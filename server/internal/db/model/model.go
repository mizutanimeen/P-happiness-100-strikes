package model

import "time"

// TODO: Jsonタグを追加する or リスポンス用の構造体を作成する

type User struct {
	ID        string    `json:"id"`
	Password  string    `json:"password"`
	Create_at time.Time `json:"create_at"`
	Update_at time.Time `json:"update_at"`
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
	ID              string    `json:"id"`
	UserID          string    `json:"user_id"`
	Time            time.Time `json:"date_time"`
	InvestmentMoney int       `json:"investment_money"`
	RecoveryMoney   int       `json:"recovery_money"`
	Create_at       time.Time `json:"create_at"`
	Update_at       time.Time `json:"update_at"`
}

type Machine struct {
	ID        string
	UserID    string
	Name      string
	Rate      int
	Create_at time.Time
	Update_at time.Time
}

type RPMRecord struct {
	ID              string    `json:"id"`
	TimeRecordID    int       `json:"time_record_id"`
	UserID          string    `json:"user_id"`
	InvestmentMoney int       `json:"investment_money"`
	InvestmentBall  int       `json:"investment_ball"`
	StartRPM        int       `json:"start_rpm"`
	EndRPM          int       `json:"end_rpm"`
	MachineID       int       `json:"machine_id"`
	Create_at       time.Time `json:"create_at"`
	Update_at       time.Time `json:"update_at"`
}
