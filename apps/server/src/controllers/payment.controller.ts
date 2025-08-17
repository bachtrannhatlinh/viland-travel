import { Request, Response } from 'express';
import { supabaseService, Payment } from '../config/supabase';
import { PaymentService, SupportedGateway } from '../services/payment/PaymentService';
import { PaymentRequest } from '../types/payment.types';

// Initialize payment service
const paymentService = PaymentService.fromEnv();

// Generate transaction ID
const generateTransactionId = (): string => {
  return `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
};

/**
 * Create payment
 * POST /api/v1/payments/create
 */
export const createPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      bookingNumber, 
      amount, 
      currency = 'VND', 
      gateway = 'vnpay', 
      customerInfo,
      returnUrl 
    } = req.body;
    
    console.log('💳 Payment creation request:', { bookingNumber, amount, gateway });
    
    // Validate required fields
    if (!bookingNumber || !amount) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: bookingNumber, amount'
      });
      return;
    }
    
    // Validate gateway
    if (!paymentService.isGatewayAvailable(gateway)) {
      res.status(400).json({
        success: false,
        message: `Gateway ${gateway} is not available`,
        availableGateways: paymentService.getAvailableGateways()
      });
      return;
    }
    
    // Get booking details
    const booking = await supabaseService.getBookingByNumber(bookingNumber);
    
    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
      return;
    }
    
    // Check if booking is in correct status
    if (booking.status !== 'pending_payment') {
      res.status(400).json({
        success: false,
        message: `Cannot create payment for booking with status: ${booking.status}`
      });
      return;
    }
    
    // Generate transaction ID
    const transactionId = generateTransactionId();
    
    // Prepare payment request
    const paymentRequest: PaymentRequest = {
      bookingId: bookingNumber,
      amount: amount,
      currency: currency,
      description: `Flight booking payment - ${booking.flight.airline} ${booking.flight.flight_number}`,
      customerInfo: customerInfo || {
        name: booking.contact_info.name,
        email: booking.contact_info.email,
        phone: booking.contact_info.phone
      },
      returnUrl: returnUrl || `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/return`
    };
    
    // Create payment with gateway
    const paymentResponse = await paymentService.createPayment(paymentRequest, gateway);
    
    if (!paymentResponse.success) {
      res.status(500).json({
        success: false,
        message: 'Failed to create payment with gateway',
        error: paymentResponse.error
      });
      return;
    }
    
    // Save payment to database
    const paymentData: Omit<Payment, 'id' | 'created_at' | 'updated_at'> = {
      booking_id: booking.id!,
      transaction_id: paymentResponse.transactionId!,
      amount: amount,
      currency: currency,
      gateway: gateway,
      payment_url: paymentResponse.paymentUrl,
      status: 'pending'
    };
    
    const payment = await supabaseService.createPayment(paymentData);
    
    res.json({
      success: true,
      data: {
        payment,
        paymentUrl: paymentResponse.paymentUrl,
        transactionId: paymentResponse.transactionId,
        gateway: gateway,
        qrCode: paymentResponse.qrCode,
        deeplink: paymentResponse.deeplink
      },
      message: 'Payment created successfully. Redirect to payment URL.'
    });
  } catch (error: any) {
    console.error('❌ Payment creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating payment',
      error: error.message
    });
  }
};

/**
 * Query payment status
 * GET /api/v1/payments/status/:gateway/:transactionId
 */
export const queryPaymentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { gateway, transactionId } = req.params as { gateway: SupportedGateway; transactionId: string };
    
    console.log('🔍 Payment status query:', { gateway, transactionId });
    
    // Validate gateway
    if (!paymentService.isGatewayAvailable(gateway)) {
      res.status(400).json({
        success: false,
        message: `Gateway ${gateway} is not available`
      });
      return;
    }
    
    // Query payment status from gateway
    const gatewayStatus = await paymentService.queryPaymentStatus(transactionId, gateway);
    
    // Get payment from database
    const payment = await supabaseService.getPaymentByTransactionId(transactionId);
    
    // Update payment status if different
    if (payment.status !== gatewayStatus.status) {
      const updatedPayment = await supabaseService.updatePaymentStatus(
        transactionId, 
        gatewayStatus.status,
        gatewayStatus.status === 'completed' ? new Date().toISOString() : undefined
      );
      
      // If payment is completed, update booking status
      if (gatewayStatus.status === 'completed') {
        const booking = await supabaseService.getBookingByNumber(payment.booking_id);
        if (booking && booking.status === 'pending_payment') {
          await supabaseService.updateBookingStatus(booking.id!, 'confirmed');
        }
      }
    }
    
    res.json({
      success: true,
      data: {
        transactionId,
        gateway,
        status: gatewayStatus.status,
        amount: gatewayStatus.amount,
        currency: gatewayStatus.currency,
        paidAt: gatewayStatus.paidAt,
        gatewayResponse: gatewayStatus
      },
      message: 'Payment status retrieved successfully'
    });
  } catch (error: any) {
    console.error('❌ Payment status query error:', error);
    res.status(500).json({
      success: false,
      message: 'Error querying payment status',
      error: error.message
    });
  }
};

/**
 * Handle payment callback
 * POST /api/v1/payments/callback/:gateway
 */
export const handlePaymentCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { gateway } = req.params as { gateway: SupportedGateway };
    const callbackData = req.body;
    
    console.log('📞 Payment callback received:', { gateway, data: callbackData });
    
    // Validate gateway
    if (!paymentService.isGatewayAvailable(gateway)) {
      res.status(400).json({
        success: false,
        message: `Gateway ${gateway} is not available`
      });
      return;
    }
    
    // Process callback
    const callbackResult = await paymentService.handleCallback(callbackData, gateway);
    
    if (callbackResult.success) {
      // Update payment status
      await supabaseService.updatePaymentStatus(
        callbackResult.transactionId!,
        callbackResult.status!,
        callbackResult.status === 'completed' ? new Date().toISOString() : undefined
      );
      
      // If payment is completed, update booking status
      if (callbackResult.status === 'completed') {
        const payment = await supabaseService.getPaymentByTransactionId(callbackResult.transactionId!);
        const booking = await supabaseService.getBookingByNumber(payment.booking_id);
        
        if (booking && booking.status === 'pending_payment') {
          await supabaseService.updateBookingStatus(booking.id!, 'confirmed');
        }
      }
    }
    
    res.json({
      success: true,
      data: callbackResult,
      message: 'Payment callback processed successfully'
    });
  } catch (error: any) {
    console.error('❌ Payment callback error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing payment callback',
      error: error.message
    });
  }
};

/**
 * Get available payment gateways
 * GET /api/v1/payments/gateways
 */
export const getAvailableGateways = async (req: Request, res: Response): Promise<void> => {
  try {
    const gateways = paymentService.getAvailableGateways();
    
    res.json({
      success: true,
      data: {
        gateways,
        count: gateways.length
      },
      message: 'Available payment gateways retrieved successfully'
    });
  } catch (error: any) {
    console.error('❌ Get gateways error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving payment gateways',
      error: error.message
    });
  }
};

/**
 * Health check for payment service
 * GET /api/v1/payments/health
 */
export const healthCheck = async (req: Request, res: Response): Promise<void> => {
  try {
    const gateways = paymentService.getAvailableGateways();
    
    res.json({
      success: true,
      data: {
        status: 'healthy',
        availableGateways: gateways,
        timestamp: new Date().toISOString()
      },
      message: 'Payment service is healthy'
    });
  } catch (error: any) {
    console.error('❌ Payment health check error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment service health check failed',
      error: error.message
    });
  }
};
