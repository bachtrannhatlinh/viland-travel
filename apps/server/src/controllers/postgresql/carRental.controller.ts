import { Request, Response } from 'express';
import { CarRental, CarStatus, CarType, FuelType, TransmissionType } from '../../entities/CarRental.entity';
import { Booking, BookingType, BookingStatus } from '../../entities/Booking.entity';
import { PaymentService } from '../../services/payment/PaymentService';
import { PaymentRequest } from '../../types/payment.types';

interface AuthRequest extends Request {
  user?: any;
}

// ...existing code...
