package main

import (
	"backend/methods"
	"backend/routes"
	"context"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"log"
	"net/http"
	"os"
)

func main() {

	err2 := godotenv.Load(".env")

	if err2 != nil {
		log.Fatalf("Error loading .env file")
	}

	uri := os.Getenv("MONGO_DATABASE_URL")

	client, err := mongo.Connect(options.Client().ApplyURI(uri))
	if err != nil {
		log.Print(err)
	} else {
		log.Default().Println("Connected to MongoDB!")
	}

	InitializeDatabase(client)
	r := mux.NewRouter()
	r.HandleFunc("/", handleHome)
	r.HandleFunc("/pages", routes.FetchPages(client)).Methods("GET")
	r.HandleFunc("/posts", routes.FetchPosts(client)).Methods("GET")
	r.HandleFunc("/theme", routes.FetchTheme(client)).Methods("GET")
	r.HandleFunc("/themes", routes.FetchThemes(client)).Methods("GET")
	r.HandleFunc("/theme/import", routes.ImportTheme(client)).Methods("POST")
	r.HandleFunc("/theme/id/{id}", routes.FetchThemeById(client)).Methods("GET")
	r.HandleFunc("/page/slug/{slug}", routes.FindPageBySlug(client)).Methods("GET")
	r.HandleFunc("/page/id/{id}", routes.FindPageById(client)).Methods("GET")
	r.HandleFunc("/page/edit", routes.EditPage(client))
	r.HandleFunc("/page/create", routes.CreatePage(client)).Methods("POST")
	r.HandleFunc("/post/slug/{slug}", routes.FindPostBySlug(client)).Methods("GET")
	r.HandleFunc("/post/id/{id}", routes.FindPostById(client)).Methods("GET")
	r.HandleFunc("/post/edit", routes.EditPost(client))
	r.HandleFunc("/post/create", routes.CreatePost(client)).Methods("POST")
	r.HandleFunc("/account/id/{id}", routes.FetchAccountByID(client)).Methods("GET")
	r.HandleFunc("/account/create", routes.CreateAccount(client)).Methods("POST")
	r.HandleFunc("/account/edit", routes.EditAccount(client)).Methods("POST")
	r.HandleFunc("/account/authenticate", routes.AuthenticateAccount(client))
	r.HandleFunc("/accounts", routes.FetchAccounts(client)).Methods("GET")
	r.HandleFunc("/settings", routes.FetchSettings(client)).Methods("GET")
	r.HandleFunc("/settings/edit", routes.EditSettings(client))
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

func InitializeDatabase(client *mongo.Client) {
	collection := client.Database(methods.GetDatabaseName()).Collection("themes")
	_, err := collection.InsertOne(context.TODO(), bson.M{
		"name":           "Default Theme",
		"author":         "Michael",
		"description":    "This is the theme that is first installed when setting up the system",
		"featured_image": "https://www.doubledtrailers.com/wp-content/uploads/2023/10/random-horse-facts-shareable.png",
		"website":        "https://google.com",
		"github":         "https://github.com/McDonaghMichael",
		"navbar":         "<ul> [ITEMS] </ul>\n\n<head><link\n  rel=\"stylesheet\"\n  href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css\"\n  integrity=\"sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH\"\n  crossorigin=\"anonymous\"\n/></head>",
		"footer":         "<footer>\n  <p>Author: Hege Refsnes</p>\n  <p><a href=\"mailto:hege@example.com\">hege@example.com</a></p>\n</footer>",
		"css":            "ul {\n  list-style-type: none;\n  margin: 0;\n  padding: 0;\n} footer {\n  text-align: center;\n  padding: 3px;\n  background-color: DarkSalmon;\n  color: white;\n}",
		"standard_page":  "<div class='container'>[TIME][PAGE_TITLE] [HTML]</div>",
		"not_found_page": "<h1>Page not found</h1>",
	})
	if err != nil {
		log.Println("MongoDB Insert Error:", err)
		return
	}

}
