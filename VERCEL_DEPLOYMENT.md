# Deploying SAHAYAK AI to Vercel

This repository has already been pre-configured for **seamless full-stack deployment on Vercel** using `vercel.json` and serverless API rewrites.

---

## 🚀 Recommended: Deploy directly via GitHub (Fastest & Easiest)

### Step 1: Push Code to a GitHub Repository
Open your terminal (or PowerShell) in the project directory:
```bash
cd C:\Users\hkumb\.gemini\antigravity\scratch\sahayak-ai

# Initialize Git (if not already initialized)
git init
git add .
git commit -m "Initial commit of SAHAYAK AI platform"

# Link to your GitHub repo and push
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/sahayak-ai.git
git push -u origin main
```

---

### Step 2: Import into Vercel
1. Go to [https://vercel.com](https://vercel.com) and log in.
2. Click **"Add New..."** → **"Project"**.
3. Under **"Import Git Repository"**, select your `sahayak-ai` repository and click **"Import"**.
4. In the configuration screen:
   - **Framework Preset**: Leave as **"Other"** (Vercel reads `vercel.json` automatically).
   - **Root Directory**: Leave as `./` (Root directory).
   - **Build and Output Settings**: Vercel automatically detects `vercel.json`:
     - Build Command: `npm --prefix frontend install && npm --prefix frontend run build`
     - Output Directory: `frontend/dist`
5. Click **"Deploy"**!

---

### Step 3: Deployment Verification
Once deployed (typically within 60–90 seconds):
- Your frontend will be live at `https://sahayak-ai-xxxx.vercel.app/`
- Your serverless API endpoints will be live at `https://sahayak-ai-xxxx.vercel.app/api/...`
- The React SPA client-side routing works on page refreshes (handled by `vercel.json`).

---

## ⚡ Option 2: Deploy using Vercel CLI (Command Line)

If you have the Vercel CLI installed:
```bash
# 1. Navigate to the project root
cd C:\Users\hkumb\.gemini\antigravity\scratch\sahayak-ai

# 2. Log in to Vercel (if not already logged in)
npx vercel login

# 3. Deploy to Preview
npx vercel

# 4. Deploy to Production
npx vercel --prod
```

---

## ⚙️ How Full-Stack Works on Vercel

1. **Frontend**: Vite compiles React into static assets served globally via Vercel's Edge CDN.
2. **REST API**: Any call to `/api/*` is automatically rewritten by `vercel.json` to the serverless function in `api/index.js`, which executes your Express backend.
3. **AI & Multilingual Fallback**: The Node backend in `backend/routes/aiProxy.js` contains a built-in intelligent NLP intent extractor and conversational response engine that runs directly in Vercel's serverless runtime without needing an external Python server.
4. **External FastAPI / Database (Optional)**:
   - If you want to connect a live remote PostgreSQL database, add the environment variable `DATABASE_URL` in your Vercel Project Settings (`Settings` → `Environment Variables`).
   - If you deploy the Python FastAPI microservice to Render or Railway, set `FASTAPI_URL=https://your-fastapi-service.onrender.com` in Vercel.
   - Without any environment variables, the platform runs in zero-config demo mode with all 11 schemes and 10 Pune partners preloaded!
