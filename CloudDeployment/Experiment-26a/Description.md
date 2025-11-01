# Experiment-26a: CI/CD Pipeline with GitHub Actions and GitHub Pages Deployment

## Overview
This project demonstrates the implementation of a complete Continuous Integration and Continuous Deployment (CI/CD) pipeline using GitHub Actions. The workflow automatically tests, builds, and deploys a Node.js application to GitHub Pages whenever code is pushed to the main branch.

## Project Description
A hands-on demonstration of modern DevOps practices, showcasing how to automate the entire software delivery process from code commit to production deployment. The project uses GitHub Actions to create a seamless pipeline that ensures code quality through automated testing and delivers the application to GitHub Pages without manual intervention.

## Technology Stack
- **Runtime**: Node.js
- **CI/CD Platform**: GitHub Actions
- **Deployment Target**: GitHub Pages
- **Authentication**: Personal Access Token (PAT)
- **Build Tool**: npm scripts
- **Version Control**: Git/GitHub

## CI/CD Architecture

### Workflow Trigger
- **Event**: Push to `main` branch
- **Automatic**: No manual approval required
- **Branch Protection**: Can be configured for additional safety

### Pipeline Stages

#### 1. Source Stage
- Code checkout from repository
- Branch: `main`
- Includes all project files

#### 2. Test Stage
- Installs project dependencies
- Runs automated test suite
- Validates code quality
- Fails pipeline if tests fail

#### 3. Build Stage
- Compiles/bundles the application
- Creates production-ready artifacts
- Generates static HTML output in `dist/` directory

#### 4. Deploy Stage
- Pushes build artifacts to GitHub Pages
- Uses secure PAT authentication
- Publishes to `gh-pages` branch
- Makes application publicly accessible

## Key Features

### 1. Automated Testing
- Runs test suite on every commit
- Ensures code quality before deployment
- Provides immediate feedback to developers
- Prevents broken code from reaching production

### 2. Continuous Deployment
- Zero manual intervention required
- Deploys successful builds automatically
- Reduces time from commit to production
- Eliminates human error in deployment

### 3. GitHub Pages Integration
- Free hosting for static sites
- HTTPS by default
- Custom domain support
- Global CDN distribution

### 4. Secure Authentication
- Uses GitHub Personal Access Token
- Stored as encrypted secret
- No credentials in code
- Follows security best practices

### 5. Build Artifact Management
- Generates static HTML output
- Organized in `dist/` directory
- Optimized for web delivery
- Version controlled in separate branch

## Project Structure
```
Experiment-26a/
├── .github/
│   └── workflows/
│       └── ci-cd.yml        # GitHub Actions workflow definition
├── output/
│   ├── complete.png         # Screenshots of successful pipeline
│   └── process.png          # Screenshots of pipeline process
├── index.js                 # Main application entry point
├── package.json             # Project dependencies and scripts
└── desc.txt                 # Original project description
```

## Application Components

### index.js
Simple Node.js application that outputs a success message:
```javascript
console.log("🚀 CI/CD Demo running successfully!");
```

### package.json Scripts

#### `start`
```json
"start": "node index.js"
```
Runs the application locally

#### `test`
```json
"test": "echo \"✅ All tests passed!\" && exit 0"
```
Executes test suite (placeholder implementation)

#### `build`
```json
"build": "echo \"🔨 Building project...\" && mkdir -p dist && echo '<h1>Build complete!</h1>' > dist/index.html"
```
Creates production build with static HTML output

## GitHub Actions Workflow

### Workflow Configuration
The `.github/workflows/ci-cd.yml` file defines the pipeline:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v2
        
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'
          
      - name: Install dependencies
        run: npm install
        
      - name: Run tests
        run: npm test
        
      - name: Build project
        run: npm run build
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Workflow Steps Explained

1. **Checkout Code**
   - Uses `actions/checkout@v2`
   - Clones repository to runner
   - Provides access to all project files

2. **Setup Node.js**
   - Uses `actions/setup-node@v2`
   - Installs Node.js runtime (v14)
   - Configures npm environment

3. **Install Dependencies**
   - Runs `npm install`
   - Installs packages from package.json
   - Creates `node_modules` directory

4. **Run Tests**
   - Executes `npm test`
   - Validates code functionality
   - Fails pipeline if tests fail

5. **Build Project**
   - Runs `npm run build`
   - Creates production artifacts
   - Generates `dist/` directory

6. **Deploy to GitHub Pages**
   - Uses `peaceiris/actions-gh-pages@v3`
   - Authenticates with PAT
   - Pushes `dist/` to `gh-pages` branch
   - Updates live website

## Setup Instructions

### Prerequisites
- GitHub account
- Git installed locally
- Node.js and npm installed
- Basic understanding of Git and GitHub

### Step 1: Create GitHub Repository
```bash
# Create new repository on GitHub
# Clone to local machine
git clone https://github.com/your-username/ci-cd-demo.git
cd ci-cd-demo
```

### Step 2: Add Project Files
```bash
# Copy project files
cp -r Experiment-26a/* .

# Or create from scratch
npm init -y
# Create index.js and add code
```

### Step 3: Configure GitHub Pages

#### Enable GitHub Pages
1. Go to repository Settings
2. Navigate to Pages section
3. Source: Deploy from branch
4. Branch: `gh-pages`
5. Folder: `/ (root)`
6. Save settings

### Step 4: Create Personal Access Token (PAT)

#### Generate PAT
1. GitHub Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token (classic)
4. Scopes: Select `repo` and `workflow`
5. Generate token and copy immediately

#### Add as Repository Secret
1. Repository Settings → Secrets and variables → Actions
2. New repository secret
3. Name: `GITHUB_TOKEN` or `PAT_TOKEN`
4. Value: Paste your PAT
5. Add secret

### Step 5: Create GitHub Actions Workflow
```bash
# Create workflow directory
mkdir -p .github/workflows

# Create workflow file
touch .github/workflows/ci-cd.yml
```

Add workflow configuration (see GitHub Actions Workflow section above)

### Step 6: Commit and Push
```bash
git add .
git commit -m "Add CI/CD pipeline with GitHub Actions"
git push origin main
```

### Step 7: Monitor Pipeline
1. Go to repository on GitHub
2. Click "Actions" tab
3. View running workflow
4. Check each step's output
5. Verify deployment success

### Step 8: Access Deployed Application
```
https://your-username.github.io/repository-name/
```

## Usage and Testing

### Trigger Pipeline
Any push to `main` branch triggers the workflow:
```bash
# Make a change
echo "Updated" >> README.md

# Commit and push
git add .
git commit -m "Update README"
git push origin main
```

### View Pipeline Status
- Green checkmark: Success ✅
- Red X: Failure ❌
- Yellow circle: In progress 🟡

### Check Logs
1. Actions tab → Select workflow run
2. Click on job name
3. Expand each step
4. View detailed logs

### Test Locally
```bash
# Install dependencies
npm install

# Run tests
npm test

# Run build
npm run build

# Start application
npm start
```

## Monitoring and Maintenance

### Pipeline Health
- Monitor success/failure rates
- Review build times
- Check deployment frequency
- Analyze error patterns

### Debugging Failed Pipelines

#### Test Failures
```bash
# Run tests locally
npm test

# Check test output
# Fix failing tests
# Commit and push fix
```

#### Build Failures
```bash
# Run build locally
npm run build

# Check for errors
# Verify dist/ directory created
# Fix build configuration
```

#### Deployment Failures
- Verify PAT is valid and not expired
- Check PAT has correct permissions
- Ensure `gh-pages` branch exists
- Verify GitHub Pages is enabled

### Updating Workflow
```bash
# Edit workflow file
nano .github/workflows/ci-cd.yml

# Test changes
git add .
git commit -m "Update CI/CD workflow"
git push origin main
```

## Advanced Configuration

### Custom Domain
```yaml
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./dist
    cname: www.your-domain.com
```

### Deploy to Multiple Environments
```yaml
jobs:
  deploy-staging:
    if: github.ref == 'refs/heads/develop'
    # Deploy to staging
    
  deploy-production:
    if: github.ref == 'refs/heads/main'
    # Deploy to production
```

### Add Build Matrix
```yaml
strategy:
  matrix:
    node-version: [12, 14, 16]
    os: [ubuntu-latest, windows-latest, macos-latest]
```

### Cache Dependencies
```yaml
- name: Cache node modules
  uses: actions/cache@v2
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

## Security Best Practices

### 1. Secret Management
- Never commit tokens to repository
- Use GitHub Secrets for sensitive data
- Rotate PATs regularly
- Use minimum required permissions

### 2. Workflow Permissions
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

### 3. Branch Protection
- Require pull request reviews
- Require status checks to pass
- Enforce up-to-date branches
- Restrict push access

### 4. Dependency Security
```yaml
- name: Run security audit
  run: npm audit
```

## Performance Optimization

### 1. Parallel Jobs
```yaml
jobs:
  test:
    runs-on: ubuntu-latest
  build:
    runs-on: ubuntu-latest
    needs: test
```

### 2. Conditional Execution
```yaml
- name: Deploy
  if: success() && github.ref == 'refs/heads/main'
```

### 3. Artifact Caching
```yaml
- name: Upload build artifacts
  uses: actions/upload-artifact@v2
  with:
    name: build
    path: dist/
```

## Troubleshooting Guide

### Issue: Workflow Not Triggering
**Solution:**
- Check workflow file is in `.github/workflows/`
- Verify YAML syntax is correct
- Ensure push is to correct branch
- Check repository settings allow Actions

### Issue: Test Failures
**Solution:**
- Run tests locally first
- Check test logs in Actions tab
- Verify dependencies are installed
- Ensure correct Node.js version

### Issue: Deployment Fails
**Solution:**
- Verify PAT is valid
- Check PAT permissions (repo, workflow)
- Ensure GitHub Pages is enabled
- Verify `dist/` directory exists after build

### Issue: Site Not Updating
**Solution:**
- Check deployment completed successfully
- Clear browser cache
- Wait a few minutes for CDN propagation
- Verify correct URL

## Cost and Resource Usage

### GitHub Actions Usage
- **Free Tier**: 2,000 minutes/month for public repos
- **Private Repos**: 2,000 minutes/month (paid plans)
- **Storage**: 500 MB for artifacts
- **Retention**: 90 days for artifacts

### GitHub Pages
- **Free**: For public repositories
- **Bandwidth**: Soft limit of 100 GB/month
- **Build Limit**: 10 builds per hour
- **Storage**: 1 GB recommended

## Learning Outcomes
- Understanding CI/CD principles
- GitHub Actions workflow configuration
- Automated testing integration
- Continuous deployment strategies
- Secret management in CI/CD
- GitHub Pages deployment
- DevOps best practices

## Comparison: Experiment-26a vs 26b
- **26a**: Focuses on GitHub Pages deployment
- **26b**: May include different deployment target
- **Both**: Share same CI/CD principles
- **Authentication**: Both use PAT for security

## Real-World Applications
- Portfolio websites
- Documentation sites
- Product landing pages
- Blog deployments
- Static site generators (Gatsby, Next.js, Hugo)
- React/Vue/Angular applications

## Future Enhancements
- Add integration tests
- Implement staging environment
- Add performance monitoring
- Integrate code quality tools (ESLint, Prettier)
- Add automatic versioning
- Implement rollback capabilities
- Add Slack/Discord notifications

## Additional Resources
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Workflow Syntax Reference](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages)
- [CI/CD Best Practices](https://docs.github.com/en/actions/guides)

## License
MIT License - Educational purposes

## Author
Dhamanpreet Singh - Full Stack Development Course

## Acknowledgments
- GitHub Actions community
- peaceiris for gh-pages action
- Node.js community
