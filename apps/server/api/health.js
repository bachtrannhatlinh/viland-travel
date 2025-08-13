// Vercel API route: /api/health
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
let supabase = null;
let useSupabase = false;

try {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (supabaseUrl && supabaseServiceKey) {
    supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    useSupabase = true;
  }
} catch (error) {
  console.log('❌ Supabase init error:', error.message);
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    let databaseStatus = 'disconnected';
    let databaseMessage = 'No database configured';

    if (useSupabase && supabase) {
      try {
        // Test Supabase connection
        const { data, error } = await supabase.from('flights').select('count').limit(1);
        
        if (error) {
          databaseStatus = 'error';
          databaseMessage = error.message;
        } else {
          databaseStatus = 'connected';
          databaseMessage = 'Supabase connected successfully';
        }
      } catch (error) {
        databaseStatus = 'error';
        databaseMessage = error.message;
      }
    }

    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      database: databaseMessage,
      services: {
        supabase: databaseStatus,
        payment: 'available'
      },
      endpoints: {
        flights: '/api/v1/flights/search',
        health: '/api/health'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      message: error.message
    });
  }
}