// GoSafe API Client
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://server666.vercel.app';
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = `${API_BASE_URL}/api/${API_VERSION}`;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // Flight APIs
  async searchFlights(params: {
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

    return this.request(`/flights/search?${searchParams.toString()}`);
  }

  async getFlightDetails(flightId: string) {
    return this.request(`/flights/${flightId}`);
  }

  async bookFlight(bookingData: {
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
    return this.request('/flights/book', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  // Payment APIs
  async createPayment(paymentData: {
    bookingNumber: string;
    amount: number;
    currency?: string;
    gateway?: string;
    customerInfo?: {
      name: string;
      email: string;
      phone: string;
    };
  }) {
    return this.request('/payments/create', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async getPaymentStatus(gateway: string, transactionId: string) {
    return this.request(`/payments/status/${gateway}/${transactionId}`);
  }

  // Booking APIs
  async getBookingHistory() {
    return this.request('/flights/bookings/history');
  }

  async cancelBooking(bookingId: string) {
    return this.request(`/flights/bookings/${bookingId}/cancel`, {
      method: 'PUT',
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

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

export default apiClient;
