/**
 * Terraform Outputs for AfricanKingsEshop Infrastructure
 */

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.website.domain_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID for invalidations and updates"
  value       = aws_cloudfront_distribution.website.id
  sensitive   = false
}

output "s3_bucket_name" {
  description = "S3 bucket name for website content"
  value       = aws_s3_bucket.website.id
}

output "s3_bucket_arn" {
  description = "S3 bucket ARN"
  value       = aws_s3_bucket.website.arn
}

output "website_url" {
  description = "Website URL"
  value       = "https://${var.domain_name}"
}

output "github_actions_role_arn" {
  description = "ARN of GitHub Actions IAM role for OIDC authentication"
  value       = aws_iam_role.github_actions.arn
  sensitive   = false
}

output "route53_zone_id" {
  description = "Route 53 hosted zone ID"
  value       = data.aws_route53_zone.main.zone_id
}

output "waf_web_acl_arn" {
  description = "WAF Web ACL ARN"
  value       = aws_wafv2_web_acl.cloudfront.arn
}

output "cloudwatch_dashboard_url" {
  description = "CloudWatch dashboard URL"
  value       = "https://console.aws.amazon.com/cloudwatch/home?region=${var.aws_region}#dashboards:name=africankings-dashboard"
}

output "cloudtrail_log_group" {
  description = "CloudTrail log group name"
  value       = aws_cloudtrail.website.cloud_watch_logs_group_arn
}

output "guardduty_detector_id" {
  description = "GuardDuty detector ID"
  value       = aws_guardduty_detector.website.id
}

output "kms_key_id" {
  description = "KMS key ID for S3 encryption"
  value       = aws_kms_key.s3.key_id
}

output "kms_key_arn" {
  description = "KMS key ARN for S3 encryption"
  value       = aws_kms_key.s3.arn
}

output "acm_certificate_arn" {
  description = "ACM certificate ARN"
  value       = aws_acm_certificate.website.arn
}

output "deployment_summary" {
  description = "Summary of deployment information"
  value = {
    website_url                  = "https://${var.domain_name}"
    cloudfront_domain            = aws_cloudfront_distribution.website.domain_name
    s3_bucket                    = aws_s3_bucket.website.id
    region                       = var.aws_region
    environment                  = var.environment
    github_actions_role_arn      = aws_iam_role.github_actions.arn
    cloudwatch_dashboard         = "https://console.aws.amazon.com/cloudwatch/home?region=${var.aws_region}#dashboards:name=africankings-dashboard"
    waf_enabled                  = true
    cloudtrail_enabled           = true
    guardduty_enabled            = true
    kms_encryption_enabled       = true
  }
}
