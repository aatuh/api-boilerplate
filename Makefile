.PHONY: help codegen dev down build test fmt lint health

VERSION ?= $(shell git describe --tags --always --dirty 2>/dev/null || echo dev)
COMMIT ?= $(shell git rev-parse --short HEAD 2>/dev/null || echo none)
DATE ?= $(shell date -u +%Y-%m-%dT%H:%M:%SZ)
export VERSION
export COMMIT
export DATE

help: ## Show this help message
	@echo "Available targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

dev: ## Start development environment
	@echo "🚀 Starting development environment (VERSION=$(VERSION), COMMIT=$(COMMIT))..."
	@docker compose up -d

down: ## Clean up containers and volumes
	@echo "🧹 Cleaning up..."
	@docker compose down -v

cycle: ## Cycle the containers down and up
	@echo "♻️ Cycling development environment..."
	@make down
	@make dev

logs: ## View the logs of the service
	@docker compose logs -f

codegen: ## Generate code
	@echo "🔄 Generating code..."
	@cd api && make swag
	@echo "🔄 Code generated successfully"

build: ## Build all Docker Compose services
	@echo "🔨 Building all services..."
	@make down
	@docker compose build

test: ## Run tests
	@echo "🧪 Running tests..."
	@cd api && make test

fmt: ## Format code
	@echo "🎨 Formatting code..."
	@cd api && make fmt

lint: ## Lint code
	@echo "🔍 Linting code..."
	@cd api && make lint

health: ## Check service healthiness
	@echo "🏥 Checking service healthiness..."
	@cd api && make health
