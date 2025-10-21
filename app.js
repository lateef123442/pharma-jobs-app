const express = require('express');
const { OpenAI } = require('openai');  // Updated to use the newer destructured import (consistent with OpenAI docs)
require('dotenv').config();  // Load environment variables from .env

const app = express();

// Set up EJS as the view engine (if you're using it for other pages)
app.set('view engine', 'ejs');
app.set('views', './views');  // Specify views directory if needed

// Middleware
app.use(express.urlencoded({ extended: true }));  // For parsing form data
app.use(express.json());  // For parsing JSON bodies (important for the AI POST request)
app.use(express.static('public'));  // Serve static files (e.g., CSS, images)

// Require routers
const dashboardRouter = require('./routes/dashboard');
const jobsRouter = require('./routes/jobs');
const contactRouter = require('./routes/contact');
const aboutRouter = require('./routes/about');
const interviewQuestionsRouter = require('./routes/interview-questions');

// Use routers
app.use('/', dashboardRouter);  // Dashboard as home page
app.use('/jobs', jobsRouter);
app.use('/dashboard', dashboardRouter);  // Redundant but okay if you want both / and /dashboard to serve the same
app.use('/contact', contactRouter);
app.use('/about', aboutRouter);
app.use('/interview-questions', interviewQuestionsRouter);  // For the interview questions page and AI API

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});