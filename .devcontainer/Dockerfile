# syntax=docker/dockerfile:1
FROM ubuntu:22.04

SHELL [ "/bin/sh", "-x", "-c" ]

# キャッシュの永続化
RUN rm -f /etc/apt/apt.conf.d/docker-clean \
    && echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' >/etc/apt/apt.conf.d/keep-cache

# ca-certificates
RUN --mount=type=cache,target=/var/lib/apt/lists,sharing=locked \
    --mount=type=cache,target=/var/cache/apt,sharing=locked \
    apt-get update \
    && apt-get install -y --no-install-recommends \
    ca-certificates

# 日本語対応
RUN --mount=type=cache,target=/var/lib/apt/lists,sharing=locked \
    --mount=type=cache,target=/var/cache/apt,sharing=locked \
    apt-get update \
    && apt-get install -y --no-install-recommends \
    tzdata \
    && ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime \
    && echo 'Asia/Tokyo' >/etc/timezone \
    && apt-get install -y --no-install-recommends \
    language-pack-ja-base \
    language-pack-ja
ENV LANG=ja_JP.UTF-8

# 基本ツール
RUN --mount=type=cache,target=/var/lib/apt/lists,sharing=locked \
    --mount=type=cache,target=/var/cache/apt,sharing=locked \
    apt-get update \
    && apt-get install -y --no-install-recommends \
    bash-completion \
    curl \
    git \
    gnupg2 \
    iputils-ping \
    less \
    net-tools \
    tar \
    time \
    unzip \
    xz-utils \
    zip

# ユーザー作成
ARG USERNAME=vscode
RUN --mount=type=cache,target=/var/lib/apt/lists,sharing=locked \
    --mount=type=cache,target=/var/cache/apt,sharing=locked \
    apt-get update \
    && apt-get install -y --no-install-recommends \
    sudo \
    && echo "${USERNAME} ALL=(ALL) NOPASSWD:ALL" >>/etc/sudoers.d/ALL \
    && groupadd --gid 5000 ${USERNAME} \
    && useradd --uid 5000 --gid 5000 --home-dir /home/${USERNAME} --create-home --shell /bin/bash ${USERNAME}

ENV PATH="${PATH}:/home/${USERNAME}/.local/bin"

# go 環境
ARG GO_VERSION=1.21.6
RUN --mount=type=cache,target=/var/lib/apt/lists,sharing=locked \
    --mount=type=cache,target=/var/cache/apt,sharing=locked \
    apt-get update \
    && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    git \
    && curl -fsSL "https://go.dev/dl/go${GO_VERSION}.linux-amd64.tar.gz" | tar -xz -C /usr/local
ENV GOROOT=/usr/local/go \
    GOPATH=/home/${USERNAME}/go \
    PATH=/home/${USERNAME}/go/bin:/usr/local/go/bin:${PATH}
RUN mkdir ${GOPATH} \
    && chown -R ${USERNAME}:${USERNAME} ${GOPATH}

# node 環境
ARG NODE_VERSION=20.11
RUN --mount=type=cache,target=/var/lib/apt/lists,sharing=locked \
    --mount=type=cache,target=/var/cache/apt,sharing=locked \
    apt-get update \
    && apt-get install -y --no-install-recommends \
    nodejs \
    npm
RUN --mount=type=cache,target=/var/lib/apt/lists,sharing=locked \
    --mount=type=cache,target=/var/cache/apt,sharing=locked \
    npm install -g n
RUN n ${NODE_VERSION}
RUN --mount=type=cache,target=/var/lib/apt/lists,sharing=locked \
    --mount=type=cache,target=/var/cache/apt,sharing=locked \
    apt-get purge -y --auto-remove \
    nodejs \
    npm

USER ${USERNAME}
