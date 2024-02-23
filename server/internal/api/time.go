package api

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/mizutanimeen/P-happiness-100-strikes/internal/db"
)

func TimeRecordsGet(DB db.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		id := r.Context().Value(CK_USERID).(string)

		startTime, endTime, status, err := getStartEndDateQuery(r)
		if err != nil {
			http.Error(w, err.Error(), status)
			return
		}

		timeRecords, err := DB.TimeRecordsGet(id, startTime, endTime)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(timeRecords)
	}
}

type createTimeRecordRequest struct {
	DateTime        string `json:"date_time"`
	InvestmentMoney int    `json:"investment_money"`
	RecoveryMoney   int    `json:"recovery_money"`
}

func TimeRecordCreate(DB db.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		id := r.Context().Value(CK_USERID).(string)

		var timeRecordReq createTimeRecordRequest
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

type updateTimeRecordRequest struct {
	ID              string `json:"time_record_id"`
	DateTime        string `json:"date_time"`
	InvestmentMoney int    `json:"investment_money"`
	RecoveryMoney   int    `json:"recovery_money"`
}

func TimeRecordUpdate(DB db.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		id := r.Context().Value(CK_USERID).(string)

		var timeRecordReq updateTimeRecordRequest
		if err := json.NewDecoder(r.Body).Decode(&timeRecordReq); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		dateTime, err := time.Parse("2006-01-02 15:04:05", timeRecordReq.DateTime)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		// ユーザーが指定のレコードを持っているか確認
		timeRecord, err := DB.TimeRecordGetByID(timeRecordReq.ID, id)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
		if timeRecord == nil {
			http.Error(w, "Record not found", http.StatusBadRequest)
			return
		}

		if err := DB.TimeRecordUpdate(timeRecordReq.ID, dateTime, timeRecordReq.InvestmentMoney, timeRecordReq.RecoveryMoney); err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"message":"updated"}`))
	}
}

func TimeRecordDelete(DB db.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		id := r.Context().Value(CK_USERID).(string)

		timeRecordID := r.URL.Query().Get("time_record_id")
		if timeRecordID == "" {
			http.Error(w, "Invalid request", http.StatusBadRequest)
			return
		}

		// ユーザーが指定のレコードを持っているか確認
		timeRecord, err := DB.TimeRecordGetByID(timeRecordID, id)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
		if timeRecord == nil {
			http.Error(w, "Record not found", http.StatusBadRequest)
			return
		}

		if err := DB.TimeRecordDelete(timeRecordID); err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"message":"deleted"}`))
	}
}
