import pg from 'pg';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const initializeDatabase = async () => {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        skill_level VARCHAR(50),
        avatar VARCHAR(255) DEFAULT '👤',
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create admin user if not exists
    const adminExists = await pool.query('SELECT id FROM users WHERE email = $1', ['admin']);
    if (adminExists.rows.length === 0) {
      const adminId = randomUUID();
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin2026';
      await pool.query(
        `INSERT INTO users (id, email, password, is_admin) VALUES ($1, $2, $3, $4)`,
        [adminId, 'admin', adminPassword, true]
      );
      console.log('Admin user created');
    }

    // Create bookings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) REFERENCES users(id),
        court VARCHAR(100) NOT NULL,
        sport VARCHAR(50) NOT NULL,
        date VARCHAR(100) NOT NULL,
        time VARCHAR(50) NOT NULL,
        price VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create posts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id VARCHAR(36) PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        body TEXT NOT NULL,
        author VARCHAR(255) NOT NULL,
        avatar VARCHAR(255) DEFAULT '👤',
        date VARCHAR(100) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        likes INTEGER DEFAULT 0,
        comments INTEGER DEFAULT 0,
        pinned BOOLEAN DEFAULT FALSE
      )
    `);

    // Create conversations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        avatar VARCHAR(255) DEFAULT '👤',
        last_msg TEXT,
        time VARCHAR(50),
        unread INTEGER DEFAULT 0,
        is_support BOOLEAN DEFAULT FALSE,
        resolved BOOLEAN DEFAULT FALSE,
        is_admin BOOLEAN DEFAULT FALSE
      )
    `);

    // Create messages table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id VARCHAR(36) PRIMARY KEY,
        conversation_id VARCHAR(36) REFERENCES conversations(id) ON DELETE CASCADE,
        from_user VARCHAR(50) NOT NULL,
        text TEXT NOT NULL,
        time VARCHAR(50) NOT NULL,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
      )
    `);

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export default pool;