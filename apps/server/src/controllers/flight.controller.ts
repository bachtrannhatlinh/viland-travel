import { Request, Response } from 'express';
import { supabaseService, Flight, Booking, Passenger } from '../config/supabase';
import { PaymentService } from '../services/payment/PaymentService';

// Initialize payment service
const paymentService = PaymentService.fromEnv();

// Generate booking number
const generateBookingNumber = (): string => {
  return 'VN' + Date.now().toString().slice(-6) + Math.random().toString(36).substr(2, 3).toUpperCase();
};

// Generate transaction ID
const generateTransactionId = (): string => {
  return `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
};

// Calculate total amount based on passengers and class
const calculateTotalAmount = (flight: Flight, passengers: any[], selectedClass: string): number => {
  const basePrice = flight.pricing[selectedClass as keyof typeof flight.pricing]?.price || flight.pricing.economy.price;
  let totalAmount = 0;
  
  passengers.forEach(passenger => {
    switch (passenger.type) {
      case 'adult':
        totalAmount += basePrice;
        break;
      case 'child':
        totalAmount += basePrice * 0.75; // 25% discount for children
        break;
      case 'infant':
        totalAmount += basePrice * 0.1; // 90% discount for infants
        break;
    }
  });
  
  // Add taxes and fees (10%)
  totalAmount += totalAmount * 0.1;
  
  return Math.round(totalAmount);
};

/**
 * Search flights
 * GET /api/v1/flights/search
 */
export const searchFlights = async (req: Request, res: Response): Promise<void> => {
  try {
    const { from, to, departureDate, returnDate, adults, children, infants, class: flightClass } = req.query;
    
    console.log('🔍 Flight search request:', { from, to, departureDate, adults, children, infants, flightClass });
    
    // Search flights using Supabase
    const flights = await supabaseService.searchFlights({
      from: from as string,
      to: to as string,
      departureDate: departureDate as string,
      limit: 50
    });
    
    // Calculate filters
    const airlines = [...new Set(flights.map(f => f.airline))];
    const prices = flights.map(f => f.pricing.economy.price);
    const priceRange = {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
    
    res.json({
      success: true,
      data: {
        flights,
        totalCount: flights.length,
        searchParams: { from, to, departureDate, returnDate, adults, children, infants, flightClass },
        filters: {
          airlines,
          priceRange
        }
      },
      message: 'Flight search completed successfully'
    });
  } catch (error: any) {
    console.error('❌ Flight search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching flights',
      error: error.message
    });
  }
};

/**
 * Get flight details
 * GET /api/v1/flights/:flightId
 */
export const getFlightDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { flightId } = req.params;
    
    const flight = await supabaseService.getFlightById(flightId);
    
    res.json({
      success: true,
      data: flight,
      message: 'Flight details retrieved successfully'
    });
  } catch (error: any) {
    console.error('❌ Flight details error:', error);
    res.status(404).json({
      success: false,
      message: 'Flight not found',
      error: error.message
    });
  }
};

/**
 * Book flight
 * POST /api/v1/flights/book
 */
export const bookFlight = async (req: Request, res: Response): Promise<void> => {
  try {
    const { flightId, passengers, contactInfo, selectedClass, specialRequests } = req.body;
    
    console.log('✈️ Flight booking request:', { flightId, passengers: passengers?.length, selectedClass });
    
    // Validate required fields
    if (!flightId || !passengers || !contactInfo || !selectedClass) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: flightId, passengers, contactInfo, selectedClass'
      });
      return;
    }
    
    // Validate passengers array
    if (!Array.isArray(passengers) || passengers.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Passengers must be a non-empty array'
      });
      return;
    }
    
    // Get flight details
    const flight = await supabaseService.getFlightById(flightId);
    
    // Check if selected class is available
    if (!flight.pricing[selectedClass as keyof typeof flight.pricing]) {
      res.status(400).json({
        success: false,
        message: `Selected class '${selectedClass}' is not available for this flight`
      });
      return;
    }
    
    // Check seat availability
    const availableSeats = flight.pricing[selectedClass as keyof typeof flight.pricing]?.available || 0;
    const adultPassengers = passengers.filter(p => p.type === 'adult').length;
    const childPassengers = passengers.filter(p => p.type === 'child').length;
    const requiredSeats = adultPassengers + childPassengers; // Infants don't need separate seats
    
    if (requiredSeats > availableSeats) {
      res.status(400).json({
        success: false,
        message: `Not enough seats available. Requested: ${requiredSeats}, Available: ${availableSeats}`
      });
      return;
    }
    
    // Generate booking number
    const bookingNumber = generateBookingNumber();
    
    // Calculate total amount
    const totalAmount = calculateTotalAmount(flight, passengers, selectedClass);
    
    // Create booking
    const bookingData: Omit<Booking, 'id' | 'created_at' | 'updated_at'> = {
      booking_number: bookingNumber,
      flight_id: flightId,
      contact_info: contactInfo,
      selected_class: selectedClass,
      total_amount: totalAmount,
      special_requests: specialRequests,
      status: 'pending_payment'
    };
    
    const booking = await supabaseService.createBooking(bookingData);
    
    // Create passengers
    const passengerData: Omit<Passenger, 'id' | 'created_at'>[] = passengers.map(p => ({
      booking_id: booking.id!,
      type: p.type,
      title: p.title,
      first_name: p.firstName,
      last_name: p.lastName,
      date_of_birth: p.dateOfBirth,
      nationality: p.nationality,
      passport_number: p.passportNumber,
      passport_expiry: p.passportExpiry
    }));
    
    const createdPassengers = await supabaseService.createPassengers(passengerData);
    
    // Prepare response
    const response = {
      booking: {
        ...booking,
        flight,
        passengers: createdPassengers
      },
      paymentInfo: {
        amount: totalAmount,
        currency: 'VND',
        description: `Flight booking ${bookingNumber} - ${flight.airline} ${flight.flight_number}`
      }
    };
    
    res.json({
      success: true,
      data: response,
      message: 'Flight booked successfully. Please proceed to payment.'
    });
  } catch (error: any) {
    console.error('❌ Flight booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error booking flight',
      error: error.message
    });
  }
};

/**
 * Get booking history
 * GET /api/v1/flights/bookings/history
 */
export const getBookingHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    // In a real implementation, you would filter by user ID
    // For now, we'll return a placeholder response
    res.json({
      success: true,
      data: [],
      message: 'Booking history retrieved successfully'
    });
  } catch (error: any) {
    console.error('❌ Booking history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving booking history',
      error: error.message
    });
  }
};

/**
 * Cancel booking
 * PUT /api/v1/flights/bookings/:bookingId/cancel
 */
export const cancelBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookingId } = req.params;
    
    // Update booking status to cancelled
    const updatedBooking = await supabaseService.updateBookingStatus(bookingId, 'cancelled');
    
    res.json({
      success: true,
      data: updatedBooking,
      message: 'Booking cancelled successfully'
    });
  } catch (error: any) {
    console.error('❌ Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
      error: error.message
    });
  }
};