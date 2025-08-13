// Script để seed mock data vào Supabase
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

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
    departure_date: '2024-01-15',
    departure_time: '08:00',
    arrival_time: '10:15',
    duration: '2h 15m',
    pricing: {
      economy: { price: 2500000, available: 50 },
      business: { price: 5000000, available: 10 },
      first: { price: 8000000, available: 4 }
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
    departure_date: '2024-01-15',
    departure_time: '14:30',
    arrival_time: '16:45',
    duration: '2h 15m',
    pricing: {
      economy: { price: 1800000, available: 80 },
      business: { price: 3500000, available: 15 }
    },
    status: 'scheduled'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    flight_number: 'BB003',
    airline: 'Bamboo Airways',
    aircraft_type: 'A321',
    departure_airport: 'HAN',
    arrival_airport: 'SGN',
    departure_city: 'Hanoi',
    arrival_city: 'Ho Chi Minh City',
    departure_date: '2024-01-16',
    departure_time: '09:15',
    arrival_time: '11:30',
    duration: '2h 15m',
    pricing: {
      economy: { price: 2200000, available: 60 },
      business: { price: 4200000, available: 12 }
    },
    status: 'scheduled'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    flight_number: 'VN101',
    airline: 'Vietnam Airlines',
    aircraft_type: 'A350',
    departure_airport: 'SGN',
    arrival_airport: 'HAN',
    departure_city: 'Ho Chi Minh City',
    arrival_city: 'Hanoi',
    departure_date: '2024-01-15',
    departure_time: '19:00',
    arrival_time: '21:15',
    duration: '2h 15m',
    pricing: {
      economy: { price: 2800000, available: 120 },
      business: { price: 5500000, available: 20 },
      first: { price: 9000000, available: 8 }
    },
    status: 'scheduled'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    flight_number: 'VJ102',
    airline: 'VietJet Air',
    aircraft_type: 'A321',
    departure_airport: 'HAN',
    arrival_airport: 'SGN',
    departure_city: 'Hanoi',
    arrival_city: 'Ho Chi Minh City',
    departure_date: '2024-01-15',
    departure_time: '06:00',
    arrival_time: '08:15',
    duration: '2h 15m',
    pricing: {
      economy: { price: 1900000, available: 75 },
      business: { price: 3600000, available: 12 }
    },
    status: 'scheduled'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    flight_number: 'BB201',
    airline: 'Bamboo Airways',
    aircraft_type: 'A320',
    departure_airport: 'SGN',
    arrival_airport: 'DAD',
    departure_city: 'Ho Chi Minh City',
    arrival_city: 'Da Nang',
    departure_date: '2024-01-16',
    departure_time: '10:30',
    arrival_time: '11:45',
    duration: '1h 15m',
    pricing: {
      economy: { price: 1500000, available: 90 },
      business: { price: 2800000, available: 18 }
    },
    status: 'scheduled'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440007',
    flight_number: 'VN301',
    airline: 'Vietnam Airlines',
    aircraft_type: 'A321',
    departure_airport: 'HAN',
    arrival_airport: 'DAD',
    departure_city: 'Hanoi',
    arrival_city: 'Da Nang',
    departure_date: '2024-01-17',
    departure_time: '15:45',
    arrival_time: '17:00',
    duration: '1h 15m',
    pricing: {
      economy: { price: 1600000, available: 85 },
      business: { price: 3000000, available: 15 }
    },
    status: 'scheduled'
  }
];

async function seedFlights() {
  try {
    console.log('🚀 Starting to seed flights data to Supabase...');
    
    // Test connection
    console.log('🔍 Testing Supabase connection...');
    const { data: testData, error: testError } = await supabase
      .from('flights')
      .select('count')
      .limit(1);
    
    if (testError) {
      throw new Error(`Connection failed: ${testError.message}`);
    }
    
    console.log('✅ Supabase connection successful');
    
    // Delete existing mock data
    console.log('🗑️  Deleting existing mock data...');
    const flightNumbers = mockFlights.map(f => f.flight_number);
    const { error: deleteError } = await supabase
      .from('flights')
      .delete()
      .in('flight_number', flightNumbers);
    
    if (deleteError) {
      console.warn('⚠️  Delete warning:', deleteError.message);
    } else {
      console.log('✅ Existing data cleaned');
    }
    
    // Insert new data
    console.log('📝 Inserting new flight data...');
    const { data, error } = await supabase
      .from('flights')
      .insert(mockFlights)
      .select();
    
    if (error) {
      throw new Error(`Insert failed: ${error.message}`);
    }
    
    console.log(`✅ Successfully inserted ${data.length} flights`);
    
    // Verify data
    console.log('🔍 Verifying inserted data...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('flights')
      .select('flight_number, airline, departure_city, arrival_city')
      .order('departure_time');
    
    if (verifyError) {
      throw new Error(`Verification failed: ${verifyError.message}`);
    }
    
    console.log('\n📋 Inserted flights:');
    verifyData.forEach((flight, index) => {
      console.log(`${index + 1}. ${flight.flight_number} - ${flight.airline}`);
      console.log(`   ${flight.departure_city} → ${flight.arrival_city}`);
    });
    
    console.log('\n🎉 Seeding completed successfully!');
    console.log('🔗 You can now use Supabase data in your application');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

// Run seeding
seedFlights();