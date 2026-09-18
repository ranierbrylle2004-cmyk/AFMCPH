# Database Setup Instructions

## Option 1: PostgreSQL (Recommended for Production)

### Install PostgreSQL
1. Download and install PostgreSQL from https://www.postgresql.org/download/
2. During installation, set a password for the postgres user
3. Make sure PostgreSQL service is running

### Create Database
```bash
# Open psql command line
psql -U postgres

# Create database
CREATE DATABASE afmc_picklehub;

# Exit psql
\q
```

### Update .env file
Update the DATABASE_URL in your `.env` file with your actual PostgreSQL credentials:
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/afmc_picklehub
```

### Start the server
```bash
npm run server
```

## Option 2: Use Hyperdrive (Cloud Database)

If you want to use Hyperdrive's cloud database solution:

1. Sign up for Hyperdrive at https://hyperdrive.cloud
2. Create a new PostgreSQL database
3. Get your connection string from Hyperdrive dashboard
4. Update the DATABASE_URL in `.env` file:
```
DATABASE_URL=postgresql://user:password@your-hyperdrive-host:5432/database
```

## Option 3: Docker (Easiest Local Setup)

If you have Docker installed, you can run PostgreSQL in a container:

```bash
# Run PostgreSQL in Docker
docker run --name afmc-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=afmc_picklehub -p 5432:5432 -d postgres:15

# Update .env with these credentials:
# DATABASE_URL=postgresql://postgres:password@localhost:5432/afmc_picklehub
```

## Testing the Setup

Once your database is running:

1. Start the API server:
```bash
npm run server
```

2. In another terminal, start the frontend:
```bash
npm run dev
```

3. Test registration and login to verify database connectivity

## Troubleshooting

- **Connection Refused**: Make sure PostgreSQL is running and accessible
- **Authentication Failed**: Check your database credentials in .env file
- **Database Not Found**: Make sure you created the database named `afmc_picklehub`