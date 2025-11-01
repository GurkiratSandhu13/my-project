# Experiment-25: Multi-Stage Docker Build for React Application

## Overview
This project demonstrates the implementation of a multi-stage Docker build process for a React application, optimizing the final image size while maintaining production-grade deployment capabilities using Nginx as a web server.

## Project Description
The application showcases best practices in containerizing React applications by separating the build and runtime environments. The multi-stage approach significantly reduces the final Docker image size (~81MB) by excluding development dependencies and build tools from the production image.

## Technology Stack
- **Frontend Framework**: React 19.2.0
- **Build Tool**: react-scripts 5.0.1
- **Node.js**: v18 (Alpine Linux)
- **Web Server**: Nginx (Alpine Linux)
- **Container Platform**: Docker
- **Testing Libraries**: 
  - @testing-library/react
  - @testing-library/jest-dom
  - @testing-library/user-event

## Architecture

### Multi-Stage Build Process

#### Stage 1: Build Stage
- Base Image: `node:18-alpine`
- Installs all dependencies (including devDependencies)
- Compiles React application using `npm run build`
- Creates optimized production build in `/app/build` directory

#### Stage 2: Production Stage
- Base Image: `nginx:alpine`
- Copies only the built static files from Stage 1
- Serves application through Nginx on port 80
- Excludes all Node.js dependencies and build tools

## Key Features

### 1. Optimized Image Size
- Final production image: ~81MB
- Excludes development dependencies
- Removes build tools and intermediate files
- Uses Alpine Linux for minimal base images

### 2. Production-Ready Nginx Configuration
- Static file serving optimized for React SPA
- URL rewriting for client-side routing
- Cache headers for static assets (1-year expiration)
- Efficient handling of JS, CSS, and image files

### 3. Docker Best Practices
- `.dockerignore` file to exclude unnecessary files
- Multi-stage builds for size optimization
- Non-root user consideration (Nginx default)
- Clean separation of concerns

## Project Structure
```
Experiment-25/
├── public/              # Static assets
├── src/                 # React source code
├── Dockerfile           # Multi-stage Docker configuration
├── Dockerignore         # Docker ignore patterns
├── nginx.conf           # Custom Nginx configuration
├── package.json         # Node.js dependencies and scripts
├── package-lock.json    # Locked dependency versions
└── README.md            # Project documentation
```

## Setup and Deployment

### Prerequisites
- Docker installed and running
- Node.js and npm (for local development)
- Basic understanding of React and Docker

### Step 1: Clone or Create React App
```bash
# If starting fresh
npx create-react-app exp25
cd exp25
```

### Step 2: Customize Application
Edit the following files to customize your application:
- `src/App.js` - Main React component
- `src/App.css` - Application styling

### Step 3: Add Docker Configuration
Ensure the following files are in the project root:
- `Dockerfile` - Multi-stage build configuration
- `Dockerignore` - Exclude unnecessary files from Docker context
- `nginx.conf` - Optional custom Nginx configuration

### Step 4: Build the Application

#### Install Dependencies
```bash
npm install
```

#### Build Docker Image
```bash
docker build -t exp25:latest .
```

Build process:
1. Creates build stage with Node.js
2. Installs dependencies
3. Compiles React app
4. Creates production stage with Nginx
5. Copies built files to Nginx directory

### Step 5: Run the Container
```bash
docker run -d -p 8080:80 --name exp25-container exp25:latest
```

Flags explained:
- `-d` - Run in detached mode (background)
- `-p 8080:80` - Map host port 8080 to container port 80
- `--name exp25-container` - Assign a name to the container
- `exp25:latest` - Use the built image

### Step 6: Access the Application
Open your web browser and navigate to:
```
http://localhost:8080
```

### Step 7: Verify Image Size
```bash
docker images exp25:latest
```

Expected output: Image size approximately 81MB

## Container Management

### View Running Containers
```bash
docker ps
```

### View Container Logs
```bash
docker logs exp25-container
```

### Stop the Container
```bash
docker stop exp25-container
```

### Start the Container
```bash
docker start exp25-container
```

### Remove the Container
```bash
docker rm exp25-container
```

### Remove the Image
```bash
docker rmi exp25:latest
```

## Development Workflow

### Making Changes
1. Edit source code in `src/` directory
2. Test changes locally:
   ```bash
   npm start
   ```
3. Build new Docker image:
   ```bash
   docker build -t exp25:latest .
   ```
4. Stop and remove old container:
   ```bash
   docker stop exp25-container
   docker rm exp25-container
   ```
5. Run new container:
   ```bash
   docker run -d -p 8080:80 --name exp25-container exp25:latest
   ```

### Hot Reload for Development
For development with hot reload:
```bash
docker run -it -p 3000:3000 -v $(pwd)/src:/app/src --name exp25-dev node:18-alpine sh -c "cd /app && npm install && npm start"
```

## Nginx Configuration Details

The custom `nginx.conf` provides:

### Root Configuration
- Listens on port 80
- Serves files from `/usr/share/nginx/html`
- Default file: `index.html`

### SPA Support
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```
Ensures all routes are handled by React Router

### Static Asset Caching
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```
- Sets 1-year expiration for static assets
- Improves performance with browser caching
- Marks assets as immutable for optimal caching

## Performance Optimization

### Image Size Reduction Techniques
1. **Alpine Linux Base**: Minimal OS footprint
2. **Multi-Stage Builds**: Exclude build dependencies
3. **No Source Code**: Only compiled static files
4. **Optimized React Build**: Minified and bundled

### Runtime Optimization
1. **Nginx Efficiency**: Lightweight, high-performance web server
2. **Static File Serving**: No Node.js runtime overhead
3. **Caching Headers**: Reduced network requests
4. **Gzip Compression**: Nginx default compression

## Troubleshooting

### Container Won't Start
```bash
# Check logs
docker logs exp25-container

# Check if port is in use
lsof -i :8080
```

### Build Fails
```bash
# Clear Docker cache
docker builder prune

# Rebuild without cache
docker build --no-cache -t exp25:latest .
```

### Application Not Loading
1. Verify container is running: `docker ps`
2. Check container logs: `docker logs exp25-container`
3. Verify port mapping: `docker port exp25-container`
4. Test Nginx inside container:
   ```bash
   docker exec exp25-container wget -qO- http://localhost
   ```

## Security Considerations

### Best Practices Implemented
- Uses official Docker images
- Minimal attack surface (Alpine Linux)
- No unnecessary services running
- Nginx runs as non-root user by default

### Additional Recommendations
- Regularly update base images
- Scan images for vulnerabilities: `docker scan exp25:latest`
- Use specific version tags instead of `latest` in production
- Implement health checks in production deployments

## CI/CD Integration

### Example GitHub Actions Workflow
```yaml
name: Build and Push Docker Image
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build Docker image
        run: docker build -t exp25:${{ github.sha }} .
      - name: Push to registry
        run: docker push exp25:${{ github.sha }}
```

## Production Deployment Considerations

### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: exp25-deployment
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: exp25
        image: exp25:latest
        ports:
        - containerPort: 80
```

### Docker Compose
```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "8080:80"
    restart: unless-stopped
```

## Learning Outcomes
- Understanding of Docker multi-stage builds
- React production build optimization
- Nginx configuration for SPAs
- Container orchestration basics
- DevOps best practices for frontend applications

## Additional Resources
- [Docker Multi-Stage Builds Documentation](https://docs.docker.com/build/building/multi-stage/)
- [React Deployment Documentation](https://create-react-app.dev/docs/deployment/)
- [Nginx Configuration Guide](https://nginx.org/en/docs/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

## License
This project is for educational purposes.

## Author
Created as part of Full Stack Development coursework.
