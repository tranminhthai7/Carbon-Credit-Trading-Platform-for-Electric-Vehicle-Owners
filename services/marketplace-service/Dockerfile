# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (development/demo environment)
# Use `npm install` so local package.json updates (added jwt) don't require updating the lock file
RUN npm install

# Copy source code
COPY . .

# Build TypeScript -> dist
RUN npm run build

# Expose port
EXPOSE 3004

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3004/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); })"

# Start application
CMD ["npm", "start"]
