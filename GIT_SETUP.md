# Git Setup Instructions

## Initialize Git Repository

1. **Initialize git repository:**
   ```bash
   git init
   ```

2. **Add all files:**
   ```bash
   git add .
   ```

3. **Create initial commit:**
   ```bash
   git commit -m "Initial commit: PHEW Cafe POS System"
   ```

4. **Create a new repository on GitHub:**
   - Go to GitHub and create a new repository
   - Don't initialize with README, .gitignore, or license

5. **Add remote and push:**
   ```bash
   git remote add origin https://github.com/your-username/your-repo-name.git
   git branch -M main
   git push -u origin main
   ```

## Important Notes

- Make sure `.env` files are in `.gitignore` (they are)
- Never commit sensitive data like MongoDB URIs or JWT secrets
- Update `vercel.json` with your actual backend URL after deployment
- Update `DEPLOYMENT.md` with your actual URLs after deployment

