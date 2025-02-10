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

	routes.CreatePage(client, "Example", "<h1>hi</h1>", "/", 0, "/png", "ttt", "fwef", "afds")
	//routes.CreateTheme(client, "Cool Theme", "Very cool theme", "<ul> <li><a href=\"default.asp\">Home</a></li> <li><a href=\"news.asp\">News</a></li> <li><a href=\"contact.asp\">Contact</a></li> <li><a href=\"about.asp\">About</a></li> </ul>", "<footer>\n  <p>Author: Hege Refsnes</p>\n  <p><a href=\"mailto:hege@example.com\">hege@example.com</a></p>\n</footer>", "ul {\n  list-style-type: none;\n  margin: 0;\n  padding: 0;\n} footer {\n  text-align: center;\n  padding: 3px;\n  background-color: DarkSalmon;\n  color: white;\n}")

	r := mux.NewRouter()
	r.HandleFunc("/", handleHome)
	r.HandleFunc("/pages", routes.FetchPages(client))
	r.HandleFunc("/theme", routes.FetchTheme(client))
	r.HandleFunc("/theme/import", routes.ImportTheme(client)).Methods("POST")
	r.HandleFunc("/theme/id/{id}", routes.FetchThemeById(client))

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
