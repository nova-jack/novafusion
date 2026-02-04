#!/bin/bash

# NovaFusion Deployment Script
# Automate deployment process with safety checks

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# Deployment configuration
DEPLOY_ENV="production"
DEPLOY_METHOD="manual"
SKIP_BACKUP=false
SKIP_TESTS=false
AUTO_APPROVE=false

print_header() {
    echo ""
    echo -e "${CYAN}╔════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║   NovaFusion Deployment Script v1.0    ║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════╝${NC}"
    echo ""
}

print_step() {
    echo -e "${BLUE}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${MAGENTA}ℹ️  $1${NC}"
}

show_help() {
    cat << EOF
Usage: ./deploy.sh [OPTIONS]

Deployment environments:
  --production      Deploy to production (default)
  --staging         Deploy to staging
  --preview         Deploy preview build

Deployment methods:
  --manual          Manual deployment (default)
  --pm2             Deploy with PM2
  --docker          Deploy with Docker
  --vercel          Deploy to Vercel
  --netlify         Deploy to Netlify

Options:
  --skip-backup     Skip database backup
  --skip-tests      Skip running tests
  --auto-approve    Skip confirmation prompts
  -h, --help        Show this help message

Examples:
  ./deploy.sh                         # Manual production deployment
  ./deploy.sh --staging --pm2         # Deploy to staging with PM2
  ./deploy.sh --production --docker   # Docker production deployment
  ./deploy.sh --vercel --auto-approve # Quick Vercel deployment

EOF
}

parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --production)
                DEPLOY_ENV="production"
                shift
                ;;
            --staging)
                DEPLOY_ENV="staging"
                shift
                ;;
            --preview)
                DEPLOY_ENV="preview"
                shift
                ;;
            --manual)
                DEPLOY_METHOD="manual"
                shift
                ;;
            --pm2)
                DEPLOY_METHOD="pm2"
                shift
                ;;
            --docker)
                DEPLOY_METHOD="docker"
                shift
                ;;
            --vercel)
                DEPLOY_METHOD="vercel"
                shift
                ;;
            --netlify)
                DEPLOY_METHOD="netlify"
                shift
                ;;
            --skip-backup)
                SKIP_BACKUP=true
                shift
                ;;
            --skip-tests)
                SKIP_TESTS=true
                shift
                ;;
            --auto-approve)
                AUTO_APPROVE=true
                shift
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
}

confirm_deployment() {
    if [ "$AUTO_APPROVE" = true ]; then
        return 0
    fi
    
    echo ""
    print_warning "⚠️  DEPLOYMENT CONFIRMATION ⚠️"
    echo ""
    echo "You are about to deploy to: $DEPLOY_ENV"
    echo "Deployment method: $DEPLOY_METHOD"
    echo ""
    read -p "Continue with deployment? (yes/no): " -r
    echo ""
    
    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        print_info "Deployment cancelled"
        exit 0
    fi
}

pre_deployment_checks() {
    print_step "Running pre-deployment checks..."
    
    # Check git status
    if [ -d ".git" ]; then
        if ! git diff-index --quiet HEAD --; then
            print_error "Uncommitted changes detected"
            echo ""
            git status --short
            echo ""
            read -p "Continue anyway? (y/N): " -n 1 -r
            echo ""
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                exit 1
            fi
        else
            print_success "Git working directory clean"
        fi
        
        # Check current branch
        CURRENT_BRANCH=$(git branch --show-current)
        print_info "Current branch: $CURRENT_BRANCH"
        
        if [ "$DEPLOY_ENV" = "production" ] && [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
            print_warning "Not on main/master branch for production deployment"
        fi
    fi
    
    # Check environment file
    ENV_FILE=".env.$DEPLOY_ENV"
    if [ "$DEPLOY_ENV" = "production" ] && [ ! -f ".env.production" ]; then
        ENV_FILE=".env"
    fi
    
    if [ ! -f "$ENV_FILE" ]; then
        print_error "Environment file not found: $ENV_FILE"
        exit 1
    else
        print_success "Environment file found: $ENV_FILE"
    fi
    
    # Check Node.js version
    NODE_VERSION=$(node --version)
    print_info "Node.js version: $NODE_VERSION"
    
    print_success "Pre-deployment checks passed"
}

backup_database() {
    if [ "$SKIP_BACKUP" = true ]; then
        print_warning "Skipping database backup"
        return 0
    fi
    
    print_step "Creating database backup..."
    
    BACKUP_DIR="backups"
    mkdir -p "$BACKUP_DIR"
    
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="$BACKUP_DIR/backup_${DEPLOY_ENV}_${TIMESTAMP}.sql"
    
    print_warning "Database backup feature needs to be configured for your database"
    print_info "Backup would be saved to: $BACKUP_FILE"
    
    # TODO: Implement actual database backup based on your database type
    # Example for PostgreSQL:
    # pg_dump $DATABASE_URL > "$BACKUP_FILE"
    
    print_info "Configure database backup in deploy.sh for your database"
}

run_build() {
    print_step "Building application..."
    
    if [ -f "./scripts/build.sh" ]; then
        ./scripts/build.sh --$DEPLOY_ENV
    else
        npm run build
    fi
    
    print_success "Build completed"
}

deploy_manual() {
    print_step "Manual deployment instructions:"
    echo ""
    echo "1. Copy build files to server:"
    echo "   rsync -avz --exclude 'node_modules' ./ user@server:/path/to/app/"
    echo ""
    echo "2. On server, install dependencies:"
    echo "   npm ci --production"
    echo ""
    echo "3. Generate Prisma Client:"
    echo "   npx prisma generate"
    echo ""
    echo "4. Run database migrations:"
    echo "   npx prisma migrate deploy"
    echo ""
    echo "5. Restart application:"
    echo "   pm2 restart novafusion"
    echo "   # or"
    echo "   systemctl restart novafusion"
    echo ""
}

deploy_pm2() {
    print_step "Deploying with PM2..."
    
    if ! command -v pm2 &> /dev/null; then
        print_error "PM2 not found. Install with: npm install -g pm2"
        exit 1
    fi
    
    # Run migrations
    print_step "Running database migrations..."
    npx prisma migrate deploy
    
    # Check if app is already running
    if pm2 list | grep -q "novafusion"; then
        print_step "Restarting application..."
        pm2 restart novafusion
    else
        print_step "Starting application..."
        pm2 start npm --name "novafusion" -- start
    fi
    
    # Save PM2 configuration
    pm2 save
    
    print_success "Deployed with PM2"
}

deploy_docker() {
    print_step "Deploying with Docker..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker not found"
        exit 1
    fi
    
    # Build Docker image
    print_step "Building Docker image..."
    docker build -t novafusion:$DEPLOY_ENV .
    
    # Stop and remove old container
    print_step "Stopping old container..."
    docker stop novafusion || true
    docker rm novafusion || true
    
    # Run new container
    print_step "Starting new container..."
    docker run -d \
        --name novafusion \
        --restart unless-stopped \
        -p 3000:3000 \
        --env-file .env.$DEPLOY_ENV \
        novafusion:$DEPLOY_ENV
    
    print_success "Deployed with Docker"
}

deploy_vercel() {
    print_step "Deploying to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        print_error "Vercel CLI not found. Install with: npm install -g vercel"
        exit 1
    fi
    
    if [ "$DEPLOY_ENV" = "production" ]; then
        vercel --prod
    else
        vercel
    fi
    
    print_success "Deployed to Vercel"
}

deploy_netlify() {
    print_step "Deploying to Netlify..."
    
    if ! command -v netlify &> /dev/null; then
        print_error "Netlify CLI not found. Install with: npm install -g netlify-cli"
        exit 1
    fi
    
    if [ "$DEPLOY_ENV" = "production" ]; then
        netlify deploy --prod
    else
        netlify deploy
    fi
    
    print_success "Deployed to Netlify"
}

post_deployment() {
    print_step "Post-deployment tasks..."
    
    # Health check (customize based on your setup)
    if [ "$DEPLOY_METHOD" = "pm2" ]; then
        sleep 3
        if pm2 list | grep -q "online"; then
            print_success "Application is running"
        else
            print_error "Application failed to start"
            pm2 logs novafusion --lines 50
            exit 1
        fi
    fi
    
    # Clear cache (if applicable)
    print_info "Consider clearing CDN cache if using one"
    
    print_success "Post-deployment tasks completed"
}

show_summary() {
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║     Deployment Completed! 🎉           ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
    echo ""
    echo "Environment: $DEPLOY_ENV"
    echo "Method: $DEPLOY_METHOD"
    echo "Time: $(date)"
    echo ""
    print_info "Next steps:"
    echo "  - Verify deployment manually"
    echo "  - Check application logs"
    echo "  - Monitor for errors"
    echo "  - Test critical functionality"
    echo ""
}

main() {
    parse_arguments "$@"
    print_header
    
    print_info "Deploying to: $DEPLOY_ENV"
    print_info "Using method: $DEPLOY_METHOD"
    echo ""
    
    confirm_deployment
    pre_deployment_checks
    backup_database
    run_build
    
    case $DEPLOY_METHOD in
        manual)
            deploy_manual
            ;;
        pm2)
            deploy_pm2
            ;;
        docker)
            deploy_docker
            ;;
        vercel)
            deploy_vercel
            ;;
        netlify)
            deploy_netlify
            ;;
        *)
            print_error "Unknown deployment method: $DEPLOY_METHOD"
            exit 1
            ;;
    esac
    
    post_deployment
    show_summary
}

main "$@"

