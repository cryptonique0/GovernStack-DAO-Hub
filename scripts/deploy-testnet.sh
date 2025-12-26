#!/bin/bash

# GovernStack DAO Hub - Deployment Script for Testnet

echo "🚀 Deploying GovernStack DAO Hub to Stacks Testnet..."

# Check if Clarinet is installed
if ! command -v clarinet &> /dev/null; then
    echo "❌ Clarinet is not installed. Please install it first:"
    echo "   curl -L https://github.com/hirosystems/clarinet/releases/download/v1.7.0/clarinet-linux-x64.tar.gz | tar xz"
    exit 1
fi

# Generate deployment plan
echo "📝 Generating deployment plan..."
clarinet deployments generate --testnet

# Review deployment plan
echo "📋 Deployment plan generated. Review the plan at:"
echo "   deployments/default.testnet-plan.yaml"
echo ""
read -p "Do you want to proceed with deployment? (y/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔄 Deploying contracts..."
    clarinet deployments apply -p deployments/default.testnet-plan.yaml
    
    if [ $? -eq 0 ]; then
        echo "✅ Contracts deployed successfully!"
        echo ""
        echo "📝 Next steps:"
        echo "1. Update .env file with deployed contract addresses"
        echo "2. Start the backend: cd backend && npm run dev"
        echo "3. Start the frontend: cd frontend && npm run dev"
        echo "4. Access the app at http://localhost:5173"
    else
        echo "❌ Deployment failed. Check the error messages above."
        exit 1
    fi
else
    echo "❌ Deployment cancelled."
    exit 0
fi
