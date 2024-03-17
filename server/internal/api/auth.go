package api

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/mizutanimeen/P-happiness-100-strikes/internal/db"
	"github.com/mizutanimeen/P-happiness-100-strikes/internal/session"
)

const (
	COOKIE_SESSION_NAME       = "session_id"
	COOKIE_SESSION_EXPIRATION = 24 * time.Hour
)

type contextKey string

const CK_USERID contextKey = "userID"

type registerRequest struct {
	UserID   string `json:"user_id"`
	Password string `json:"password"`
}

func RegisterHandler(DB db.DB, s *session.Session) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		var registerReq registerRequest
		if err := json.NewDecoder(r.Body).Decode(&registerReq); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		// TODO: パスワードのバリデーション
		if registerReq.UserID == "" || registerReq.Password == "" {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		// TODO: ユーザー名の重複チェック

		if err := DB.UserCreate(registerReq.UserID, registerReq.Password); err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		sessionID, err := s.CreateSession(registerReq.UserID)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
		//TODO: クッキー処理まとめる
		http.SetCookie(w, &http.Cookie{
			Name:     COOKIE_SESSION_NAME,
			Value:    sessionID,
			Expires:  time.Now().Add(COOKIE_SESSION_EXPIRATION),
			Path:     "/",
			Secure:   false, // TODO: true にする
			HttpOnly: true,
		})

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		w.Write([]byte(`{"message":"created"}`))
	}
}

type loginRequest struct {
	UserID   string `json:"user_id"`
	Password string `json:"password"`
}

// TODO: ログイン状態でログインAPIを叩かれた場合の処理
func LoginHandler(DB db.DB, s *session.Session) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		var loginReq loginRequest
		if err := json.NewDecoder(r.Body).Decode(&loginReq); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		// ユーザー名とパスワードの検証
		user, err := DB.UserGet(loginReq.UserID)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
		if user == nil || user.Password != loginReq.Password {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		// セッションIDの生成
		sessionID, err := s.CreateSession(loginReq.UserID)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		// クッキーにセッションIDを保存
		http.SetCookie(w, &http.Cookie{
			Name:     COOKIE_SESSION_NAME,
			Value:    sessionID,
			Expires:  time.Now().Add(COOKIE_SESSION_EXPIRATION),
			Path:     "/",
			Secure:   false, // TODO: true にする
			HttpOnly: true,
		})

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Login successful"))
	}
}

func IsLoginHandler(s *session.Session) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie(COOKIE_SESSION_NAME)
		if err != nil {
			http.Error(w, "Unauthorized: "+err.Error(), http.StatusUnauthorized)
			return
		}

		if cookie.Value == "" {
			http.Error(w, "Unauthorized:", http.StatusUnauthorized)
			return
		}

		// 認証
		_, err = s.GetUserIDBySession(cookie.Value)
		if err != nil {
			http.Error(w, "Unauthorized: "+err.Error(), http.StatusUnauthorized)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Logined"))
	}
}

func LogoutHandler() func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		http.SetCookie(w, &http.Cookie{
			Name:    COOKIE_SESSION_NAME,
			Value:   "",
			Expires: time.Now().Add(COOKIE_SESSION_EXPIRATION),
			Path:    "/",
		})

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Logout successful"))
	}
}

func WithAuth(next http.Handler, s *session.Session) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		c := r.Context()
		cookie, err := r.Cookie(COOKIE_SESSION_NAME)
		if err != nil {
			http.Error(w, "Unauthorized: "+err.Error(), http.StatusUnauthorized)
			return
		}

		// 認証
		userID, err := s.GetUserIDBySession(cookie.Value)
		if err != nil {
			http.Error(w, "Unauthorized: "+err.Error(), http.StatusUnauthorized)
			return
		}

		// クッキーに新しいセッションIDを保存
		newSessionID, err := s.UpdateSession(cookie.Value, userID)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
		http.SetCookie(w, &http.Cookie{
			Name:     COOKIE_SESSION_NAME,
			Value:    newSessionID,
			Expires:  time.Now().Add(COOKIE_SESSION_EXPIRATION),
			Path:     "/",
			Secure:   false, // TODO: true にする
			HttpOnly: true,
		})

		c = context.WithValue(c, CK_USERID, userID)
		next.ServeHTTP(w, r.WithContext(c))
	})
}
