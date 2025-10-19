SHELL := /bin/bash

.PHONY: help dev down logs swag migrate-build migrate-up migrate-down migrate-status migrate-new tidy test test-cached test-fast test-clean health

help: ## Show this help message
	@echo "Available targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

dev: ## Start development environment
	docker compose --env-file .env up --build

down: ## Clean up containers and volumes
	docker compose down -v

logs: ## View the logs of the development environment
	docker compose logs -f api

swag: ## Generate the swagger files
	# generate swagger files inside the api container
	docker compose exec api swag init -g cmd/api/main.go -o ./swagger

migrate-up: ## Apply the migrations
	docker compose exec api sh -c "go run ./cmd/migrate -dir \$$MIGRATIONS_DIR up"

migrate-down: ## Rollback the migrations
	docker compose exec api sh -c "go run ./cmd/migrate -dir \$$MIGRATIONS_DIR --allow-down down"

migrate-status: ## Show the status of the migrations
	docker compose exec api sh -c "go run ./cmd/migrate -dir \$$MIGRATIONS_DIR status"

tidy: ## Tidy the go modules
	docker compose exec api go mod tidy

FLAGS   ?=
TEST_PATTERN ?=
PKG          ?= ./...
CACHE_TTL ?= 3600
CACHE_ENABLED ?= true

test: ## Run the tests
	@echo "🧪 Running tests in Docker. Pattern: '$(TEST_PATTERN)'  Flags: '$(FLAGS)'  Pkg: '$(PKG)'"
	@docker compose up -d db api
	@docker compose run --no-deps --rm \
		-e TEST_PATTERN='$(TEST_PATTERN)' \
		-e FLAGS='$(FLAGS)' \
		-e PKG='$(PKG)' \
		-e FAST='$(FAST)' \
		-e SKIP_API_WAIT='$(SKIP_API_WAIT)' \
		test

test-cached: ## Run tests with caching enabled
	@echo "🧪 Running cached tests in Docker. Pattern: '$(TEST_PATTERN)'  Flags: '$(FLAGS)'  Pkg: '$(PKG)'  Cache TTL: '$(CACHE_TTL)'"
	@docker compose up -d db api
	@docker compose run --no-deps --rm \
		-e TEST_PATTERN='$(TEST_PATTERN)' \
		-e FLAGS='$(FLAGS)' \
		-e PKG='$(PKG)' \
		-e FAST='$(FAST)' \
		-e SKIP_API_WAIT='$(SKIP_API_WAIT)' \
		-e TEST_CACHE_ENABLED='$(CACHE_ENABLED)' \
		-e TEST_CACHE_TTL='$(CACHE_TTL)' \
		-e TEST_CACHE_DIR='/tmp/test-cache' \
		test

test-clean: ## Clean test cache
	@echo "🧹 Cleaning test cache..."
	@docker compose run --no-deps --rm test sh -c "rm -rf /tmp/test-cache .test-cache"

test-fast: ## Run tests in fast mode (no coverage, no caching)
	@echo "⚡ Running fast tests..."
	@docker compose up -d db api
	@docker compose run --no-deps --rm \
		-e TEST_PATTERN='$(TEST_PATTERN)' \
		-e FLAGS='$(FLAGS)' \
		-e PKG='$(PKG)' \
		-e FAST='true' \
		-e SKIP_API_WAIT='$(SKIP_API_WAIT)' \
		test

fmt: ## Format Go code
	@echo "🎨 Formatting Go code..."
	@docker compose run --no-deps --rm api gofmt -s -w .
	@echo "✅ Code formatted successfully"

lint: ## Lint Go code
	@echo "🔍 Linting Go code..."
	@docker compose run --no-deps --rm api sh -c "go vet ./... && golangci-lint run"
	@echo "✅ Code linted successfully"

health: ## Check service healthiness (logs + curl)
	@echo "🏥 Checking service healthiness..."
	@echo "📋 Docker Compose logs (last 20 lines):"
	@docker-compose logs --tail=20 api
	@echo ""
	@echo "🌐 Health endpoint check:"
	@curl -f http://localhost:8000/health || echo "❌ Health check failed"
	@echo ""
	@echo "✅ Health check completed"
