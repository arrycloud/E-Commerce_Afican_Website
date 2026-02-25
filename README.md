# AfricanKingsEshop - Enterprise African Men's Fashion E-Commerce

[![Build Status](https://github.com/yourusername/AfricanKingsEshop/workflows/Deploy%20to%20AWS/badge.svg)](https://github.com/yourusername/AfricanKingsEshop/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Terraform](https://img.shields.io/badge/Terraform-1.6.0-blue.svg)](https://www.terraform.io/)
[![AWS](https://img.shields.io/badge/AWS-Production-orange.svg)](https://aws.amazon.com/)

A premium, enterprise-grade static e-commerce platform celebrating African men's fashion. Built with modern web technologies and deployed on AWS with infrastructure-as-code principles.

## 🎯 Overview

AfricanKingsEshop is a fully functional e-commerce website specializing in authentic African men's fashion including Agbada, Dashiki, Buba, and Senator wear. The platform features:

- **Modern UI/UX**: Bold African Heritage Maximalism design with deep navy and gold accents
- **Product Catalog**: 20+ curated products with filtering and search
- **Shopping Cart**: Persistent localStorage-based cart functionality
- **Checkout Simulation**: Form validation and order simulation
- **Customer Testimonials**: Social proof with star ratings
- **Newsletter Signup**: Email subscription functionality
- **SEO Optimized**: Meta tags, schema markup, and structured data
- **Enterprise AWS Infrastructure**: Production-ready deployment with security and monitoring

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Internet Users                           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   Route 53      │
                    │   (DNS)         │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  CloudFront     │
                    │  (CDN + Cache)  │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   WAF           │
                    │   (Security)    │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  S3 Bucket      │
                    │  (Static Files) │
                    └─────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                    Monitoring & Logging                          │
├──────────────────────────────────────────────────────────────────┤
│ CloudWatch (Metrics, Logs, Alarms) │ CloudTrail (Audit Logs)    │
│ GuardDuty (Threat Detection)       │ X-Ray (Tracing)            │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                      CI/CD Pipeline                              │
├──────────────────────────────────────────────────────────────────┤
│ GitHub Actions → Build → Security Scan → Deploy → Invalidate CF │
└──────────────────────────────────────────────────────────────────┘
```

## 📋 Features

### Frontend
- **React 19** with TypeScript for type safety
- **Tailwind CSS 4** for responsive design
- **shadcn/ui** components for consistent UI
- **Wouter** for client-side routing
- **Framer Motion** for smooth animations
- **Responsive Design**: Mobile-first approach with breakpoints for all devices
- **Accessibility**: WCAG 2.1 AA compliant

### E-Commerce Features
- **Product Catalog**: Browse 20+ products with detailed descriptions
- **Filtering**: Filter by category, price, size, and color
- **Shopping Cart**: Add/remove items with persistent storage
- **Wishlist**: Save favorite items
- **Product Search**: Find items quickly
- **Reviews & Ratings**: Customer testimonials and star ratings
- **Checkout Simulation**: Complete order form with validation

### AWS Infrastructure
- **S3**: Versioned, encrypted static asset storage
- **CloudFront**: Global CDN with edge caching
- **WAF**: DDoS protection and SQL injection prevention
- **Route 53**: DNS management with health checks
- **CloudWatch**: Comprehensive monitoring and alerting
- **CloudTrail**: Audit logging for compliance
- **GuardDuty**: Threat detection and response
- **IAM**: Least privilege access control

### Security
- HTTPS/TLS 1.2+ enforcement
- KMS encryption for S3 buckets
- WAF rules for common attacks
- CloudTrail audit logging
- GuardDuty threat detection
- GitHub Actions OIDC authentication
- Least privilege IAM policies

### CI/CD
- **GitHub Actions** workflow for automated deployment
- **Terraform** for infrastructure management
- **Security scanning** with Trivy
- **Linting and validation** checks
- **Automated invalidation** of CloudFront cache
- **Slack notifications** for deployment status

## 🚀 Quick Start

### Prerequisites
- Node.js 22+
- pnpm 10+
- Terraform 1.6+
- AWS CLI v2
- Git

### Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/AfricanKingsEshop.git
cd AfricanKingsEshop

# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Open http://localhost:3000 in your browser
```

### Building for Production

```bash
# Build the website
pnpm run build

# Preview production build
pnpm run preview

# Check TypeScript
pnpm run check
```

## 🌐 AWS Deployment

### Prerequisites
1. AWS Account with appropriate permissions
2. GitHub repository with secrets configured
3. Domain name (optional, can use CloudFront domain)

### Setup Steps

#### 1. Prepare Configuration

```bash
# Copy example configuration
cp infra/terraform.tfvars.example infra/terraform.tfvars

# Edit with your values
nano infra/terraform.tfvars
```

#### 2. Configure GitHub Secrets

Add the following secrets to your GitHub repository:

```
AWS_ROLE_ARN              - ARN of the IAM role for GitHub Actions
S3_BUCKET_NAME            - Name of S3 bucket for website content
CLOUDFRONT_DISTRIBUTION_ID - CloudFront distribution ID
DOMAIN_NAME               - Your domain name
ROUTE53_ZONE_NAME         - Route 53 hosted zone name
TF_STATE_BUCKET           - S3 bucket for Terraform state
SLACK_WEBHOOK_URL         - (Optional) Slack webhook for notifications
```

#### 3. Initialize Infrastructure

```bash
# Initialize Terraform
make init

# Review planned changes
make plan

# Apply infrastructure
make apply
```

#### 4. Deploy Website

```bash
# Build and deploy
make deploy

# Or manually sync to S3 and invalidate CloudFront
make sync-s3
make invalidate-cf
```

## 📁 Project Structure

```
AfricanKingsEshop/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── pages/            # Page components
│   │   ├── components/       # Reusable UI components
│   │   ├── data/             # Product data and constants
│   │   ├── contexts/         # React contexts
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utility functions
│   │   ├── App.tsx           # Main app component
│   │   ├── main.tsx          # Entry point
│   │   └── index.css         # Global styles and theme
│   ├── public/               # Static assets
│   └── index.html            # HTML template
├── infra/                     # Terraform infrastructure code
│   ├── main.tf               # Main infrastructure configuration
│   ├── variables.tf          # Variable definitions
│   ├── terraform.tfvars.example
│   └── outputs.tf            # Output definitions
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions CI/CD
├── docs/                      # Documentation
│   ├── DEPLOYMENT_GUIDE.md   # Step-by-step deployment
│   ├── ARCHITECTURE.md       # Architecture details
│   └── TROUBLESHOOTING.md    # Common issues and solutions
├── Makefile                   # Build and deployment commands
├── package.json              # Node.js dependencies
└── README.md                 # This file
```

## 📊 Product Catalog

The store features 20+ products across 4 categories:

### Traditional Formal Wear
- Classic Black Agbada with Gold Embroidery ($280)
- White Agbada with Silver Embroidery ($290)
- Traditional Buba with Embroidered Sokoto ($250)
- Ceremonial Agbada Deluxe ($380)

### Modern Fusion
- Vibrant Blue Dashiki with Geometric Patterns ($85)
- Gold Ankara Print Dashiki ($75)
- Kente Pattern Dashiki ($80)
- Elegant Emerald Kaftan ($150)
- Royal Blue Embroidered Kaftan ($170)
- Contemporary Ankara Shirt ($65)
- Modern Dashiki Pants ($55)

### Senator Wear
- Premium Navy Senator Wear Set ($220)
- Burgundy Senator Wear with Gold Embroidery ($240)
- Black Senator Wear Premium ($210)
- Gold Senator Wear Deluxe ($260)

### Accessories
- Traditional Embroidered Cap ($35)
- Beaded Leather Belt ($45)
- Traditional Ankara Pocket Square ($20)

## 🎨 Design System

### Color Palette
- **Primary**: Deep Navy (`oklch(0.35 0.15 265)`)
- **Accent**: Gold (`oklch(0.65 0.18 50)`)
- **Secondary**: Burgundy (`oklch(0.4 0.14 10)`)
- **Tertiary**: Emerald (`oklch(0.45 0.12 145)`)

### Typography
- **Display Font**: Playfair Display (serif, bold headings)
- **Body Font**: Poppins (sans-serif, readable body text)
- **Hierarchy**: Bold display font for headings, regular Poppins for body

### Components
- Button variants: default, outline, ghost
- Card components with hover effects
- Product cards with image overlays
- Modal dialogs for product details
- Form inputs with validation

## 📈 Performance

### Optimization Strategies
- **Image Optimization**: WebP format with fallbacks
- **Code Splitting**: React lazy loading for routes
- **Caching**: CloudFront edge caching with 1-year TTL for static assets
- **Compression**: gzip and brotli compression enabled
- **Minification**: Production builds with minified CSS/JS
- **CDN**: Global distribution via CloudFront

### Metrics
- Lighthouse Score: 90+
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

## 🔒 Security

### Implemented Measures
- **HTTPS/TLS**: All traffic encrypted with TLS 1.2+
- **WAF**: AWS WAF with managed rules for common attacks
- **DDoS Protection**: CloudFront and WAF DDoS mitigation
- **Encryption**: KMS encryption for S3 buckets
- **Access Control**: Least privilege IAM policies
- **Audit Logging**: CloudTrail for all API calls
- **Threat Detection**: GuardDuty for anomaly detection
- **CSP Headers**: Content Security Policy headers

### Compliance
- GDPR-ready data handling
- HIPAA-compatible configuration options
- PCI DSS considerations for future payment integration
- SOC 2 audit logging

## 📊 Monitoring & Alerts

### CloudWatch Dashboards
- Request metrics (count, latency, errors)
- Cache hit ratio
- Error rate tracking (4xx, 5xx)
- S3 bucket size and object count

### Alarms
- 4xx error rate > 5%
- 5xx error rate > 1%
- CloudFront latency > 1000ms
- S3 bucket size exceeds threshold

## 💰 Cost Estimation

### Monthly Costs (Estimated)
- **S3 Storage**: $0.50-2.00 (depending on storage size)
- **CloudFront**: $10-50 (depending on traffic)
- **WAF**: $5.00 (fixed monthly)
- **Route 53**: $0.50 (per hosted zone)
- **CloudWatch**: $0.50-5.00 (depending on metrics)
- **Total**: ~$16-62/month for typical traffic

### Cost Optimization
- Use S3 lifecycle policies to transition old versions to Glacier
- Enable CloudFront caching to reduce origin requests
- Monitor CloudWatch metrics to optimize WAF rules

[AWS Pricing Calculator](https://calculator.aws/)

## 🔄 CI/CD Pipeline

### Workflow Stages

1. **Build**: Compile TypeScript, bundle with Vite
2. **Security Scan**: Trivy vulnerability scanning
3. **Terraform Plan**: Review infrastructure changes
4. **Deploy**: Sync to S3, invalidate CloudFront
5. **Terraform Apply**: Update infrastructure if needed

### Triggering Deployments

```bash
# Automatic deployment on push to main
git push origin main

# Manual deployment
make deploy

# With environment variables
S3_BUCKET_NAME=my-bucket CLOUDFRONT_DISTRIBUTION_ID=E123ABC make deploy
```

## 📚 Documentation

- [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) - Step-by-step AWS console walkthrough
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) - Detailed architecture documentation
- [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) - Common issues and solutions
- [PRODUCTION_CHECKLIST.md](docs/PRODUCTION_CHECKLIST.md) - Pre-launch checklist

## 🛠️ Useful Commands

```bash
# Website development
make build              # Build production bundle
make dev               # Start development server
make preview           # Preview production build

# Infrastructure management
make init              # Initialize Terraform
make plan              # Plan infrastructure changes
make apply             # Apply infrastructure changes
make destroy           # Destroy infrastructure (CAUTION)
make fmt               # Format Terraform files
make validate          # Validate Terraform configuration

# Deployment
make deploy            # Build and deploy website
make sync-s3           # Sync to S3
make invalidate-cf     # Invalidate CloudFront cache

# Utilities
make lint              # Run linting checks
make security-scan     # Run security scanning
make cost-estimate     # Estimate AWS costs
make clean             # Clean build artifacts
```

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- African fashion heritage and cultural pride
- React and Tailwind CSS communities
- AWS and Terraform communities
- All contributors and supporters

## 📧 Contact & Support

- **Email**: support@africankingseshop.com
- **GitHub Issues**: [Report a bug](https://github.com/yourusername/AfricanKingsEshop/issues)
- **Discussions**: [Ask a question](https://github.com/yourusername/AfricanKingsEshop/discussions)

## 🗺️ Roadmap

- [ ] Payment integration (Stripe)
- [ ] User accounts and order history
- [ ] Admin dashboard for product management
- [ ] Email notifications for orders
- [ ] Multi-currency support
- [ ] Mobile app (React Native)
- [ ] AI-powered product recommendations
- [ ] Live chat support
- [ ] Inventory management system
- [ ] Analytics dashboard

---

**Built with ❤️ celebrating African heritage and craftsmanship**
# E-Commerce_Afican_Website
