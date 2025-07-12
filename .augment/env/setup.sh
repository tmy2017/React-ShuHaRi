#!/bin/bash
set -e

# Update package lists
sudo apt-get update

# Install Node.js 20 (LTS) and npm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify Node.js and npm installation
node --version
npm --version

# Navigate to the workspace directory
cd /mnt/persist/workspace

# Install project dependencies
npm ci

# Add npm global bin to PATH in user profile
echo 'export PATH="$PATH:$(npm config get prefix)/bin"' >> $HOME/.profile
echo 'export PATH="$PATH:./node_modules/.bin"' >> $HOME/.profile

# Source the profile to make PATH available immediately
source $HOME/.profile