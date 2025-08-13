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
        dataSource = 'mock (fallback)';
      }
    } else {
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
