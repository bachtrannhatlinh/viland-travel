import { request } from './core';

// Flight APIs
export async function searchFlights(params: {
  from?: string;
  to?: string;
  departureDate?: string;
  returnDate?: string;
  adults?: number;
  children?: number;
  infants?: number;
  class?: string;
}) {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  });

  return request(`/flights/search?${searchParams.toString()}`);
}

export async function getFlightDetails(flightId: string) {
  return request(`/flights/${flightId}`);
}

export async function bookFlight(bookingData: {
  flightId: string;
  passengers: Array<{
    type: 'adult' | 'child' | 'infant';
    title: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    nationality: string;
    passportNumber?: string;
    passportExpiry?: string;
  }>;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  selectedClass: 'economy' | 'business' | 'first';
  specialRequests?: string;
}) {
  return request('/flights/book', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  });
}

export async function getBookingHistory() {
  return request('/flights/bookings/history');
}

export async function cancelBooking(bookingId: string) {
  return request(`/flights/bookings/${bookingId}/cancel`, {
    method: 'PUT',
  });
}