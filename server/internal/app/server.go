package app

import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/chi/v5"
	"github.com/mizutanimeen/P-happiness-100-strikes/internal/api"
)

func (a *App) ListenAndServe() error {
	router := chi.NewRouter()
	router.Use(middleware.Logger)

	router.Post("/register", api.RegisterHandler(a.DB, a.Session))
	router.Post("/login", api.LoginHandler(a.DB, a.Session))
	router.Get("/logout", api.LogoutHandler())
	router.Mount("/api/v1", api.WithAuth(a.restAPI(), a.Session))

	if err := http.ListenAndServe(":3001", router); err != nil {
		return fmt.Errorf("ListenAndServe:%w", err)
	}

	return nil
}

func (a *App) restAPI() http.Handler {
	router := chi.NewRouter()
	router.Mount("/users", a.usersHandler())
	router.Mount("/records", a.recordHandler())
	return router
}

func (a *App) usersHandler() http.Handler {
	router := chi.NewRouter()
	router.Get("/", api.UserGet(a.DB))
	// CreateはRegisterで実装
	return router
}

func (a *App) recordHandler() http.Handler {
	router := chi.NewRouter()
	router.Mount("/dates", a.dateRecordHandler())
	router.Mount("/times", a.timeRecordHandler())
	return router
}

func (a *App) dateRecordHandler() http.Handler {
	router := chi.NewRouter()
	router.Get("/", api.DayRecordGet(a.DB))
	router.Post("/", api.DayRecordCreate(a.DB))
	router.Put("/", api.DayRecordUpdate(a.DB))
	return router
}

func (a *App) timeRecordHandler() http.Handler {
	router := chi.NewRouter()
	router.Get("/", api.TimeRecordGet())
	router.Mount("/{id}/rpms", a.rPMRecordHandler())
	return router
}

func (a *App) rPMRecordHandler() http.Handler {
	router := chi.NewRouter()
	router.Get("/", api.RPMRecordGet())
	return router
}
