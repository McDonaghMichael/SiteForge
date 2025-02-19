package models

import "go.mongodb.org/mongo-driver/v2/bson"

type Theme struct {
	ID           bson.ObjectID `bson:"_id" json:"id,omitempty"`
	Name         string        `json:"name"`
	Author       string        `json:"author"`
	Description  string        `json:"description"`
	Github       string        `json:"github"`
	Website      string        `json:"website"`
	CSS          string        `json:"css"`
	Navbar       string        `json:"navbar"`
	Footer       string        `json:"footer"`
	StandardPage string        `json:"standard_page"`
	NotFoundPage string        `json:"not_found_page"`
}
