package app

import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/mizutanimeen/P-happiness-100-strikes/internal/api"
)

func (a *App) ListenAndServe() error {
	router := chi.NewRouter()
	router.Use(middleware.Logger)
	router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token", "Cookie"},
		AllowCredentials: true,
		MaxAge:           300,
	}))
	router.Post("/register", api.RegisterHandler(a.DB, a.Session))
	router.Post("/login", api.LoginHandler(a.DB, a.Session))
	router.Get("/login/check", api.IsLoginHandler(a.Session))
	router.Get("/logout", api.LogoutHandler())
	router.Mount("/api/v1", api.WithAuth(a.restAPI(), a.Session))

	// TODO: TLS 対応
	if err := http.ListenAndServe(":3001", router); err != nil {
		return fmt.Errorf("ListenAndServe:%w", err)
	}

	return nil
}

func (a *App) restAPI() http.Handler {
	router := chi.NewRouter()
	router.Mount("/users", a.usersHandler())
	router.Mount("/records", a.recordsHandler())
	router.Mount("/machines", a.machinesHandler())
	return router
}

func (a *App) usersHandler() http.Handler {
	router := chi.NewRouter()
	router.Get("/", api.UserGet(a.DB))
	// CreateはRegisterで実装
	return router
}

func (a *App) recordsHandler() http.Handler {
	router := chi.NewRouter()
	router.Mount("/dates", a.dateRecordsHandler())
	router.Mount("/times", a.timeRecordsHandler())
	return router
}

func (a *App) dateRecordsHandler() http.Handler {
	router := chi.NewRouter()
	router.Get("/", api.DateRecordsGet(a.DB))
	router.Post("/", api.DateRecordCreate(a.DB))
	router.Put("/", api.DateRecordUpdate(a.DB))
	return router
}

func (a *App) timeRecordsHandler() http.Handler {
	router := chi.NewRouter()
	router.Get("/", api.TimeRecordsGet(a.DB))
	router.Get("/{times_id}", api.TimeRecordsGetByID(a.DB))
	router.Post("/", api.TimeRecordCreate(a.DB))
	router.Put("/", api.TimeRecordUpdate(a.DB))
	router.Delete("/", api.TimeRecordDelete(a.DB))
	router.Mount("/{times_id}/rpms", a.rPMRecordsHandler())
	return router
}

func (a *App) rPMRecordsHandler() http.Handler {
	router := chi.NewRouter()
	router.Get("/", api.RPMRecordsGet(a.DB))
	router.Post("/", api.RPMRecordCreate(a.DB))
	router.Put("/", api.RPMRecordUpdate(a.DB))
	router.Delete("/", api.RPMRecordDelete(a.DB))
	return router
}

func (a *App) machinesHandler() http.Handler {
	router := chi.NewRouter()
	router.Get("/", api.MachinesGet(a.DB))
	router.Get("/{machine_id}", api.MachinesGetByID(a.DB))
	router.Post("/", api.MachineCreate(a.DB))
	router.Put("/", api.MachineUpdate(a.DB))
	router.Delete("/", api.MachineDelete(a.DB))
	return router
}
