package main

import (
	"io"
	"log"
	"os"
	"path/filepath"

	"github.com/mizutanimeen/P-happiness-100-strikes/internal/app"
)

// TODO: DBの環境変数をjsonとかyamlにして読み込むか、envファイルをスクリプトから読み込むようにする。デプロイがめんどくさすぎる
func main() {
	f, err := logSetting(os.Getenv("LOG_PATH"))
	if err != nil {
		log.Fatalln("LogSetting: ", err)
	}
	defer f.Close()

	app, err := app.New()
	if err != nil {
		log.Fatalln("app.New:", err)
	}
	defer app.Close()

	if err := app.ListenAndServe(); err != nil {
		log.Fatalln("app.ListenAndServe:", err)
	}
}

// TODO: ログローテーション
// TODO: 書く場所を変える。app.New()とか
func logSetting(logPath string) (*os.File, error) {
	if err := os.MkdirAll(filepath.Dir(logPath), os.ModePerm);err != nil {
		return nil, err
	}

	f, err := os.OpenFile(logPath, os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
	if err != nil {
		return nil, err
	}
	tMultiLogFile := io.MultiWriter(os.Stdout, f)
	log.SetFlags(log.Ldate | log.Ltime | log.Llongfile)
	log.SetOutput(tMultiLogFile)

	log.Println("LogSetting: Success")

	return f, nil
}
