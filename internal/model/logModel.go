package model

type LogModel struct {
	Log_id          int
	Endpoint        string
	Method          string
	Status_Code     int
	Description     string
	Local_date_time string
	User_id         int
}

type LogModelResponse struct {
	Log_id          int    `json:"logId"`
	Endpoint        string `json:"endpoint"`
	Method          string `json:"method"`
	Status_Code     int    `json:"statusCode"`
	Description     string `json:"description"`
	Local_date_time string `json:"date"`
	User_id         int    `json:"userId"`
}

type AllLogs struct {
	Log_id          int    `json:"logId"`
	Description     string `json:"description"`
	Local_date_time string `json:"date"`
}
