import express from 'express';
import { protect } from '../middleware/auth';

const router = express.Router();

// Mock flight data for development
const mockFlights = [
  {
    id: '1',
    flightNumber: 'VN123',
    airline: 'Vietnam Airlines',
    aircraftType: 'A321',
    departureAirport: 'SGN',
    arrivalAirport: 'HAN',
    departureCity: 'TP. Hồ Chí Minh',
    arrivalCity: 'Hà Nội',
    departureDate: '2025-08-15T06:00:00Z',
    arrivalDate: '2025-08-15T08:15:00Z',
    duration: 135,
    pricing: {
      economy: { available: 50, price: 2500000 },
      business: { available: 10, price: 5500000 }
    },
    status: 'scheduled',
    type: 'domestic',
    isDirect: true,
    formattedDuration: '2h 15m'
  },
  {
    id: '2',
    flightNumber: 'VJ456',
    airline: 'VietJet Air',
    aircraftType: 'A320',
    departureAirport: 'SGN',
    arrivalAirport: 'HAN',
    departureCity: 'TP. Hồ Chí Minh',
    arrivalCity: 'Hà Nội',
    departureDate: '2025-08-15T08:30:00Z',
    arrivalDate: '2025-08-15T10:45:00Z',
    duration: 135,
    pricing: {
      economy: { available: 75, price: 1950000 }
    },
    status: 'scheduled',
    type: 'domestic',
    isDirect: true,
    formattedDuration: '2h 15m'
  }
];

// Flight search controller
const searchFlights = (req: any, res: any) => {
  try {
    const { from, to, departureDate, returnDate, adults, children, infants, class: flightClass } = req.query;
    
    // Simple filtering based on departure/arrival cities
    let filteredFlights = mockFlights;
    
    if (from && to) {
      filteredFlights = mockFlights.filter(flight => 
        flight.departureCity.toLowerCase().includes(from.toLowerCase()) &&
        flight.arrivalCity.toLowerCase().includes(to.toLowerCase())
      );
    }
    
    // Add mock return flights if round trip
    if (returnDate) {
      const returnFlights = filteredFlights.map(flight => ({
        ...flight,
        id: flight.id + '_return',
        flightNumber: flight.flightNumber.replace(/\d+/, (match) => (parseInt(match) + 100).toString()),
        departureAirport: flight.arrivalAirport,
        arrivalAirport: flight.departureAirport,
        departureCity: flight.arrivalCity,
        arrivalCity: flight.departureCity,
        departureDate: returnDate + 'T14:00:00Z',
        arrivalDate: returnDate + 'T16:15:00Z'
      }));
      
      filteredFlights = [...filteredFlights, ...returnFlights];
    }
    
    res.json({
      success: true,
      data: {
        flights: filteredFlights,
        totalCount: filteredFlights.length,
        searchParams: { from, to, departureDate, returnDate, adults, children, infants, flightClass },
        filters: {
          airlines: [...new Set(filteredFlights.map(f => f.airline))],
          priceRange: {
            min: Math.min(...filteredFlights.map(f => f.pricing.economy.price)),
            max: Math.max(...filteredFlights.map(f => f.pricing.economy.price))
          }
        }
      },
      message: 'Flight search completed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching flights',
      error: error
    });
  }
};

const getFlightDetails = (req: any, res: any) => {
  try {
    const { flightId } = req.params;
    const flight = mockFlights.find(f => f.id === flightId);
    
    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
    }
    
    res.json({
      success: true,
      data: flight,
      message: 'Flight details retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving flight details',
      error: error
    });
  }
};

const bookFlight = (req: any, res: any) => {
  try {
    const { flightId, passengers, contactInfo, selectedClass, specialRequests } = req.body;
    
    // Find flight
    const flight = mockFlights.find(f => f.id === flightId);
    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
    }
    
    // Generate booking number
    const bookingNumber = 'VN' + Math.random().toString(36).substr(2, 6).toUpperCase();
    
    // Calculate total amount
    const basePrice = (flight.pricing as any)[selectedClass]?.price || (flight.pricing as any).economy.price;
    let totalAmount = 0;
    
    passengers.forEach((passenger: any) => {
      switch (passenger.type) {
        case 'adult':
          totalAmount += basePrice;
          break;
        case 'child':
          totalAmount += basePrice * 0.75;
          break;
        case 'infant':
          totalAmount += basePrice * 0.1;
          break;
      }
    });
    
    // Add taxes (10%)
    totalAmount += totalAmount * 0.1;
    
    const booking = {
      bookingNumber,
      flight,
      passengers,
      contactInfo,
      selectedClass,
      specialRequests,
      totalAmount,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: booking,
      message: 'Flight booked successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error booking flight',
      error: error
    });
  }
};

const getBookingHistory = (req: any, res: any) => {
  res.json({ 
    success: true, 
    data: [],
    message: 'Flight booking history - coming soon' 
  });
};

const cancelBooking = (req: any, res: any) => {
  res.json({ 
    success: true, 
    message: 'Cancel flight booking - coming soon' 
  });
};

// Public routes
router.get('/search', searchFlights);
router.get('/:flightId', getFlightDetails);

// Protected routes
router.use(protect);
router.post('/book', bookFlight);
router.get('/bookings/history', getBookingHistory);
router.put('/bookings/:bookingId/cancel', cancelBooking);

export default router;
