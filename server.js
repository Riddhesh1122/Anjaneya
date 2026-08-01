const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const db = new Database(path.join(__dirname, 'data.db'));

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize tables
db.exec(`
CREATE TABLE IF NOT EXISTS colleges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  domain TEXT
);
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  college_id INTEGER,
  role TEXT DEFAULT 'student',
  FOREIGN KEY(college_id) REFERENCES colleges(id)
);
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  start_at TEXT,
  end_at TEXT,
  venue TEXT,
  college_id INTEGER,
  capacity INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  FOREIGN KEY(college_id) REFERENCES colleges(id)
);
CREATE TABLE IF NOT EXISTS registrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  event_id INTEGER,
  status TEXT DEFAULT 'registered',
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(event_id) REFERENCES events(id)
);
`);

// Helpers
function generateToken(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing authorization' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Auth routes
app.post('/api/signup', (req, res) => {
  const { name, email, password, college_id } = req.body;
  if (!email || !password || !name) return res.status(400).json({ error: 'Missing fields' });
  const hashed = bcrypt.hashSync(password, 8);
  try {
    const stmt = db.prepare('INSERT INTO users (name,email,password,college_id) VALUES (?,?,?,?)');
    const info = stmt.run(name, email, hashed, college_id || null);
    const user = { id: info.lastInsertRowid, name, email, role: 'student' };
    const token = generateToken(user);
    res.json({ user, token });
  } catch (e) {
    res.status(400).json({ error: 'Email already exists' });
  }
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!row) return res.status(400).json({ error: 'Invalid credentials' });
  if (!bcrypt.compareSync(password, row.password)) return res.status(400).json({ error: 'Invalid credentials' });
  const user = { id: row.id, name: row.name, email: row.email, role: row.role };
  const token = generateToken(user);
  res.json({ user, token });
});

// Events CRUD (protected for create/update/delete)
app.get('/api/events', (req, res) => {
  const { college_id } = req.query;
  let rows;
  if (college_id) rows = db.prepare('SELECT * FROM events WHERE college_id = ? AND status = "published"').all(college_id);
  else rows = db.prepare('SELECT * FROM events WHERE status = "published"').all();
  res.json(rows);
});

app.post('/api/events', authMiddleware, (req, res) => {
  const { title, description, start_at, end_at, venue, college_id, capacity } = req.body;
  const stmt = db.prepare('INSERT INTO events (title,description,start_at,end_at,venue,college_id,capacity,status) VALUES (?,?,?,?,?,?,?,?)');
  const info = stmt.run(title, description, start_at, end_at, venue, college_id, capacity || 0, 'published');
  const ev = db.prepare('SELECT * FROM events WHERE id = ?').get(info.lastInsertRowid);
  res.json(ev);
});

app.get('/api/events/:id', (req, res) => {
  const ev = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
  if (!ev) return res.status(404).json({ error: 'Not found' });
  res.json(ev);
});

app.post('/api/events/:id/register', authMiddleware, (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.id;
  // Check capacity
  const ev = db.prepare('SELECT capacity FROM events WHERE id = ?').get(eventId);
  if (!ev) return res.status(404).json({ error: 'Event not found' });
  const count = db.prepare('SELECT COUNT(*) as c FROM registrations WHERE event_id = ?').get(eventId).c;
  if (ev.capacity > 0 && count >= ev.capacity) return res.status(400).json({ error: 'Event full' });
  const stmt = db.prepare('INSERT INTO registrations (user_id,event_id) VALUES (?,?)');
  const info = stmt.run(userId, eventId);
  const reg = db.prepare('SELECT * FROM registrations WHERE id = ?').get(info.lastInsertRowid);
  res.json(reg);
});

// Simple admin route to create college
app.post('/api/colleges', (req, res) => {
  const { name, domain } = req.body;
  const stmt = db.prepare('INSERT INTO colleges (name,domain) VALUES (?,?)');
  const info = stmt.run(name, domain);
  const c = db.prepare('SELECT * FROM colleges WHERE id = ?').get(info.lastInsertRowid);
  res.json(c);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server started on port', PORT));
