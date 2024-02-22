package main

import (
	"log"

	"github.com/mizutanimeen/P-happiness-100-strikes/internal/app"
)

func main() {
	// TODO: ログ設定
	app, err := app.New()
	if err != nil {
		log.Fatalln("app.New:", err)
	}
	defer app.Close()

	if err := app.ListenAndServe(); err != nil {
		log.Fatalln("app.ListenAndServe:", err)
	}
}
