package api

import (
	"encoding/json"
	"net/http"

	"github.com/mizutanimeen/P-happiness-100-strikes/internal/db"
)

func MachinesGet(DB db.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		id := r.Context().Value(CK_USERID).(string)

		machines, err := DB.MachinesGet(id)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(machines)
	}
}

type createMachineRequest struct {
	Name string `json:"machine_name"`
	Rate int    `json:"rate"`
}

func MachineCreate(DB db.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		id := r.Context().Value(CK_USERID).(string)

		var machineReq createMachineRequest
		if err := json.NewDecoder(r.Body).Decode(&machineReq); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		if err := DB.MachineCreate(id, machineReq.Name, machineReq.Rate); err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		w.Write([]byte(`{"message":"created"}`))
	}
}

type updateMachineRequest struct {
	ID   string `json:"machine_id"`
	Name string `json:"machine_name"`
	Rate int    `json:"rate"`
}

func MachineUpdate(DB db.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		id := r.Context().Value(CK_USERID).(string)

		var machineReq updateMachineRequest
		if err := json.NewDecoder(r.Body).Decode(&machineReq); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		// ユーザーがIDを持っているか確認
		machine, err := DB.MachineGetByID(machineReq.ID, id)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
		if machine == nil {
			http.Error(w, "Machine not found", http.StatusBadRequest)
			return
		}

		if err := DB.MachineUpdate(machineReq.ID, machineReq.Name, machineReq.Rate); err != nil {
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
		id := r.Context().Value(CK_USERID).(string)

		machineID := r.URL.Query().Get("machine_id")
		if machineID == "" {
			http.Error(w, "Invalid request", http.StatusBadRequest)
			return
		}

		// ユーザーがIDを持っているか確認
		machine, err := DB.MachineGetByID(machineID, id)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
		if machine == nil {
			http.Error(w, "Machine not found", http.StatusBadRequest)
			return
		}

		if err := DB.MachineDelete(machineID); err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNoContent)
		w.Write([]byte(`{"message":"deleted"}`))
	}
}
