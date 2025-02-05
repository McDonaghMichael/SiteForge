package main

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"log"
	"net/http"
)

type User struct {
	FirstName string `bson:"first_name"`
	LastName  string `bson:"last_name"`
	Username  string `bson:"username"`
	Email     string `bson:"email"`
	Password  string `bson:"password"`
}

func main() {

	uri := "mongodb://localhost:27017"

	client, err := mongo.Connect(options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatal(err)
	} else {
		log.Default().Println("Connected to MongoDB!")
	}

	createUser(client, "Michael", "McDonagh", "mcd", "G00", "pass")

	r := mux.NewRouter()
	r.HandleFunc("/", handleHome)
	r.HandleFunc("/users", fetchUsers(client)).Methods("GET")
	http.ListenAndServe(":8080", r)
}

func handleHome(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
}

func fetchUsers(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		w.WriteHeader(http.StatusOK)
		w.Header().Set("Content-Type", "application/json")

		var result bson.M
		err := client.Database("test").Collection("users")

		if err != nil {
			log.Fatal(err)
		} else {
			json.NewEncoder(w).Encode(result)
		}
	}
}

func createUser(client *mongo.Client, firstName string, lastName string, username string, email string, password string) {
	coll := client.Database("test").Collection("users")
	doc := User{FirstName: firstName, LastName: lastName, Username: username, Email: email, Password: password}
	res, err := coll.InsertOne(context.TODO(), doc)

	if err != nil {
		log.Fatalln(err)
	}

	fmt.Println(res.InsertedID)
}
