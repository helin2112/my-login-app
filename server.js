const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ============ DATABASE SETUP ============
const db = new sqlite3.Database('./users.db');

// Create all tables
db.serialize(() => {
    // Users table (for login/signup)
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    // User favorites table
    db.run(`CREATE TABLE IF NOT EXISTS user_favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        tutorial_id INTEGER,
        tutorial_name TEXT,
        tutorial_language TEXT,
        tutorial_level TEXT,
        saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id),
        UNIQUE(user_id, tutorial_id)
    )`);
    
    // User backpack table
    db.run(`CREATE TABLE IF NOT EXISTS user_backpack (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        tutorial_id INTEGER,
        tutorial_name TEXT,
        quantity INTEGER DEFAULT 1,
        added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id),
        UNIQUE(user_id, tutorial_id)
    )`);
    
    // Guestbook messages table
    db.run(`CREATE TABLE IF NOT EXISTS guestbook_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        username TEXT,
        message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`);
    
    // Learning progress table
    db.run(`CREATE TABLE IF NOT EXISTS learning_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        tutorial_id INTEGER,
        completed BOOLEAN DEFAULT 0,
        completed_at DATETIME,
        FOREIGN KEY(user_id) REFERENCES users(id),
        UNIQUE(user_id, tutorial_id)
    )`);

    db.run(`CREATE UNIQUE INDEX IF NOT EXISTS idx_user_backpack_user_tutorial ON user_backpack(user_id, tutorial_id)`);
    db.run(`CREATE UNIQUE INDEX IF NOT EXISTS idx_learning_progress_user_tutorial ON learning_progress(user_id, tutorial_id)`);
    
    console.log('✅ Database tables ready');
});

// ============ AUTHENTICATION APIs ============

// SIGN UP - Register new user
app.post('/api/signup', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
    }
    
    if (username.length < 3) {
        return res.status(400).json({ error: 'Username must be at least 3 characters' });
    }
    
    if (password.length < 4) {
        return res.status(400).json({ error: 'Password must be at least 4 characters' });
    }
    
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', 
        [username, password], 
        function(err) {
            if (err) {
                if (err.message.includes('UNIQUE')) {
                    return res.status(400).json({ error: 'Username already exists. Try another one.' });
                }
                return res.status(500).json({ error: 'Database error. Please try again.' });
            }
            res.json({ 
                success: true, 
                userId: this.lastID, 
                username: username,
                message: 'Account created successfully!' 
            });
        });
});

// LOGIN - Authenticate user
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
    }
    
    db.get('SELECT * FROM users WHERE username = ? AND password = ?', 
        [username, password], 
        (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Database error. Please try again.' });
            }
            if (!user) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }
            res.json({ 
                success: true, 
                userId: user.id, 
                username: user.username,
                message: 'Login successful!' 
            });
        });
});

// ============ FAVORITES APIs ============

// Get user's favorites
app.get('/api/favorites/:userId', (req, res) => {
    db.all('SELECT tutorial_id, tutorial_name, tutorial_language, tutorial_level FROM user_favorites WHERE user_id = ?',
        [req.params.userId], (err, favorites) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ favorites });
        });
});

// Add favorite
app.post('/api/favorites', (req, res) => {
    const { userId, tutorialId, tutorialName, tutorialLanguage, tutorialLevel } = req.body;
    
    db.run(`INSERT OR IGNORE INTO user_favorites (user_id, tutorial_id, tutorial_name, tutorial_language, tutorial_level) 
            VALUES (?, ?, ?, ?, ?)`,
        [userId, tutorialId, tutorialName, tutorialLanguage, tutorialLevel],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        });
});

// Remove favorite
app.delete('/api/favorites/:userId/:tutorialId', (req, res) => {
    db.run('DELETE FROM user_favorites WHERE user_id = ? AND tutorial_id = ?',
        [req.params.userId, req.params.tutorialId],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        });
});

// Batch remove favorites
app.post('/api/favorites/batch-remove', (req, res) => {
    const { userId, tutorialIds } = req.body;
    const placeholders = tutorialIds.map(() => '?').join(',');
    db.run(`DELETE FROM user_favorites WHERE user_id = ? AND tutorial_id IN (${placeholders})`,
        [userId, ...tutorialIds],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, count: this.changes });
        });
});

// ============ BACKPACK APIs ============

app.get('/api/backpack/:userId', (req, res) => {
    db.all('SELECT tutorial_id, tutorial_name, quantity FROM user_backpack WHERE user_id = ?',
        [req.params.userId], (err, backpack) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ backpack });
        });
});

app.post('/api/backpack', (req, res) => {
    const { userId, tutorialId, tutorialName } = req.body;
    
    db.run(`INSERT INTO user_backpack (user_id, tutorial_id, tutorial_name, quantity) 
            VALUES (?, ?, ?, 1)
            ON CONFLICT(user_id, tutorial_id) DO UPDATE SET quantity = quantity + 1`,
        [userId, tutorialId, tutorialName],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        });
});

app.put('/api/backpack', (req, res) => {
    const { userId, tutorialId, quantity } = req.body;
    
    if (quantity <= 0) {
        db.run('DELETE FROM user_backpack WHERE user_id = ? AND tutorial_id = ?',
            [userId, tutorialId], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ success: true });
            });
    } else {
        db.run('UPDATE user_backpack SET quantity = ? WHERE user_id = ? AND tutorial_id = ?',
            [quantity, userId, tutorialId], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ success: true });
            });
    }
});

app.delete('/api/backpack/:userId', (req, res) => {
    db.run('DELETE FROM user_backpack WHERE user_id = ?', [req.params.userId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// ============ GUESTBOOK APIs ============

app.get('/api/messages', (req, res) => {
    db.all('SELECT id, username, message, created_at FROM guestbook_messages ORDER BY created_at DESC LIMIT 50',
        [], (err, messages) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ messages });
        });
});

app.post('/api/messages', (req, res) => {
    const { userId, username, message } = req.body;
    
    if (!username || !message) {
        return res.status(400).json({ error: 'Name and message required' });
    }
    
    db.run('INSERT INTO guestbook_messages (user_id, username, message) VALUES (?, ?, ?)',
        [userId || null, username, message],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, id: this.lastID });
        });
});

// ============ PROGRESS APIs ============

app.post('/api/progress', (req, res) => {
    const { userId, tutorialId } = req.body;
    
    db.run(`INSERT OR REPLACE INTO learning_progress (user_id, tutorial_id, completed, completed_at) 
            VALUES (?, ?, 1, CURRENT_TIMESTAMP)`,
        [userId, tutorialId],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        });
});

app.get('/api/progress/:userId', (req, res) => {
    db.all('SELECT tutorial_id FROM learning_progress WHERE user_id = ? AND completed = 1',
        [req.params.userId], (err, progress) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ completed: progress.map(p => p.tutorial_id) });
        });
});

// ============ START SERVER ============
app.listen(PORT, () => {
    console.log(`
    ╔═══════════════════════════════════════╗
    ║     🔐 SkillBridge Server Ready       ║
    ║     http://localhost:${PORT}           ║
    ║     Login & Signup Active             ║
    ╚═══════════════════════════════════════╝
    `);
});