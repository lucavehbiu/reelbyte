# ReelByte Deployment Guide

## Architecture

- **Frontend:** Cloudflare Pages (React/Vite)
- **Backend:** Heroku (FastAPI/Python)
- **Database:** Heroku Postgres
- **Cache:** Heroku Redis

## Frontend Deployment (Cloudflare Pages)

### Prerequisites
- Cloudflare account
- GitHub repository connected

### Steps

1. **Go to Cloudflare Dashboard**
   - Navigate to Pages
   - Click "Create a project"
   - Connect to your GitHub repository

2. **Configure Build Settings**
   ```
   Build command: npm run build
   Build output directory: dist
   Root directory: frontend
   ```

3. **Set Environment Variables in Cloudflare Pages**
   ```
   VITE_API_URL=https://your-backend-app.herokuapp.com/v1
   ```

4. **Deploy**
   - Cloudflare will automatically build and deploy
   - Every push to main will trigger a new deployment
   - Every PR will get a preview deployment

### Custom Domain (Optional)
1. Go to your Pages project settings
2. Add custom domain (e.g., www.reelbyte.com)
3. Update DNS records as instructed

## Backend Deployment (Heroku)

### Prerequisites
- Heroku account
- Heroku CLI installed: `brew install heroku/brew/heroku`

### Steps

1. **Login to Heroku**
   ```bash
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   heroku create reelbyte-api
   ```

3. **Add Buildpacks (for monorepo)**
   ```bash
   heroku buildpacks:add https://github.com/timanovsky/subdir-heroku-buildpack
   heroku buildpacks:add heroku/python
   heroku config:set PROJECT_PATH=backend
   ```

4. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:essential-0
   ```

5. **Add Redis**
   ```bash
   heroku addons:create heroku-redis:mini
   ```

6. **Set Environment Variables**
   ```bash
   heroku config:set \
     SECRET_KEY="your-super-secret-key-change-this" \
     JWT_SECRET_KEY="your-jwt-secret-key-change-this" \
     ENVIRONMENT=production \
     CORS_ORIGINS="https://reelbyte.pages.dev,https://www.reelbyte.com" \
     SENDGRID_API_KEY="your-sendgrid-api-key" \
     FROM_EMAIL="noreply@reelbyte.com" \
     CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name" \
     CLOUDINARY_API_KEY="your-cloudinary-api-key" \
     CLOUDINARY_API_SECRET="your-cloudinary-api-secret" \
     MOLLIE_API_KEY="your-mollie-api-key"
   ```

7. **Deploy**
   ```bash
   git push heroku main
   ```

8. **Run Database Migrations**
   ```bash
   heroku run "cd backend && alembic upgrade head"
   ```

9. **Seed Database (Optional)**
   ```bash
   heroku run "cd backend && python -m database.seeds.seed_all"
   ```

10. **Check Logs**
    ```bash
    heroku logs --tail
    ```

### Update CORS Origins

After deploying frontend to Cloudflare Pages, update the backend CORS origins:

```bash
heroku config:set CORS_ORIGINS="https://your-pages-url.pages.dev,https://www.reelbyte.com"
```

## Database Management

### View Database Info
```bash
heroku pg:info
```

### Connect to Database
```bash
heroku pg:psql
```

### Backup Database
```bash
heroku pg:backups:capture
heroku pg:backups:download
```

### Run Migrations
```bash
heroku run "cd backend && alembic upgrade head"
```

### Rollback Migration
```bash
heroku run "cd backend && alembic downgrade -1"
```

## Monitoring

### View Logs
```bash
# Backend
heroku logs --tail

# Errors only
heroku logs --tail --source app
```

### Check Dyno Status
```bash
heroku ps
```

### Restart Dynos
```bash
heroku restart
```

## Scaling

### Scale Web Dynos
```bash
heroku ps:scale web=1
```

### Upgrade Database
```bash
heroku addons:upgrade heroku-postgresql:standard-0
```

## CI/CD

Both platforms support automatic deployments:

- **Cloudflare Pages:** Auto-deploys on every push to main
- **Heroku:** Auto-deploys on every push to main (if enabled)

### Enable Heroku Auto-Deploy
1. Go to Heroku Dashboard
2. Select your app
3. Go to "Deploy" tab
4. Connect to GitHub
5. Enable "Automatic deploys from main"

## Troubleshooting

### Frontend Not Loading
- Check Cloudflare Pages build logs
- Verify `VITE_API_URL` is set correctly
- Check browser console for errors

### Backend Errors
- Check Heroku logs: `heroku logs --tail`
- Verify all environment variables are set
- Check database connection
- Verify migrations are up to date

### Database Connection Issues
- Check `DATABASE_URL` is set: `heroku config:get DATABASE_URL`
- Ensure asyncpg is installed
- Verify connection string format

### CORS Errors
- Update `CORS_ORIGINS` in Heroku config
- Include both main domain and preview domains
- Restart dynos after config changes

## Cost Estimates

### Free Tier
- **Cloudflare Pages:** Free (500 builds/month)
- **Heroku:** Free tier no longer available

### Paid Tier (Minimal)
- **Cloudflare Pages:** Free
- **Heroku Eco Dyno:** $5/month
- **Heroku Postgres Essential-0:** $5/month
- **Heroku Redis Mini:** $3/month
- **Total:** ~$13/month

### Production Tier
- **Cloudflare Pages:** Free (or $20/month for more builds)
- **Heroku Standard Dynos:** $25/month
- **Heroku Postgres Standard-0:** $50/month
- **Heroku Redis Premium-0:** $15/month
- **Total:** ~$90/month
