const express = require('express');
const path = require('path');
const router = express.Router();

// Interview questions (static data for now)
const questions = [
  {
    question: "What is the difference between a drug and a medicine?",
    answer: "A drug is a chemical substance that affects the body's physiology, while a medicine is a drug formulated for therapeutic use to treat or prevent disease."
  },
  {
    question: "Explain the phases of clinical trials.",
    answer: "Phase 1: Safety and dosage in healthy volunteers. Phase 2: Efficacy and side effects in patients. Phase 3: Large-scale testing for effectiveness and monitoring adverse reactions. Phase 4: Post-marketing surveillance."
  },
  {
    question: "What is GMP and why is it important?",
    answer: "GMP (Good Manufacturing Practice) ensures products are consistently produced and controlled according to quality standards. It's crucial for patient safety and regulatory compliance."
  },
  {
    question: "How does the FDA approval process work for new drugs?",
    answer: "It involves preclinical testing, IND submission, clinical trials (Phases 1–3), NDA submission, FDA review, and post-approval monitoring."
  },
  {
    question: "What are the key differences between generics and branded drugs?",
    answer: "Generics have the same active ingredients, dosage, and efficacy as branded drugs but are cheaper and sold under chemical names. Branded drugs are patented and marketed under brand names."
  },
  {
    question: "Explain pharmacokinetics and pharmacodynamics.",
    answer: "Pharmacokinetics studies how the body handles a drug (absorption, distribution, metabolism, excretion). Pharmacodynamics studies the drug's effects on the body and mechanisms of action."
  },
  {
    question: "What is adverse drug reaction (ADR)?",
    answer: "An ADR is an unintended, harmful reaction to a drug at normal doses. They must be reported to regulatory bodies like the FDA or EMA."
  },
  {
    question: "How do you ensure patient compliance with medication?",
    answer: "Through clear instructions, reminders, simplified regimens, patient education, and addressing barriers like cost or side effects."
  },
  {
    question: "What is the role of a pharmacist in healthcare?",
    answer: "Pharmacists dispense medications, advise on usage, monitor for interactions, provide health screenings, and educate patients on disease management."
  },
  {
    question: "Describe the drug development pipeline.",
    answer: "It starts with drug discovery (lab research), preclinical testing (animal studies), clinical trials (human testing), regulatory approval, and ends with manufacturing and marketing."
  }
];

// Render the HTML page directly
router.get('/', (req, res) => {
  let html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Interview Questions - Pharma Desk</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
    <link rel="stylesheet" href="/style.css" />
    <style>
       body {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: 'Roboto', sans-serif;
      margin: 0;
      padding: 0;
      overflow-x: hidden;
      position: relative;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    body::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: 
        radial-gradient(circle at 20% 50%, rgba(0, 123, 255, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(40, 167, 69, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 40% 80%, rgba(255, 193, 7, 0.3) 0%, transparent 50%);
      animation: blobFloat 10s ease-in-out infinite;
      z-index: -1;
    }
        .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      position: relative;
      z-index: 10;
    }
    .nav-brand {
      font-size: 1.5em;
      font-weight: 700;
      color: #667eea;
      text-decoration: none;
    }
    .nav-links {
      display: flex;
      gap: 20px;
    }
    .nav-links a {
      color: #333;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s;
    }
    .nav-links a:hover, .nav-links a.active {
      color: #667eea;
    }
    .menu-btn {
      display: none;
      background: none;
      border: none;
      font-size: 1.5em;
      color: #333;
      cursor: pointer;
      transition: color 0.3s;
    }
    .menu-btn:hover {
      color: #667eea;
    }
    .hero {
      background: transparent;
      height: 30vh;
      min-height: 180px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .hero h1 {
      z-index: 1;
      font-size: clamp(2em, 5vw, 2.5em);
      font-weight: 700;
      text-shadow: 0 0 20px rgba(255,255,255,0.8);
      animation: typing 2.5s steps(20, end), blink-caret 0.75s step-end infinite;
      white-space: nowrap;
      overflow: hidden;
      border-right: 3px solid white;
    }
    .container {
      max-width: 1200px;
      margin: -30px auto 0;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(15px);
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
      animation: slideUpBounce 1s ease-out 0.5s both;
      flex: 1;
    }
    .section {
      margin-bottom: 40px;
      animation: fadeInUp 0.8s ease-out 1s both;
    }
    .section h2 {
      color: #007bff;
      margin-bottom: 20px;
      font-size: 2em;
      text-align: center;
      border-bottom: 2px solid #007bff;
      padding-bottom: 10px;
    }
    .questions-list {
      max-width: 800px;
      margin: 0 auto;
    }
    .question-item {
      background: rgba(255, 255, 255, 0.9);
      border-radius: 10px;
      margin-bottom: 15px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: box-shadow 0.3s;
    }
    .question-item:hover {
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }
    .question-header {
      background: #007bff;
      color: white;
      padding: 15px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: background 0.3s;
    }
    .question-header:hover {
      background: #0056b3;
    }
    .question-header h3 {
      margin: 0;
      font-size: 1.1em;
    }
    .question-header i {
      transition: transform 0.3s;
    }
    .question-item.active .question-header i {
      transform: rotate(180deg);
    }
    .question-answer {
      padding: 0;
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }
    .question-item.active .question-answer {
      padding: 15px;
      max-height: 500px;
    }
    .question-answer p {
      color: #555;
      line-height: 1.6;
      margin: 0;
    }
    .loading {
      text-align: center;
      color: #007bff;
      font-size: 1.2em;
    }
    .error {
      text-align: center;
      color: red;
      font-size: 1.1em;
    }
    .footer {
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 40px 20px;
      text-align: center;
      margin-top: 40px;
    }
    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }
    .footer-section h3 {
      color: #007bff;
      margin-bottom: 15px;
    }
    .footer-section ul {
      list-style: none;
      padding: 0;
    }
    .footer-section ul li {
      margin: 10px 0;
    }
    .footer-section ul li a {
      color: white;
      text-decoration: none;
      transition: color 0.3s;
    }
    .footer-section ul li a:hover {
      color: #007bff;
    }
    .social-links {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin-top: 20px;
    }
    .social-links a {
      color: white;
      font-size: 1.5em;
      transition: color 0.3s;
    }
    .social-links a:hover {
      color: #007bff;
    }
    .footer-bottom {
      margin-top: 20px;
      border-top: 1px solid #444;
      padding-top: 20px;
    }
    /* Mobile Menu Styles */
    @media (max-width: 768px) {
      .nav-links {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background: rgba(255, 255, 255, 0.95);
        flex-direction: column;
        gap: 0;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        animation: slideDown 0.3s ease-out;
      }
      .nav-links.active {
        display: flex;
      }
      .nav-links a {
        padding: 15px 20px;
        border-bottom: 1px solid #eee;
      }
      .menu-btn {
        display: block;
      }
      .hero { height: 25vh; }
      .hero h1 { font-size: 2em; }
      .dashboard { width: 98%; margin-top: -20px; padding: 25px; }
      .dashboard h1 { font-size: 2em; }
      .job-grid { grid-template-columns: 1fr; }
      .stats { grid-template-columns: 1fr; }
      .card { padding: 20px; }
      .section h2 { font-size: 1.5em; }
      .footer-content { grid-template-columns: 1fr; }
    }
    /* Animations */
    @keyframes blobFloat {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      25% { transform: translateY(-20px) rotate(90deg); }
      50% { transform: translateY(-40px) rotate(180deg); }
      75% { transform: translateY(-20px) rotate(270deg); }
    }
    @keyframes typing {
      from { width: 0; }
      to { width: 100%; }
    }
    @keyframes blink-caret {
      from, to { border-color: transparent; }
      50% { border-color: white; }
    }
    @keyframes slideUpBounce {
      0% { opacity: 0; transform: translateY(50px) scale(0.9); }
      60% { transform: translateY(-10px) scale(1.05); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes fadeInUp {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    /* Responsiveness */
    @media (max-width: 768px) {
      .hero { height: 20vh; }
      .hero h1 { font-size: 1.8em; }
      .container { margin-top: -20px; padding: 25px; }
      .question-header { padding: 12px; }
      .question-header h3 { font-size: 1em; }
      .footer-content { grid-template-columns: 1fr; }
    }
      @keyframes slideDown {
      0% { opacity: 0; transform: translateY(-10px); }
      100% { opacity: 1; transform: translateY(0); }
    }
      .ai-section {
  margin-top: 50px;
  text-align: center;
  padding: 30px;
  background: rgba(255,255,255,0.9);
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}
.ai-section h2 {
  color: #007bff;
  margin-bottom: 15px;
}
.ai-box {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}
.ai-box input {
  width: 60%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1em;
}
.ai-box button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
}
.ai-box button:hover {
  background: #0056b3;
}
.ai-response {
  margin-top: 30px;
  text-align: left;
  max-width: 700px;
  margin-inline: auto;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  display: none;
}
    </style>
  </head>
<body>
  <nav class="navbar">
    <div class="nav-brand"><i class="fas fa-pills"></i> Pharma Desk</div>
    <button class="menu-btn" onclick="toggleMenu()"><i class="fas fa-bars"></i></button>
    <div class="nav-links" id="navLinks">
      <a href="/dashboard"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
      <a href="/jobs"><i class="fas fa-search"></i> Jobs</a>
      <a href="/contact"><i class="fas fa-envelope"></i> Contact Us</a>
      <a href="/interview-questions" class="active"><i class="fas fa-question-circle"></i> Interview Questions</a>
      <a href="/about"><i class="fas fa-info-circle"></i> About Us</a>
    </div>
  </nav>
  <div class="hero">
    <h1>Interview Questions</h1>
  </div>
  <div class="container">
    <div class="section">
      <h2>Medical & Pharma Interview Questions</h2>
      <p>Prepare for your next interview with AI-generated questions and answers tailored to the pharmaceutical and medical fields. Click on a question to reveal the answer.</p>
      <div class="questions-list">
`;

  // Dynamically add each question and answer
  questions.forEach((q, i) => {
    html += `
      <div class="question-item" onclick="toggleAnswer(${i})">
        <div class="question-header">
          <h3>${q.question}</h3>
          <i class="fas fa-chevron-down"></i>
        </div>
        <div class="question-answer" id="answer-${i}">
          <p>${q.answer}</p>
        </div>
      </div>
    `;
  });

  html += `
      </div>
    </div>
    <div class="ai-section">
      <h2>Ask the AI Interview Assistant</h2>
      <p>Didn’t find your question? Ask AI to generate an interview question and answer instantly.</p>
      <div class="ai-box">
        <input type="text" id="userQuestion" placeholder="Type your question..." />
        <button onclick="askAI()">Ask AI</button>
      </div>
      <div id="aiResponse" class="ai-response"></div>
    </div>
  </div>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h3>Quick Links</h3>
        <ul>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/jobs">Jobs</a></li>
          <li><a href="/contact">Contact Us</a></li>
          <li><a href="/interview-questions">Interview Questions</a></li>
          <li><a href="/about">About Us</a></li>
        </ul>
      </div>
      <div class="footer-section">
        <h3>Contact Info</h3>
        <ul>
          <li><i class="fas fa-phone"></i> 123-456-7890</li>
                    <li><i class="fas fa-envelope"></i> support@pharmadesk.com</li>
          <li><i class="fas fa-map-marker-alt"></i> 123 Pharma St, Delhi, India</li>
        </ul>
      </div>
      <div class="footer-section">
        <h3>Follow Us</h3>
        <div class="social-links">
          <a href="#" target="_blank"><i class="fab fa-facebook"></i></a>
          <a href="#" target="_blank"><i class="fab fa-twitter"></i></a>
          <a href="#" target="_blank"><i class="fab fa-linkedin"></i></a>
          <a href="#" target="_blank"><i class="fab fa-instagram"></i></a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; ${new Date().getFullYear()} Pharma Desk. All rights reserved.</p>
    </div>
  </footer>
  <script>
    function toggleMenu() {
      const navLinks = document.getElementById('navLinks');
      navLinks.classList.toggle('active');
    }

    function toggleAnswer(index) {
      const item = document.querySelectorAll('.question-item')[index];
      item.classList.toggle('active');
    }

    async function askAI() {
      const question = document.getElementById('userQuestion').value.trim();
      const responseBox = document.getElementById('aiResponse');

      if (!question) {
        responseBox.style.display = 'block';
        responseBox.innerHTML = '<p style="color:red;">Please enter a question.</p>';
        return;
      }

      responseBox.style.display = 'block';
      responseBox.innerHTML = '<p style="color:#007bff;">Thinking...</p>';

      try {
        const res = await fetch('/interview-questions/ask-ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question })
        });

        const data = await res.json();
        console.log('Client received data:', data);  // Added for debugging
        responseBox.innerHTML = \`
          <h3><i class="fas fa-robot"></i> AI Response</h3>
          <p><strong>Question:</strong> \${question}</p>
          <p><strong>Answer:</strong> \${data.answer || 'No answer received. Please try again.'}</p>
        \`;
      } catch (err) {
        console.error('Client fetch error:', err);  // Added for debugging
        responseBox.innerHTML = '<p style="color:red;">Sorry, something went wrong. Try again later.</p>';
      }
    }
  </script>
</body>
</html>
`;

  res.send(html);
});

// Updated OpenAI import (modern syntax)
const { OpenAI } = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY  // Store your key safely in .env
});

router.post('/ask-ai', async (req, res) => {
  try {
    const { question } = req.body;
    console.log('Received question:', question);  // Added for debugging

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",  // Try "gpt-3.5-turbo" if this fails
      messages: [
        { role: "system", content: "You are a helpful assistant that answers pharmaceutical and medical interview questions in clear, professional English." },
        { role: "user", content: question }
      ],
      temperature: 0.7,
    });

    const aiAnswer = completion.choices[0].message.content;
    console.log('AI Answer:', aiAnswer);  // Added for debugging
    res.json({ answer: aiAnswer });

  } catch (err) {
    console.error("AI Error:", err);
    res.status(500).json({ error: "AI request failed" });
  }
});

module.exports = router;