const express = require('express');
const router = express.Router();
// GET /about - Render About Us page
router.get('/', (req, res) => {
  res.render('about'); // Renders views/about.ejs
});
module.exports = router;