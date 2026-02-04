#!/bin/bash

# NovaFusion Cleanup Script
# Safely removes build artifacts and caches

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to safely remove directory/file
safe_remove() {
    local path="$1"
    local description="$2"
    
    if [ -e "$path" ]; then
        print_info "Removing $description..."
        rm -rf "$path"
        print_success "$description removed"
    else
        print_info "$description not found (skipping)"
    fi
}

# Parse command line arguments
CLEAN_ALL=false
CLEAN_DEPS=false
CLEAN_CACHE=false
CLEAN_BUILD=false

show_help() {
    echo "Usage: ./cleanup.sh [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --all         Clean everything (build, cache, dependencies)"
    echo "  --build       Clean only build artifacts"
    echo "  --cache       Clean only caches"
    echo "  --deps        Clean node_modules and reinstall"
    echo "  -h, --help    Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./cleanup.sh              # Clean build artifacts only (default)"
    echo "  ./cleanup.sh --all        # Clean everything"
    echo "  ./cleanup.sh --cache      # Clean caches only"
    echo ""
}

# Parse arguments
if [ $# -eq 0 ]; then
    CLEAN_BUILD=true
else
    while [[ $# -gt 0 ]]; do
        case $1 in
            --all)
                CLEAN_ALL=true
                shift
                ;;
            --build)
                CLEAN_BUILD=true
                shift
                ;;
            --cache)
                CLEAN_CACHE=true
                shift
                ;;
            --deps)
                CLEAN_DEPS=true
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
fi

# If --all is specified, enable everything
if [ "$CLEAN_ALL" = true ]; then
    CLEAN_BUILD=true
    CLEAN_CACHE=true
    CLEAN_DEPS=true
fi

echo ""
echo "╔════════════════════════════════════════╗"
echo "║   NovaFusion Cleanup Script v1.0       ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Navigate to project root (parent of scripts directory)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

print_info "Working directory: $PROJECT_ROOT"
echo ""

# Clean build artifacts
if [ "$CLEAN_BUILD" = true ]; then
    print_info "🧹 Cleaning build artifacts..."
    echo ""
    
    safe_remove ".next" "Next.js build cache (.next)"
    safe_remove "dist" "Distribution folder (dist)"
    safe_remove "build" "Build folder (build)"
    safe_remove "out" "Static export folder (out)"
    safe_remove ".turbo" "Turbopack cache (.turbo)"
    
    echo ""
fi

# Clean caches
if [ "$CLEAN_CACHE" = true ]; then
    print_info "🧽 Cleaning caches..."
    echo ""
    
    safe_remove "node_modules/.cache" "Node modules cache"
    safe_remove ".eslintcache" "ESLint cache"
    safe_remove "tsconfig.tsbuildinfo" "TypeScript build info"
    
    print_info "Cleaning npm cache..."
    if npm cache clean --force 2>/dev/null; then
        print_success "NPM cache cleaned"
    else
        print_warning "NPM cache clean failed (may not be critical)"
    fi
    
    echo ""
fi

# Clean and reinstall dependencies
if [ "$CLEAN_DEPS" = true ]; then
    print_warning "⚠️  This will remove node_modules and reinstall all dependencies"
    print_warning "⚠️  This may take several minutes"
    echo ""
    
    # Ask for confirmation
    read -p "Continue? (y/N) " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "🗑️  Removing node_modules..."
        safe_remove "node_modules" "Node modules"
        
        safe_remove "package-lock.json" "Package lock file"
        
        print_info "📦 Reinstalling dependencies..."
        if npm install; then
            print_success "Dependencies reinstalled successfully"
        else
            print_error "Failed to reinstall dependencies"
            exit 1
        fi
        
        print_info "🔄 Regenerating Prisma Client..."
        if npx prisma generate; then
            print_success "Prisma Client generated successfully"
        else
            print_error "Failed to generate Prisma Client"
            exit 1
        fi
    else
        print_info "Skipping dependency reinstallation"
    fi
    
    echo ""
fi

# Summary
echo ""
echo "╔════════════════════════════════════════╗"
echo "║           Cleanup Summary              ║"
echo "╚════════════════════════════════════════╝"
echo ""

if [ "$CLEAN_BUILD" = true ]; then
    echo "✅ Build artifacts cleaned"
fi

if [ "$CLEAN_CACHE" = true ]; then
    echo "✅ Caches cleaned"
fi

if [ "$CLEAN_DEPS" = true ]; then
    echo "✅ Dependencies reinstalled"
fi

echo ""
print_success "🎉 Cleanup completed successfully!"
echo ""

# Suggestions
print_info "💡 Next steps:"
if [ "$CLEAN_DEPS" = true ]; then
    echo "   - Run: npm run dev      (start development server)"
    echo "   - Run: npm run build    (build for production)"
else
    if [ "$CLEAN_BUILD" = true ] || [ "$CLEAN_CACHE" = true ]; then
        echo "   - Run: npm run dev      (start development server)"
        echo "   - Run: npm run build    (build for production)"
    fi
fi
echo ""

exit 0
