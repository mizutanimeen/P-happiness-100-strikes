package api

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/mizutanimeen/P-happiness-100-strikes/internal/db"
)

func MachinesGet(DB db.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := r.Context().Value(CK_USERID).(string)

		machines, err := DB.MachinesGet(userID)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(machines)
	}
}

func MachinesGetByID(DB db.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := r.Context().Value(CK_USERID).(string)

		machineID := chi.URLParam(r, "machine_id")
		if machineID == "" {
			http.Error(w, "Invalid request", http.StatusBadRequest)
			return
		}

		// ユーザーがIDを持っているか確認
		machine, err := DB.MachineGetByID(userID, machineID)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
		if machine == nil {
			http.Error(w, "Machine not found", http.StatusBadRequest)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(machine)
	}
}

type createMachineRequest struct {
	Name string `json:"machine_name"`
	Rate int    `json:"rate"`
}

func MachineCreate(DB db.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := r.Context().Value(CK_USERID).(string)

		var machineReq createMachineRequest
		if err := json.NewDecoder(r.Body).Decode(&machineReq); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		machineID, err := DB.MachineCreate(userID, machineReq.Name, machineReq.Rate)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		text := fmt.Sprintf(`{"machine_id":%d,"message":"created"}`, machineID)
		w.Write([]byte(text))
	}
}

type updateMachineRequest struct {
	ID   string `json:"machine_id"`
	Name string `json:"machine_name"`
	Rate int    `json:"rate"`
}

func MachineUpdate(DB db.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := r.Context().Value(CK_USERID).(string)

		var machineReq updateMachineRequest
		if err := json.NewDecoder(r.Body).Decode(&machineReq); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		if err := DB.MachineUpdate(userID, machineReq.ID, machineReq.Name, machineReq.Rate); err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNoContent)
		w.Write([]byte(`{"message":"updated"}`))
	}
}

func MachineDelete(DB db.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := r.Context().Value(CK_USERID).(string)

		machineID := r.URL.Query().Get("machine_id")
		if machineID == "" {
			http.Error(w, "Invalid request", http.StatusBadRequest)
			return
		}

		if err := DB.MachineDelete(userID, machineID); err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNoContent)
		w.Write([]byte(`{"message":"deleted"}`))
	}
}
