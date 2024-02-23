package api

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/mizutanimeen/P-happiness-100-strikes/internal/db"
)

type DayRecordRequest struct {
	Date      string `json:"date"`
	Happiness int    `json:"happiness"`
}

func DayRecordGet(DB db.DB) func(w http.ResponseWriter, r *http.Request) {
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

const (
	START_DATE_QUERY = "start"
	END_DATE_QUERY   = "end"
)

func getStartEndDayQuery(r *http.Request) (time.Time, time.Time, int, error) {
	startDate := r.URL.Query().Get(START_DATE_QUERY)
	endDate := r.URL.Query().Get(END_DATE_QUERY)

	// 日付を解析
	startTime, err := time.Parse("2006-01-02", startDate)
	if err != nil {
		return time.Time{}, time.Time{}, http.StatusBadRequest, fmt.Errorf("invalid start date")
	}

	endTime, err := time.Parse("2006-01-02", endDate)
	if err != nil {
		return time.Time{}, time.Time{}, http.StatusBadRequest, fmt.Errorf("invalid end date")
	}

	return startTime, endTime, 0, nil
}

func DayRecordCreate(DB db.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		id := r.Context().Value(CK_USERID).(string)

		var dayRecordReq DayRecordRequest
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

		if err := DB.DayRecordCreate(id, date, dayRecordReq.Happiness); err != nil {
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

		var dayRecordReq DayRecordRequest
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
