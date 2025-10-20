const express = require('express');
const axios = require('axios'); // For API calls
const router = express.Router();

// Adzuna API credentials
const APP_ID = '8f65aa47';
const APP_KEY = '6f89a7e40ee715f0d952dcc9c7439a97';
const API_BASE_URL = 'http://api.adzuna.com/v1/api/jobs/in/search/';

// Simple in-memory cache for jobs (Map for O(1) lookup by ID)
const jobCache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

router.get('/', async (req, res) => {
  const { keyword = 'pharmaceutical', location = 'India', domain, posted, page = 1 } = req.query; // Added 'posted' here
  const limit = 20;

  // Map posted filter to max_days_old
  let maxDaysOld = '';
  if (posted === '24h') maxDaysOld = '&max_days_old=1';
  else if (posted === '1w') maxDaysOld = '&max_days_old=7';
  else if (posted === '2w') maxDaysOld = '&max_days_old=14';
  else if (posted === '1m') maxDaysOld = '&max_days_old=30';

  try {
    const apiUrl = `${API_BASE_URL}${page}?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=${limit}&what=${encodeURIComponent(keyword)}&where=${encodeURIComponent(location)}${domain ? `&category=${encodeURIComponent(domain)}` : ''}${maxDaysOld}`;
    const response = await axios.get(apiUrl);
    const data = response.data;
    const jobs = (data.results || []).map(job => ({
      id: job.id,
      title: job.title,
      company: job.company?.display_name || 'Not specified',
      location: job.location?.display_name || 'Not specified',
      domain: job.category?.label || domain || 'Not specified',
      description: job.description || 'No description available',
      requirements: job.contract_type || 'Not specified',
      salary_range: job.salary_min ? `${job.salary_min} - ${job.salary_max}` : 'Not specified',
      created_at: job.created,
      redirect_url: job.redirect_url || null,
      company_logo: job.company?.logo_url || null
    }));

    // Cache the jobs for quick lookup in details
    const now = Date.now();
    jobs.forEach(job => {
      jobCache.set(job.id, { ...job, cachedAt: now });
    });

    // Clean up expired cache entries
    for (const [id, job] of jobCache) {
      if (now - job.cachedAt > CACHE_TTL) {
        jobCache.delete(id);
      }
    }

    const totalJobs = data.count || jobs.length;
    const totalPages = Math.ceil(totalJobs / limit);

    res.render('jobs', { 
      jobs, 
      currentPage: parseInt(page), 
      totalPages, 
      keyword, 
      location, 
      domain,
      posted // Pass posted to template for form persistence
    });
  } catch (error) {
    console.error('Error fetching jobs:', error.message);
    res.render('jobs', { 
      jobs: [], 
      currentPage: 1, 
      totalPages: 1, 
      keyword, 
      location, 
      domain, 
      posted: '', // Default to empty string in error case
      error: 'Error fetching jobs. Try again later.' 
    });
  }
});

// GET /jobs/:id - View job details (public)
router.get('/:id', async (req, res) => {
  try {
    const jobId = req.params.id;
    console.log(`Searching for job ID: ${jobId}`); // Debug log

    // Check cache first
    const cachedJob = jobCache.get(jobId);
    if (cachedJob && (Date.now() - cachedJob.cachedAt) < CACHE_TTL) {
      console.log(`Job found in cache: ${cachedJob.title}`);
      // Pass userDetails (from req.user if authenticated)
      const userDetails = req.user || null; // Adjust based on your auth setup
      console.log('Passing userDetails:', userDetails); // Debug log
      return res.render('job-details', { job: cachedJob, userDetails });
    }

    // Fallback: Search API if not in cache (e.g., server restart)
    console.log('Job not in cache, searching API...');
    let job = null;
    const maxPages = 10;
    const resultsPerPage = 100;

    for (let page = 1; page <= maxPages; page++) {
      const apiUrl = `${API_BASE_URL}${page}?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=${resultsPerPage}`;
      console.log(`Fetching page ${page}: ${apiUrl}`);

      const response = await axios.get(apiUrl);
      const jobs = response.data.results || [];
      console.log(`Page ${page} has ${jobs.length} jobs`);

      job = jobs.find(j => j.id == jobId);
      if (job) {
        console.log(`Job found on page ${page}: ${job.title}`);
        // Cache it for future requests
        jobCache.set(jobId, { ...job, cachedAt: Date.now() });
        break;
      }
    }

    if (!job) {
      console.error(`Job with ID ${jobId} not found.`);
      return res.status(404).render('error', { message: 'Job not found. It may have been removed or is not available.' });
    }

    // Format the job data (if not already formatted)
    const formattedJob = {
      id: job.id,
      title: job.title,
      company: job.company?.display_name || 'Not specified',
      location: job.location?.display_name || 'Not specified',
      domain: job.category?.label || 'Not specified',
      description: job.description || 'No description available',
      requirements: job.contract_type || 'Not specified',
      salary_range: job.salary_min ? `${job.salary_min} - ${job.salary_max}` : 'Not specified',
      created_at: job.created,
      redirect_url: job.redirect_url || null,
      company_logo: job.company?.logo_url || null
    };

    // Pass userDetails
    const userDetails = req.user || null;
    console.log('Passing userDetails:', userDetails); // Debug log
    res.render('job-details', { job: formattedJob, userDetails });
  } catch (error) {
    console.error('Error fetching job details:', error.message);
    res.status(500).render('error', { message: 'Error loading job details. Please try again later.' });
  }
});

module.exports = router;