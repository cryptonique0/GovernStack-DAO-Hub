#!/bin/bash

# GovernStack DAO Hub - Setup Script

echo "🛠️  Setting up GovernStack DAO Hub..."

# Check Node.js version
echo "📦 Checking Node.js version..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Copy environment file
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please update .env file with your configuration"
else
    echo "✅ .env file already exists"
fi

# Check Clarinet installation
echo "🔍 Checking Clarinet installation..."
if ! command -v clarinet &> /dev/null; then
    echo "⚠️  Clarinet is not installed."
    echo "   To install Clarinet, run:"
    echo "   curl -L https://github.com/hirosystems/clarinet/releases/download/v1.7.0/clarinet-linux-x64.tar.gz | tar xz"
    echo "   sudo mv clarinet /usr/local/bin/"
else
    echo "✅ Clarinet is installed: $(clarinet --version)"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Update .env file with your configuration"
echo "2. Run smart contract tests: cd contracts && clarinet test"
echo "3. Deploy to testnet: npm run deploy:testnet"
echo "4. Start development servers: npm run dev"
echo ""
