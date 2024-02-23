package api

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/mizutanimeen/P-happiness-100-strikes/internal/db"
)

func TimeRecordGet(DB db.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		id := r.Context().Value(CK_USERID).(string)

		startTime, endTime, status, err := getStartEndDayQuery(r)
		if err != nil {
			http.Error(w, err.Error(), status)
			return
		}

		timeRecords, err := DB.TimeRecordGet(id, startTime, endTime)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(timeRecords)
	}
}

type TimeRecordRequest struct {
	DateTime        string `json:"date_time"`
	InvestmentMoney int    `json:"investment_money"`
	RecoveryMoney   int    `json:"recovery_money"`
}

func TimeRecordCreate(DB db.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		id := r.Context().Value(CK_USERID).(string)

		var timeRecordReq TimeRecordRequest
		if err := json.NewDecoder(r.Body).Decode(&timeRecordReq); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		dateTime, err := time.Parse("2006-01-02 15:04:05", timeRecordReq.DateTime)
		if err != nil {
			http.Error(w, "Invalid request body: "+err.Error(), http.StatusBadRequest)
			return
		}

		if err := DB.TimeRecordCreate(id, dateTime, timeRecordReq.InvestmentMoney, timeRecordReq.RecoveryMoney); err != nil {
			http.Error(w, "Internal Server Error: "+err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		w.Write([]byte(`{"message":"created"}`))
	}
}
