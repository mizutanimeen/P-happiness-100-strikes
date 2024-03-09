package api

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/mizutanimeen/P-happiness-100-strikes/internal/db"
	"github.com/mizutanimeen/P-happiness-100-strikes/internal/db/model"
)

func DateRecordsGet(DB db.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		id := r.Context().Value(CK_USERID).(string)

		startTime, endTime, status, err := getStartEndDateQuery(r)
		if err != nil {
			http.Error(w, err.Error(), status)
			return
		}

		dateRecords, err := DB.DateRecordsGet(id, startTime, endTime)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		records := make(map[string]model.DateRecord)
		for _, record := range dateRecords {
			date := record.Date.Format("2006-01-02")
			fmt.Println(date)
			records[date] = *record
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(records)
	}
}

type createDateRecordRequest struct {
	Date      string `json:"date"`
	Happiness int    `json:"happiness"`
}

func DateRecordCreate(DB db.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		id := r.Context().Value(CK_USERID).(string)

		var dateRecordReq createDateRecordRequest
		if err := json.NewDecoder(r.Body).Decode(&dateRecordReq); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		date, err := time.Parse("2006-01-02", dateRecordReq.Date)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		if err := DB.DateRecordCreate(id, date, dateRecordReq.Happiness); err != nil {
			log.Println(err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		w.Write([]byte(`{"message":"created"}`))
	}
}

type updateDateRecordRequest struct {
	ID        string `json:"date_record_id"`
	Happiness int    `json:"happiness"`
}

func DateRecordUpdate(DB db.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		id := r.Context().Value(CK_USERID).(string)

		var dateRecordReq updateDateRecordRequest
		if err := json.NewDecoder(r.Body).Decode(&dateRecordReq); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		if err := DB.DateRecordUpdate(dateRecordReq.ID, id, dateRecordReq.Happiness); err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"message":"updated"}`))
	}
}
