# Docker Setup for Frontend

This project uses Bun for fast package management and building, with Docker for containerization.

## Prerequisites

- Docker and Docker Compose installed
- Bun (optional, for local development)

## Quick Start

### Production Build
```bash
# Build and run production container
npm run docker:compose
```

### Development Build
```bash
# Build and run development container with hot reload
npm run docker:compose-dev
```

## Available Commands

### Docker Commands
```bash
# Build production image
npm run docker:build

# Build development image
npm run docker:dev

# Run production container
npm run docker:run

# Run development container
npm run docker:run-dev

# Use docker-compose for production
npm run docker:compose

# Use docker-compose for development
npm run docker:compose-dev
```

### Manual Docker Commands
```bash
# Build production image
docker build -t lct-frontend .

# Build development image
docker build -f Dockerfile.dev -t lct-frontend-dev .

# Run production container
docker run -p 3000:80 lct-frontend

# Run development container with volume mounting
docker run -p 5173:5173 -v $(pwd):/app lct-frontend-dev

# Use docker-compose
docker-compose up frontend        # Production
docker-compose up frontend-dev    # Development
```

## Configuration

### Environment Variables

The frontend can be configured using environment variables:

```bash
# Set backend URL
docker run -p 3000:80 -e VITE_API_BASE_URL=http://your-backend:8080 lct-frontend
```

Or in docker-compose.yml:
```yaml
environment:
  - VITE_API_BASE_URL=http://your-backend:8080
```

### Nginx Configuration

The production build uses Nginx for serving static files. The configuration includes:

- **Client-side routing support** - All routes fallback to index.html
- **Gzip compression** - Reduces file sizes
- **Static asset caching** - 1-year cache for static files
- **Security headers** - XSS protection, content type sniffing prevention
- **API proxy** - Optional proxy to backend (if using same domain)

## File Structure

```
Frontend/
├── Dockerfile              # Production build
├── Dockerfile.dev          # Development build
├── docker-compose.yml      # Multi-container setup
├── nginx.conf              # Nginx configuration
├── .dockerignore           # Files to ignore in Docker build
└── DOCKER.md              # This documentation
```

## Development vs Production

### Development (Dockerfile.dev)
- Uses Bun directly
- Hot reload enabled
- Source code mounted as volume
- Port 5173 exposed
- Faster startup

### Production (Dockerfile)
- Multi-stage build
- Bun builds the app
- Nginx serves static files
- Optimized for performance
- Port 80 exposed
- Smaller final image

## Backend Integration

The nginx configuration includes proxy rules for API calls:

```nginx
location /api/ {
    proxy_pass http://backend:8080/api/;
}

location /admin/ {
    proxy_pass http://backend:8080/admin/;
}

location /files/ {
    proxy_pass http://backend:8080/files/;
}
```

This allows the frontend to be served from the same domain as the backend, avoiding CORS issues.

## Troubleshooting

### Port Conflicts
If ports 3000 or 5173 are in use:
```bash
# Use different ports
docker run -p 3001:80 lct-frontend
docker run -p 5174:5173 lct-frontend-dev
```

### Build Issues
```bash
# Clean build
docker build --no-cache -t lct-frontend .

# Check build logs
docker build -t lct-frontend . 2>&1 | tee build.log
```

### Volume Mounting Issues (Windows)
On Windows, use forward slashes for volume paths:
```bash
docker run -p 5173:5173 -v /c/Projects/lct/Frontend:/app lct-frontend-dev
```

### Environment Variables Not Working
Make sure to set environment variables before building:
```bash
# Set environment variable
export VITE_API_BASE_URL=http://your-backend:8080

# Build with environment variable
docker build --build-arg VITE_API_BASE_URL=$VITE_API_BASE_URL -t lct-frontend .
```

## Performance Tips

1. **Use .dockerignore** - Exclude unnecessary files from build context
2. **Multi-stage builds** - Keep final image small
3. **Layer caching** - Copy package.json first for better caching
4. **Nginx optimization** - Enable gzip and caching

## Security Considerations

1. **Non-root user** - Consider running as non-root in production
2. **Security headers** - Already configured in nginx.conf
3. **HTTPS** - Use reverse proxy with SSL in production
4. **Environment variables** - Don't commit sensitive data

## Integration with Backend

To run both frontend and backend together:

```yaml
# docker-compose.yml (in project root)
version: '3.8'
services:
  backend:
    build: ./Backend
    ports:
      - "8080:8080"
  
  frontend:
    build: ./Frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
```
