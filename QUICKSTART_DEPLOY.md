# Quick Start: Deploy ReelByte

## 🚀 Deploy in 10 Minutes

### 1. Deploy Frontend to Cloudflare Pages (5 min)

1. **Go to Cloudflare Pages Dashboard**
   - Visit: https://dash.cloudflare.com/
   - Click "Pages" → "Create a project"
   - Connect to your GitHub repository

2. **Configure Build**
   ```
   Framework preset: None (or Vite)
   Build command: npm run build
   Build output directory: dist
   Root directory: frontend
   Node version: 20
   ```

3. **Add Environment Variable**
   - Go to Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-app-name.herokuapp.com/v1`
   - (You'll get the Heroku URL in step 2, then come back here)

4. **Deploy!**
   - Click "Save and Deploy"
   - Wait 2-3 minutes
   - Your frontend will be live at: `https://your-project.pages.dev`

### 2. Deploy Backend to Heroku (5 min)

1. **Install Heroku CLI** (if not installed)
   ```bash
   brew install heroku/brew/heroku
   ```

2. **Login**
   ```bash
   heroku login
   ```

3. **Create App & Deploy**
   ```bash
   # Create app
   heroku create reelbyte-api

   # Add buildpacks for monorepo
   heroku buildpacks:add https://github.com/timanovsky/subdir-heroku-buildpack
   heroku buildpacks:add heroku/python
   heroku config:set PROJECT_PATH=backend

   # Add database
   heroku addons:create heroku-postgresql:essential-0

   # Add Redis (optional for now)
   # heroku addons:create heroku-redis:mini

   # Set required environment variables
   heroku config:set \
     SECRET_KEY="$(openssl rand -hex 32)" \
     JWT_SECRET_KEY="$(openssl rand -hex 32)" \
     ENVIRONMENT=production

   # Deploy!
   git push heroku main

   # Run migrations
   heroku run "cd backend && alembic upgrade head"

   # Check if it's running
   heroku open
   ```

4. **Get your backend URL**
   ```bash
   heroku info
   # Look for "Web URL": https://reelbyte-api-xxxxx.herokuapp.com
   ```

5. **Update CORS** (use the frontend URL from step 1)
   ```bash
   heroku config:set CORS_ORIGINS="https://your-project.pages.dev,https://www.yourdomain.com"
   ```

### 3. Update Frontend Environment Variable

1. Go back to Cloudflare Pages Settings
2. Update `VITE_API_URL` to your Heroku backend URL
3. Redeploy (or it will auto-redeploy)

## ✅ Done!

Your app is now live:
- **Frontend:** `https://your-project.pages.dev`
- **Backend API:** `https://reelbyte-api-xxxxx.herokuapp.com`
- **API Docs:** `https://reelbyte-api-xxxxx.herokuapp.com/docs`

## 🔧 Optional: Add Services

### SendGrid (Email)
```bash
heroku config:set \
  SENDGRID_API_KEY="your-key" \
  FROM_EMAIL="noreply@yourdomain.com"
```

### Cloudinary (Media Storage)
```bash
heroku config:set \
  CLOUDINARY_CLOUD_NAME="your-cloud-name" \
  CLOUDINARY_API_KEY="your-api-key" \
  CLOUDINARY_API_SECRET="your-api-secret"
```

### Mollie (Payments)
```bash
heroku config:set MOLLIE_API_KEY="your-mollie-key"
```

## 📊 Monitor Your App

```bash
# View logs
heroku logs --tail

# Check status
heroku ps

# Run database migrations
heroku run "cd backend && alembic upgrade head"

# Seed database (optional)
heroku run "cd backend && python -m database.seeds.seed_all"
```

## 💰 Costs

- **Cloudflare Pages:** FREE
- **Heroku Eco Dyno:** $5/month
- **Heroku Postgres Essential:** $5/month
- **Total:** ~$10/month

## 🐛 Troubleshooting

### Frontend not connecting to backend?
1. Check `VITE_API_URL` in Cloudflare Pages settings
2. Check CORS_ORIGINS in Heroku: `heroku config:get CORS_ORIGINS`
3. View browser console for errors

### Backend errors?
```bash
heroku logs --tail
```

### Database issues?
```bash
heroku pg:info
heroku pg:psql  # Connect to database directly
```

## 🎉 What's Next?

1. **Add Custom Domain** in Cloudflare Pages settings
2. **Set up monitoring** with Heroku metrics
3. **Add backups:** `heroku pg:backups:schedule --at '02:00 America/Los_Angeles' DATABASE_URL`
4. **Enable auto-deploy** from GitHub in both platforms

Need more details? See [DEPLOYMENT.md](./DEPLOYMENT.md)
