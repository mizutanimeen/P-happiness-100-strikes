# # syntax=docker/dockerfile:1
# FROM golang:1.21.6 as server

# SHELL [ "/bin/sh", "-x", "-c" ]

# WORKDIR /workdir

# COPY ./server .

# RUN go build \
#     -ldflags="-s -w" \
#     -trimpath \
#     -o server

# FROM ubuntu:22.04

# SHELL [ "/bin/sh", "-x", "-c" ]

# # キャッシュの永続化
# RUN rm -f /etc/apt/apt.conf.d/docker-clean \
#     && echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' >/etc/apt/apt.conf.d/keep-cache

# # ca-certificates
# RUN --mount=type=cache,target=/var/lib/apt/lists,sharing=locked \
#     --mount=type=cache,target=/var/cache/apt,sharing=locked \
#     apt-get update \
#     && apt-get install -y --no-install-recommends ca-certificates

# # 日本語対応
# RUN --mount=type=cache,target=/var/lib/apt/lists,sharing=locked \
#     --mount=type=cache,target=/var/cache/apt,sharing=locked \
#     apt-get update \
#     && apt-get install -y --no-install-recommends \
#     tzdata \
#     && ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime \
#     && echo 'Asia/Tokyo' >/etc/timezone \
#     && apt-get install -y --no-install-recommends \
#     language-pack-ja-base \
#     language-pack-ja
# ENV LANG=ja_JP.UTF-8

# COPY --from=server /workdir/server /server

# ENTRYPOINT [ "/server" ]

#dev
FROM golang:1.21.6

# ホットリロード
RUN go install github.com/cosmtrek/air@latest

WORKDIR /src
