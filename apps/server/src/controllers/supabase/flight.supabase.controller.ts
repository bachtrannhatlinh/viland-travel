import { Request, Response } from 'express';
import { supabase, TABLES } from '../../config/supabase';
import { supabaseService } from '../../config/supabase';

// Tìm kiếm chuyến bay
export const searchFlights = async (req: Request, res: Response) => {
  try {
    let query = supabase
      .from(TABLES.FLIGHTS)
      .select('*')
      .eq('status', 'scheduled');

    const { from, to, departureDate, limit } = req.query;

    if (from) {
      query = query.ilike('departure_city', `%${from}%`);
    }
    if (to) {
      query = query.ilike('arrival_city', `%${to}%`);
    }
    if (departureDate) {
      query = query.eq('departure_date', departureDate);
    }
    if (limit) {
      query = query.limit(Number(limit));
    }

    const { data, error } = await query.order('departure_time', { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error searching flights', error });
  }
};


// Lấy chi tiết chuyến bay
export const getFlightDetails = async (req: Request, res: Response) => {
  try {
    const { flightId } = req.params;
    const flight = await supabaseService.getFlightById(flightId);
    res.json({
      success: true,
      data: flight,
      message: 'Flight details retrieved successfully'
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: 'Flight not found',
      error: error.message
    });
  }
};


// Đặt vé máy bay
export const bookFlight = async (req: Request, res: Response) => {
  try {
    const { flightId, passengers, contactInfo, selectedClass, specialRequests } = req.body;
    if (!flightId || !passengers || !contactInfo || !selectedClass) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: flightId, passengers, contactInfo, selectedClass'
      });
      return;
    }
    if (!Array.isArray(passengers) || passengers.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Passengers must be a non-empty array'
      });
      return;
    }
    const flight = await supabaseService.getFlightById(flightId);
    if (!flight.pricing[selectedClass]) {
      res.status(400).json({
        success: false,
        message: `Selected class '${selectedClass}' is not available for this flight`
      });
      return;
    }
    const availableSeats = flight.pricing[selectedClass]?.available || 0;
    const adultPassengers = passengers.filter((p: any) => p.type === 'adult').length;
    const childPassengers = passengers.filter((p: any) => p.type === 'child').length;
    const requiredSeats = adultPassengers + childPassengers;
    if (requiredSeats > availableSeats) {
      res.status(400).json({
        success: false,
        message: `Not enough seats available. Requested: ${requiredSeats}, Available: ${availableSeats}`
      });
      return;
    }
    const bookingNumber = 'VN' + Date.now().toString().slice(-6) + Math.random().toString(36).substr(2, 3).toUpperCase();
    // Tính tổng tiền
    const basePrice = flight.pricing[selectedClass]?.price || flight.pricing.economy.price;
    let totalAmount = 0;
    passengers.forEach((passenger: any) => {
      switch (passenger.type) {
        case 'adult': totalAmount += basePrice; break;
        case 'child': totalAmount += basePrice * 0.75; break;
        case 'infant': totalAmount += basePrice * 0.1; break;
      }
    });
    totalAmount += totalAmount * 0.1;
    totalAmount = Math.round(totalAmount);
    // Lấy user_id từ req.user (nếu có xác thực), hoặc gán tạm user_id test nếu chưa có auth
    const userId = (req as any).user?.id || '00000000-0000-0000-0000-000000000000';
    const bookingData = {
      booking_number: bookingNumber,
      flight_id: flightId,
      contact_info: contactInfo,
      selected_class: selectedClass,
      total_amount: totalAmount,
      special_requests: specialRequests,
      status: "pending" as "pending",
      booking_type: "flight" as "flight",
      service_id: flightId,
      user_id: userId
    };
    let booking;
    try {
      booking = await supabaseService.createBooking(bookingData);
    } catch (err) {
      throw err;
    }
    const passengerData = passengers.map((p: any) => ({
      booking_id: booking.id || '',
      type: p.type,
      title: p.title,
      first_name: p.firstName,
      last_name: p.lastName,
      date_of_birth: p.date_of_birth,
      nationality: p.nationality,
      passport_number: p.passportNumber,
      passport_expiry: p.passportExpiry
    }));
    const createdPassengers = await supabaseService.createPassengers(passengerData);
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
    res.status(500).json({
      success: false,
      message: 'Error booking flight',
      error: error.message
    });
  }
};


// Lịch sử booking của user
export const getBookingHistory = async (req: Request, res: Response) => {
  try {
    // TODO: Lọc theo user thực tế nếu có auth
    res.json({
      success: true,
      data: [],
      message: 'Booking history retrieved successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving booking history',
      error: error.message
    });
  }
};


// Hủy booking
export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const updatedBooking = await supabaseService.updateBookingStatus(bookingId, 'cancelled');
    res.json({
      success: true,
      data: updatedBooking,
      message: 'Booking cancelled successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
      error: error.message
    });
  }
};

export const getFlightById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from(TABLES.FLIGHTS)
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    if (!data) {
      res.status(404).json({ message: 'Flight not found' });
      return;
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error getting flight', error });
  }
};
