// Vercel API route: /api/v1/flights/search
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
    console.log('✅ Supabase initialized');
  } else {
    console.log('⚠️ Supabase env vars not found');
  }
} catch (error) {
  console.log('❌ Supabase init error:', error.message);
}

// Mock flight data for fallback
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
    const { from, to, departureDate, returnDate, adults, children, infants, class: flightClass } = req.query;
    
    console.log('🔍 Flight search request:', { from, to, departureDate, adults, children, infants, flightClass });
    
    let flights = [];
    let dataSource = 'mock';

    if (useSupabase && supabase) {
      try {
        console.log('🔍 Searching flights in database...');
        
        let query = supabase
          .from('flights')
          .select('*')
          .eq('status', 'scheduled');

        // Apply filters
        if (from) {
          query = query.ilike('departure_city', `%${from}%`);
        }
        if (to) {
          query = query.ilike('arrival_city', `%${to}%`);
        }
        if (departureDate) {
          query = query.eq('departure_date', departureDate);
        }

        const { data, error } = await query.order('departure_time', { ascending: true });

        if (error) throw error;

        flights = data || [];
        dataSource = 'database';
        console.log(`✅ Found ${flights.length} flights from database`);
      } catch (error) {
        console.log('⚠️ Database query failed, using mock data:', error.message);
        flights = mockFlights;
        dataSource = 'mock (fallback)';
      }
    } else {
      flights = mockFlights;
      dataSource = 'mock (no database)';
    }

    // Calculate filters
    const airlines = [...new Set(flights.map(f => f.airline))];
    const prices = flights.map(f => f.pricing.economy.price);
    const priceRange = {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };

    res.status(200).json({
      success: true,
      data: {
        flights,
        totalCount: flights.length,
        searchParams: { from, to, departureDate, returnDate, adults, children, infants, flightClass },
        filters: {
          airlines,
          priceRange
        },
        dataSource
      },
      message: 'Flight search completed successfully'
    });
  } catch (error) {
    console.error('❌ Flight search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching flights',
      error: error.message
    });
  }
}
