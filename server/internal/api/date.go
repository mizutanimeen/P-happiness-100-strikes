package api

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/mizutanimeen/P-happiness-100-strikes/internal/db"
)

func DateRecordsGet(DB db.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		id := r.Context().Value(CK_USERID).(string)

		startTime, endTime, status, err := getStartEndDayQuery(r)
		if err != nil {
			http.Error(w, err.Error(), status)
			return
		}

		dayRecords, err := DB.DayRecordGet(id, startTime, endTime)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(dayRecords)
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

		if err := DB.DayRecordCreate(id, date, dateRecordReq.Happiness); err != nil {
			log.Println(err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		w.Write([]byte(`{"message":"created"}`))
	}
}

func DayRecordUpdate(DB db.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		id := r.Context().Value(CK_USERID).(string)

		var dayRecordReq createDateRecordRequest
		if err := json.NewDecoder(r.Body).Decode(&dayRecordReq); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		date, err := time.Parse("2006-01-02", dayRecordReq.Date)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		record, err := DB.DayRecordGetOne(id, date)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		if err := DB.DayRecordUpdate(record.ID, dayRecordReq.Happiness); err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"message":"updated"}`))
	}
}
