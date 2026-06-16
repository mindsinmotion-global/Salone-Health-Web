const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'salonehealth.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Unable to open database:', err.message);
        process.exit(1);
    }
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    district TEXT,
    service TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    district TEXT NOT NULL,
    service TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'Pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    store: new SQLiteStore({ db: 'sessions.sqlite', dir: dataDir, concurrentDB: true }),
    secret: process.env.SESSION_SECRET || 'salonehealth-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));
app.use(express.static(path.join(__dirname)));

app.post('/api/register', (req, res) => {
    const { name, email, password, district, service } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    db.run(
        'INSERT INTO users (name, email, password, district, service) VALUES (?, ?, ?, ?, ?)',
        [name.trim(), email.trim().toLowerCase(), hashedPassword, district || '', service || ''],
        function (err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(409).json({ error: 'Email is already registered.' });
                }
                return res.status(500).json({ error: 'Unable to create account.' });
            }
            return res.json({ message: 'Account created successfully.' });
        }
    );
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    db.get('SELECT id, name, email, password, district, service FROM users WHERE email = ?', [email.trim().toLowerCase()], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to query credentials.' });
        }
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }
        req.session.userId = user.id;
        req.session.userName = user.name;
        return res.json({ message: 'Login successful.', user: { id: user.id, name: user.name, email: user.email, district: user.district, service: user.service } });
    });
});

app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to log out.' });
        }
        res.clearCookie('connect.sid');
        return res.json({ message: 'Logged out successfully.' });
    });
});

app.get('/api/profile', (req, res) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated.' });
    }
    db.get('SELECT id, name, email, district, service, created_at FROM users WHERE id = ?', [req.session.userId], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to load profile.' });
        }
        if (!user) {
            return res.status(401).json({ error: 'Session invalid.' });
        }
        return res.json({ user });
    });
});

app.post('/api/book', (req, res) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ error: 'You must be signed in to book an appointment.' });
    }

    const { firstName, lastName, phone, email, district, service, message } = req.body;
    if (!firstName || !lastName || !phone || !email || !district || !service) {
        return res.status(400).json({ error: 'Please complete all required booking fields.' });
    }

    db.run(
        'INSERT INTO bookings (user_id, first_name, last_name, phone, email, district, service, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [req.session.userId, firstName.trim(), lastName.trim(), phone.trim(), email.trim().toLowerCase(), district.trim(), service.trim(), message ? message.trim() : ''],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Unable to submit booking request.' });
            }
            return res.json({ message: 'Booking request submitted successfully.' });
        }
    );
});

app.get('/api/bookings', (req, res) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated.' });
    }
    db.all('SELECT id, first_name, last_name, phone, email, district, service, message, status, created_at FROM bookings WHERE user_id = ? ORDER BY created_at DESC', [req.session.userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to load bookings.' });
        }
        return res.json({ bookings: rows });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`SaloneHealth server running on http://localhost:${PORT}`);
});
