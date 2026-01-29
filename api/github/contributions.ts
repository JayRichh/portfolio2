import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
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
        data: response.data.data,
      });
    }

    res.json(response.data);
  } catch (error: any) {
    console.error('GitHub API error:', error.message);

    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.message;

      if (status === 403 && message.includes('rate limit')) {
        return res.status(429).json({
          error: 'GitHub API rate limit exceeded. Please try again later.',
        });
      }

      if (status === 401) {
        return res.status(401).json({
          error: 'GitHub authentication failed. Please check your token.',
        });
      }

      return res.status(status).json({
        error: message,
      });
    }

    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({
        error: 'Request timeout. GitHub API took too long to respond.',
      });
    }

    res.status(500).json({
      error: 'Internal server error while fetching GitHub data',
    });
  }
}
