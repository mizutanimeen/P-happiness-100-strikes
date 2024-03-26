package mysql

import (
	"crypto/tls"
	"crypto/x509"
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/go-sql-driver/mysql"
)

type Mysql struct {
	DB *sql.DB
}

// TODO: -> CREATE_AT, UPDATE_AT
var (
	createAt = os.Getenv("MYSQL_CREATEDAT")
	updateAt = os.Getenv("MYSQL_UPDATEDAT")
)

func New() (*Mysql, error) {
	IP := os.Getenv("MYSQL_IP") // <azure db name>.mysql.database.azure.com:3306
	mysqlConfig := mysql.Config{
		User:      os.Getenv("MYSQL_USER"),
		Passwd:    os.Getenv("MYSQL_PASSWORD"),
		Net:       "tcp",
		Addr:      IP,
		DBName:    os.Getenv("MYSQL_DATABASE"),
		ParseTime: true,
	}

	// Azure 用証書のパスが指定されている場合
	if os.Getenv("MYSQL_CERT_PATH") != "" {
		// CA証明書のロード
		caCert, err := os.ReadFile(os.Getenv("MYSQL_CERT_PATH")) // DigiCertGlobalRootCA.crt.pemのパス
		if err != nil {
			return nil, fmt.Errorf("error read CA cert: %w", err)
		}
		certs := x509.NewCertPool()
		if ok := certs.AppendCertsFromPEM(caCert); !ok {
			return nil, fmt.Errorf("error append certs from pem")
		}

		mysqlConfig.TLS = &tls.Config{
			RootCAs:    certs,
			ServerName: IP,
		}
		mysqlConfig.AllowNativePasswords = true // Azure MySQLでは必要
	}

	DB, err := sql.Open("mysql", mysqlConfig.FormatDSN())
	if err != nil {
		return nil, fmt.Errorf("error DB open: %w", err)
	}

	if err := checkConnect(DB); err != nil {
		return nil, fmt.Errorf("error DB ping: %w", err)
	}

	log.Println("DB connected")

	return &Mysql{DB: DB}, nil
}

func checkConnect(DB *sql.DB) error {
	var err error
	for count := 100; count > 0; count-- {
		err = DB.Ping()
		if err != nil {
			time.Sleep(time.Second * 2)
		} else {
			break
		}
	}

	return err
}

func (s *Mysql) Close() error {
	return s.DB.Close()
}

func (s *Mysql) TouchTables() error {
	if err := s.CreateUserTable(); err != nil {
		return fmt.Errorf("error create user table: %w", err)
	}
	if err := s.CreateMachineTable(); err != nil {
		return fmt.Errorf("error create machine table: %w", err)
	}
	if err := s.CreateDateRecordTable(); err != nil {
		return fmt.Errorf("error create date record table: %w", err)
	}
	if err := s.CreateTimeRecordTable(); err != nil {
		return fmt.Errorf("error create time record table: %w", err)
	}
	if err := s.CreateRPMRecordTable(); err != nil {
		return fmt.Errorf("error create rpm record table: %w", err)
	}
	return nil
}
