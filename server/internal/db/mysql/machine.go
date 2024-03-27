package mysql

import (
	"database/sql"
	"fmt"
	"os"

	"github.com/mizutanimeen/P-happiness-100-strikes/internal/db/model"
)

var (
	machineTable  = os.Getenv("MYSQL_MACHINE_TABLE")
	machineID     = os.Getenv("MYSQL_MACHINE_ID")
	machineUserID = os.Getenv("MYSQL_USERS_ID")
	machineName   = os.Getenv("MYSQL_MACHINE_NAME")
	machineRate   = os.Getenv("MYSQL_MACHINE_RATE")
)

func (s *Mysql) CreateMachineTable() error {
	query := fmt.Sprintf("CREATE TABLE IF NOT EXISTS %s (%s int(16) AUTO_INCREMENT, %s varchar(32) NOT NULL, %s varchar(64) NOT NULL, %s int(16) NOT NULL, %s DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, %s DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, PRIMARY KEY (%s), FOREIGN KEY (%s) REFERENCES %s(%s));",
		machineTable, machineID, machineUserID, machineName, machineRate, createAt, updateAt, machineID, machineUserID, userTable, userID)
	if _, err := s.DB.Exec(query); err != nil {
		return fmt.Errorf("error exec: %w", err)
	}
	return nil

}

func (s *Mysql) MachinesGet(userID string) ([]*model.Machine, error) {
	query := fmt.Sprintf("SELECT * FROM %s WHERE %s = ?", machineTable, machineUserID)
	rows, err := s.DB.Query(query, userID)
	if err != nil {
		return nil, fmt.Errorf("error query: %w", err)
	}
	defer rows.Close()

	var machines []*model.Machine
	for rows.Next() {
		var machine model.Machine
		if err := rows.Scan(&machine.ID, &machine.UserID, &machine.Name, &machine.Rate, &machine.Create_at, &machine.Update_at); err != nil {
			return nil, fmt.Errorf("error scan: %w", err)
		}
		machines = append(machines, &machine)
	}
	return machines, nil
}

func (s *Mysql) MachineGetByID(userID, id string) (*model.Machine, error) {
	query := fmt.Sprintf("SELECT * FROM %s WHERE %s = ? AND %s = ?", machineTable, machineUserID, machineID)
	row := s.DB.QueryRow(query, userID, id)

	var machine model.Machine
	if err := row.Scan(&machine.ID, &machine.UserID, &machine.Name, &machine.Rate, &machine.Create_at, &machine.Update_at); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("error scan: %w", err)
	}
	return &machine, nil
}

func (s *Mysql) MachineCreate(userID string, name string, rate int) (int64, error) {
	query := fmt.Sprintf("INSERT INTO %s(%s, %s, %s) VALUES(?,?,?)", machineTable, machineUserID, machineName, machineRate)
	insert, err := s.DB.Prepare(query)
	if err != nil {
		return -1, fmt.Errorf("error prepare: %w", err)
	}

	r, err := insert.Exec(userID, name, rate)
	if err != nil {
		return -1, fmt.Errorf("error exec: %w", err)
	}

	id, err := r.LastInsertId()
	if err != nil {
		return -1, fmt.Errorf("error last insert id: %w", err)
	}

	return id, nil
}

func (s *Mysql) MachineUpdate(userID string, id string, name string, rate int) error {
	query := fmt.Sprintf("UPDATE %s SET %s=?, %s=? WHERE %s=? AND %s=?", machineTable, machineName, machineRate, machineUserID, machineID)
	update, err := s.DB.Prepare(query)
	if err != nil {
		return fmt.Errorf("error prepare: %w", err)
	}

	if _, err := update.Exec(name, rate, userID, id); err != nil {
		return fmt.Errorf("error exec: %w", err)
	}
	return nil
}

func (s *Mysql) MachineDelete(userID, id string) error {
	query := fmt.Sprintf("DELETE FROM %s WHERE %s = ? AND %s = ?", machineTable, machineUserID, machineID)
	delete, err := s.DB.Prepare(query)
	if err != nil {
		return fmt.Errorf("error prepare: %w", err)
	}

	if _, err := delete.Exec(userID, id); err != nil {
		return fmt.Errorf("error exec: %w", err)
	}
	return nil
}
