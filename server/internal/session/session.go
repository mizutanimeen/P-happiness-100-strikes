package session

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"os"
	"time"

	"github.com/redis/go-redis/v9"
)

const (
	SESSION_EXPIRATION = time.Hour * 24
)

type Session struct {
	Client *redis.Client
	Ctx    context.Context
}

func New() *Session {
	rdb := redis.NewClient(&redis.Options{
		Addr:     os.Getenv("REDIS_IP"),
		Password: "",
		DB:       0,
	})

	return &Session{
		Client: rdb,
		Ctx:    context.Background(),
	}
}

func (s *Session) GetUserIDBySession(sessionID string) (string, error) {
	userID, err := s.Client.Get(s.Ctx, sessionID).Result()
	if err != nil {
		return "", err
	}
	return userID, nil
}

func (s *Session) UpdateSession(sessionID, userID string) (string, error) {
	newSessionID, err := s.CreateSession(userID)
	if err != nil {
		return "", err
	}

	if err := s.deleteSession(sessionID); err != nil {
		return "", err
	}

	return newSessionID, nil
}

func (s *Session) CreateSession(userID string) (string, error) {
	sessionID, err := generateRandomSessionID()
	if err != nil {
		return "", err
	}

	if err := s.Client.Set(s.Ctx, sessionID, userID, SESSION_EXPIRATION).Err(); err != nil {
		return "", err
	}

	return sessionID, nil
}

func (s *Session) deleteSession(sessionID string) error {
	if err := s.Client.Del(s.Ctx, sessionID).Err(); err != nil {
		return err
	}
	return nil
}

func generateRandomSessionID() (string, error) {
	randomBytes := make([]byte, 16)
	if _, err := rand.Read(randomBytes); err != nil {
		return "", err
	}

	return hex.EncodeToString(randomBytes), nil
}
