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
	Create_at time.Time
	Update_at time.Time
}
type TimeRecord struct {
	ID              string
	UserID          string
	Time            time.Time
	InvestmentMoney int
	RecoveryMoney   int
	Create_at       time.Time
	Update_at       time.Time
}
