import axios from 'axios';
import { VercelRequest, VercelResponse } from '@vercel/node';

export default async (req: VercelRequest, res: VercelResponse) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { query, variables } = req.body;

  if (!query) {
    return res.status(400).json({
      error: 'GraphQL query is required',
    });
  }

  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    console.error('GITHUB_TOKEN environment variable is not set');
    return res.status(500).json({
      error: 'GitHub API is not configured',
    });
  }

  try {
    const response = await axios.post(
      'https://api.github.com/graphql',
      { query, variables },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Portfolio-App',
        },
        timeout: 30000,
      }
    );

    if (response.data.errors) {
      console.error('GitHub GraphQL errors:', response.data.errors);
      return res.status(400).json({
        errors: response.data.errors,
      });
    }

    return res.status(200).json(response.data);
  } catch (error) {
    console.error('GitHub API error:', error);
    return res.status(500).json({
      error: 'Failed to fetch data from GitHub API',
    });
  }
};
