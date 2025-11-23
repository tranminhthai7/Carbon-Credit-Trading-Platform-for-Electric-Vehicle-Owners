# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (allows changed package.json without lockfile update during dev/demo)
RUN npm install

# Copy source code
COPY . .

# Build TypeScript -> dist
RUN npm run build

# Expose port
EXPOSE 3003

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3003/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); })"

# Start application
CMD ["npm", "start"]
