const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

// In-memory user storage (demo only)
let users = [];
let nextUserId = 1;

router.get('/login', (req, res) => res.render('login'));

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.send('Invalid credentials');
  }
  req.session.userId = user.id;
  res.redirect('/dashboard');
});

router.get('/register', (req, res) => res.render('register'));

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (users.find(u => u.email === email)) return res.send('Email taken');
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ id: nextUserId++, name, email, password: hashedPassword });
  res.redirect('/auth/login');
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

module.exports = router;