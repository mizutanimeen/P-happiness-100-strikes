package model

import "time"

// TODO: Jsonタグを追加する or リスポンス用の構造体を作成する

type User struct {
	ID        string
	Password  string
	Create_at time.Time
	Update_at time.Time
}

type DateRecord struct {
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

type Machine struct {
	ID        string
	UserID    string
	Name      string
	Rate      int
	Create_at time.Time
	Update_at time.Time
}
