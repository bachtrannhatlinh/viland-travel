import { request } from './core';

// Tour APIs
export async function getTours(params: {
  category?: string;
  difficulty?: string;
  featured?: boolean;
  limit?: number;
  page?: number;
} = {}) {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  });

  return request(`/tours?${searchParams.toString()}`);
}

export async function getTourById(tourId: string) {
  return request(`/tours/${tourId}`);
}

export async function searchTours(params: {
  destination?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  duration?: number;
  limit?: number;
}) {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  });

  return request(`/tours/search?${searchParams.toString()}`);
}