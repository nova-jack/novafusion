#!/bin/bash
set -e

echo "🧹 Cleaning old build artifacts..."

rm -rf .next
rm -rf dist
rm -rf build
rm -rf out

rm -rf node_modules/.cache

echo "🧽 Cleaning npm cache..."
npm cache clean --force

echo "✅ Clean completed successfully"

