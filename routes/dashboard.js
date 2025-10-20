const express = require('express');
const axios = require('axios');
const router = express.Router();

const APP_ID = '8f65aa47';
const APP_KEY = '6f89a7e40ee715f0d952dcc9c7439a97';
const API_BASE_URL = 'http://api.adzuna.com/v1/api/jobs/in/search/';

router.get('/', async (req, res) => {

  
  const userName = 'User'; // Mock name since no DB
  
  try {
    const apiUrl = `${API_BASE_URL}1?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=5&what=pharmaceutical&where=India`;
    const response = await axios.get(apiUrl);
    const jobs = (response.data.results || []).map(job => ({
      id: job.id,
      title: job.title,
      company: job.company?.display_name || 'Not specified',
      location: job.location?.display_name || 'Not specified',
      domain: job.category?.label || 'Not specified',
      description: job.description || 'No description available',
      requirements: job.contract_type || 'Not specified',
      salary_range: job.salary_min ? `${job.salary_min} - ${job.salary_max}` : 'Not specified',
      created_at: job.created
    }));
    
    const applications = []; // Mocked - no DB to track
    
    res.render('dashboard', { userName, jobs, applications });
  } catch (error) {
    console.error('Error fetching jobs:', error.message);
    res.render('dashboard', { userName, jobs: [], applications: [] });
  }
});

module.exports = router;