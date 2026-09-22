import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { v4 as uuidv4 } from 'uuid';

type Env = {
  DB: D1Database;
  ENVIRONMENT: string;
};

const app = new Hono<{ Bindings: Env }>();

// Middleware
app.use('*', cors({
  origin: '*',
  credentials: true,
}));

// Health check
app.get('/', (c) => {
  return c.json({ status: 'ok', message: 'AFMC Pickle Hub API running on Cloudflare Workers with D1' });
});

app.get('/api/health', (c) => {
  return c.json({ status: 'ok', message: 'Server is running' });
});

// User routes
app.post('/api/users/register', async (c) => {
  try {
    const { email, password, firstName, lastName, skillLevel } = await c.req.json();
    
    // Check if user already exists
    const existingUser = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
    
    if (existingUser) {
      return c.json({ error: 'User already exists' }, 400);
    }
    
    // Create new user
    const id = uuidv4();
    const result = await c.env.DB.prepare(
      `INSERT INTO users (id, email, password, first_name, last_name, skill_level) 
       VALUES (?, ?, ?, ?, ?, ?)`
    ).bind(id, email, password, firstName, lastName, skillLevel).run();
    
    const user = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(id).first();
    return c.json(user);
  } catch (error) {
    console.error('Error registering user:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post('/api/users/login', async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    const user = await c.env.DB.prepare('SELECT * FROM users WHERE email = ? AND password = ?').bind(email, password).first();
    
    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }
    
    return c.json(user);
  } catch (error) {
    console.error('Error logging in:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.get('/api/users/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const user = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(id).first();
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    return c.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Booking routes
app.get('/api/bookings', async (c) => {
  try {
    const bookings = await c.env.DB.prepare('SELECT * FROM bookings ORDER BY created_at DESC').all();
    return c.json(bookings.results);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.get('/api/bookings/user/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const bookings = await c.env.DB.prepare('SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC').bind(userId).all();
    return c.json(bookings.results);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post('/api/bookings', async (c) => {
  try {
    const { userId, court, sport, date, time, price } = await c.req.json();
    const id = uuidv4();
    
    await c.env.DB.prepare(
      `INSERT INTO bookings (id, user_id, court, sport, date, time, price) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(id, userId, court, sport, date, time, price).run();
    
    const booking = await c.env.DB.prepare('SELECT * FROM bookings WHERE id = ?').bind(id).first();
    return c.json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.put('/api/bookings/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const { status } = await c.req.json();
    
    await c.env.DB.prepare('UPDATE bookings SET status = ? WHERE id = ?').bind(status, id).run();
    
    const booking = await c.env.DB.prepare('SELECT * FROM bookings WHERE id = ?').bind(id).first();
    
    if (!booking) {
      return c.json({ error: 'Booking not found' }, 404);
    }
    
    return c.json(booking);
  } catch (error) {
    console.error('Error updating booking:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.delete('/api/bookings/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const result = await c.env.DB.prepare('DELETE FROM bookings WHERE id = ?').bind(id).run();
    
    if (result.meta.changes === 0) {
      return c.json({ error: 'Booking not found' }, 404);
    }
    
    return c.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Posts routes
app.get('/api/posts', async (c) => {
  try {
    const posts = await c.env.DB.prepare('SELECT * FROM posts ORDER BY date DESC').all();
    return c.json(posts.results);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post('/api/posts', async (c) => {
  try {
    const { type, title, body, author, avatar, date } = await c.req.json();
    const id = uuidv4();
    
    await c.env.DB.prepare(
      `INSERT INTO posts (id, type, title, body, author, avatar, date) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(id, type, title, body, author, avatar, date).run();
    
    const post = await c.env.DB.prepare('SELECT * FROM posts WHERE id = ?').bind(id).first();
    return c.json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.put('/api/posts/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const { status } = await c.req.json();
    
    await c.env.DB.prepare('UPDATE posts SET status = ? WHERE id = ?').bind(status, id).run();
    
    const post = await c.env.DB.prepare('SELECT * FROM posts WHERE id = ?').bind(id).first();
    
    if (!post) {
      return c.json({ error: 'Post not found' }, 404);
    }
    
    return c.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default app;