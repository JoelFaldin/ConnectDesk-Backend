package model

type UserData struct {
	Rut        string `json:"rut"`
	Names      string `json:"names"`
	Lastnames  string `json:"lastnames"`
	Email      string `json:"email"`
	Role       string `json:"role"`
	Departmens string `json:"departments"`
	Directions string `json:"directions"`
	JobNumber  string `json:"jobNumber"`
	Contact    string `json:"Contact"`
}

type UserModel struct {
	Message   string     `json:"message"`
	Content   []UserData `json:"content"`
	Showing   int        `json:"showing"`
	Page      int        `json:"page"`
	Total     int        `json:"total"`
	TotalData int        `json:"totalData"`
}
