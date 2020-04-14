package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path"
	"path/filepath"

	"github.com/gobuffalo/packr"
	"github.com/gorilla/mux"
)

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

func FileServerIndex(root, prefix string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		p, err := filepath.Abs(filepath.Join(root, "/**/*"))
		if err != nil {
			log.Print(err)
			return
		}
		files, err := filepath.Glob(p)
		if err != nil {
			log.Print(err)
			return
		}
		for i, file := range files {
			files[i] = filepath.Join(prefix, file[len(root)+1:])
		}
		err = json.NewEncoder(w).Encode(files)
		if err != nil {
			log.Print(err)
			return
		}
	})
}

func main() {
	box := packr.NewBox("./web/dist")

	r := mux.NewRouter()
	r.HandleFunc("/room/{dm}/{id}", room)
	r.Handle("/img/index.json", FileServerIndex("/home/adam/Documents/code/dnd-map/images", "/img/"))
	r.PathPrefix("/img/").Handler(http.StripPrefix("/img/", http.FileServer(http.Dir("/home/adam/Documents/code/dnd-map/images"))))
	r.PathPrefix("/").Handler(FileServer404(box, "index.html"))

	http.ListenAndServe(":8753", r)
}
