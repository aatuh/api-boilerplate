.PHONY: help codegen dev down build test fmt lint health

help: ## Show this help message
	@echo "Available targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

codegen: ## Generate code
	@echo "🔄 Generating code..."
	@cd api && make swag
	@echo "🔄 Code generated successfully"

dev: ## Start development environment
	@echo "🚀 Starting development environment..."
	@docker-compose up

down: ## Clean up containers and volumes
	@echo "🧹 Cleaning up..."
	@docker-compose down -v

build: ## Build all services
	@echo "🔨 Building all services..."
	@docker-compose build

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
