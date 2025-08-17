// Export types
export interface FlightSearchParams {
  from?: string;
  to?: string;
  departureDate?: string;
  returnDate?: string;
  adults?: number;
  children?: number;
  infants?: number;
  class?: string;
}

export interface Flight {
  id: string;
  flight_number: string;
  airline: string;
  aircraft_type: string;
  departure_airport: string;
  arrival_airport: string;
  departure_city: string;
  arrival_city: string;
  departure_date: string;
  departure_time: string;
  arrival_time: string;
  duration: string;
  pricing: {
    economy: { price: number; available: number };
    business?: { price: number; available: number };
    first?: { price: number; available: number };
  };
  status: string;
}

export interface Passenger {
  type: 'adult' | 'child' | 'infant';
  title: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber?: string;
  passportExpiry?: string;
}

export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
}

export interface Booking {
  id: string;
  booking_number: string;
  flight_id: string;
  flight: Flight;
  passengers: Passenger[];
  contact_info: ContactInfo;
  selected_class: string;
  total_amount: number;
  special_requests?: string;
  status: string;
  created_at: string;
}

export interface Payment {
  id: string;
  booking_id: string;
  transaction_id: string;
  amount: number;
  currency: string;
  gateway: string;
  payment_url?: string;
  status: string;
  created_at: string;
}