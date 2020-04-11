package main

import (
	"io/ioutil"
	"net/http"
	"os"
	"path"

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

func main() {
	box := packr.NewBox("./web/dist")

	r := mux.NewRouter()
	r.HandleFunc("/room/{id}", room)
	r.PathPrefix("/").Handler(FileServer404(box, "index.html"))

	http.ListenAndServe(":8080", r)
}
