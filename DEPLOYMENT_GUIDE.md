# AfricanKingsEshop - Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying AfricanKingsEshop to AWS. The deployment includes setting up infrastructure with Terraform, configuring CI/CD with GitHub Actions, and deploying the website.

## Prerequisites

Before starting, ensure you have:

1. **AWS Account** with administrative access
2. **GitHub Account** with repository access
3. **Domain Name** (optional, can use CloudFront domain initially)
4. **Local Tools**:
   - AWS CLI v2
   - Terraform 1.6+
   - Node.js 22+
   - pnpm 10+
   - Git

## Step 1: Prepare Your Environment

### 1.1 Clone the Repository

```bash
git clone https://github.com/yourusername/AfricanKingsEshop.git
cd AfricanKingsEshop
```

### 1.2 Install Dependencies

```bash
# Install Node.js dependencies
pnpm install

# Verify installations
node --version    # Should be 22+
pnpm --version    # Should be 10+
terraform version # Should be 1.6+
aws --version     # Should be 2.x
```

### 1.3 Configure AWS CLI

```bash
# Configure AWS credentials
aws configure

# Verify configuration
aws sts get-caller-identity
```

## Step 2: Create S3 Bucket for Terraform State

Terraform needs a backend to store its state. Create an S3 bucket for this:

```bash
# Set variables
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
STATE_BUCKET="africankings-terraform-state-${ACCOUNT_ID}"
REGION="us-east-1"

# Create S3 bucket
aws s3 mb s3://${STATE_BUCKET} --region ${REGION}

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket ${STATE_BUCKET} \
  --versioning-configuration Status=Enabled

# Enable encryption
aws s3api put-bucket-encryption \
  --bucket ${STATE_BUCKET} \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'

# Block public access
aws s3api put-public-access-block \
  --bucket ${STATE_BUCKET} \
  --public-access-block-configuration \
  "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

# Create DynamoDB table for state locking
aws dynamodb create-table \
  --table-name terraform-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --region ${REGION}

echo "State bucket: ${STATE_BUCKET}"
echo "Save this for later use in terraform.tfvars"
```

## Step 3: Configure Terraform

### 3.1 Create terraform.tfvars

```bash
# Copy example configuration
cp infra/terraform.tfvars.example infra/terraform.tfvars

# Edit with your values
nano infra/terraform.tfvars
```

Fill in the following values:

```hcl
aws_region           = "us-east-1"
environment          = "prod"
s3_bucket_name       = "africankingseshop-prod-12345"  # Must be globally unique
domain_name          = "africankingseshop.com"
route53_zone_name    = "africankingseshop.com"
additional_domains   = ["www.africankingseshop.com"]
github_repo          = "yourusername/AfricanKingsEshop"
waf_rate_limit       = 2000
cloudwatch_log_retention_days = 30
```

### 3.2 Initialize Terraform

```bash
cd infra

# Initialize Terraform with your state bucket
terraform init \
  -backend-config="bucket=${STATE_BUCKET}" \
  -backend-config="key=africankings/terraform.tfstate" \
  -backend-config="region=us-east-1" \
  -backend-config="encrypt=true" \
  -backend-config="dynamodb_table=terraform-locks"

# Verify initialization
terraform validate
terraform fmt -check -recursive
```

## Step 4: Set Up GitHub OIDC for AWS

This allows GitHub Actions to authenticate with AWS without storing credentials.

### 4.1 Create OIDC Provider

```bash
# Create OIDC provider in AWS
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1

# Get your AWS account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "Account ID: ${ACCOUNT_ID}"
```

### 4.2 Create IAM Role for GitHub Actions

The Terraform configuration includes this role, but you need to note the ARN:

```bash
# After applying Terraform, get the role ARN
cd infra
terraform output github_actions_role_arn
```

## Step 5: Plan and Apply Infrastructure

### 5.1 Review the Plan

```bash
cd infra

# Create a plan
terraform plan -out=tfplan

# Review the output carefully
# This shows all resources that will be created
```

### 5.2 Apply Infrastructure

```bash
# Apply the plan
terraform apply tfplan

# Save the outputs
terraform output -json > outputs.json

# Note the following outputs:
# - cloudfront_distribution_id
# - s3_bucket_name
# - website_url
```

## Step 6: Configure GitHub Secrets

Add the following secrets to your GitHub repository:

### 6.1 Navigate to Repository Settings

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

### 6.2 Add Secrets

Create the following secrets:

| Secret Name | Value | Source |
|-------------|-------|--------|
| AWS_ROLE_ARN | ARN of GitHub Actions role | Terraform output: `github_actions_role_arn` |
| S3_BUCKET_NAME | Name of S3 bucket | Terraform output: `s3_bucket_name` |
| CLOUDFRONT_DISTRIBUTION_ID | CloudFront distribution ID | Terraform output: `cloudfront_distribution_id` |
| DOMAIN_NAME | Your domain name | From terraform.tfvars |
| ROUTE53_ZONE_NAME | Route 53 zone name | From terraform.tfvars |
| TF_STATE_BUCKET | Terraform state bucket | Created in Step 2 |

Optional secrets:

| Secret Name | Value |
|-------------|-------|
| SLACK_WEBHOOK_URL | Slack webhook for notifications |

## Step 7: Build and Deploy Website

### 7.1 Build Locally

```bash
# Build the website
pnpm run build

# Verify build output
ls -la dist/public/
```

### 7.2 Deploy to AWS

```bash
# Option 1: Using Makefile
make deploy

# Option 2: Manual deployment
aws s3 sync dist/public s3://$(terraform output -raw s3_bucket_name)/ \
  --delete \
  --cache-control "public, max-age=3600"

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id $(terraform output -raw cloudfront_distribution_id) \
  --paths "/*"
```

### 7.3 Verify Deployment

```bash
# Get the CloudFront domain
CLOUDFRONT_DOMAIN=$(terraform output -raw cloudfront_domain_name)

# Test the website
curl -I https://${CLOUDFRONT_DOMAIN}/

# Open in browser
echo "https://${CLOUDFRONT_DOMAIN}/"
```

## Step 8: Configure Custom Domain (Optional)

If you have a custom domain registered with Route 53:

### 8.1 Verify Domain in Route 53

```bash
# Check if hosted zone exists
aws route53 list-hosted-zones-by-name \
  --dns-name africankingseshop.com

# If not, create it:
aws route53 create-hosted-zone \
  --name africankingseshop.com \
  --caller-reference $(date +%s)
```

### 8.2 Update Domain Registrar

If your domain is registered elsewhere, update the nameservers:

```bash
# Get the nameservers from Route 53
aws route53 get-hosted-zone \
  --id <HOSTED_ZONE_ID> \
  --query 'DelegationSet.NameServers' \
  --output text
```

Update these nameservers in your domain registrar's control panel.

### 8.3 Verify DNS

```bash
# Wait a few minutes for DNS propagation
nslookup africankingseshop.com

# Test HTTPS
curl -I https://africankingseshop.com/
```

## Step 9: Configure CI/CD Pipeline

### 9.1 Push Code to GitHub

```bash
# Create initial commit
git add .
git commit -m "Initial commit: AfricanKingsEshop"

# Push to main branch
git push origin main
```

### 9.2 Monitor GitHub Actions

1. Go to your GitHub repository
2. Click **Actions**
3. Watch the deployment workflow execute
4. Check logs if any step fails

### 9.3 Verify Automated Deployment

After pushing to main, the workflow should:

1. Build the website
2. Run security scans
3. Plan Terraform changes
4. Deploy to S3
5. Invalidate CloudFront cache
6. Apply Terraform changes

## Step 10: Post-Deployment Verification

### 10.1 Test Website Functionality

```bash
# Test main page loads
curl -s https://africankingseshop.com/ | head -20

# Test product page
curl -s https://africankingseshop.com/ | grep -i "product"

# Check SSL certificate
openssl s_client -connect africankingseshop.com:443 -servername africankingseshop.com
```

### 10.2 Verify Monitoring

```bash
# Check CloudWatch dashboard
aws cloudwatch get-dashboard \
  --dashboard-name africankings-dashboard

# Check CloudWatch alarms
aws cloudwatch describe-alarms \
  --alarm-names africankings-cloudfront-4xx-errors
```

### 10.3 Test CI/CD Pipeline

```bash
# Make a small change
echo "# Test change" >> README.md

# Commit and push
git add README.md
git commit -m "Test CI/CD pipeline"
git push origin main

# Monitor the workflow in GitHub Actions
```

## Troubleshooting

### Issue: Terraform State Lock

If you get a state lock error:

```bash
# Force unlock (use with caution)
terraform force-unlock <LOCK_ID>
```

### Issue: CloudFront Distribution Not Working

```bash
# Check distribution status
aws cloudfront get-distribution \
  --id <DISTRIBUTION_ID> \
  --query 'Distribution.DistributionConfig'

# Check origin configuration
aws cloudfront get-distribution \
  --id <DISTRIBUTION_ID> \
  --query 'Distribution.DistributionConfig.Origins'
```

### Issue: S3 Bucket Access Denied

```bash
# Verify bucket policy
aws s3api get-bucket-policy \
  --bucket <BUCKET_NAME>

# Verify CloudFront OAC
aws cloudfront get-origin-access-control \
  --id <OAC_ID>
```

### Issue: DNS Not Resolving

```bash
# Check Route 53 records
aws route53 list-resource-record-sets \
  --hosted-zone-id <ZONE_ID>

# Verify nameserver propagation
dig africankingseshop.com NS
```

## Maintenance

### Regular Tasks

**Daily**: Monitor CloudWatch dashboards and alarms

**Weekly**: Review error logs and performance metrics

**Monthly**: 
- Update dependencies: `pnpm update`
- Review AWS costs
- Backup Terraform state
- Security audit

### Updating the Website

```bash
# Make changes to the website
# ...

# Build and test locally
pnpm run build
pnpm run preview

# Commit and push
git add .
git commit -m "Update website"
git push origin main

# GitHub Actions will automatically deploy
```

### Updating Infrastructure

```bash
# Update Terraform configuration
# ...

# Plan changes
cd infra
terraform plan

# Review and apply
terraform apply

# Commit changes
git add infra/
git commit -m "Update infrastructure"
git push origin main
```

## Disaster Recovery

### Backup Procedures

```bash
# Backup S3 bucket
aws s3 sync s3://<BUCKET_NAME>/ ./backup-s3/ --delete

# Backup Terraform state
aws s3 cp s3://<STATE_BUCKET>/africankings/terraform.tfstate ./backup-terraform.tfstate

# Backup database (if applicable)
aws rds create-db-snapshot \
  --db-instance-identifier <INSTANCE_ID> \
  --db-snapshot-identifier backup-$(date +%Y%m%d)
```

### Restore Procedures

```bash
# Restore from S3 backup
aws s3 sync ./backup-s3/ s3://<BUCKET_NAME>/ --delete

# Invalidate CloudFront
aws cloudfront create-invalidation \
  --distribution-id <DISTRIBUTION_ID> \
  --paths "/*"

# Restore Terraform state (if needed)
aws s3 cp ./backup-terraform.tfstate s3://<STATE_BUCKET>/africankings/terraform.tfstate
```

## Cost Optimization

### Recommendations

1. **S3 Lifecycle Policies**: Automatically transition old versions to Glacier
2. **CloudFront Caching**: Increase TTL for static assets
3. **Reserved Capacity**: Consider Reserved Instances for predictable workloads
4. **CloudWatch Logs**: Set appropriate retention periods
5. **WAF Rules**: Monitor and optimize rule effectiveness

### Cost Monitoring

```bash
# Get current month's costs
aws ce get-cost-and-usage \
  --time-period Start=2026-02-01,End=2026-02-28 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --group-by Type=DIMENSION,Key=SERVICE
```

## Support & Escalation

For issues or questions:

1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Review AWS CloudWatch logs
3. Check GitHub Actions logs
4. Contact AWS Support (if applicable)
5. Open a GitHub issue

## Next Steps

After successful deployment:

1. [ ] Set up monitoring and alerting
2. [ ] Configure backup and disaster recovery
3. [ ] Set up CI/CD notifications (Slack, etc.)
4. [ ] Document runbooks for common tasks
5. [ ] Train team on deployment procedures
6. [ ] Schedule regular security audits
7. [ ] Plan for future scaling and optimization
