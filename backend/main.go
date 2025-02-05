package main

import (
	"backend/methods"
	"backend/routes"
	"fmt"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"log"
	"net/http"
)

func main() {

	uri := "mongodb://localhost:27017"

	client, err := mongo.Connect(options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatal(err)
	} else {
		log.Default().Println("Connected to MongoDB!")
	}

	routes.CreateUser(client, "Michael", "McDonagh", "mcd", "G00", "pass")
	routes.CreatePage(client, "Title", "<h1>r</h1>", "test-page", 0, ".png", "title-meta", "desc-meta", "cool blog, test")

	r := mux.NewRouter()
	r.HandleFunc("/", handleHome(client))
	r.HandleFunc("/page/slug/{slug}", routes.FindPageBySlug(client))
	r.HandleFunc("/page/id/{id}", routes.FindPageById(client))
	r.HandleFunc("/user/id/{id}", routes.FetchUserByID(client))
	http.ListenAndServe(":8080", r)
}

func handleHome(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Header().Set("Content-Type", "text/html; charset=utf-8")

		html, _ := methods.FindPageById(client, "67a3786977c8d8dad1fa1b38")
		fmt.Fprint(w, html)
	}

}
