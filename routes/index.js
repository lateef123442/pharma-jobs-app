const express = require('express');
const router = express.Router();
router.get('/', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/auth/login');
  }
  res.redirect('/dashboard');  // Redirect logged-in users to dashboard
});

module.exports = router;