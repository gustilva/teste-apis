#!/bin/bash
set -e

echo "Building api-gateway..."
npx nx build api-gateway --prod
echo "API Gateway built successfully!"

echo "Building auth..."
npx nx build auth --prod
echo "Auth built successfully!"

# Add other projects
