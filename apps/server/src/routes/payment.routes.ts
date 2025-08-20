import { Router } from 'express';
import { PaymentController } from '../controllers/postgresql/PaymentController';
import { PaymentService } from '../services/payment/PaymentService';
import { protect } from '../middleware/auth';

// Initialize payment service from environment
const paymentService = PaymentService.fromEnv();
const paymentController = new PaymentController(paymentService);

const router = Router();

/**
 * @route POST /api/payments/create
 * @desc Create new payment
 * @access Public
 * @body {
 *   bookingId: string,
 *   userId?: string,
 *   amount: number,
 *   currency: string,
 *   description: string,
 *   customerInfo: { name, email, phone },
 *   returnUrl?: string,
 *   gateway?: 'vnpay' | 'zalopay' | 'momo' | 'onepay'
 * }
 */
router.post('/create', paymentController.createPayment);

/**
 * @route POST /api/payments/callback/:gateway
 * @desc Handle payment callback from gateway
 * @access Public
 * @params gateway: 'vnpay' | 'zalopay' | 'momo' | 'onepay'
 * @body Gateway-specific callback data
 */
router.post('/callback/:gateway', paymentController.handleCallback);

/**
 * @route GET /api/payments/return/:gateway
 * @desc Handle return from payment gateway
 * @access Public
 * @params gateway: 'vnpay' | 'zalopay' | 'momo' | 'onepay'
 * @query Gateway-specific return data
 */
router.get('/return/:gateway', paymentController.handleReturn);

/**
 * @route GET /api/payments/status/:gateway/:transactionId
 * @desc Query payment status
 * @access Private
 * @params gateway: 'vnpay' | 'zalopay' | 'momo' | 'onepay'
 * @params transactionId: string
 */
router.get('/status/:gateway/:transactionId', protect, paymentController.queryPaymentStatus);

/**
 * @route POST /api/payments/refund/:gateway
 * @desc Process payment refund
 * @access Private
 * @params gateway: 'vnpay' | 'zalopay' | 'momo' | 'onepay'
 * @body {
 *   transactionId: string,
 *   gatewayOrderId?: string,
 *   amount: number,
 *   reason: string
 * }
 */
router.post('/refund/:gateway', protect, paymentController.processRefund);

/**
 * @route POST /api/payments/verify/:gateway
 * @desc Verify payment signature
 * @access Private
 * @params gateway: 'vnpay' | 'zalopay' | 'momo' | 'onepay'
 * @body {
 *   data: any,
 *   signature: string
 * }
 */
router.post('/verify/:gateway', protect, paymentController.verifySignature);

/**
 * @route GET /api/payments/gateways
 * @desc Get available payment gateways
 * @access Public
 */
router.get('/gateways', paymentController.getGateways);

/**
 * @route GET /api/payments/health
 * @desc Health check for payment service
 * @access Public
 */
router.get('/health', paymentController.healthCheck);

// Webhook handlers for payment gateways
const vnpayWebhook = (req: any, res: any) => {
  res.json({ 
    success: true, 
    message: 'VNPAY webhook handler - coming soon' 
  });
};

const momoWebhook = (req: any, res: any) => {
  res.json({ 
    success: true, 
    message: 'MoMo webhook handler - coming soon' 
  });
};

const zalopayWebhook = (req: any, res: any) => {
  res.json({ 
    success: true, 
    message: 'ZaloPay webhook handler - coming soon' 
  });
};

const stripeWebhook = (req: any, res: any) => {
  res.json({ 
    success: true, 
    message: 'Stripe webhook handler - coming soon' 
  });
};

// Payment return URLs
const vnpayReturn = (req: any, res: any) => {
  res.json({ 
    success: true, 
    message: 'VNPAY return handler - coming soon' 
  });
};

const momoReturn = (req: any, res: any) => {
  res.json({ 
    success: true, 
    message: 'MoMo return handler - coming soon' 
  });
};

const zalopayReturn = (req: any, res: any) => {
  res.json({ 
    success: true, 
    message: 'ZaloPay return handler - coming soon' 
  });
};

// Webhook routes (public)
router.post('/vnpay/webhook', vnpayWebhook);
router.post('/momo/webhook', momoWebhook);
router.post('/zalopay/webhook', zalopayWebhook);
router.post('/stripe/webhook', stripeWebhook);

// Return URLs (public)
router.get('/vnpay/return', vnpayReturn);
router.get('/momo/return', momoReturn);
router.get('/zalopay/return', zalopayReturn);

// Protected routes
router.use(protect);

// Legacy routes - to be removed when new system is fully tested
const getPaymentHistory = (req: any, res: any) => {
  res.json({ 
    success: true, 
    data: [],
    message: 'Payment history API - coming soon. Use /api/payments/status/:gateway/:transactionId for specific status queries.' 
  });
};

export default router;
