# Canvas Otomasyon Sistemi - Makefile
# Production deployment ve development için helper commands

.PHONY: help install test build deploy clean docker k8s

# Variables
PYTHON := python3
PIP := pip3
DOCKER := docker
KUBECTL := kubectl
PROJECT_NAME := canvas-automation
VERSION := $(shell git describe --tags --always --dirty)
REGISTRY := ghcr.io
IMAGE_NAME := $(REGISTRY)/$(PROJECT_NAME)

# Default target
help: ## Show this help message
	@echo "Canvas Otomasyon Sistemi - Available Commands:"
	@echo "=============================================="
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Development
install: ## Install development dependencies
	@echo "📦 Installing dependencies..."
	$(PIP) install --upgrade pip setuptools wheel
	$(PIP) install -r requirements_advanced.txt
	$(PIP) install pytest pytest-cov black flake8 isort bandit safety
	@echo "✅ Dependencies installed"

install-ubuntu: ## Install on Ubuntu 22.04
	@echo "🐧 Installing on Ubuntu 22.04..."
	chmod +x ubuntu_setup_advanced.sh
	./ubuntu_setup_advanced.sh
	@echo "✅ Ubuntu installation completed"

format: ## Format code with black and isort
	@echo "🎨 Formatting code..."
	black .
	isort .
	@echo "✅ Code formatted"

lint: ## Run linting checks
	@echo "🔍 Running linting checks..."
	flake8 . --max-line-length=127 --extend-ignore=E203,W503
	black --check .
	isort --check-only .
	@echo "✅ Linting completed"

security: ## Run security checks
	@echo "🔒 Running security checks..."
	bandit -r . -f json -o bandit-report.json || true
	bandit -r . --severity-level medium
	safety check
	@echo "✅ Security checks completed"

# Testing
test: ## Run all tests
	@echo "🧪 Running tests..."
	export DISPLAY=:99 && \
	xvfb-run -a pytest tests/ -v --cov=. --cov-report=term-missing --cov-report=html
	@echo "✅ Tests completed"

test-unit: ## Run unit tests only
	@echo "🧪 Running unit tests..."
	pytest tests/ -v -m "not integration" --cov=.
	@echo "✅ Unit tests completed"

test-integration: ## Run integration tests only
	@echo "🧪 Running integration tests..."
	export DISPLAY=:99 && \
	xvfb-run -a pytest tests/ -v -m "integration"
	@echo "✅ Integration tests completed"

test-automation: ## Run automation system tests
	@echo "🧪 Running automation tests..."
	chmod +x test_advanced_automation.sh
	./test_advanced_automation.sh
	@echo "✅ Automation tests completed"

# Docker
docker-build: ## Build Docker image
	@echo "🐳 Building Docker image..."
	$(DOCKER) build -t $(IMAGE_NAME):$(VERSION) .
	$(DOCKER) tag $(IMAGE_NAME):$(VERSION) $(IMAGE_NAME):latest
	@echo "✅ Docker image built: $(IMAGE_NAME):$(VERSION)"

docker-run: ## Run Docker container locally
	@echo "🐳 Running Docker container..."
	$(DOCKER) run -d \
		--name $(PROJECT_NAME) \
		-p 8080:8080 \
		-p 8081:8081 \
		-v $(PWD)/logs:/app/logs \
		$(IMAGE_NAME):latest
	@echo "✅ Container started: http://localhost:8080"

docker-stop: ## Stop Docker container
	@echo "🐳 Stopping Docker container..."
	$(DOCKER) stop $(PROJECT_NAME) || true
	$(DOCKER) rm $(PROJECT_NAME) || true
	@echo "✅ Container stopped"

docker-push: ## Push Docker image to registry
	@echo "🐳 Pushing Docker image..."
	$(DOCKER) push $(IMAGE_NAME):$(VERSION)
	$(DOCKER) push $(IMAGE_NAME):latest
	@echo "✅ Docker image pushed"

docker-compose-up: ## Start with docker-compose
	@echo "🐳 Starting with docker-compose..."
	docker-compose up -d
	@echo "✅ Services started"

docker-compose-down: ## Stop docker-compose services
	@echo "🐳 Stopping docker-compose services..."
	docker-compose down
	@echo "✅ Services stopped"

# Kubernetes
k8s-deploy: ## Deploy to Kubernetes
	@echo "☸️ Deploying to Kubernetes..."
	$(KUBECTL) apply -f k8s-deployment.yaml
	@echo "✅ Deployed to Kubernetes"

k8s-status: ## Check Kubernetes deployment status
	@echo "☸️ Checking Kubernetes status..."
	$(KUBECTL) get pods -n canvas-automation
	$(KUBECTL) get services -n canvas-automation
	$(KUBECTL) get ingress -n canvas-automation

k8s-logs: ## View Kubernetes logs
	@echo "☸️ Viewing Kubernetes logs..."
	$(KUBECTL) logs -f deployment/canvas-automation-api -n canvas-automation

k8s-delete: ## Delete Kubernetes deployment
	@echo "☸️ Deleting Kubernetes deployment..."
	$(KUBECTL) delete -f k8s-deployment.yaml
	@echo "✅ Kubernetes deployment deleted"

# Production deployment
deploy-staging: ## Deploy to staging environment
	@echo "🚀 Deploying to staging..."
	@echo "Building and pushing image..."
	make docker-build
	make docker-push
	@echo "Deploying to staging cluster..."
	$(KUBECTL) set image deployment/canvas-automation-api canvas-automation=$(IMAGE_NAME):$(VERSION) -n canvas-automation-staging
	$(KUBECTL) rollout status deployment/canvas-automation-api -n canvas-automation-staging
	@echo "✅ Deployed to staging"

deploy-production: ## Deploy to production environment
	@echo "🚀 Deploying to production..."
	@read -p "Are you sure you want to deploy to production? [y/N] " confirm && [ "$$confirm" = "y" ]
	@echo "Building and pushing image..."
	make docker-build
	make docker-push
	@echo "Deploying to production cluster..."
	$(KUBECTL) set image deployment/canvas-automation-api canvas-automation=$(IMAGE_NAME):$(VERSION) -n canvas-automation
	$(KUBECTL) rollout status deployment/canvas-automation-api -n canvas-automation
	@echo "✅ Deployed to production"

# Monitoring
logs: ## View application logs
	@echo "📊 Viewing logs..."
	tail -f *.log

monitor: ## Start monitoring dashboard
	@echo "📊 Starting monitoring dashboard..."
	$(PYTHON) monitoring_dashboard.py 8080 &
	@echo "✅ Monitoring dashboard started: http://localhost:8080"

api-server: ## Start API server
	@echo "🚀 Starting API server..."
	$(PYTHON) api_server.py 8081 &
	@echo "✅ API server started: http://localhost:8081"

# Maintenance
backup: ## Create backup of configuration and logs
	@echo "💾 Creating backup..."
	mkdir -p backups
	tar -czf backups/canvas-automation-backup-$(shell date +%Y%m%d-%H%M%S).tar.gz \
		*.json *.py *.sh *.md *.log 2>/dev/null || true
	@echo "✅ Backup created in backups/"

restore: ## Restore from backup (specify BACKUP_FILE)
	@echo "📥 Restoring from backup..."
	@if [ -z "$(BACKUP_FILE)" ]; then \
		echo "❌ Please specify BACKUP_FILE=path/to/backup.tar.gz"; \
		exit 1; \
	fi
	tar -xzf $(BACKUP_FILE)
	@echo "✅ Restored from $(BACKUP_FILE)"

clean: ## Clean up temporary files and caches
	@echo "🧹 Cleaning up..."
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.log" -size +100M -delete 2>/dev/null || true
	rm -rf .pytest_cache/ htmlcov/ .coverage coverage.xml
	rm -rf bandit-report.json safety-report.json
	$(DOCKER) system prune -f 2>/dev/null || true
	@echo "✅ Cleanup completed"

# Health checks
health-check: ## Run health checks
	@echo "❤️ Running health checks..."
	@echo "Checking API server..."
	curl -f http://localhost:8081/health || echo "❌ API server not responding"
	@echo "Checking monitoring dashboard..."
	curl -f http://localhost:8080/health || echo "❌ Dashboard not responding"
	@echo "Checking system resources..."
	df -h
	free -h
	@echo "✅ Health checks completed"

performance-test: ## Run performance tests
	@echo "⚡ Running performance tests..."
	@echo "Testing API endpoints..."
	for i in {1..10}; do \
		curl -s -w "Response time: %{time_total}s\n" http://localhost:8081/health > /dev/null; \
	done
	@echo "✅ Performance tests completed"

# Development helpers
dev-setup: ## Setup development environment
	@echo "🛠️ Setting up development environment..."
	make install
	make format
	make test-unit
	@echo "✅ Development environment ready"

dev-run: ## Run in development mode
	@echo "🛠️ Running in development mode..."
	export DISPLAY=:99 && \
	xvfb-run -a $(PYTHON) advanced_canvas_automation.py chrome 12345678901234 false

dev-api: ## Run API server in development mode
	@echo "🛠️ Running API server in development mode..."
	$(PYTHON) api_server.py 8081

# CI/CD helpers
ci-test: ## Run CI tests
	@echo "🔄 Running CI tests..."
	make lint
	make security
	make test
	@echo "✅ CI tests completed"

cd-deploy: ## Run CD deployment
	@echo "🔄 Running CD deployment..."
	make docker-build
	make docker-push
	make k8s-deploy
	@echo "✅ CD deployment completed"

# Documentation
docs: ## Generate documentation
	@echo "📚 Generating documentation..."
	@echo "Available documentation files:"
	@ls -la *.md
	@echo "✅ Documentation ready"

# Version management
version: ## Show current version
	@echo "Current version: $(VERSION)"

tag: ## Create a new git tag (specify TAG)
	@if [ -z "$(TAG)" ]; then \
		echo "❌ Please specify TAG=v1.0.0"; \
		exit 1; \
	fi
	git tag -a $(TAG) -m "Release $(TAG)"
	git push origin $(TAG)
	@echo "✅ Tagged as $(TAG)"

# Quick commands
quick-test: ## Quick test run
	@echo "⚡ Quick test..."
	$(PYTHON) windows_test.py || $(PYTHON) canvas_automation.py chrome 12345678901234 true

quick-deploy: ## Quick deployment to local Docker
	@echo "⚡ Quick deployment..."
	make docker-build
	make docker-run
	@echo "✅ Quick deployment completed"

# All-in-one commands
full-setup: ## Complete setup (Ubuntu + test)
	@echo "🚀 Full setup starting..."
	make install-ubuntu
	make test-automation
	@echo "✅ Full setup completed"

full-deploy: ## Complete deployment pipeline
	@echo "🚀 Full deployment starting..."
	make ci-test
	make docker-build
	make docker-push
	make k8s-deploy
	make health-check
	@echo "✅ Full deployment completed"

# Status and info
status: ## Show system status
	@echo "📊 System Status"
	@echo "==============="
	@echo "Version: $(VERSION)"
	@echo "Python: $(shell $(PYTHON) --version)"
	@echo "Docker: $(shell $(DOCKER) --version 2>/dev/null || echo 'Not installed')"
	@echo "Kubectl: $(shell $(KUBECTL) version --client --short 2>/dev/null || echo 'Not installed')"
	@echo ""
	@echo "Services:"
	@curl -s http://localhost:8081/health 2>/dev/null && echo "✅ API Server" || echo "❌ API Server"
	@curl -s http://localhost:8080/health 2>/dev/null && echo "✅ Dashboard" || echo "❌ Dashboard"
	@echo ""
	@echo "Disk usage:"
	@df -h . | tail -1
	@echo ""
	@echo "Memory usage:"
	@free -h | grep Mem