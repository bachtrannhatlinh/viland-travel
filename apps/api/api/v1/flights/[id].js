// Vercel API route: /api/v1/flights/[id]
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

// Mock flight data
const mockFlights = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    flight_number: 'VN001',
    airline: 'Vietnam Airlines',
    aircraft_type: 'A321',
    departure_airport: 'SGN',
    arrival_airport: 'HAN',
    departure_city: 'Ho Chi Minh City',
    arrival_city: 'Hanoi',
    departure_date: '2025-08-15',
    departure_time: '06:00',
    arrival_time: '08:15',
    duration: '2h 15m',
    pricing: {
      economy: { price: 2500000, available: 50 },
      business: { price: 5500000, available: 10 }
    },
    status: 'scheduled'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    flight_number: 'VJ002',
    airline: 'VietJet Air',
    aircraft_type: 'A320',
    departure_airport: 'SGN',
    arrival_airport: 'HAN',
    departure_city: 'Ho Chi Minh City',
    arrival_city: 'Hanoi',
    departure_date: '2025-08-15',
    departure_time: '14:30',
    arrival_time: '16:45',
    duration: '2h 15m',
    pricing: {
      economy: { price: 1800000, available: 80 },
      business: { price: 3500000, available: 15 }
    },
    status: 'scheduled'
  }
];

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

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
    const { id } = req.query;
    
    console.log('🔍 Flight details request for ID:', id);
    
    let flight = null;
    let dataSource = 'mock';

    if (useSupabase && supabase) {
      try {
        const { data, error } = await supabase
          .from('flights')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        flight = data;
        dataSource = 'database';
        console.log('✅ Found flight from database');
      } catch (error) {
        console.log('⚠️ Database query failed, using mock data:', error.message);
        flight = mockFlights.find(f => f.id === id);
        dataSource = 'mock (fallback)';
      }
    } else {
      flight = mockFlights.find(f => f.id === id);
      dataSource = 'mock (no database)';
    }

    if (!flight) {
      res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: flight,
      dataSource,
      message: 'Flight details retrieved successfully'
    });
  } catch (error) {
    console.error('❌ Flight details error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving flight details',
      error: error.message
    });
  }
}
