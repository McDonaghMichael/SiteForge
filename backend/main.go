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
		log.Print(err)
	} else {
		log.Default().Println("Connected to MongoDB!")
	}

	//routes.CreateSettings(client)

	//routes.CreatePage(client, "Example", "<h1>hi</h1>", "lol", 0, "/png", "ttt", "fwef", "afds", 0)
	//routes.CreateTheme(client, "Cool Theme", "Very cool theme", "<ul> <li><a href=\"default.asp\">Home</a></li> <li><a href=\"news.asp\">News</a></li> <li><a href=\"contact.asp\">Contact</a></li> <li><a href=\"about.asp\">About</a></li> </ul>", "<footer>\n  <p>Author: Hege Refsnes</p>\n  <p><a href=\"mailto:hege@example.com\">hege@example.com</a></p>\n</footer>", "ul {\n  list-style-type: none;\n  margin: 0;\n  padding: 0;\n} footer {\n  text-align: center;\n  padding: 3px;\n  background-color: DarkSalmon;\n  color: white;\n}", "<div class='container'>[TIME][PAGE_TITLE] [HTML]</div>")

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
