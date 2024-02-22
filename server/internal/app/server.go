package app

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/chi/v5"
	"github.com/mizutanimeen/P-happiness-100-strikes/internal/db"
)

const (
	COOKIE_SESSION_NAME       = "session_id"
	COOKIE_SESSION_EXPIRATION = 24 * time.Hour
)

func (a *App) ListenAndServe() error {
	router := chi.NewRouter()
	router.Use(middleware.Logger)

	router.Post("/register", a.RegisterHandler())
	router.Post("/login", a.LoginHandler())
	router.Mount("/api/v1", a.withAuth(a.restAPI()))

	if err := http.ListenAndServe(":3001", router); err != nil {
		return fmt.Errorf("ListenAndServe:%w", err)
	}

	return nil
}

type contextKey string

const ckUserID contextKey = "userID"

func (a *App) withAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		c := r.Context()
		cookie, err := r.Cookie(COOKIE_SESSION_NAME)
		if err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		// 認証
		userID, err := a.Session.GetUserIDBySession(cookie.Value)
		if err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		// クッキーに新しいセッションIDを保存
		newSessionID, err := a.Session.UpdateSession(cookie.Value, userID)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
		http.SetCookie(w, &http.Cookie{
			Name:    COOKIE_SESSION_NAME,
			Value:   newSessionID,
			Expires: time.Now().Add(COOKIE_SESSION_EXPIRATION),
			Path:    "/",
		})

		c = context.WithValue(c, ckUserID, userID)
		next.ServeHTTP(w, r.WithContext(c))
	})
}

func (a *App) restAPI() http.Handler {
	router := chi.NewRouter()
	router.Mount("/user", a.userHandler())
	return router
}

func (a *App) userHandler() http.Handler {
	router := chi.NewRouter()
	router.Get("/", func(w http.ResponseWriter, r *http.Request) {
		id := r.Context().Value(ckUserID).(string)
		user, err := db.UserGet(a.DB, id)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
		if user == nil {
			http.Error(w, "Not Found", http.StatusNotFound)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(user)
	})
	// CreateはRegisterで実装済み
	return router
}

type RegisterRequest struct {
	UserID   string `json:"user_id"`
	Password string `json:"password"`
}

func (a *App) RegisterHandler() func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		var registerReq RegisterRequest
		if err := json.NewDecoder(r.Body).Decode(&registerReq); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		if err := db.UserCreate(a.DB, registerReq.UserID, registerReq.Password); err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		sessionID, err := a.Session.CreateSession(registerReq.UserID)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
		http.SetCookie(w, &http.Cookie{
			Name:    COOKIE_SESSION_NAME,
			Value:   sessionID,
			Expires: time.Now().Add(COOKIE_SESSION_EXPIRATION),
			Path:    "/",
		})

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		w.Write([]byte(`{"message":"created"}`))
	}

}

type LoginRequest struct {
	UserID   string `json:"user_id"`
	Password string `json:"password"`
}

// TODO: ログイン状態でログインAPIを叩かれた場合の処理
func (a *App) LoginHandler() func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		var loginReq LoginRequest
		if err := json.NewDecoder(r.Body).Decode(&loginReq); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		// ユーザー名とパスワードの検証
		user, err := db.UserGet(a.DB, loginReq.UserID)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
		if user == nil || user.Password != loginReq.Password {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		// セッションIDの生成
		sessionID, err := a.Session.CreateSession(loginReq.UserID)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		// クッキーにセッションIDを保存
		http.SetCookie(w, &http.Cookie{
			Name:    COOKIE_SESSION_NAME,
			Value:   sessionID,
			Expires: time.Now().Add(COOKIE_SESSION_EXPIRATION),
			Path:    "/",
		})

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Login successful"))
	}
}
