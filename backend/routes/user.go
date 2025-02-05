package routes

import (
	"backend/models"
	"context"
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"log"
	"net/http"
)

func FetchUserByID(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Header().Set("Content-Type", "application/json")

		vars := mux.Vars(r)
		id, _ := bson.ObjectIDFromHex(vars["id"])

		collection := client.Database("test").Collection("users")

		filter := bson.D{{"_id", id}}

		var result models.User
		err := collection.FindOne(context.TODO(), filter).Decode(&result)

		if err != nil {
			log.Fatal(err)
		} else {
			json.NewEncoder(w).Encode(result)
		}
	}
}

func CreateUser(client *mongo.Client, firstName string, lastName string, username string, email string, password string) {
	coll := client.Database("test").Collection("users")
	doc := models.User{FirstName: firstName, LastName: lastName, Username: username, Email: email, Password: password}
	res, err := coll.InsertOne(context.TODO(), doc)

	if err != nil {
		log.Fatalln(err)
	}

	fmt.Println(res.InsertedID)
}
