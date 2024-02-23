package model

import "time"

type User struct {
	ID        string
	Password  string
	Create_at time.Time
	Update_at time.Time
}
type DayRecord struct {
	ID        string
	UserID    string
	Date      time.Time
	Happiness int
	Create_at string
	Update_at string
}
