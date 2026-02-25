.PHONY: help init plan apply destroy fmt validate clean build deploy

# Color output
BLUE := \033[0;34m
GREEN := \033[0;32m
RED := \033[0;31m
NC := \033[0m # No Color

# Default target
help:
	@echo "$(BLUE)AfricanKingsEshop - Infrastructure Management$(NC)"
	@echo ""
	@echo "$(GREEN)Website Targets:$(NC)"
	@echo "  make build              Build the website"
	@echo "  make dev                Start development server"
	@echo "  make preview            Preview production build"
	@echo ""
	@echo "$(GREEN)Infrastructure Targets:$(NC)"
	@echo "  make init               Initialize Terraform"
	@echo "  make plan               Plan infrastructure changes"
	@echo "  make apply              Apply infrastructure changes"
	@echo "  make destroy            Destroy infrastructure (CAUTION)"
	@echo "  make fmt                Format Terraform files"
	@echo "  make validate           Validate Terraform configuration"
	@echo ""
	@echo "$(GREEN)Deployment Targets:$(NC)"
	@echo "  make deploy             Build and deploy website"
	@echo "  make sync-s3            Sync website to S3"
	@echo "  make invalidate-cf      Invalidate CloudFront cache"
	@echo ""
	@echo "$(GREEN)Utility Targets:$(NC)"
	@echo "  make clean              Clean build artifacts"
	@echo "  make lint               Run linting checks"
	@echo "  make security-scan      Run security scanning"
	@echo "  make cost-estimate      Estimate AWS costs"

# Website targets
build:
	@echo "$(BLUE)Building website...$(NC)"
	pnpm install
	pnpm run build
	@echo "$(GREEN)Build complete!$(NC)"

dev:
	@echo "$(BLUE)Starting development server...$(NC)"
	pnpm install
	pnpm run dev

preview:
	@echo "$(BLUE)Building and previewing production build...$(NC)"
	pnpm install
	pnpm run build
	pnpm run preview

# Terraform targets
init:
	@echo "$(BLUE)Initializing Terraform...$(NC)"
	@if [ ! -f infra/terraform.tfvars ]; then \
		echo "$(RED)Error: terraform.tfvars not found$(NC)"; \
		echo "Please copy terraform.tfvars.example to terraform.tfvars and fill in your values"; \
		exit 1; \
	fi
	cd infra && terraform init
	@echo "$(GREEN)Terraform initialized!$(NC)"

plan: init
	@echo "$(BLUE)Planning infrastructure changes...$(NC)"
	cd infra && terraform plan -out=tfplan
	@echo "$(GREEN)Plan complete! Review changes above.$(NC)"

apply: init
	@echo "$(BLUE)Applying infrastructure changes...$(NC)"
	@echo "$(RED)WARNING: This will create/modify AWS resources$(NC)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		cd infra && terraform apply; \
	else \
		echo "Cancelled."; \
	fi

destroy: init
	@echo "$(RED)CAUTION: This will destroy all AWS resources$(NC)"
	@read -p "Type 'destroy' to confirm: " confirm; \
	if [ "$$confirm" = "destroy" ]; then \
		cd infra && terraform destroy; \
	else \
		echo "Cancelled."; \
	fi

fmt:
	@echo "$(BLUE)Formatting Terraform files...$(NC)"
	cd infra && terraform fmt -recursive
	@echo "$(GREEN)Formatting complete!$(NC)"

validate: init
	@echo "$(BLUE)Validating Terraform configuration...$(NC)"
	cd infra && terraform validate
	@echo "$(GREEN)Validation complete!$(NC)"

# Deployment targets
deploy: build
	@echo "$(BLUE)Deploying website...$(NC)"
	@if [ -z "$$S3_BUCKET_NAME" ]; then \
		echo "$(RED)Error: S3_BUCKET_NAME environment variable not set$(NC)"; \
		exit 1; \
	fi
	@if [ -z "$$CLOUDFRONT_DISTRIBUTION_ID" ]; then \
		echo "$(RED)Error: CLOUDFRONT_DISTRIBUTION_ID environment variable not set$(NC)"; \
		exit 1; \
	fi
	make sync-s3
	make invalidate-cf
	@echo "$(GREEN)Deployment complete!$(NC)"

sync-s3:
	@echo "$(BLUE)Syncing website to S3...$(NC)"
	aws s3 sync dist/public s3://$(S3_BUCKET_NAME)/ \
		--delete \
		--cache-control "public, max-age=3600" \
		--exclude ".git*" \
		--exclude "*.map"
	@echo "$(GREEN)S3 sync complete!$(NC)"

invalidate-cf:
	@echo "$(BLUE)Invalidating CloudFront cache...$(NC)"
	aws cloudfront create-invalidation \
		--distribution-id $(CLOUDFRONT_DISTRIBUTION_ID) \
		--paths "/*"
	@echo "$(GREEN)CloudFront invalidation requested!$(NC)"

# Utility targets
clean:
	@echo "$(BLUE)Cleaning build artifacts...$(NC)"
	rm -rf dist/
	rm -rf node_modules/
	rm -rf .turbo/
	rm -rf infra/.terraform/
	rm -rf infra/tfplan
	@echo "$(GREEN)Clean complete!$(NC)"

lint:
	@echo "$(BLUE)Running linting checks...$(NC)"
	pnpm run check
	cd infra && terraform fmt -check -recursive
	@echo "$(GREEN)Linting complete!$(NC)"

security-scan:
	@echo "$(BLUE)Running security scanning...$(NC)"
	@if command -v trivy &> /dev/null; then \
		trivy fs .; \
	else \
		echo "$(RED)Trivy not installed. Install from: https://github.com/aquasecurity/trivy$(NC)"; \
	fi
	@if command -v tfsec &> /dev/null; then \
		tfsec infra/; \
	else \
		echo "$(RED)tfsec not installed. Install from: https://github.com/aquasecurity/tfsec$(NC)"; \
	fi

cost-estimate:
	@echo "$(BLUE)Estimating AWS costs...$(NC)"
	@echo "Opening AWS Pricing Calculator..."
	@echo "S3: https://calculator.aws/#/addService/S3"
	@echo "CloudFront: https://calculator.aws/#/addService/CloudFront"
	@echo "WAF: https://calculator.aws/#/addService/WAF"
	@echo "Route53: https://calculator.aws/#/addService/Route53"

# Development utilities
install:
	@echo "$(BLUE)Installing dependencies...$(NC)"
	pnpm install

update:
	@echo "$(BLUE)Updating dependencies...$(NC)"
	pnpm update

check-versions:
	@echo "$(BLUE)Checking tool versions...$(NC)"
	@echo "Node: $$(node --version)"
	@echo "pnpm: $$(pnpm --version)"
	@echo "Terraform: $$(cd infra && terraform version | head -1)"
	@echo "AWS CLI: $$(aws --version)"
