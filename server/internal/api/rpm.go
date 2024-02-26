package api

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/mizutanimeen/P-happiness-100-strikes/internal/db"
)

func RPMRecordsGet(db db.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := r.Context().Value(CK_USERID).(string)
		timeRecordID := chi.URLParam(r, "times_id")

		rpmRecords, err := db.RPMRecordsGet(timeRecordID, userID)
		if err != nil {
			http.Error(w, fmt.Sprintf("RPMRecordsGet: %v", err), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		if err := json.NewEncoder(w).Encode(rpmRecords); err != nil {
			http.Error(w, fmt.Sprintf("json encode: %v", err), http.StatusInternalServerError)
			return
		}
	}
}

type createRPMRecordRequest struct {
	InvestmentMoney int `json:"investment_money"`
	InvestmentBall  int `json:"investment_ball"`
	StartRPM        int `json:"start_rpm"`
	EndRPM          int `json:"end_rpm"`
	MachineID       int `json:"machine_id"`
}

func RPMRecordCreate(db db.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := r.Context().Value(CK_USERID).(string)
		timeRecordID := chi.URLParam(r, "times_id")

		var rpmRecordReq createRPMRecordRequest
		if err := json.NewDecoder(r.Body).Decode(&rpmRecordReq); err != nil {
			http.Error(w, fmt.Sprintf("json decode: %v", err), http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		if err := db.RPMRecordCreate(timeRecordID, userID, rpmRecordReq.InvestmentMoney, rpmRecordReq.InvestmentBall, rpmRecordReq.StartRPM, rpmRecordReq.EndRPM, rpmRecordReq.MachineID); err != nil {
			http.Error(w, fmt.Sprintf("RPMRecordCreate: %v", err), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		w.Write([]byte(`{"message":"created"}`))
	}
}

type updateRPMRecordRequest struct {
	ID              string `json:"rpm_record_id"`
	InvestmentMoney int    `json:"investment_money"`
	InvestmentBall  int    `json:"investment_ball"`
	StartRPM        int    `json:"start_rpm"`
	EndRPM          int    `json:"end_rpm"`
	MachineID       int    `json:"machine_id"`
}

// TODO: Updateをもっと軽量化する。 回転数追加で頻繁に更新されるため
func RPMRecordUpdate(db db.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := r.Context().Value(CK_USERID).(string)
		timeRecordID := chi.URLParam(r, "times_id")

		var rpmRecordReq updateRPMRecordRequest
		if err := json.NewDecoder(r.Body).Decode(&rpmRecordReq); err != nil {
			http.Error(w, fmt.Sprintf("json decode: %v", err), http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		if err := db.RPMRecordUpdate(rpmRecordReq.ID, timeRecordID, userID, rpmRecordReq.InvestmentMoney, rpmRecordReq.InvestmentBall, rpmRecordReq.StartRPM, rpmRecordReq.EndRPM, rpmRecordReq.MachineID); err != nil {
			http.Error(w, fmt.Sprintf("RPMRecordUpdate: %v", err), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"message":"updated"}`))
	}
}

func RPMRecordDelete(db db.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := r.Context().Value(CK_USERID).(string)
		timeRecordID := chi.URLParam(r, "times_id")
		id := chi.URLParam(r, "rpm_record_id")

		if err := db.RPMRecordDelete(id, timeRecordID, userID); err != nil {
			http.Error(w, fmt.Sprintf("RPMRecordDelete: %v", err), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"message":"deleted"}`))
	}
}
