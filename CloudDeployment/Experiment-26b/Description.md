# Experiment-26b: CI/CD Pipeline with GitHub Actions - Alternative Implementation

## Overview
This project demonstrates an alternative implementation of a Continuous Integration and Continuous Deployment (CI/CD) pipeline using GitHub Actions. Similar to Experiment-26a, this workflow automates the testing, building, and deployment of a Node.js application, showcasing different configuration approaches and deployment strategies.

## Project Description
An educational demonstration of CI/CD principles using GitHub Actions, focusing on automating the software development lifecycle from code commit to deployment. This experiment serves as a companion to Experiment-26a, potentially exploring different deployment targets, workflow configurations, or pipeline optimizations while maintaining the same core functionality.

## Technology Stack
- **Runtime**: Node.js
- **CI/CD Platform**: GitHub Actions
- **Deployment Target**: GitHub Pages (or alternative)
- **Authentication**: Personal Access Token (PAT)
- **Build Tool**: npm scripts
- **Version Control**: Git/GitHub

## Project Purpose
This experiment allows developers to:
- Compare different CI/CD implementations
- Understand workflow variations
- Explore deployment alternatives
- Test different GitHub Actions configurations
- Learn CI/CD best practices through comparison

## CI/CD Workflow

### Automated Pipeline Flow
```
Code Push → Checkout → Install Dependencies → Run Tests → Build → Deploy
```

### Workflow Triggers
- **Primary**: Push to `main` branch
- **Optional**: Pull request events
- **Manual**: Workflow dispatch (if configured)

### Pipeline Components

#### 1. Source Control Integration
- Automatic checkout from GitHub repository
- Access to all project files and history
- Branch-specific configurations

#### 2. Dependency Management
- Automated npm install
- Package.json parsing
- Node_modules generation
- Dependency caching (if configured)

#### 3. Test Automation
- Runs test suite automatically
- Provides immediate feedback
- Prevents broken code deployment
- Ensures code quality

#### 4. Build Process
- Creates production artifacts
- Generates static HTML in `dist/` directory
- Optimizes assets for deployment
- Prepares deployment package

#### 5. Deployment Stage
- Automated deployment to hosting platform
- Uses secure authentication (PAT)
- Updates live application
- Provides deployment feedback

## Key Features

### 1. Continuous Integration
- **Automated Testing**: Every commit triggers tests
- **Build Validation**: Ensures code compiles successfully
- **Immediate Feedback**: Developers know instantly if changes break the build
- **Quality Gates**: Failed tests prevent deployment

### 2. Continuous Deployment
- **Automatic Deployment**: Successful builds deploy automatically
- **No Manual Steps**: Eliminates deployment overhead
- **Fast Delivery**: Changes reach production quickly
- **Consistent Process**: Same deployment every time

### 3. GitHub Actions Integration
- **Cloud-Based**: No local infrastructure required
- **Scalable**: Handles multiple concurrent builds
- **Free for Public Repos**: Cost-effective solution
- **Extensive Marketplace**: Access to thousands of actions

### 4. Security Features
- **Encrypted Secrets**: Secure credential storage
- **No Hardcoded Credentials**: Tokens stored safely
- **Access Control**: GitHub permission management
- **Audit Trail**: Complete workflow history

### 5. Monitoring and Logging
- **Detailed Logs**: Step-by-step execution output
- **Status Badges**: Visual workflow status
- **Email Notifications**: Alert on failures
- **Workflow History**: Track all runs

## Project Structure
```
Experiment-26b/
├── index.js                 # Application entry point
├── package.json             # Dependencies and scripts
└── desc.txt                 # Original description (to be replaced)
```

### Expected Additional Files (for full CI/CD setup)
```
├── .github/
│   └── workflows/
│       └── ci-cd.yml        # GitHub Actions workflow
├── dist/                    # Build output directory (generated)
├── node_modules/            # Dependencies (generated)
└── README.md                # Documentation
```

## Application Code

### index.js
```javascript
console.log("🚀 CI/CD Demo running successfully!");
```

Simple demonstration application that confirms successful execution.

### package.json Configuration

#### Project Metadata
- **Name**: ci-cd-demo
- **Version**: 1.0.0
- **Author**: Dhamanpreet Singh
- **License**: MIT

#### Scripts

##### `start` - Run Application
```bash
npm start
```
Executes the Node.js application using `node index.js`

##### `test` - Run Tests
```bash
npm test
```
Placeholder test command that always passes (✅ All tests passed!)

##### `build` - Create Production Build
```bash
npm run build
```
- Creates `dist/` directory
- Generates `index.html` with build confirmation
- Prepares artifacts for deployment

## GitHub Actions Workflow

### Basic Workflow Structure

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main

jobs:
  build-test-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          
      - name: Install dependencies
        run: npm install
        
      - name: Run tests
        run: npm test
        
      - name: Build project
        run: npm run build
        
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Workflow Components

#### Trigger Configuration
```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

#### Job Configuration
```yaml
jobs:
  build-test-deploy:
    runs-on: ubuntu-latest
    timeout-minutes: 10
```

#### Environment Setup
- Latest Ubuntu runner
- Node.js 16+ installation
- npm configuration
- Clean workspace

## Setup Guide

### Prerequisites
1. **GitHub Account**: Free or paid plan
2. **Git**: Installed locally
3. **Node.js**: Version 14+ recommended
4. **npm**: Comes with Node.js
5. **Text Editor**: VS Code, Sublime, etc.

### Initial Setup Steps

#### 1. Repository Creation
```bash
# Create repository on GitHub
# Clone to local machine
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

#### 2. Add Project Files
```bash
# Copy from Experiment-26b
cp -r Experiment-26b/* .

# Or initialize new project
npm init -y
```

#### 3. Create Workflow File
```bash
mkdir -p .github/workflows
touch .github/workflows/ci-cd.yml
```

Edit `ci-cd.yml` with your workflow configuration.

#### 4. Configure Secrets

**Generate Personal Access Token:**
1. GitHub Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token
4. Select scopes: `repo`, `workflow`
5. Copy token immediately

**Add to Repository:**
1. Repository Settings → Secrets and variables → Actions
2. New repository secret
3. Name: `GITHUB_TOKEN` or custom name
4. Value: Your PAT
5. Add secret

#### 5. Enable GitHub Pages (if deploying to Pages)
1. Repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: `gh-pages`
4. Folder: `/ (root)`
5. Save

#### 6. Push to GitHub
```bash
git add .
git commit -m "Initial commit with CI/CD"
git push origin main
```

#### 7. Monitor Workflow
- Go to Actions tab
- View running workflow
- Check each step's logs
- Verify successful completion

### Testing the Pipeline

#### Trigger a Build
```bash
# Make any change
echo "# CI/CD Demo" > README.md

# Commit and push
git add README.md
git commit -m "Add README"
git push origin main
```

#### View Results
1. **Actions Tab**: See workflow execution
2. **Workflow Logs**: Detailed step output
3. **Deployment**: Check live site (if applicable)

## Local Development

### Setup Local Environment
```bash
# Navigate to project
cd Experiment-26b

# Install dependencies
npm install

# Run tests
npm test

# Run build
npm run build

# Start application
npm start
```

### Development Workflow
1. Make code changes
2. Test locally: `npm test`
3. Build locally: `npm run build`
4. Verify output in `dist/`
5. Commit and push
6. CI/CD pipeline runs automatically

## Deployment Options

### Option 1: GitHub Pages
- Free hosting
- HTTPS by default
- Custom domain support
- Ideal for static sites

### Option 2: Netlify
```yaml
- name: Deploy to Netlify
  uses: netlify/actions/cli@master
  with:
    args: deploy --prod --dir=dist
  env:
    NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
    NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
```

### Option 3: Vercel
```yaml
- name: Deploy to Vercel
  uses: amondnet/vercel-action@v20
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.ORG_ID }}
    vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### Option 4: AWS S3
```yaml
- name: Deploy to S3
  uses: jakejarvis/s3-sync-action@master
  with:
    args: --delete
  env:
    AWS_S3_BUCKET: ${{ secrets.AWS_S3_BUCKET }}
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    SOURCE_DIR: 'dist'
```

## Comparison: 26a vs 26b

### Similarities
- Both use GitHub Actions
- Same core application code
- Identical npm scripts
- Similar CI/CD principles
- PAT authentication

### Potential Differences
- **Deployment Target**: Different hosting platforms
- **Workflow Configuration**: Varied step implementations
- **Branch Strategy**: Different branch policies
- **Environment Variables**: Different configurations
- **Optimization Techniques**: Various caching strategies

### Use Cases
- **26a**: Learn basic GitHub Pages deployment
- **26b**: Explore alternative implementations
- **Both**: Understand CI/CD variations

## Advanced Features

### 1. Matrix Builds
Test across multiple Node versions:
```yaml
strategy:
  matrix:
    node-version: [14, 16, 18]
```

### 2. Conditional Deployment
```yaml
- name: Deploy to production
  if: github.ref == 'refs/heads/main'
  run: npm run deploy
```

### 3. Environment Secrets
```yaml
environment:
  name: production
  url: https://your-app.com
```

### 4. Artifact Upload
```yaml
- name: Upload artifacts
  uses: actions/upload-artifact@v3
  with:
    name: build
    path: dist/
```

### 5. Cache Dependencies
```yaml
- name: Cache node modules
  uses: actions/cache@v3
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

## Monitoring and Debugging

### Workflow Status
- **Success**: ✅ Green checkmark
- **Failure**: ❌ Red X
- **In Progress**: 🟡 Yellow circle
- **Cancelled**: ⚫ Grey circle

### Common Issues

#### Issue 1: Tests Failing
```bash
# Run locally to debug
npm test

# Check test output
# Fix failing tests
# Commit and push
```

#### Issue 2: Build Errors
```bash
# Run build locally
npm run build

# Check error messages
# Verify dependencies
# Fix configuration
```

#### Issue 3: Deployment Fails
- Verify PAT validity
- Check repository permissions
- Ensure deployment target is configured
- Review deployment logs

#### Issue 4: Workflow Not Triggering
- Verify workflow file location
- Check YAML syntax
- Ensure Actions are enabled
- Verify branch name matches

### Debugging Tips
1. **Check Logs**: Always review workflow logs first
2. **Test Locally**: Reproduce issues on local machine
3. **Validate YAML**: Use YAML validators
4. **Check Permissions**: Verify PAT and repository access
5. **Read Documentation**: GitHub Actions docs are comprehensive

## Best Practices

### 1. Version Control
- Use `.gitignore` for `node_modules/` and `dist/`
- Commit workflow files
- Tag releases appropriately

### 2. Security
- Never commit tokens or secrets
- Use repository secrets for sensitive data
- Rotate PATs regularly
- Follow principle of least privilege

### 3. Workflow Efficiency
- Cache dependencies
- Use matrix builds sparingly
- Optimize build steps
- Set appropriate timeouts

### 4. Code Quality
- Write meaningful tests
- Use linting tools
- Follow coding standards
- Document changes

### 5. Monitoring
- Set up notifications
- Monitor build times
- Track success rates
- Review failed builds promptly

## Learning Objectives

After completing this experiment, you should understand:
- CI/CD pipeline fundamentals
- GitHub Actions workflow syntax
- Automated testing integration
- Deployment automation
- Secret management
- DevOps best practices
- Workflow debugging techniques

## Real-World Applications
- **Web Applications**: Automated frontend deployments
- **APIs**: Backend service deployments
- **Documentation**: Auto-generated docs hosting
- **Static Sites**: Blog and portfolio deployments
- **Libraries**: npm package publishing
- **Mobile Apps**: Build automation

## Cost Considerations

### GitHub Actions (Public Repositories)
- **Free**: 2,000 minutes/month
- **Linux runners**: 1x consumption rate
- **Windows runners**: 2x consumption rate
- **macOS runners**: 10x consumption rate

### GitHub Actions (Private Repositories)
- **Free Tier**: 2,000 minutes/month
- **Additional**: $0.008 per minute (Linux)

### Storage
- **Artifacts**: 500 MB free
- **Retention**: 90 days default

## Future Enhancements

### Immediate Improvements
- Add real unit tests
- Implement integration tests
- Add code coverage reporting
- Include linting and formatting

### Advanced Features
- Multi-environment deployments (staging, production)
- Database migrations
- Performance testing
- Visual regression testing
- Automated version bumping
- Changelog generation
- Slack/Discord notifications

### Scalability
- Implement Docker containers
- Add Kubernetes deployments
- Set up monitoring and alerting
- Implement blue-green deployments
- Add rollback capabilities

## Troubleshooting Reference

### Quick Fixes

**Workflow not running?**
```yaml
# Verify trigger syntax
on:
  push:
    branches: [main]  # Check branch name
```

**Dependencies not installing?**
```yaml
# Clear cache
- name: Clear npm cache
  run: npm cache clean --force
```

**Build failing?**
```bash
# Check Node version compatibility
node --version
npm --version
```

**Deployment not working?**
```yaml
# Verify token usage
github_token: ${{ secrets.GITHUB_TOKEN }}
# Check secret name matches
```

## Additional Resources

### Documentation
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)

### Tutorials
- [GitHub Actions Quickstart](https://docs.github.com/en/actions/quickstart)
- [CI/CD Best Practices](https://docs.github.com/en/actions/guides)
- [Deployment Guides](https://docs.github.com/en/actions/deployment)

### Community
- [GitHub Community Forum](https://github.community/)
- [Stack Overflow - GitHub Actions](https://stackoverflow.com/questions/tagged/github-actions)
- [Reddit - r/github](https://www.reddit.com/r/github/)

## License
MIT License - For educational and learning purposes

## Author
Dhamanpreet Singh  
Full Stack Development Course

## Acknowledgments
- GitHub Actions team
- Open-source community
- Node.js community
- DevOps practitioners

## Conclusion
This experiment provides hands-on experience with CI/CD automation using GitHub Actions. By comparing implementations (26a vs 26b), developers gain deeper understanding of workflow configurations, deployment strategies, and DevOps best practices. The knowledge gained here is directly applicable to real-world software development projects.
