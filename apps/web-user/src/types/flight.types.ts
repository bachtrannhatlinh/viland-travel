export enum FlightStatus {
  SCHEDULED = 'scheduled',
  DELAYED = 'delayed',
  CANCELLED = 'cancelled',
  BOARDING = 'boarding',
  DEPARTED = 'departed',
  ARRIVED = 'arrived'
}

export enum FlightClass {
  ECONOMY = 'economy',
  PREMIUM_ECONOMY = 'premium_economy',
  BUSINESS = 'business',
  FIRST = 'first'
}

export enum FlightType {
  DOMESTIC = 'domestic',
  INTERNATIONAL = 'international'
}

export interface FlightPricing {
  [FlightClass.ECONOMY]: {
    available: number;
    price: number;
    originalPrice?: number;
  };
  [FlightClass.PREMIUM_ECONOMY]?: {
    available: number;
    price: number;
    originalPrice?: number;
  };
  [FlightClass.BUSINESS]?: {
    available: number;
    price: number;
    originalPrice?: number;
  };
  [FlightClass.FIRST]?: {
    available: number;
    price: number;
    originalPrice?: number;
  };
}

export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  aircraftType: string;
  type: FlightType;
  status: FlightStatus;
  departureAirport: string;
  arrivalAirport: string;
  departureCity: string;
  arrivalCity: string;
  departureDate: string;
  arrivalDate: string;
  duration: number;
  pricing: FlightPricing;
  currency?: string;
  baggage?: {
    cabin: {
      weight: number;
      dimensions: string;
    };
    checked: {
      weight: number;
      additionalFee?: number;
    };
  };
  amenities?: string[] | {
    wifi: boolean;
    meals: boolean;
    entertainment: boolean;
    powerOutlets: boolean;
    extraLegroom?: boolean;
  };
  cancellationPolicy?: {
    refundable: boolean;
    changeFee?: number;
    cancellationFee?: number;
    terms: string;
  };
  stopover?: {
    airports: string[];
    duration: number;
    cities: string[];
  };
  rating?: number;
  reviewCount?: number;
  isBookable?: boolean;
  totalSeatsAvailable?: number;
  isDirect?: boolean;
  formattedDuration?: string;
}

export interface FlightSearchParams {
  class: FlightClass;
  adults: number;
  from: string;
  to: string;
  departureDate: string;
  returnDate?: string;
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  flightClass: FlightClass;
  tripType: 'one-way' | 'round-trip';
}

export interface FlightSearchResult {
  flights: Flight[];
  totalCount: number;
  filters: {
    airlines: string[];
    priceRange: {
      min: number;
      max: number;
    };
    departureTimeRanges: string[];
    duration: {
      min: number;
      max: number;
    };
  };
}

export interface PassengerInfo {
  id?: string;
  type: 'adult' | 'child' | 'infant';
  title: string;
  firstName: string;
  lastName: string;
  date_of_birth: string;
  nationality: string;
  passportNumber?: string;
  passportExpiry?: string;
  email?: string;
  phone?: string;
}

export interface FlightBookingData {
  flight: Flight;
  selectedClass: FlightClass;
  passengers: PassengerInfo[];
  contact_info: {
    name: string;
    phone: string;
    email: string;
  };
  specialRequests?: string;
  total_amount: number;
  bookingDate?: string;
  status?: string;
}

export interface BookingConfirmation {
  bookingNumber: string;
  status: string;
  flight: Flight;
  passengers: PassengerInfo[];
  totalAmount: number;
  paymentStatus: string;
  createdAt: string;
}
