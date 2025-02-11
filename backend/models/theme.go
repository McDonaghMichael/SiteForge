package models

type Theme struct {
	Name         string `json:"name"`
	Description  string `json:"description"`
	CSS          string `json:"css"`
	Navbar       string `json:"navbar"`
	Footer       string `json:"footer"`
	StandardPage string `json:"standard_page"`
}
