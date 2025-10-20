# Deployment Guide

This guide provides detailed instructions for deploying Family Hub to Cloudflare Pages with D1 database.

## Prerequisites

- Cloudflare account (free tier is sufficient)
- Wrangler CLI installed: `npm install -g wrangler`
- Git repository (GitHub, GitLab, or Bitbucket)
- Node.js 18+ installed locally

## Step 1: Prepare Your Cloudflare Account

### 1.1 Login to Wrangler

```bash
wrangler login
```

This will open a browser window to authenticate with your Cloudflare account.

### 1.2 Get Your Account ID

```bash
wrangler whoami
```

Note your Account ID for later use.

## Step 2: Create Cloudflare D1 Database

### 2.1 Create the Database

```bash
wrangler d1 create family-hub-db
```

This will output something like:
```
✅ Successfully created DB 'family-hub-db'!
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**Save this database_id** - you'll need it for configuration.

### 2.2 Update Configuration

1. Copy the example wrangler config:
   ```bash
   cp wrangler.toml.example wrangler.toml
   ```

2. Edit `wrangler.toml` and replace `your-database-id-here` with your actual database ID:
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "family-hub-db"
   database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
   ```

### 2.3 Initialize Database Schema

Execute the migration on your remote D1 database:

```bash
wrangler d1 execute family-hub-db --remote --file=./prisma/migrations/schema.sql
```

Verify the schema was created:
```bash
wrangler d1 execute family-hub-db --remote --command="SELECT name FROM sqlite_master WHERE type='table';"
```

## Step 3: Build and Test Locally

### 3.1 Generate Prisma Client

```bash
npm run db:generate
```

### 3.2 Build the Application

```bash
npm run build
```

Ensure there are no build errors. The output will be in `.output/public/`.

### 3.3 Test Locally with Wrangler (Optional)

```bash
wrangler pages dev .output/public
```

This simulates the Cloudflare Pages environment locally.

## Step 4: Deploy to Cloudflare Pages

### Option A: Deploy via Wrangler CLI

```bash
# First deployment
wrangler pages deploy .output/public --project-name=family-hub

# Subsequent deployments
npm run deploy
```

### Option B: Deploy via Cloudflare Dashboard (Recommended)

1. **Push code to Git repository** (GitHub, GitLab, or Bitbucket)

2. **Go to Cloudflare Dashboard**:
   - Navigate to "Workers & Pages"
   - Click "Create application"
   - Select "Pages" tab
   - Click "Connect to Git"

3. **Connect Repository**:
   - Authorize Cloudflare to access your Git account
   - Select your repository
   - Click "Begin setup"

4. **Configure Build Settings**:
   - **Project name**: `family-hub`
   - **Production branch**: `main`
   - **Framework preset**: Nuxt.js
   - **Build command**: `npm run build`
   - **Build output directory**: `.output/public`
   - **Node version**: 18 or higher

5. **Add Environment Variables**:
   Click "Environment variables" and add:
   - Key: `JWT_SECRET`
   - Value: A secure random string (generate with `openssl rand -base64 32`)
   - Apply to: Production and Preview

6. **Save and Deploy**:
   - Click "Save and Deploy"
   - Wait for the build to complete (usually 2-5 minutes)

## Step 5: Configure D1 Binding

After the first deployment, you need to bind the D1 database:

### Via Cloudflare Dashboard:

1. Go to your Pages project in Cloudflare Dashboard
2. Click "Settings" tab
3. Scroll to "Functions" section
4. Click "D1 database bindings"
5. Click "Add binding"
   - **Variable name**: `DB`
   - **D1 database**: Select `family-hub-db`
6. Click "Save"

### Via Wrangler (if deploying via CLI):

The binding is automatically configured from your `wrangler.toml` file.

## Step 6: Seed Production Database

### 6.1 Prepare Seed Script for Remote

Create a temporary file `seed-remote.sql` with your seed data:

```sql
-- Insert admin user (password: admin123)
INSERT INTO User (id, name, email, password, role, createdAt, updatedAt)
VALUES (
  lower(hex(randomblob(16))),
  'Admin User',
  'admin@family-hub.com',
  '$2b$10$YourBcryptHashHere',
  'admin',
  datetime('now'),
  datetime('now')
);
```

**Note**: Generate bcrypt hashes locally first:
```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('admin123', 10).then(console.log)"
```

### 6.2 Execute Seed

```bash
wrangler d1 execute family-hub-db --remote --file=./seed-remote.sql
```

Alternatively, use the Cloudflare Dashboard SQL editor in the D1 section.

## Step 7: Verify Deployment

1. **Visit your deployment URL**: `https://family-hub.pages.dev` (or your custom domain)

2. **Test login** with seeded credentials

3. **Check functionality**:
   - Register a new user
   - Create calendar event
   - Add travel plan
   - Post news update

## Step 8: Set Up Custom Domain (Optional)

1. Go to your Pages project in Cloudflare Dashboard
2. Click "Custom domains" tab
3. Click "Set up a custom domain"
4. Enter your domain name
5. Follow DNS configuration instructions
6. Wait for SSL certificate to be issued (usually automatic)

## Security Checklist

Before going live:

- [ ] Set a strong, random `JWT_SECRET` (minimum 32 characters)
- [ ] Change default admin password
- [ ] Delete test users in production
- [ ] Enable Cloudflare Web Application Firewall (WAF)
- [ ] Set up rate limiting in Cloudflare
- [ ] Review security headers in `nuxt.config.ts`
- [ ] Enable HTTPS only (automatic with Cloudflare Pages)
- [ ] Set up monitoring and alerts

## Environment Variables Reference

### Production Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `JWT_SECRET` | Secret for JWT signing | `your-random-secret-string` |
| `NODE_VERSION` | Node.js version | `18` or `20` |

### D1 Binding

| Variable | Value |
|----------|-------|
| `DB` | Binding to `family-hub-db` |

## Troubleshooting

### Build Fails

**Issue**: Build fails with module not found errors
**Solution**: 
- Ensure all dependencies are in `dependencies`, not `devDependencies`
- Clear build cache and redeploy

**Issue**: TypeScript errors during build
**Solution**:
- Run `npm run build` locally first to catch errors
- Fix type issues before deploying

### Database Connection Fails

**Issue**: Cannot connect to D1 database
**Solution**:
- Verify D1 binding is configured in Pages settings
- Check binding name matches `DB` in code
- Ensure database exists and has tables

**Issue**: Database queries return empty results
**Solution**:
- Verify migrations ran successfully
- Check data was seeded correctly
- Use Cloudflare Dashboard D1 SQL editor to inspect data

### Authentication Issues

**Issue**: Login fails with 401 errors
**Solution**:
- Verify `JWT_SECRET` is set in environment variables
- Check user exists in database with correct password hash
- Clear browser cookies and try again

**Issue**: Token expired errors
**Solution**:
- JWT tokens expire after 7 days by default
- Users need to log in again
- Consider implementing refresh tokens for longer sessions

### Deployment Takes Too Long

**Issue**: Deployment hangs or takes >10 minutes
**Solution**:
- Check build logs for errors
- Ensure `node_modules` is in `.gitignore`
- Verify build command is correct
- Try deploying via Wrangler CLI instead

## Monitoring and Maintenance

### View Logs

```bash
# View Pages deployment logs
wrangler pages deployment tail --project-name=family-hub

# View D1 database metrics
# Go to Cloudflare Dashboard > D1 > family-hub-db > Metrics
```

### Update Application

1. Make code changes locally
2. Test thoroughly: `npm run dev`
3. Commit and push to Git
4. Cloudflare Pages automatically redeploys

### Database Migrations

For schema changes:

1. Update `prisma/schema.prisma`
2. Generate migration: `npx prisma migrate dev --name migration_name`
3. Create SQL file from migration
4. Execute on remote: `wrangler d1 execute family-hub-db --remote --file=migration.sql`

### Backup Database

```bash
# Export database (creates backup.sql)
wrangler d1 export family-hub-db --remote --output=backup.sql
```

### Restore Database

```bash
# Import from backup
wrangler d1 execute family-hub-db --remote --file=backup.sql
```

## Cost Estimation

Cloudflare's free tier includes:
- **Pages**: Unlimited requests, 500 builds/month
- **D1**: 5 GB storage, 5M reads/day, 100K writes/day
- **Workers**: 100K requests/day

For a small family (5-10 users), the free tier should be sufficient.

## Next Steps

- Set up CI/CD pipeline for automated testing
- Implement email notifications for calendar events
- Add file upload functionality for travel documents
- Set up monitoring with Sentry or similar
- Configure backup automation
- Add mobile app or PWA support

## Support Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
- [Nuxt Deployment Guide](https://nuxt.com/deploy/cloudflare)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)

---

Need help? Open an issue on the GitHub repository.

