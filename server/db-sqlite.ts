import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const dbPath = path.join(process.cwd(), 'afmc-picklehub.db');
const db = new Database(dbPath);

export const initializeDatabase = () => {
  try {
    // Create users table
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        first_name TEXT,
        last_name TEXT,
        skill_level TEXT,
        avatar TEXT DEFAULT '👤',
        is_admin INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create bookings table
    db.exec(`
      CREATE TABLE IF NOT EXISTS bookings (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        court TEXT NOT NULL,
        sport TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        price TEXT NOT NULL,
        status TEXT DEFAULT 'Pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create posts table
    db.exec(`
      CREATE TABLE IF NOT EXISTS posts (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        author TEXT NOT NULL,
        avatar TEXT DEFAULT '👤',
        date TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        likes INTEGER DEFAULT 0,
        comments INTEGER DEFAULT 0,
        pinned INTEGER DEFAULT 0
      )
    `);

    // Create conversations table
    db.exec(`
      CREATE TABLE IF NOT EXISTS conversations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        avatar TEXT DEFAULT '👤',
        last_msg TEXT,
        time TEXT,
        unread INTEGER DEFAULT 0,
        is_support INTEGER DEFAULT 0,
        resolved INTEGER DEFAULT 0,
        is_admin INTEGER DEFAULT 0
      )
    `);

    // Create messages table
    db.exec(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        conversation_id TEXT,
        from_user TEXT NOT NULL,
        text TEXT NOT NULL,
        time TEXT NOT NULL,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
      )
    `);

    // Create admin user if not exists
    const adminExists = db.prepare('SELECT id FROM users WHERE email = ?').get('admin');
    if (!adminExists) {
      const adminId = randomUUID();
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin2026';
      db.prepare(`INSERT INTO users (id, email, password, is_admin) VALUES (?, ?, ?, ?)`)
        .run(adminId, 'admin', adminPassword, 1);
      console.log('Admin user created');
    }

    console.log('SQLite database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export default db;