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

func CreateAccount(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		var newPage models.Account
		err := json.NewDecoder(r.Body).Decode(&newPage)
		if err != nil {
			http.Error(w, "Invalid JSON request", http.StatusBadRequest)
			fmt.Println("Error decoding JSON:", err)
			return
		}
		fmt.Printf("Received Page: %+v\n", newPage)

		collection := client.Database("test").Collection("accounts")
		res, err := collection.InsertOne(context.TODO(), bson.M{
			"first_name":   newPage.FirstName,
			"last_name":    newPage.LastName,
			"username":     newPage.Username,
			"email":        newPage.Email,
			"password":     newPage.Password,
			"created_date": newPage.CreatedDate,
			"updated_date": newPage.UpdatedDate,
		})
		if err != nil {
			log.Println("MongoDB Insert Error:", err)
			http.Error(w, "Failed to create page", http.StatusInternalServerError)
			return
		}

		response := map[string]interface{}{
			"message": "Page created successfully",
			"userID":  res.InsertedID,
			"user":    newPage,
		}
		json.NewEncoder(w).Encode(response)
	}
}

func FetchAccounts(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		coll := client.Database("test").Collection("accounts")

		cursor, err := coll.Find(context.TODO(), bson.D{})
		if err != nil {

			panic(err)
		}

		var results []bson.M
		if err = cursor.All(context.TODO(), &results); err != nil {
			panic(err)
		}

		json.NewEncoder(w).Encode(results)
	}
}

func FetchAccountsByID(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Header().Set("Content-Type", "application/json")

		vars := mux.Vars(r)
		id, _ := bson.ObjectIDFromHex(vars["id"])

		collection := client.Database("test").Collection("accounts")

		filter := bson.D{{"_id", id}}

		var result models.Account
		err := collection.FindOne(context.TODO(), filter).Decode(&result)

		if err != nil {
			log.Print(err)
		} else {
			json.NewEncoder(w).Encode(result)
		}
	}
}

func AuthenticateAccount(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		var account models.Account
		err := json.NewDecoder(r.Body).Decode(&account)

		fmt.Println(account)
		if err != nil {
			http.Error(w, "Invalid JSON request", http.StatusBadRequest)
			fmt.Println("Error decoding JSON:", err)
			return
		}

		collection := client.Database("test").Collection("accounts")

		filter := bson.D{{Key: "email", Value: account.Email}, {Key: "password", Value: account.Password}}

		var result models.Account
		error := collection.FindOne(context.TODO(), filter).Decode(&result)

		if error != nil {
			log.Print(error)
		} else {
			json.NewEncoder(w).Encode(result)
		}
	}
}
