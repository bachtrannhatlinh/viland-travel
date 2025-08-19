// ITour interface for Tour model (no mongoose)
export interface ITour {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  images: string[];
  duration: {
    days: number;
    nights: number;
  };
  destinations: string[];
  startLocation: {
    name: string;
    address: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  endLocation: {
    name: string;
    address: string;
    coordinates: [number, number];
  };
  price: {
    adult: number;
    child: number;
    infant: number;
    currency: string;
  };
  discountPrice?: {
    adult?: number;
    child?: number;
    infant?: number;
  };
  inclusions: string[];
  exclusions: string[];
  itinerary: [{
    day: number;
    title: string;
    description: string;
    activities: string[];
    meals: string[];
    accommodation?: string;
  }];
  difficulty: 'easy' | 'moderate' | 'challenging' | 'extreme';
  category: 'cultural' | 'adventure' | 'beach' | 'mountain' | 'city' | 'wildlife' | 'spiritual' | 'eco';
  tags: string[];
  maxGroupSize: number;
  minGroupSize: number;
  ageRestriction?: {
    minAge?: number;
    maxAge?: number;
  };
  languages: string[];
  tourGuide: {
    included: boolean;
    languages: string[];
  };
  transportation: {
    included: boolean;
    type: string[];
  };
  accommodation: {
    included: boolean;
    type: string;
    rating?: number;
  };
  meals: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
  };
  highlights: string[];
  requirements: string[];
  cancellationPolicy: {
    freeCancellation: {
      enabled: boolean;
      daysBeforeDeparture?: number;
    };
    cancellationFees: [{
      daysBeforeDeparture: number;
      feePercentage: number;
    }];
  };
  availability: [{
    startDate: Date;
    endDate: Date;
    availableSlots: number;
    price: {
      adult: number;
      child: number;
      infant: number;
    };
    isAvailable: boolean;
  }];
  reviews: [{
    user: string; // user id
    rating: number;
    comment: string;
    createdAt: Date;
  }];
  averageRating: number;
  totalReviews: number;
  isActive: boolean;
  featured: boolean;
  promoted: boolean;
  createdBy: string; // user id
  createdAt: Date;
  updatedAt: Date;
}


