package main

import (
	"github.com/gorilla/mux"
	"net/http"
)

func main() {

	r := mux.NewRouter()
	r.HandleFunc("/", handleHome)
	http.ListenAndServe(":8080", r)
}

func handleHome(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
}
