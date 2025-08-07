import { VNPayGateway } from './VNPayGateway';
import { ZaloPayGateway } from './ZaloPayGateway';
import { MoMoGateway } from './MoMoGateway';
import { OnePayGateway } from './OnePayGateway';
import { PaymentGateway } from './PaymentGateway.abstract';
import { 
  PaymentRequest, 
  PaymentResponse, 
  PaymentCallback, 
  PaymentStatus,
  RefundRequest,
  RefundResponse 
} from '../../types/payment.types';

export type SupportedGateway = 'vnpay' | 'zalopay' | 'momo' | 'onepay';

interface PaymentServiceConfig {
  vnpay?: {
    tmnCode: string;
    hashSecret: string;
    url: string;
    apiUrl: string;
    returnUrl: string;
    notifyUrl: string;
  };
  zalopay?: {
    appId: string;
    key1: string;
    key2: string;
    endpoint: string;
    callbackUrl: string;
  };
  momo?: {
    partnerCode: string;
    accessKey: string;
    secretKey: string;
    endpoint: string;
    redirectUrl: string;
    ipnUrl: string;
  };
  onepay?: {
    merchantId: string;
    accessCode: string;
    secureSecret: string;
    paymentUrl: string;
    queryUrl: string;
    returnUrl: string;
  };
}

export class PaymentService {
  private gateways: Map<SupportedGateway, PaymentGateway> = new Map();
  private defaultGateway: SupportedGateway = 'vnpay';

  constructor(config: PaymentServiceConfig) {
    this.initializeGateways(config);
  }

  private initializeGateways(config: PaymentServiceConfig): void {
    try {
      // Initialize VNPay
      if (config.vnpay) {
        const vnpayGateway = new VNPayGateway(config.vnpay);
        this.gateways.set('vnpay', vnpayGateway);
        console.log('✅ VNPay gateway initialized');
      }

      // Initialize ZaloPay
      if (config.zalopay) {
        const zaloPayGateway = new ZaloPayGateway(config.zalopay);
        this.gateways.set('zalopay', zaloPayGateway);
        console.log('✅ ZaloPay gateway initialized');
      }

      // Initialize MoMo
      if (config.momo) {
        const momoGateway = new MoMoGateway(config.momo);
        this.gateways.set('momo', momoGateway);
        console.log('✅ MoMo gateway initialized');
      }

      // Initialize OnePay
      if (config.onepay) {
        const onePayGateway = new OnePayGateway(config.onepay);
        this.gateways.set('onepay', onePayGateway);
        console.log('✅ OnePay gateway initialized');
      }

      if (this.gateways.size === 0) {
        console.log('⚠️  No payment gateways configured - running in development mode');
      } else {
        console.log(`🚀 PaymentService initialized with ${this.gateways.size} gateways`);
      }
    } catch (error) {
      console.error('❌ Failed to initialize payment gateways:', error);
      console.log('⚠️  Continuing in development mode without payment gateways');
    }
    // Development mode allows no payment gateways
  }

  /**
   * Create payment with specified gateway
   */
  async createPayment(
    request: PaymentRequest, 
    gateway: SupportedGateway = this.defaultGateway
  ): Promise<PaymentResponse> {
    try {
      const paymentGateway = this.getGateway(gateway);
      
      console.log(`💳 Creating payment with ${gateway} gateway for booking ${request.bookingId}`);
      
      const response = await paymentGateway.createPayment(request);
      
      if (response.success) {
        console.log(`✅ Payment created successfully: ${response.transactionId}`);
      } else {
        console.error(`❌ Payment creation failed: ${response.error}`);
      }
      
      return response;
    } catch (error) {
      console.error(`❌ Payment creation error with ${gateway}:`, error);
      return {
        success: false,
        error: `Payment creation failed: ${(error as Error).message}`
      };
    }
  }

  /**
   * Handle payment callback from gateway
   */
  async handleCallback(
    callbackData: any, 
    gateway: SupportedGateway
  ): Promise<PaymentCallback> {
    try {
      const paymentGateway = this.getGateway(gateway);
      
      console.log(`📞 Handling callback from ${gateway} gateway`);
      
      const callback = await paymentGateway.handleCallback(callbackData);
      
      if (callback.success) {
        console.log(`✅ Payment callback successful: ${callback.transactionId}`);
      } else {
        console.log(`❌ Payment callback failed: ${callback.message}`);
      }
      
      return callback;
    } catch (error) {
      console.error(`❌ Callback handling error with ${gateway}:`, error);
      throw error;
    }
  }

  /**
   * Query payment status
   */
  async queryPaymentStatus(
    transactionId: string, 
    gateway: SupportedGateway
  ): Promise<PaymentStatus> {
    try {
      const paymentGateway = this.getGateway(gateway);
      
      console.log(`🔍 Querying payment status for ${transactionId} with ${gateway}`);
      
      const status = await paymentGateway.queryPaymentStatus(transactionId);
      
      console.log(`📊 Payment status: ${status.status}`);
      
      return status;
    } catch (error) {
      console.error(`❌ Status query error with ${gateway}:`, error);
      return {
        transactionId,
        status: 'failed',
        amount: 0,
        currency: 'VND',
        gatewayResponse: { error: (error as Error).message }
      };
    }
  }

  /**
   * Process refund
   */
  async refundPayment(
    request: RefundRequest, 
    gateway: SupportedGateway
  ): Promise<RefundResponse> {
    try {
      const paymentGateway = this.getGateway(gateway);
      
      console.log(`💰 Processing refund for ${request.transactionId} with ${gateway}`);
      
      const refund = await paymentGateway.refundPayment(request);
      
      if (refund.success) {
        console.log(`✅ Refund processed successfully: ${refund.refundId}`);
      } else {
        console.error(`❌ Refund failed: ${refund.error}`);
      }
      
      return refund;
    } catch (error) {
      console.error(`❌ Refund error with ${gateway}:`, error);
      return {
        success: false,
        refundAmount: 0,
        error: `Refund failed: ${(error as Error).message}`
      };
    }
  }

  /**
   * Verify payment signature
   */
  verifySignature(
    data: any, 
    signature: string, 
    gateway: SupportedGateway
  ): boolean {
    try {
      const paymentGateway = this.getGateway(gateway);
      return paymentGateway.verifySignature(data, signature);
    } catch (error) {
      console.error(`❌ Signature verification error with ${gateway}:`, error);
      return false;
    }
  }

  /**
   * Get available gateways
   */
  getAvailableGateways(): SupportedGateway[] {
    return Array.from(this.gateways.keys());
  }

  /**
   * Check if gateway is available
   */
  isGatewayAvailable(gateway: SupportedGateway): boolean {
    return this.gateways.has(gateway);
  }

  /**
   * Set default gateway
   */
  setDefaultGateway(gateway: SupportedGateway): void {
    if (!this.isGatewayAvailable(gateway)) {
      throw new Error(`Gateway ${gateway} is not available`);
    }
    this.defaultGateway = gateway;
    console.log(`🔧 Default gateway set to: ${gateway}`);
  }

  /**
   * Get gateway statistics
   */
  getGatewayStats(): Record<SupportedGateway, any> {
    const stats: Record<string, any> = {};
    
    for (const [gatewayName, gateway] of this.gateways) {
      stats[gatewayName] = {
        name: gatewayName,
        isActive: true,
        // Add more stats as needed
      };
    }
    
    return stats as Record<SupportedGateway, any>;
  }

  private getGateway(gateway: SupportedGateway): PaymentGateway {
    const paymentGateway = this.gateways.get(gateway);
    if (!paymentGateway) {
      throw new Error(`Payment gateway ${gateway} is not configured`);
    }
    return paymentGateway;
  }

  /**
   * Health check for all gateways
   */
  async healthCheck(): Promise<Record<SupportedGateway, boolean>> {
    const healthStatus: Record<string, boolean> = {};
    
    for (const [gatewayName] of this.gateways) {
      try {
        // Basic health check - gateway should be initialized
        healthStatus[gatewayName] = this.isGatewayAvailable(gatewayName);
      } catch (error) {
        healthStatus[gatewayName] = false;
      }
    }
    
    return healthStatus as Record<SupportedGateway, boolean>;
  }

  /**
   * Load configuration from environment
   */
  static fromEnv(): PaymentService {
    const config: PaymentServiceConfig = {};

    // VNPay configuration
    if (process.env.VNPAY_TMN_CODE) {
      config.vnpay = {
        tmnCode: process.env.VNPAY_TMN_CODE,
        hashSecret: process.env.VNPAY_HASH_SECRET || '',
        url: process.env.VNPAY_URL || '',
        apiUrl: process.env.VNPAY_API_URL || '',
        returnUrl: process.env.VNPAY_RETURN_URL || '',
        notifyUrl: process.env.VNPAY_NOTIFY_URL || ''
      };
    }

    // ZaloPay configuration
    if (process.env.ZALOPAY_APP_ID) {
      config.zalopay = {
        appId: process.env.ZALOPAY_APP_ID,
        key1: process.env.ZALOPAY_KEY1 || '',
        key2: process.env.ZALOPAY_KEY2 || '',
        endpoint: process.env.ZALOPAY_ENDPOINT || '',
        callbackUrl: process.env.ZALOPAY_CALLBACK_URL || ''
      };
    }

    // MoMo configuration
    if (process.env.MOMO_PARTNER_CODE) {
      config.momo = {
        partnerCode: process.env.MOMO_PARTNER_CODE,
        accessKey: process.env.MOMO_ACCESS_KEY || '',
        secretKey: process.env.MOMO_SECRET_KEY || '',
        endpoint: process.env.MOMO_ENDPOINT || '',
        redirectUrl: process.env.MOMO_REDIRECT_URL || '',
        ipnUrl: process.env.MOMO_IPN_URL || ''
      };
    }

    // OnePay configuration
    if (process.env.ONEPAY_MERCHANT_ID) {
      config.onepay = {
        merchantId: process.env.ONEPAY_MERCHANT_ID,
        accessCode: process.env.ONEPAY_ACCESS_CODE || '',
        secureSecret: process.env.ONEPAY_SECURE_SECRET || '',
        paymentUrl: process.env.ONEPAY_PAYMENT_URL || '',
        queryUrl: process.env.ONEPAY_QUERY_URL || '',
        returnUrl: process.env.ONEPAY_RETURN_URL || ''
      };
    }

    return new PaymentService(config);
  }
}
