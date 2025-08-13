// Main API client file
import { healthCheck } from './core';
import * as flightApi from './flight';
import * as tourApi from './tour';
import * as paymentApi from './payment';
export * from './types';

// Create a unified API client
const apiClient = {
  // Core
  healthCheck,
  
  // Flight APIs
  searchFlights: flightApi.searchFlights,
  getFlightDetails: flightApi.getFlightDetails,
  bookFlight: flightApi.bookFlight,
  getBookingHistory: flightApi.getBookingHistory,
  cancelBooking: flightApi.cancelBooking,
  
  // Tour APIs
  getTours: tourApi.getTours,
  getTourById: tourApi.getTourById,
  searchTours: tourApi.searchTours,
  
  // Payment APIs
  createPayment: paymentApi.createPayment,
  getPaymentStatus: paymentApi.getPaymentStatus,
};

// Export singleton instance
export { apiClient };
export default apiClient;