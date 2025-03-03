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
		w.WriteHeader(http.StatusCreated)
		w.Header().Set("Content-Type", "application/json")

		var account models.Account

		err := json.NewDecoder(r.Body).Decode(&account)
		if err != nil {
			log.Println("Error decoding JSON:", err)
			http.Error(w, "Invalid JSON request", http.StatusBadRequest)
			return
		}

		collection := client.Database("test").Collection("accounts")

		result, err := collection.InsertOne(context.TODO(), bson.M{
			"first_name":   account.FirstName,
			"last_name":    account.LastName,
			"username":     account.Username,
			"email":        account.Email,
			"password":     account.Password,
			"created_date": account.CreatedDate,
			"updated_date": account.UpdatedDate,
		})
		if err != nil {
			log.Println("MongoDB Insert Error:", err)
			http.Error(w, "Failed to create page", http.StatusInternalServerError)
			return
		}

		response := map[string]interface{}{
			"message": "Account has been successfully created",
			"id":      result.InsertedID,
			"account": account,
		}

		json.NewEncoder(w).Encode(response)
	}
}

func FetchAccounts(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Header().Set("Content-Type", "application/json")

		collection := client.Database("test").Collection("accounts")

		cursor, err := collection.Find(context.TODO(), bson.D{})
		if err != nil {
			log.Println(err)
			return
		}

		var results []bson.M
		if err = cursor.All(context.TODO(), &results); err != nil {

			panic(err)
		}

		json.NewEncoder(w).Encode(results)
	}
}

// FetchAccountByID
/**
Method used to fetch an account based on the ID of the account
*/
func FetchAccountByID(client *mongo.Client) http.HandlerFunc {
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
			return
		}

		json.NewEncoder(w).Encode(result)
	}
}

// AuthenticateAccount
/**
Method used when authenticating a users login request
*/
func AuthenticateAccount(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Header().Set("Content-Type", "application/json")

		var account models.Account
		err := json.NewDecoder(r.Body).Decode(&account)

		if err != nil {
			http.Error(w, "Invalid JSON request", http.StatusBadRequest)
			fmt.Println("Error decoding JSON:", err)
			return
		}

		collection := client.Database("test").Collection("accounts")

		filter := bson.D{
			{Key: "email", Value: account.Email},
			{Key: "password", Value: account.Password}}

		var result models.Account
		error := collection.FindOne(context.TODO(), filter).Decode(&result)

		if error != nil {
			http.Error(w, error.Error(), http.StatusNotFound)
			log.Println(error)
			return
		}

		response := map[string]interface{}{
			"message": "Account has been successfully authenticated",
			"account": result,
		}

		json.NewEncoder(w).Encode(response)
	}
}
