package models

type NavbarItems struct {
	Page string `json:"page_id"`
}
type Settings struct {
	SiteTitle    string        `json:"site_title"`
	UpdatedDate  string        `json:"updated_date"`
	FavIcon      string        `json:"fav_icon"`
	DefaultTheme string        `json:"default_theme"`
	NavbarItems  []NavbarItems `json:"navbar_items"`
}
