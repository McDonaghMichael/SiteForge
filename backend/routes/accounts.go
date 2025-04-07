package routes

import (
	"backend/methods"
	"backend/models"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"log"
	"net/http"
)

// CreateAccount
/**
Method used when the account data is sent via json and then used to create an account to the database
*/
func CreateAccount(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		collection := client.Database(methods.GetDatabaseName()).Collection("accounts")

		var account models.Account

		if client == nil {
			log.Println("Error: MongoDB client is nil")
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		err := json.NewDecoder(r.Body).Decode(&account)
		if err != nil {
			log.Println("Error decoding JSON:", err)
			methods.CreateLog(client, models.ACCOUNT_CATEGORY, models.FAIL_STATUS, models.CREATED, err.Error())
			http.Error(w, "Invalid JSON request", http.StatusBadRequest)
			return
		}

		fil := bson.M{"username": account.Username}
		var existing models.Account

		err = collection.FindOne(context.TODO(), fil).Decode(&existing)
		if err == nil {
			http.Error(w, "Username already exists", http.StatusConflict)
			log.Println("[ERROR] ", account.Username)
			methods.CreateLog(client, models.ACCOUNT_CATEGORY, models.FAIL_STATUS, models.CREATED, "d")
			return
		} else if !errors.Is(err, mongo.ErrNoDocuments) {
			http.Error(w, "Database error", http.StatusInternalServerError)
			log.Println("[ERROR] Username already exists: ", err)
			methods.CreateLog(client, models.ACCOUNT_CATEGORY, models.FAIL_STATUS, models.CREATED, err.Error())
			return
		}

		fil = bson.M{"email": account.Email}

		err = collection.FindOne(context.TODO(), fil).Decode(&existing)
		if err == nil {
			http.Error(w, "Email already exists", http.StatusConflict)
			log.Println("[ERROR] ", account.Email)
			methods.CreateLog(client, models.ACCOUNT_CATEGORY, models.FAIL_STATUS, models.CREATED, err.Error())
			return
		} else if !errors.Is(err, mongo.ErrNoDocuments) {
			http.Error(w, "Database error", http.StatusInternalServerError)
			log.Println("[ERROR] Email already exists: ", err)
			methods.CreateLog(client, models.ACCOUNT_CATEGORY, models.FAIL_STATUS, models.CREATED, err.Error())
			return
		}

		hashedPassword, err := methods.HashPassword(account.Password)
		result, err := collection.InsertOne(context.TODO(), bson.M{
			"first_name":   account.FirstName,
			"last_name":    account.LastName,
			"username":     account.Username,
			"email":        account.Email,
			"password":     hashedPassword,
			"created_date": account.CreatedDate,
			"updated_date": account.UpdatedDate,
		})
		if err != nil {
			log.Println("MongoDB Insert Error:", err)
			http.Error(w, "Failed to create account", http.StatusInternalServerError)
			methods.CreateLog(client, models.ACCOUNT_CATEGORY, models.FAIL_STATUS, models.CREATED, err.Error())
			return
		}

		response := map[string]interface{}{
			"message": "Account has been successfully created",
			"id":      result.InsertedID,
			"account": account,
		}

		methods.CreateLog(client, models.ACCOUNT_CATEGORY, models.SUCCESS_STATUS, models.CREATED, "Created account "+account.Username+" with the email: "+account.Email)
		json.NewEncoder(w).Encode(response)
	}
}

func DeleteAccount(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		collection := client.Database(methods.GetDatabaseName()).Collection("accounts")

		var account models.Account
		err := json.NewDecoder(r.Body).Decode(&account)

		if err != nil {
			http.Error(w, "Invalid JSON request", http.StatusBadRequest)
			methods.CreateLog(client, models.ACCOUNT_CATEGORY, models.FAIL_STATUS, models.DELETED, err.Error())
			fmt.Println("[ERROR] ", err)
			return
		}
		log.Println("[INFO] Deleting account:", account.Username)
		filter := bson.D{{"username", account.Username}}
		_, err = collection.DeleteOne(context.TODO(), filter)
		if err != nil {
			http.Error(w, "Error deleting", http.StatusBadRequest)
			methods.CreateLog(client, models.ACCOUNT_CATEGORY, models.FAIL_STATUS, models.DELETED, err.Error())
			fmt.Println("[ERROR] ", err)
			return
		}

		methods.CreateLog(client, models.ACCOUNT_CATEGORY, models.SUCCESS_STATUS, models.DELETED, "Deleted account "+account.Username+" with the email: "+account.Email)

	}
}

// FetchAccounts
/**
Returns all the accounts in the database
*/
func FetchAccounts(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Header().Set("Content-Type", "application/json")

		collection := client.Database(methods.GetDatabaseName()).Collection("accounts")

		cursor, err := collection.Find(context.TODO(), bson.D{})
		if err != nil {
			methods.CreateLog(client, models.ACCOUNT_CATEGORY, models.FAIL_STATUS, models.FETCH, err.Error())
			log.Println(err)
			return
		}

		var results []bson.M
		if err = cursor.All(context.TODO(), &results); err != nil {
			log.Println(err)
			methods.CreateLog(client, models.ACCOUNT_CATEGORY, models.FAIL_STATUS, models.FETCH, err.Error())
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

		collection := client.Database(methods.GetDatabaseName()).Collection("accounts")

		filter := bson.D{{"_id", id}}

		var result bson.M
		err := collection.FindOne(context.TODO(), filter).Decode(&result)

		if err != nil {
			log.Print(err)
			methods.CreateLog(client, models.ACCOUNT_CATEGORY, models.FAIL_STATUS, models.FETCH, err.Error())
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

		collection := client.Database(methods.GetDatabaseName()).Collection("accounts")

		filter := bson.D{
			{Key: "email", Value: account.Email}}

		var result models.Account
		error := collection.FindOne(context.TODO(), filter).Decode(&result)

		if error != nil {
			http.Error(w, error.Error(), http.StatusNotFound)
			log.Println(error)
			return
		}

		auth := methods.VerifyPassword(account.Password, result.Password)
		if auth == false {
			log.Println(error)
			return
		}

		response := map[string]interface{}{
			"message":       "Account has been successfully authenticated",
			"authenticated": auth,
		}

		json.NewEncoder(w).Encode(response)
	}
}

// EditAccount
/**
Whenever an account needs to be edited this method is called and the new account
data is passed into it via json
*/
func EditAccount(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Header().Set("Content-Type", "application/json")

		collection := client.Database(methods.GetDatabaseName()).Collection("accounts")

		var account models.Account
		error := json.NewDecoder(r.Body).Decode(&account)
		if error != nil {
			http.Error(w, "Invalid JSON request", http.StatusBadRequest)
			fmt.Println("Error decoding JSON:", error)
			methods.CreateLog(client, models.ACCOUNT_CATEGORY, models.FAIL_STATUS, models.UPDATED, error.Error())
			return
		}

		fil := bson.M{"username": account.Username}
		var existing models.Account

		err := collection.FindOne(context.TODO(), fil).Decode(&existing)
		if err == nil {
			http.Error(w, "Username already exists", http.StatusConflict)
			log.Println("[ERROR] ", account.Username)
			methods.CreateLog(client, models.ACCOUNT_CATEGORY, models.FAIL_STATUS, models.UPDATED, err.Error())
			return
		} else if !errors.Is(err, mongo.ErrNoDocuments) {
			http.Error(w, "Database error", http.StatusInternalServerError)
			log.Println("[ERROR] Username already exists: ", err)
			methods.CreateLog(client, models.ACCOUNT_CATEGORY, models.FAIL_STATUS, models.UPDATED, err.Error())
			return
		}

		update := bson.D{{"$set", bson.D{
			{"first_name", account.FirstName},
			{"last_name", account.LastName},
			{"username", account.Username},
			{"email", account.Email},
			{"updated_date", account.UpdatedDate},
		}}}

		filter := bson.D{}

		_, err = collection.UpdateOne(context.TODO(), filter, update)

		methods.CreateLog(client, models.ACCOUNT_CATEGORY, models.SUCCESS_STATUS, models.UPDATED, "Updated account "+account.Username+" with the email: "+account.Email)

		if err != nil {
			log.Print(err)
		}
	}
}
