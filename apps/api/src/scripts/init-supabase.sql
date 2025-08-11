-- GoSafe Flight Booking Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create flights table
CREATE TABLE IF NOT EXISTS flights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flight_number VARCHAR(20) NOT NULL,
    airline VARCHAR(100) NOT NULL,
    aircraft_type VARCHAR(10) NOT NULL,
    departure_airport VARCHAR(10) NOT NULL,
    arrival_airport VARCHAR(10) NOT NULL,
    departure_city VARCHAR(100) NOT NULL,
    arrival_city VARCHAR(100) NOT NULL,
    departure_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    duration VARCHAR(20) NOT NULL,
    pricing JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'delayed', 'cancelled', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_number VARCHAR(20) UNIQUE NOT NULL,
    flight_id UUID NOT NULL REFERENCES flights(id),
    user_id UUID,
    contact_info JSONB NOT NULL,
    selected_class VARCHAR(20) NOT NULL CHECK (selected_class IN ('economy', 'business', 'first')),
    total_amount DECIMAL(12,2) NOT NULL,
    special_requests TEXT,
    status VARCHAR(20) DEFAULT 'pending_payment' CHECK (status IN ('pending_payment', 'confirmed', 'cancelled', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create passengers table
CREATE TABLE IF NOT EXISTS passengers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    type VARCHAR(10) NOT NULL CHECK (type IN ('adult', 'child', 'infant')),
    title VARCHAR(10) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    nationality VARCHAR(100) NOT NULL,
    passport_number VARCHAR(50),
    passport_expiry DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'VND',
    gateway VARCHAR(20) NOT NULL CHECK (gateway IN ('vnpay', 'zalopay', 'momo', 'onepay')),
    payment_url TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_flights_departure_city ON flights(departure_city);
CREATE INDEX IF NOT EXISTS idx_flights_arrival_city ON flights(arrival_city);
CREATE INDEX IF NOT EXISTS idx_flights_departure_date ON flights(departure_date);
CREATE INDEX IF NOT EXISTS idx_flights_status ON flights(status);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_number ON bookings(booking_number);
CREATE INDEX IF NOT EXISTS idx_bookings_flight_id ON bookings(flight_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_passengers_booking_id ON passengers(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Insert sample flight data
INSERT INTO flights (id, flight_number, airline, aircraft_type, departure_airport, arrival_airport, departure_city, arrival_city, departure_date, departure_time, arrival_time, duration, pricing, status) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'VN001', 'Vietnam Airlines', 'A321', 'SGN', 'HAN', 'Ho Chi Minh City', 'Hanoi', '2024-01-15', '08:00', '10:15', '2h 15m', '{"economy": {"price": 2500000, "available": 50}, "business": {"price": 5000000, "available": 10}, "first": {"price": 8000000, "available": 4}}', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440002', 'VJ002', 'VietJet Air', 'A320', 'SGN', 'HAN', 'Ho Chi Minh City', 'Hanoi', '2024-01-15', '14:30', '16:45', '2h 15m', '{"economy": {"price": 1800000, "available": 80}, "business": {"price": 3500000, "available": 15}}', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440003', 'BB003', 'Bamboo Airways', 'A321', 'HAN', 'SGN', 'Hanoi', 'Ho Chi Minh City', '2024-01-16', '09:15', '11:30', '2h 15m', '{"economy": {"price": 2200000, "available": 60}, "business": {"price": 4200000, "available": 12}}', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440004', 'VN101', 'Vietnam Airlines', 'A350', 'SGN', 'HAN', 'Ho Chi Minh City', 'Hanoi', '2024-01-15', '19:00', '21:15', '2h 15m', '{"economy": {"price": 2800000, "available": 120}, "business": {"price": 5500000, "available": 20}, "first": {"price": 9000000, "available": 8}}', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440005', 'VJ102', 'VietJet Air', 'A321', 'HAN', 'SGN', 'Hanoi', 'Ho Chi Minh City', '2024-01-15', '06:00', '08:15', '2h 15m', '{"economy": {"price": 1900000, "available": 75}, "business": {"price": 3600000, "available": 12}}', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440006', 'BB201', 'Bamboo Airways', 'A320', 'SGN', 'DAD', 'Ho Chi Minh City', 'Da Nang', '2024-01-16', '10:30', '11:45', '1h 15m', '{"economy": {"price": 1500000, "available": 90}, "business": {"price": 2800000, "available": 18}}', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440007', 'VN301', 'Vietnam Airlines', 'A321', 'HAN', 'DAD', 'Hanoi', 'Da Nang', '2024-01-17', '15:45', '17:00', '1h 15m', '{"economy": {"price": 1600000, "available": 85}, "business": {"price": 3000000, "available": 15}}', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440008', 'VJ401', 'VietJet Air', 'A320', 'DAD', 'SGN', 'Da Nang', 'Ho Chi Minh City', '2024-01-18', '12:00', '13:15', '1h 15m', '{"economy": {"price": 1450000, "available": 95}, "business": {"price": 2750000, "available": 20}}', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440009', 'BB501', 'Bamboo Airways', 'A321', 'DAD', 'HAN', 'Da Nang', 'Hanoi', '2024-01-19', '16:30', '17:45', '1h 15m', '{"economy": {"price": 1550000, "available": 70}, "business": {"price": 2900000, "available": 14}}', 'scheduled'),
('550e8400-e29b-41d4-a716-446655440010', 'VN601', 'Vietnam Airlines', 'A350', 'SGN', 'PQC', 'Ho Chi Minh City', 'Phu Quoc', '2024-01-20', '08:30', '09:30', '1h 00m', '{"economy": {"price": 1200000, "available": 110}, "business": {"price": 2200000, "available": 25}}', 'scheduled')
ON CONFLICT (id) DO NOTHING;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_flights_updated_at BEFORE UPDATE ON flights FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE flights ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE passengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to flights
CREATE POLICY "Allow public read access to flights" ON flights FOR SELECT USING (true);

-- Create policies for bookings (users can only see their own bookings)
CREATE POLICY "Users can view their own bookings" ON bookings FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can create bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own bookings" ON bookings FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

-- Create policies for passengers (linked to bookings)
CREATE POLICY "Users can view passengers for their bookings" ON passengers FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM bookings 
        WHERE bookings.id = passengers.booking_id 
        AND (bookings.user_id = auth.uid() OR bookings.user_id IS NULL)
    )
);
CREATE POLICY "Users can create passengers" ON passengers FOR INSERT WITH CHECK (true);

-- Create policies for payments (linked to bookings)
CREATE POLICY "Users can view payments for their bookings" ON payments FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM bookings 
        WHERE bookings.id = payments.booking_id 
        AND (bookings.user_id = auth.uid() OR bookings.user_id IS NULL)
    )
);
CREATE POLICY "Users can create payments" ON payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update payments" ON payments FOR UPDATE WITH CHECK (true);
