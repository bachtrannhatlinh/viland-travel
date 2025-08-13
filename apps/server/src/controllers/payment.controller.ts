import { Request, Response } from 'express';
import { PaymentService, SupportedGateway } from '../services/payment/PaymentService';
import { PaymentRequest } from '../types/payment.types';

export class PaymentController {
  private paymentService: PaymentService;

  constructor(paymentService: PaymentService) {
    this.paymentService = paymentService;
  }

  /**
   * Create payment
   * POST /api/payments/create
   */
  createPayment = async (req: Request, res: Response) => {
    try {
      const { gateway = 'vnpay', ...paymentData }: PaymentRequest & { gateway?: SupportedGateway } = req.body;

      // Validate required fields
      if (!paymentData.bookingId || !paymentData.amount || !paymentData.currency) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: bookingId, amount, currency'
        });
      }

      // Validate gateway
      if (!this.paymentService.isGatewayAvailable(gateway)) {
        return res.status(400).json({
          success: false,
          error: `Gateway ${gateway} is not available`,
          availableGateways: this.paymentService.getAvailableGateways()
        });
      }

      // Create payment
      const paymentResponse = await this.paymentService.createPayment(paymentData, gateway);

      if (paymentResponse.success) {
        return res.status(201).json({
          success: true,
          data: paymentResponse,
          gateway
        });
      } else {
        return res.status(400).json({
          success: false,
          error: paymentResponse.error,
          gateway
        });
      }

    } catch (error) {
      console.error('Payment creation error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  };

  /**
   * Handle payment callback
   * POST /api/payments/callback/:gateway
   */
  handleCallback = async (req: Request, res: Response) => {
    try {
      const gateway = req.params.gateway as SupportedGateway;
      const callbackData = req.body;

      // Validate gateway
      if (!this.paymentService.isGatewayAvailable(gateway)) {
        return res.status(400).json({
          success: false,
          error: `Gateway ${gateway} is not available`
        });
      }

      // Handle callback
      const callbackResult = await this.paymentService.handleCallback(callbackData, gateway);

      // Log transaction result
      console.log(`Payment callback result:`, {
        gateway,
        transactionId: callbackResult.transactionId,
        success: callbackResult.success,
        amount: callbackResult.amount
      });

      // Return appropriate response based on gateway requirements
      if (gateway === 'zalopay') {
        // ZaloPay expects specific response format
        return res.json({
          return_code: callbackResult.success ? 1 : -1,
          return_message: callbackResult.success ? 'success' : 'failed'
        });
      } else if (gateway === 'momo') {
        // MoMo expects 204 status for successful processing
        return res.status(204).send();
      } else {
        // VNPay and OnePay
        return res.json({
          RspCode: callbackResult.success ? '00' : '99',
          Message: callbackResult.success ? 'success' : 'failed'
        });
      }

    } catch (error) {
      console.error('Payment callback error:', error);
      
      // Return gateway-specific error response
      const gateway = req.params.gateway as SupportedGateway;
      if (gateway === 'zalopay') {
        return res.json({ return_code: -1, return_message: 'error' });
      } else if (gateway === 'momo') {
        return res.status(500).send();
      } else {
        return res.json({ RspCode: '99', Message: 'error' });
      }
    }
  };

  /**
   * Query payment status
   * GET /api/payments/status/:gateway/:transactionId
   */
  queryPaymentStatus = async (req: Request, res: Response) => {
    try {
      const { gateway, transactionId } = req.params as { gateway: SupportedGateway; transactionId: string };

      // Validate gateway
      if (!this.paymentService.isGatewayAvailable(gateway)) {
        return res.status(400).json({
          success: false,
          error: `Gateway ${gateway} is not available`
        });
      }

      // Query status
      const status = await this.paymentService.queryPaymentStatus(transactionId, gateway);

      return res.json({
        success: true,
        data: status,
        gateway
      });

    } catch (error) {
      console.error('Payment status query error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  };

  /**
   * Process refund
   * POST /api/payments/refund/:gateway
   */
  processRefund = async (req: Request, res: Response) => {
    try {
      const gateway = req.params.gateway as SupportedGateway;
      const refundData = req.body;

      // Validate required fields
      if (!refundData.transactionId || !refundData.amount || !refundData.reason) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: transactionId, amount, reason'
        });
      }

      // Validate gateway
      if (!this.paymentService.isGatewayAvailable(gateway)) {
        return res.status(400).json({
          success: false,
          error: `Gateway ${gateway} is not available`
        });
      }

      // Process refund
      const refundResult = await this.paymentService.refundPayment(refundData, gateway);

      if (refundResult.success) {
        return res.json({
          success: true,
          data: refundResult,
          gateway
        });
      } else {
        return res.status(400).json({
          success: false,
          error: refundResult.error,
          gateway
        });
      }

    } catch (error) {
      console.error('Payment refund error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  };

  /**
   * Return from payment gateway
   * GET /api/payments/return/:gateway
   */
  handleReturn = async (req: Request, res: Response) => {
    try {
      const gateway = req.params.gateway as SupportedGateway;
      const returnData = req.query;

      // Validate gateway
      if (!this.paymentService.isGatewayAvailable(gateway)) {
        return res.status(400).send('Gateway not available');
      }

      // Process return data similar to callback
      const callbackResult = await this.paymentService.handleCallback(returnData, gateway);

      // Redirect to frontend with result
      const redirectUrl = `${process.env.FRONTEND_URL}/payment/result?` + 
        `success=${callbackResult.success}&` +
        `transactionId=${callbackResult.transactionId}&` +
        `amount=${callbackResult.amount}&` +
        `message=${encodeURIComponent(callbackResult.message)}&` +
        `gateway=${gateway}`;

      return res.redirect(redirectUrl);

    } catch (error) {
      console.error('Payment return error:', error);
      const errorUrl = `${process.env.FRONTEND_URL}/payment/result?success=false&message=${encodeURIComponent('Payment processing error')}`;
      return res.redirect(errorUrl);
    }
  };

  /**
   * Get available gateways
   * GET /api/payments/gateways
   */
  getGateways = async (req: Request, res: Response) => {
    try {
      const gateways = this.paymentService.getAvailableGateways();
      const stats = this.paymentService.getGatewayStats();

      return res.json({
        success: true,
        data: {
          available: gateways,
          stats
        }
      });

    } catch (error) {
      console.error('Get gateways error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  };

  /**
   * Health check for payment service
   * GET /api/payments/health
   */
  healthCheck = async (req: Request, res: Response) => {
    try {
      const health = await this.paymentService.healthCheck();

      const allHealthy = Object.values(health).every(status => status === true);

      return res.status(allHealthy ? 200 : 503).json({
        success: allHealthy,
        data: health,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Payment health check error:', error);
      return res.status(503).json({
        success: false,
        error: 'Health check failed',
        timestamp: new Date().toISOString()
      });
    }
  };

  /**
   * Verify payment signature
   * POST /api/payments/verify/:gateway
   */
  verifySignature = async (req: Request, res: Response) => {
    try {
      const gateway = req.params.gateway as SupportedGateway;
      const { data, signature } = req.body;

      // Validate gateway
      if (!this.paymentService.isGatewayAvailable(gateway)) {
        return res.status(400).json({
          success: false,
          error: `Gateway ${gateway} is not available`
        });
      }

      // Verify signature
      const isValid = this.paymentService.verifySignature(data, signature, gateway);

      return res.json({
        success: true,
        data: {
          isValid,
          gateway
        }
      });

    } catch (error) {
      console.error('Signature verification error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  };
}