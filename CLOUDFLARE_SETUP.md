# Cloudflare Workers + D1 Setup Guide

## Prerequisites
1. Install Wrangler CLI: `npm install -g wrangler`
2. Login to Cloudflare: `wrangler login`

## Step 1: Create D1 Database
```bash
# Create the database
wrangler d1 create afmc-picklehub

# Copy the database_id from the output and update wrangler.toml
```

## Step 2: Update wrangler.toml
Replace `your-database-id` in wrangler.toml with the actual database ID from step 1:
```toml
[[d1_databases]]
binding = "DB"
database_name = "afmc-picklehub"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" # Your actual ID
```

## Step 3: Execute Schema
```bash
# Create tables and initial data
wrangler d1 execute afmc-picklehub --file=schema.sql
```

## Step 4: Local Development
```bash
# Start local development server
npm run worker:dev

# This will run on http://localhost:8787
```

## Step 5: Deploy to Production
```bash
# Deploy to Cloudflare Workers
npm run worker:deploy
```

## Step 6: Update Frontend API URL
After deployment, update the API_BASE in `src/utils/api.ts` with your production URL:
```typescript
const API_BASE = 'https://afmc-picklehub-api.your-subdomain.workers.dev/api';
```

## Database Management Commands
```bash
# List all D1 databases
wrangler d1 list

# Execute SQL commands
wrangler d1 execute afmc-picklehub --command="SELECT * FROM users"

# Open D1 console (interactive)
wrangler d1 execute afmc-picklehub --remote

# Backup database
wrangler d1 export afmc-picklehub --output=backup.sql
```

## Benefits of This Setup
- **Ultra-fast edge routing** with Hono framework
- **Serverless SQLite** with Cloudflare D1
- **Global edge deployment** through Cloudflare Workers
- **Zero cold starts** for your API
- **Automatic scaling** without server management
- **Free tier** available for development