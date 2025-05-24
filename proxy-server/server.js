import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// OpenAI API configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1';

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:8080',           // Local development
    'https://e1zi.netlify.app',        // Netlify
    'https://h41s3.github.io'          // GitHub Pages
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Proxy endpoint for OpenAI
app.post('/api/proxy', async (req, res) => {
  try {
    const { endpoint, method, body } = req.body;
    
    const response = await fetch(`${OPENAI_API_URL}${endpoint}`, {
      method: method || 'POST', // OpenAI mostly uses POST
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'OpenAI-Organization': process.env.OPENAI_ORG_ID // Optional: if you have an org ID
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('OpenAI API Error:', data);
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Rate limit info endpoint
app.get('/api/limits', async (req, res) => {
  try {
    const response = await fetch(`${OPENAI_API_URL}/usage`, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rate limits' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
}); 