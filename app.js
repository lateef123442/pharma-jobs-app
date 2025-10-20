


const { OpenAI } = require('openai');
const express = require('express');
require('dotenv').config(); // Load .env
const dashboardRouter = require('./routes/dashboard'); // Your jobs router
const apiRouter = require('./routes/interview-questions'); // If in separate file

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/', dashboardRouter); // Jobs as home page
app.use('/jobs', require('./routes/jobs'));
app.use('/dashboard', require('./routes/dashboard'));  // Added for dashboard
app.use('/contact', require('./routes/contact'));  // Added for dashboard
app.use('/about', require('./routes/about'));  // Added for dashboard
app.use('/interview-questions', apiRouter);

app.listen(3000, () => console.log('App running on port 3000'));



