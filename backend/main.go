package main

import (
	"backend/routes"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
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

	r := mux.NewRouter()
	r.HandleFunc("/", handleHome)
	r.HandleFunc("/pages", routes.FetchPages(client))
	r.HandleFunc("/theme", routes.FetchTheme(client))
	r.HandleFunc("/page/slug/{slug}", routes.FindPageBySlug(client))
	r.HandleFunc("/page/id/{id}", routes.FindPageById(client))
	r.HandleFunc("/user/id/{id}", routes.FetchUserByID(client))
	r.HandleFunc("/user/create", routes.CreateUser(client)).Methods("POST")
	r.HandleFunc("/users", routes.FetchUsers(client)).Methods("GET")
	corsHandler := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000"},
		AllowedMethods: []string{"GET", "POST"},
		AllowedHeaders: []string{"Content-Type"},
	}).Handler(r)

	http.ListenAndServe(":8080", corsHandler)
}

func handleHome(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
}
