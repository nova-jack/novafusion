#!/bin/bash

# NovaFusion Build Script
# Comprehensive build automation with validation and deployment prep

set -e  # Exit on error

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Build configuration
BUILD_MODE="production"
SKIP_CHECKS=false
SKIP_CLEANUP=false
SKIP_TESTS=false
ANALYZE=false
VERBOSE=false
DRY_RUN=false

# Counters
ERRORS=0
WARNINGS=0

# Functions for output
print_header() {
    echo ""
    echo -e "${CYAN}╔════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║     NovaFusion Build Script v1.0       ║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════╝${NC}"
    echo ""
}

print_section() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

print_step() {
    echo -e "${CYAN}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
    ERRORS=$((ERRORS + 1))
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    WARNINGS=$((WARNINGS + 1))
}

print_info() {
    echo -e "${MAGENTA}ℹ️  $1${NC}"
}

# Help function
show_help() {
    cat << EOF
Usage: ./build.sh [OPTIONS]

Build modes:
  --production      Production build (default)
  --development     Development build
  --staging         Staging build

Options:
  --skip-checks     Skip pre-build validation checks
  --skip-cleanup    Skip cleanup before build
  --skip-tests      Skip running tests
  --analyze         Analyze bundle size
  --verbose         Show detailed output
  --dry-run         Show what would be done without executing
  -h, --help        Show this help message

Examples:
  ./build.sh                          # Standard production build
  ./build.sh --staging                # Build for staging environment
  ./build.sh --analyze                # Build with bundle analysis
  ./build.sh --skip-checks --verbose  # Quick build with verbose output
  ./build.sh --dry-run                # Preview build steps

EOF
}

# Parse command line arguments
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --production)
                BUILD_MODE="production"
                shift
                ;;
            --development)
                BUILD_MODE="development"
                shift
                ;;
            --staging)
                BUILD_MODE="staging"
                shift
                ;;
            --skip-checks)
                SKIP_CHECKS=true
                shift
                ;;
            --skip-cleanup)
                SKIP_CLEANUP=true
                shift
                ;;
            --skip-tests)
                SKIP_TESTS=true
                shift
                ;;
            --analyze)
                ANALYZE=true
                shift
                ;;
            --verbose)
                VERBOSE=true
                shift
                ;;
            --dry-run)
                DRY_RUN=true
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

# Execute command (respects dry-run mode)
execute() {
    local cmd="$1"
    local description="$2"
    
    if [ "$DRY_RUN" = true ]; then
        print_info "[DRY-RUN] Would execute: $cmd"
        return 0
    fi
    
    if [ "$VERBOSE" = true ]; then
        print_step "$description"
        eval "$cmd"
    else
        print_step "$description"
        eval "$cmd" > /dev/null 2>&1
    fi
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Navigate to project root
navigate_to_root() {
    if [ -f "package.json" ]; then
        PROJECT_ROOT="."
    else
        SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
        PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
        cd "$PROJECT_ROOT"
    fi
    print_info "Working directory: $(pwd)"
}

# Pre-build checks
pre_build_checks() {
    if [ "$SKIP_CHECKS" = true ]; then
        print_warning "Skipping pre-build checks"
        return 0
    fi
    
    print_section "Pre-build Validation"
    
    # Check Node.js version
    print_step "Checking Node.js version..."
    if command_exists node; then
        NODE_VERSION=$(node --version)
        print_success "Node.js $NODE_VERSION"
    else
        print_error "Node.js not found"
        return 1
    fi
    
    # Check npm
    print_step "Checking npm..."
    if command_exists npm; then
        NPM_VERSION=$(npm --version)
        print_success "npm $NPM_VERSION"
    else
        print_error "npm not found"
        return 1
    fi
    
    # Check package.json
    print_step "Checking package.json..."
    if [ -f "package.json" ]; then
        print_success "package.json found"
    else
        print_error "package.json not found"
        return 1
    fi
    
    # Check .env file based on build mode
    print_step "Checking environment configuration..."
    if [ "$BUILD_MODE" = "production" ] && [ ! -f ".env.production" ] && [ ! -f ".env" ]; then
        print_warning ".env.production or .env not found"
    elif [ "$BUILD_MODE" = "staging" ] && [ ! -f ".env.staging" ] && [ ! -f ".env" ]; then
        print_warning ".env.staging or .env not found"
    else
        print_success "Environment file found"
    fi
    
    # Check required environment variables
    print_step "Validating environment variables..."
    if [ -f ".env" ] || [ -f ".env.$BUILD_MODE" ]; then
        REQUIRED_VARS=("DATABASE_URL" "JWT_SECRET" "NEXT_PUBLIC_APP_URL")
        ENV_FILE=".env"
        [ -f ".env.$BUILD_MODE" ] && ENV_FILE=".env.$BUILD_MODE"
        
        for var in "${REQUIRED_VARS[@]}"; do
            if ! grep -q "^${var}=" "$ENV_FILE" 2>/dev/null; then
                print_warning "$var not found in $ENV_FILE"
            fi
        done
    fi
    
    # Check for node_modules
    print_step "Checking dependencies..."
    if [ -d "node_modules" ]; then
        print_success "node_modules exists"
    else
        print_warning "node_modules not found - installing dependencies"
        execute "npm install" "Installing dependencies"
    fi
    
    # TypeScript check
    print_step "Running TypeScript type check..."
    if execute "npx tsc --noEmit" "Type checking"; then
        print_success "TypeScript check passed"
    else
        print_error "TypeScript errors found"
        if [ "$DRY_RUN" = false ]; then
            return 1
        fi
    fi
    
    # ESLint check
    print_step "Running ESLint..."
    if execute "npm run lint" "Linting code"; then
        print_success "Linting passed"
    else
        print_warning "Linting warnings/errors found"
    fi
    
    print_success "Pre-build checks completed"
}

# Cleanup before build
cleanup() {
    if [ "$SKIP_CLEANUP" = true ]; then
        print_warning "Skipping cleanup"
        return 0
    fi
    
    print_section "Cleanup"
    
    print_step "Removing old build artifacts..."
    execute "rm -rf .next" "Removing .next directory"
    execute "rm -rf out" "Removing out directory"
    execute "rm -rf dist" "Removing dist directory"
    
    print_success "Cleanup completed"
}

# Run tests
run_tests() {
    if [ "$SKIP_TESTS" = true ]; then
        print_warning "Skipping tests"
        return 0
    fi
    
    print_section "Running Tests"
    
    # Check if test script exists
    if grep -q '"test"' package.json; then
        print_step "Running test suite..."
        if execute "npm run test" "Running tests"; then
            print_success "All tests passed"
        else
            print_error "Some tests failed"
            return 1
        fi
    else
        print_warning "No test script found in package.json"
    fi
}

# Generate Prisma Client
generate_prisma() {
    print_section "Prisma Setup"
    
    if [ -f "prisma/schema.prisma" ]; then
        print_step "Generating Prisma Client..."
        if execute "npx prisma generate" "Generating Prisma Client"; then
            print_success "Prisma Client generated"
        else
            print_error "Prisma Client generation failed"
            return 1
        fi
    else
        print_info "No Prisma schema found, skipping"
    fi
}

# Build application
build_app() {
    print_section "Building Application"
    
    print_info "Build mode: $BUILD_MODE"
    
    # Set NODE_ENV based on build mode
    export NODE_ENV="production"
    [ "$BUILD_MODE" = "development" ] && export NODE_ENV="development"
    
    print_step "Running Next.js build..."
    
    BUILD_CMD="npm run build"
    
    # Add analyze flag if requested
    if [ "$ANALYZE" = true ]; then
        print_info "Bundle analysis enabled"
        BUILD_CMD="ANALYZE=true $BUILD_CMD"
    fi
    
    # Show build command
    print_info "Executing: $BUILD_CMD"
    
    if [ "$DRY_RUN" = true ]; then
        print_info "[DRY-RUN] Would execute: $BUILD_CMD"
        return 0
    fi
    
    # Execute build with timing
    BUILD_START=$(date +%s)
    
    if [ "$VERBOSE" = true ]; then
        eval "$BUILD_CMD"
    else
        eval "$BUILD_CMD" 2>&1 | tee build.log
    fi
    
    BUILD_EXIT_CODE=${PIPESTATUS[0]}
    BUILD_END=$(date +%s)
    BUILD_TIME=$((BUILD_END - BUILD_START))
    
    if [ $BUILD_EXIT_CODE -eq 0 ]; then
        print_success "Build completed in ${BUILD_TIME}s"
        rm -f build.log
        return 0
    else
        print_error "Build failed after ${BUILD_TIME}s"
        if [ -f "build.log" ]; then
            print_info "Build log:"
            tail -n 50 build.log
        fi
        return 1
    fi
}

# Post-build checks
post_build_checks() {
    print_section "Post-build Validation"
    
    # Check if .next directory was created
    print_step "Checking build output..."
    if [ -d ".next" ]; then
        print_success ".next directory created"
        
        # Show build size
        BUILD_SIZE=$(du -sh .next 2>/dev/null | cut -f1)
        print_info "Build size: $BUILD_SIZE"
    else
        print_error ".next directory not found"
        return 1
    fi
    
    # Check for specific build files
    print_step "Validating build structure..."
    REQUIRED_FILES=(
        ".next/BUILD_ID"
        ".next/package.json"
    )
    
    for file in "${REQUIRED_FILES[@]}"; do
        if [ -f "$file" ]; then
            print_success "$file exists"
        else
            print_warning "$file not found"
        fi
    done
}

# Generate build report
generate_report() {
    print_section "Build Report"
    
    REPORT_FILE="build-report.txt"
    
    {
        echo "NovaFusion Build Report"
        echo "======================="
        echo ""
        echo "Build Date: $(date)"
        echo "Build Mode: $BUILD_MODE"
        echo "Node Version: $(node --version)"
        echo "npm Version: $(npm --version)"
        echo ""
        echo "Build Statistics:"
        echo "- Errors: $ERRORS"
        echo "- Warnings: $WARNINGS"
        echo ""
        if [ -d ".next" ]; then
            echo "Build Output:"
            echo "- Directory: .next"
            echo "- Size: $(du -sh .next 2>/dev/null | cut -f1)"
            echo ""
        fi
        echo "Environment:"
        echo "- NODE_ENV: $NODE_ENV"
        echo "- PWD: $(pwd)"
        echo ""
    } > "$REPORT_FILE"
    
    print_info "Build report saved to: $REPORT_FILE"
}

# Show build summary
show_summary() {
    print_section "Build Summary"
    
    echo ""
    if [ $ERRORS -eq 0 ]; then
        print_success "🎉 Build completed successfully!"
    else
        print_error "Build completed with $ERRORS error(s)"
    fi
    
    if [ $WARNINGS -gt 0 ]; then
        print_warning "Found $WARNINGS warning(s)"
    fi
    
    echo ""
    print_info "Next steps:"
    if [ "$BUILD_MODE" = "production" ]; then
        echo "  - Test build locally:  npm run start"
        echo "  - Deploy to server:    See deployment guide"
    elif [ "$BUILD_MODE" = "staging" ]; then
        echo "  - Test on staging:     npm run start"
        echo "  - Verify changes:      Manual QA"
    else
        echo "  - Start dev server:    npm run dev"
    fi
    echo ""
}

# Main execution
main() {
    # Parse arguments
    parse_arguments "$@"
    
    # Show header
    print_header
    
    # Navigate to project root
    navigate_to_root
    
    # Dry run notice
    if [ "$DRY_RUN" = true ]; then
        print_warning "DRY RUN MODE - No changes will be made"
        echo ""
    fi
    
    # Execute build steps
    pre_build_checks || exit 1
    cleanup || exit 1
    generate_prisma || exit 1
    run_tests || exit 1
    build_app || exit 1
    post_build_checks || exit 1
    
    # Generate report
    if [ "$DRY_RUN" = false ]; then
        generate_report
    fi
    
    # Show summary
    show_summary
    
    # Exit with appropriate code
    if [ $ERRORS -eq 0 ]; then
        exit 0
    else
        exit 1
    fi
}

# Run main function
main "$@"

