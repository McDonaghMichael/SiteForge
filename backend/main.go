package main

import (
	"backend/routes"
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
	r.HandleFunc("/", handleHome)
	r.HandleFunc("/page/slug/{slug}", routes.FindPageBySlug(client))
	r.HandleFunc("/page/id/{id}", routes.FindPageById(client))
	r.HandleFunc("/user/id/{id}", routes.FetchUserByID(client))
	http.ListenAndServe(":8080", r)
}

func handleHome(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
}
