# Deployment Guide

This guide provides instructions for deploying Family Hub to Cloudflare Pages and other platforms.

## 🚀 Cloudflare Pages Deployment

### Prerequisites

- Cloudflare account (free tier is sufficient)
- Git repository (GitHub, GitLab, or Bitbucket)
- Your code pushed to the repository

### Step 1: Configure Cloudflare Pages

1. **Go to Cloudflare Dashboard**:
   - Navigate to "Workers & Pages"
   - Click "Create application"
   - Select "Pages" tab
   - Click "Connect to Git"

2. **Connect Repository**:
   - Authorize Cloudflare to access your Git account
   - Select your repository
   - Click "Begin setup"

3. **Configure Build Settings**:
   - **Project name**: `family-hub` (or your preferred name)
   - **Production branch**: `main`
   - **Framework preset**: Nuxt.js
   - **Build command**: `npm run build`
   - **Build output directory**: `.output/public`
   - **Environment variables** (click "Add variable"):
     - `NODE_VERSION` = `18` or `20`
     - `NITRO_PRESET` = `cloudflare-pages`
     - `JWT_SECRET` = `your-secure-random-secret-here`
4. Click "Save and Deploy"

### Step 2: Add D1 Database (Production)

After your first deployment:

1. **Create D1 Database**:

   ```bash
   wrangler d1 create homehub-db
   ```

   Save the `database_id` from the output.

2. **Configure D1 Binding**:
   - Go to your Pages project in Cloudflare Dashboard
   - Click "Settings" → "Functions"
   - Under "D1 database bindings", click "Add binding"
   - **Variable name**: `DB`
   - **D1 database**: Select `homehub-db`
   - Click "Save"

3. **Initialize Database Schema**:

   ```bash
   wrangler d1 execute homehub-db --remote --file=./prisma/migrations/schema.sql
   ```

4. **Seed Production Database**:

   ```bash
   wrangler d1 execute homehub-db --remote --file=./prisma/seed.sql
   ```

5. **Redeploy** to pick up the D1 binding

### Fixing the `crypto.hash is not a function` Error

If you encounter this error during build, it means Cloudflare's build environment is missing the Node.js crypto API. To fix:

1. **Set the `NITRO_PRESET` environment variable** in Cloudflare Pages:
   - Go to Settings → Environment variables
   - Add: `NITRO_PRESET` = `cloudflare-pages`

2. **Set the `NODE_VERSION`**:
   - Add: `NODE_VERSION` = `20`

3. **Redeploy** the project

The updated `nuxt.config.ts` already handles this by using `process.env.NITRO_PRESET` which defaults to `node-server` locally but uses `cloudflare-pages` when deployed.

### Step 3: Verify Deployment

1. Visit your deployment URL (e.g., `https://family-hub.pages.dev`)
2. Login with seeded credentials:
   - Email: `admin@family-hub.com`
   - Password: `admin123`
3. Test all features:
   - Create calendar event
   - Add travel plan
   - Post news update

### Step 4: Custom Domain (Optional)

1. Go to your Pages project → "Custom domains"
2. Click "Set up a custom domain"
3. Enter your domain
4. Update DNS records as instructed
5. Wait for SSL certificate (automatic)

## 🔧 Alternative Platforms

### Vercel

1. **Install Vercel CLI**:

   ```bash
   npm i -g vercel
   ```

2. **Deploy**:

   ```bash
   vercel
   ```

3. **Set Environment Variables**:
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add `JWT_SECRET`
   - Add `DATABASE_URL` (use Vercel Postgres or external DB)

**Note**: You'll need to use a different database (Vercel Postgres, PlanetScale, etc.) instead of SQLite.

### Netlify

1. **Install Netlify CLI**:

   ```bash
   npm i -g netlify-cli
   ```

2. **Deploy**:

   ```bash
   netlify deploy --prod
   ```

3. **Set Environment Variables**:
   - Dashboard → Site settings → Environment variables
   - Add `JWT_SECRET`
   - Add `DATABASE_URL`

**Note**: SQLite won't work on Netlify. Use an external database service.

### VPS / Docker Deployment

For VPS deployment with Docker:

1. **Create `Dockerfile`**:

   ```dockerfile
   FROM node:20-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["node", ".output/server/index.mjs"]
   ```

2. **Build and run**:
   ```bash
   docker build -t family-hub .
   docker run -p 3000:3000 -e JWT_SECRET=your-secret family-hub
   ```

## 🔐 Security Checklist

Before going live:

- [ ] Set a strong, random `JWT_SECRET` (minimum 32 characters)
- [ ] Change default admin password
- [ ] Delete test users in production
- [ ] Enable HTTPS only
- [ ] Set up rate limiting
- [ ] Configure CORS properly
- [ ] Review and update API access controls
- [ ] Set up monitoring and alerts
- [ ] Regular database backups
- [ ] Update all dependencies to latest secure versions

## 📊 Environment Variables

### Required for All Platforms

| Variable       | Description            | Example                     | Where to Set       |
| -------------- | ---------------------- | --------------------------- | ------------------ |
| `JWT_SECRET`   | Secret for JWT signing | `your-random-secret-string` | Platform dashboard |
| `NODE_VERSION` | Node.js version        | `20`                        | Build settings     |

### Cloudflare Pages Specific

| Variable       | Description         | Value              |
| -------------- | ------------------- | ------------------ |
| `NITRO_PRESET` | Deployment target   | `cloudflare-pages` |
| `DB`           | D1 database binding | (via dashboard)    |

### Generate Secure JWT_SECRET

```bash
# On macOS/Linux
openssl rand -base64 32

# Or with Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 🐛 Troubleshooting

### Build Fails with "crypto.hash is not a function"

**Solution**: Add `NITRO_PRESET=cloudflare-pages` to environment variables

### Database Connection Fails

**Solution**:

1. Verify D1 binding is configured correctly
2. Check database has tables: `wrangler d1 execute homehub-db --remote --command="SELECT name FROM sqlite_master WHERE type='table'"`
3. Ensure schema and seed ran successfully

### Authentication Not Working

**Solution**:

1. Verify `JWT_SECRET` is set
2. Check browser cookies are enabled
3. Ensure user exists in database
4. Clear browser cache/cookies

### 500 Internal Server Error

**Solution**:

1. Check deployment logs in Cloudflare Dashboard
2. Verify all environment variables are set
3. Check database connection
4. Review server API endpoints for errors

## 📈 Monitoring

### Cloudflare Pages

View logs and metrics:

- Dashboard → Your Project → Analytics
- Real-time logs: `wrangler pages deployment tail`

### Database Backups

```bash
# Export D1 database
wrangler d1 export homehub-db --remote --output=backup.sql

# Import backup
wrangler d1 execute homehub-db --remote --file=backup.sql
```

## 💰 Cost Estimation

### Cloudflare Free Tier

- **Pages**: Unlimited requests, 500 builds/month
- **D1**: 5 GB storage, 5M reads/day, 100K writes/day
- **Workers**: 100K requests/day

For a small family (5-10 users), the free tier is sufficient.

## 📚 Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
- [Nuxt Deployment](https://nuxt.com/docs/getting-started/deployment)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

## 🆘 Getting Help

- Check deployment logs for specific errors
- Review Cloudflare Pages documentation
- Open an issue on the GitHub repository
- Join Nuxt Discord for community support

---

Happy deploying! 🚀
