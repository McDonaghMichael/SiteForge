package models

type Post struct {
	Author          string `json:"author"`
	Date            string `json:"date"`
	Title           string `json:"title"`
	Body            string `json:"body"`
	Slug            string `json:"slug"`
	Status          int    `json:"status"`
	FeaturedImage   string `json:"featured-image"`
	MetaTitle       string `json:"meta_title"`
	MetaDescription string `json:"meta_description"`
	MetaKeywords    string `json:"meta_keywords"`
}
