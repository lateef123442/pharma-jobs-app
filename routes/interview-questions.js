const express = require('express');
const { OpenAI } = require('openai');
const router = express.Router();
require('dotenv').config(); // Load .env

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Load from .env
});


// GET /interview-questions - Render page with AI-generated questions
router.get('/', async (req, res) => {
  let questions = [];
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Use 'gpt-4' for better quality if available
      messages: [
        {
          role: 'system',
          content: 'You are an expert in medical and pharmaceutical interviews. Generate relevant, professional questions with detailed answers.'
        },
        {
          role: 'user',
          content: 'Generate 5 medical or pharmaceutical interview questions with concise answers. Format as a JSON array: [{"question": "Question 1?", "answer": "Answer 1."}, ...]'
        }
      ],
      max_tokens: 1500, // Adjust for response length
      temperature: 0.7, // Creativity level
    });

    // Parse the AI response (assuming it returns valid JSON)
    const content = response.choices[0].message.content.trim();
    try {
      questions = JSON.parse(content);
    } catch (parseError) {
      // Fallback if AI doesn't return perfect JSON
      questions = [
        { question: 'What is the difference between a drug and a medicine?', answer: 'A drug is a chemical substance that affects the body, while medicine is a drug used to treat or prevent disease.' },
        { question: 'Explain the phases of clinical trials.', answer: 'Phase 1: Safety in small groups. Phase 2: Efficacy in larger groups. Phase 3: Large-scale effectiveness. Phase 4: Post-marketing surveillance.' },
        { question: 'What is pharmacokinetics?', answer: 'Pharmacokinetics studies how the body handles drugs: absorption, distribution, metabolism, and excretion.' },
        { question: 'How do you ensure patient safety in drug development?', answer: 'Through rigorous testing, regulatory compliance, adverse event monitoring, and ethical guidelines.' },
        { question: 'What is the role of FDA in pharmaceuticals?', answer: 'The FDA regulates drug approval, safety, efficacy, and labeling to protect public health.' }
      ];
    }
  } catch (error) {
    console.error('Error generating questions:', error);
    // Fallback static questions
    questions = [
      { question: 'Sample Question 1: What is pharmacology?', answer: 'Pharmacology is the study of drugs and their effects on biological systems.' },
      { question: 'Sample Question 2: Explain bioavailability.', answer: 'Bioavailability is the fraction of an administered drug that reaches the systemic circulation unchanged.' }
    ];
  }

  // Render the page with questions
  res.render('interview-questions', { questions });
});

module.exports = router;