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

func CreateUser(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		var newUser models.User
		err := json.NewDecoder(r.Body).Decode(&newUser)
		if err != nil {
			http.Error(w, "Invalid JSON request", http.StatusBadRequest)
			fmt.Println("Error decoding JSON:", err)
			return
		}
		fmt.Printf("Received User: %+v\n", newUser)

		collection := client.Database("test").Collection("users")
		res, err := collection.InsertOne(context.TODO(), bson.M{
			"firstName": newUser.FirstName,
			"lastName":  newUser.LastName,
			"username":  newUser.Username,
			"email":     newUser.Email,
			"password":  newUser.Password,
		})
		if err != nil {
			log.Println("MongoDB Insert Error:", err)
			http.Error(w, "Failed to create user", http.StatusInternalServerError)
			return
		}

		response := map[string]interface{}{
			"message": "User created successfully",
			"userID":  res.InsertedID,
			"user":    newUser,
		}
		json.NewEncoder(w).Encode(response)
	}
}

func FetchUsers(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Header().Set("Content-Type", "application/json")

		id := "67a689ba15049d63ce90801e"

		collection := client.Database("admin").Collection("users")

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
