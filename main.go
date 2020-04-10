package main

import (
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path"

	"github.com/davecgh/go-spew/spew"
	"github.com/gobuffalo/packr"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
)

type Token struct {
}

type Game struct {
	Map    string
	tokens []*Token
}

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

	spew.Dump(conn)
}

func FileServer404(root http.FileSystem, fallbackPath string) http.Handler {
	var fallback []byte
	f, err := root.Open(fallbackPath)
	if err == nil {
		fallback, err = ioutil.ReadAll(f)
		if err != nil {
			fallback = nil
		}
	}

	fsh := http.FileServer(root)

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, err := root.Open(path.Clean(r.URL.Path))
		if os.IsNotExist(err) {
			w.Write(fallback)
			return
		}
		fsh.ServeHTTP(w, r)
	})
}

func main() {
	box := packr.NewBox("./web/dist")

	r := mux.NewRouter()
	r.HandleFunc("/room/:id", room)
	r.PathPrefix("/").Handler(FileServer404(box, "index.html"))

	http.ListenAndServe(":8080", r)
}
