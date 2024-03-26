package mysql

import (
	"database/sql"
	"fmt"
	"os"

	"github.com/mizutanimeen/P-happiness-100-strikes/internal/db/model"
)

// TODO: 小文字にする
// TODO: rpm_user_id -> user_idを使う
var (
	MYSQL_RPM_RECORD_TABLE            = os.Getenv("MYSQL_RPM_RECORD_TABLE")
	MYSQL_RPM_RECORD_ID               = os.Getenv("MYSQL_RPM_RECORD_ID")
	MYSQL_RPM_TIME_RECORD_ID          = os.Getenv("MYSQL_TIME_RECORD_ID")
	MYSQL_RPM_USER_ID                 = os.Getenv("MYSQL_USERS_ID")
	MYSQL_RPM_RECORD_INVESTMENT_MONEY = os.Getenv("MYSQL_RPM_RECORD_INVESTMENT_MONEY")
	MYSQL_RPM_RECORD_INVESTMENT_BALL  = os.Getenv("MYSQL_RPM_RECORD_INVESTMENT_BALL")
	MYSQL_RPM_RECORD_START_RPM        = os.Getenv("MYSQL_RPM_RECORD_START_RPM")
	MYSQL_RPM_RECORD_END_RPM          = os.Getenv("MYSQL_RPM_RECORD_END_RPM")
	MYSQL_RPM_MACHINE_ID              = os.Getenv("MYSQL_MACHINE_ID")
	rpmTimeRecordTable                = os.Getenv("MYSQL_TIME_RECORD_TABLE")
	rpmUserTable                      = os.Getenv("MYSQL_USERS_TABLE")
)

func (s *Mysql) CreateRPMRecordTable() error {
	query := fmt.Sprintf("CREATE TABLE IF NOT EXISTS %s (%s int(16) AUTO_INCREMENT, %s int(16) NOT NULL, %s varchar(32) NOT NULL, %s int(64) NOT NULL, %s int(64) NOT NULL, %s int(64) NOT NULL, %s int(64) NOT NULL, %s int(16) NOT NULL, %s DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, %s DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, PRIMARY KEY (%s), FOREIGN KEY (%s) REFERENCES %s(%s) ON DELETE CASCADE, FOREIGN KEY (%s) REFERENCES %s(%s))",
		MYSQL_RPM_RECORD_TABLE, MYSQL_RPM_RECORD_ID, MYSQL_RPM_TIME_RECORD_ID, MYSQL_RPM_USER_ID, MYSQL_RPM_RECORD_INVESTMENT_MONEY, MYSQL_RPM_RECORD_INVESTMENT_BALL, MYSQL_RPM_RECORD_START_RPM, MYSQL_RPM_RECORD_END_RPM, MYSQL_RPM_MACHINE_ID, createAt, updateAt, MYSQL_RPM_RECORD_ID, MYSQL_RPM_TIME_RECORD_ID, rpmTimeRecordTable, MYSQL_RPM_TIME_RECORD_ID, MYSQL_RPM_USER_ID, rpmUserTable, MYSQL_RPM_USER_ID)

	if _, err := s.DB.Exec(query); err != nil {
		return fmt.Errorf("error exec: %w", err)
	}
	return nil
}

func (s *Mysql) RPMRecordsGet(userID, timeRecordID string) ([]*model.RPMRecord, error) {
	query := fmt.Sprintf("SELECT * FROM %s WHERE %s = ? AND %s = ?", MYSQL_RPM_RECORD_TABLE, MYSQL_RPM_USER_ID, MYSQL_RPM_TIME_RECORD_ID)
	rows, err := s.DB.Query(query, userID, timeRecordID)
	if err != nil {
		return nil, fmt.Errorf("error query: %w", err)
	}
	defer rows.Close()

	var rpmRecords []*model.RPMRecord
	for rows.Next() {
		var rpmRecord model.RPMRecord
		if err := rows.Scan(&rpmRecord.ID, &rpmRecord.TimeRecordID, &rpmRecord.UserID, &rpmRecord.InvestmentMoney, &rpmRecord.InvestmentBall, &rpmRecord.StartRPM, &rpmRecord.EndRPM, &rpmRecord.MachineID, &rpmRecord.Create_at, &rpmRecord.Update_at); err != nil {
			if err == sql.ErrNoRows {
				return nil, nil
			}
			return nil, fmt.Errorf("error scan: %w", err)
		}
		rpmRecords = append(rpmRecords, &rpmRecord)
	}
	return rpmRecords, nil
}

func (s *Mysql) RPMRecordCreate(userID string, timeRecordID string, investmentMoney int, investmentBall int, startRPM int, endRPM int, machineID int) error {
	query := fmt.Sprintf("INSERT INTO %s(%s, %s, %s, %s, %s, %s, %s) VALUES(?,?,?,?,?,?,?)",
		MYSQL_RPM_RECORD_TABLE, MYSQL_RPM_USER_ID, MYSQL_RPM_TIME_RECORD_ID, MYSQL_RPM_RECORD_INVESTMENT_MONEY, MYSQL_RPM_RECORD_INVESTMENT_BALL,
		MYSQL_RPM_RECORD_START_RPM, MYSQL_RPM_RECORD_END_RPM, MYSQL_RPM_MACHINE_ID)
	insert, err := s.DB.Prepare(query)
	if err != nil {
		return fmt.Errorf("error prepare: %w", err)
	}
	_, err = insert.Exec(userID, timeRecordID, investmentMoney, investmentBall, startRPM, endRPM, machineID)
	if err != nil {
		return fmt.Errorf("error exec: %w", err)
	}
	return nil
}

func (s *Mysql) RPMRecordUpdate(userID string, timeRecordID string, id string, investmentMoney int, investmentBall int, startRPM int, endRPM int, machineID int) error {
	query := fmt.Sprintf("UPDATE %s SET %s=?, %s=?, %s=?, %s=?, %s=? WHERE %s=? AND %s=? AND %s=?",
		MYSQL_RPM_RECORD_TABLE, MYSQL_RPM_RECORD_INVESTMENT_MONEY, MYSQL_RPM_RECORD_INVESTMENT_BALL,
		MYSQL_RPM_RECORD_START_RPM, MYSQL_RPM_RECORD_END_RPM, MYSQL_RPM_MACHINE_ID,
		MYSQL_RPM_USER_ID, MYSQL_RPM_TIME_RECORD_ID, MYSQL_RPM_RECORD_ID)
	update, err := s.DB.Prepare(query)
	if err != nil {
		return fmt.Errorf("error prepare: %w", err)
	}
	_, err = update.Exec(investmentMoney, investmentBall, startRPM, endRPM, machineID, userID, timeRecordID, id)
	if err != nil {
		return fmt.Errorf("error exec: %w", err)
	}
	return nil
}

func (s *Mysql) RPMRecordDelete(userID string, timeRecordID string, id string) error {
	query := fmt.Sprintf("DELETE FROM %s WHERE %s = ? AND %s=? AND %s=?", MYSQL_RPM_RECORD_TABLE, MYSQL_RPM_USER_ID, MYSQL_RPM_TIME_RECORD_ID, MYSQL_RPM_RECORD_ID)
	delete, err := s.DB.Prepare(query)
	if err != nil {
		return fmt.Errorf("error prepare: %w", err)
	}
	_, err = delete.Exec(userID, timeRecordID, id)
	if err != nil {
		return fmt.Errorf("error exec: %w", err)
	}
	return nil
}
