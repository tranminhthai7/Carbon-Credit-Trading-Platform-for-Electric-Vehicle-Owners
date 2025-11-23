# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /workspace/services/ev-data-service

# Copy the whole repository into /workspace so local file: dependencies resolve
COPY . /workspace

# Install dependencies for this service
RUN cd /workspace/services/ev-data-service && npm install --no-audit --no-fund

# Expose port
EXPOSE 3002

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3002/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); })"

# Start application
CMD ["npm", "start"]
