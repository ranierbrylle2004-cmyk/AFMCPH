import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';
import db, { initializeDatabase } from './db-sqlite';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
try {
  initializeDatabase();
} catch (error) {
  console.error('Database initialization failed:', error);
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running with SQLite' });
});

// User routes
app.post('/api/users/register', (req, res) => {
  try {
    const { email, password, firstName, lastName, skillLevel } = req.body;
    
    // Check if user already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Create new user
    const id = randomUUID();
    const result = db.prepare(
      `INSERT INTO users (id, email, password, first_name, last_name, skill_level) 
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(id, email, password, firstName, lastName, skillLevel);
    
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    res.json(user);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/users/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?').get(email, password);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Booking routes
app.get('/api/bookings', (req, res) => {
  try {
    const bookings = db.prepare('SELECT * FROM bookings ORDER BY created_at DESC').all();
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/bookings/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = db.prepare('SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC').all(userId);
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/bookings', (req, res) => {
  try {
    const { userId, court, sport, date, time, price } = req.body;
    const id = randomUUID();
    
    db.prepare(
      `INSERT INTO bookings (id, user_id, court, sport, date, time, price) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(id, userId, court, sport, date, time, price);
    
    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);
    res.json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/bookings/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, id);
    
    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/bookings/:id', (req, res) => {
  try {
    const { id } = req.params;
    const result = db.prepare('DELETE FROM bookings WHERE id = ?').run(id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Posts routes
app.get('/api/posts', (req, res) => {
  try {
    const posts = db.prepare('SELECT * FROM posts ORDER BY date DESC').all();
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/posts', (req, res) => {
  try {
    const { type, title, body, author, avatar, date } = req.body;
    const id = randomUUID();
    
    db.prepare(
      `INSERT INTO posts (id, type, title, body, author, avatar, date) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(id, type, title, body, author, avatar, date);
    
    const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
    res.json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/posts/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    db.prepare('UPDATE posts SET status = ? WHERE id = ?').run(status, id);
    
    const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT} with SQLite database`);
});

// Keep server alive
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});