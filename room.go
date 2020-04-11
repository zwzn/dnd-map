package main

import (
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
)

type Room struct {
	ID    string
	Conns []*websocket.Conn
	mtx   *sync.RWMutex
}

var rooms = map[string]*Room{}
var roomsMtx = &sync.Mutex{}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func room(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	vars := mux.Vars(r)
	id := vars["id"]

	roomsMtx.Lock()
	room, ok := rooms[id]
	if !ok {
		room = &Room{
			ID:    id,
			Conns: []*websocket.Conn{},
			mtx:   &sync.RWMutex{},
		}
		rooms[id] = room
	}
	roomsMtx.Unlock()

	room.AddConn(conn)
	defer room.RemoveConn(conn)
	for {
		err = room.Send(conn)
		if _, ok := err.(*websocket.CloseError); ok {
			return
		} else if err != nil {
			log.Fatalf("%#v", err)
		}
	}

}

func (r *Room) AddConn(conn *websocket.Conn) {
	r.mtx.Lock()
	defer r.mtx.Unlock()
	r.Conns = append(r.Conns, conn)
}

func (r *Room) RemoveConn(conn *websocket.Conn) {
	r.mtx.Lock()
	defer r.mtx.Unlock()

	for i, c := range r.Conns {
		if c == conn {
			r.Conns[i] = r.Conns[len(r.Conns)-1]
			r.Conns = r.Conns[:len(r.Conns)-1]
		}
	}

	if len(r.Conns) == 0 {
		roomsMtx.Lock()
		delete(rooms, r.ID)
		roomsMtx.Unlock()
	}
}

func (r *Room) Send(conn *websocket.Conn) error {
	t, b, err := conn.ReadMessage()
	if err != nil {
		return err
	}

	r.mtx.RLock()
	defer r.mtx.RUnlock()
	for _, c := range r.Conns {
		if c != conn {
			err := c.WriteMessage(t, b)
			if err != nil {
				log.Print(err)
			}
		}
	}
	return nil
}
