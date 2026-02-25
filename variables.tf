/**
 * Terraform Variables for AfricanKingsEshop AWS Infrastructure
 */

variable "aws_region" {
  description = "AWS region for deployment"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "prod"
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "s3_bucket_name" {
  description = "Name of the S3 bucket for website content"
  type        = string
  validation {
    condition     = can(regex("^[a-z0-9][a-z0-9-]*[a-z0-9]$", var.s3_bucket_name))
    error_message = "S3 bucket name must be lowercase alphanumeric with hyphens."
  }
}

variable "domain_name" {
  description = "Primary domain name for the website"
  type        = string
  example     = "africankingseshop.com"
}

variable "additional_domains" {
  description = "Additional domain names (SANs) for the SSL certificate"
  type        = list(string)
  default     = []
  example     = ["www.africankingseshop.com"]
}

variable "route53_zone_name" {
  description = "Route 53 hosted zone name"
  type        = string
  example     = "africankingseshop.com"
}

variable "s3_noncurrent_version_expiration_days" {
  description = "Number of days before deleting noncurrent object versions"
  type        = number
  default     = 90
}

variable "waf_rate_limit" {
  description = "WAF rate limit (requests per 5 minutes)"
  type        = number
  default     = 2000
}

variable "cloudwatch_log_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 30
}

variable "github_repo" {
  description = "GitHub repository for OIDC (format: owner/repo)"
  type        = string
  example     = "yourusername/AfricanKingsEshop"
}

variable "enable_guardduty" {
  description = "Enable GuardDuty for threat detection"
  type        = bool
  default     = true
}

variable "enable_cloudtrail" {
  description = "Enable CloudTrail for audit logging"
  type        = bool
  default     = true
}

variable "cache_ttl_static" {
  description = "Cache TTL for static assets in seconds"
  type        = number
  default     = 31536000  # 1 year
}

variable "cache_ttl_default" {
  description = "Default cache TTL in seconds"
  type        = number
  default     = 3600  # 1 hour
}

variable "tags" {
  description = "Additional tags to apply to all resources"
  type        = map(string)
  default = {
    Project = "AfricanKingsEshop"
    Team    = "Engineering"
  }
}
