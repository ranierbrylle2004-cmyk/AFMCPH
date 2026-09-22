# Cloudflare Workers + D1 Setup Guide

## Prerequisites
1. Install Wrangler CLI: `npm install -g wrangler`
2. Login to Cloudflare: `wrangler login`

## Step 1: Create D1 Database
```bash
# Create the database
npx wrangler d1 create afmc-picklehub

# Copy the database_id from the output (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
```

## Step 2: Update wrangler.toml
Add the database_id to wrangler.toml:
```toml
[[d1_databases]]
binding = "DB"
database_name = "afmc-picklehub"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" # Replace with actual ID from step 1
```

## Step 3: Execute Schema
```bash
# Create tables and initial data (local)
npx wrangler d1 execute afmc-picklehub --file=schema.sql --local

# Create tables and initial data (production)
npx wrangler d1 execute afmc-picklehub --file=schema.sql --remote
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
const API_BASE = 'https://afmcph.your-subdomain.workers.dev/api';
```

## Development Workflow
```bash
# Terminal 1: Start Cloudflare Worker
npm run worker:dev

# Terminal 2: Start frontend
npm run dev

# Or run both together
npm run dev:all
```

## Database Management Commands
```bash
# List all D1 databases
npx wrangler d1 list

# Execute SQL commands (local)
npx wrangler d1 execute afmc-picklehub --command="SELECT * FROM users" --local

# Execute SQL commands (production)
npx wrangler d1 execute afmc-picklehub --command="SELECT * FROM users" --remote

# Backup database
npx wrangler d1 export afmc-picklehub --output=backup.sql
```

## Important Notes
- The Worker name in wrangler.toml must match your Cloudflare project name
- The database_id is required for production deployment
- Local development uses `--local` flag for D1 operations
- Production deployment uses `--remote` flag for D1 operations

## Benefits of This Setup
- **Ultra-fast edge routing** with Hono framework
- **Serverless SQLite** with Cloudflare D1
- **Global edge deployment** through Cloudflare Workers
- **Zero cold starts** for your API
- **Automatic scaling** without server management
- **Free tier** available for development