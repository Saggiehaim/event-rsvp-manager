# Deploying to GitHub Pages

This Event Hub application is configured for GitHub Pages deployment.

1. **Build the 



   npm run build
   ```

2. **The build output will be in the `dist` folder.**

3. **Deploy to GitHub Pages:**
   
   ### Option A: Using GitHub Actions (Recommended)
   
   Create `.github/workflows/deploy.yml`:
   
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
     workflow_dispatch:
   
   permissions:
     contents: read
     pages: write
     id-token: write
   
        
           
             cache: 'npm'
         - na
         
         
         - name: Setup Pages
         
           uses:
             path: './dist'
         - name: Deploy t
         
   
   - Go to your reposi
   - Push
   ### Option B: Manua
   1. Install gh-pages:
      npm
   
      ```json
        "
      ```
   3. Run:
      npm run de
   
      - G


- **Base path**: `./` (relative paths fo
- **.n
## 
Make sur
   - Go to your repository Settings → Pages
   - Under "Build and deployment", select "GitHub Actions" as the source
   - Push to main branch to trigger deployment
   
   ### Option B: Manual Deploy with gh-pages
   
   1. Install gh-pages:
      ```bash
      npm install -D gh-pages
      ```
   
   2. Add deploy script to package.json:
      ```json
      "scripts": {
        "deploy": "npm run build && gh-pages -d dist"
      }
      ```
   
   3. Run:
      ```bash
      npm run deploy
      ```
   
   4. Configure GitHub Pages:
      - Go to repository Settings → Pages
      - Select `gh-pages` branch as the source

## Configuration

The application is configured with:
- **Base path**: `./` (relative paths for GitHub Pages)
- **Build output**: `dist/` directory
- **.nojekyll**: Prevents Jekyll processing

## Repository Settings

Make sure to enable GitHub Pages in your repository:
1. Go to Settings → Pages
2. Choose your deployment method (GitHub Actions or branch)
3. Your site will be available at: `https://<username>.github.io/<repository>/`

## Notes

- The `.nojekyll` file ensures GitHub Pages serves your files correctly
- All assets use relative paths for portability
- The Spark runtime features (KV storage, LLM API) work in the browser
1. Go to Settings → Pages
2. Choose your deployment method (GitHub Actions or branch)
3. Your site will be available at: `https://<username>.github.io/<repository>/`

## Notes

- The `.nojekyll` file ensures GitHub Pages serves your files correctly
- All assets use relative paths for portability
- The Spark runtime features (KV storage, LLM API) work in the browser
