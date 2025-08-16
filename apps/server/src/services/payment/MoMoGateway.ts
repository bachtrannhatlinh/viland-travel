import * as crypto from 'crypto';
import axios from 'axios';
import { PaymentGateway } from './PaymentGateway.abstract';
import { 
  PaymentRequest, 
  PaymentResponse, 
  PaymentCallback, 
  PaymentStatus,
  RefundRequest,
  RefundResponse,
  MoMoRequest,
  MoMoResponse,
  MoMoCallback
} from '../../types/payment.types';

interface MoMoConfig {
  partnerCode: string;
  accessKey: string;
  secretKey: string;
  endpoint: string;
  redirectUrl: string;
  ipnUrl: string;
}

export class MoMoGateway extends PaymentGateway {
  private momoConfig: MoMoConfig;

  constructor(config: MoMoConfig) {
    super('momo', config);
    this.momoConfig = config;
    this.validateConfig();
  }

  protected validateConfig(): boolean {
    const required = ['partnerCode', 'accessKey', 'secretKey', 'endpoint'];
    for (const field of required) {
      if (!this.momoConfig[field as keyof MoMoConfig]) {
        throw new Error(`MoMo configuration missing: ${field}`);
      }
    }
    return true;
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      this.logTransaction('createPayment', { bookingId: request.bookingId, amount: request.amount });

      const orderId = this.generateTransactionId();
      const requestId = orderId;
      const amount = this.formatAmount(request.amount);
      
      const momoRequest: Omit<MoMoRequest, 'signature'> = {
        partnerCode: this.momoConfig.partnerCode,
        partnerName: 'ViLand Travel Tour',
        storeId: 'MomoTestStore',
        requestId,
        amount,
        orderId,
        orderInfo: request.description || `Payment for booking ${request.bookingId}`,
        redirectUrl: request.returnUrl || this.momoConfig.redirectUrl,
        ipnUrl: this.momoConfig.ipnUrl,
        lang: 'vi',
        requestType: 'payWithMethod',
        autoCapture: true,
        extraData: JSON.stringify({
          bookingId: request.bookingId,
          userId: request.userId
        })
      };

      // Generate signature
      const rawSignature = `accessKey=${this.momoConfig.accessKey}&amount=${amount}&extraData=${momoRequest.extraData}&ipnUrl=${momoRequest.ipnUrl}&orderId=${orderId}&orderInfo=${momoRequest.orderInfo}&partnerCode=${this.momoConfig.partnerCode}&redirectUrl=${momoRequest.redirectUrl}&requestId=${requestId}&requestType=${momoRequest.requestType}`;
      
      const signature = this.generateSignature(rawSignature);

      const requestWithSignature: MoMoRequest = {
        ...momoRequest,
        signature
      };

      // Make request to MoMo
      const response = await axios.post(`${this.momoConfig.endpoint}/create`, requestWithSignature, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result: MoMoResponse = response.data;

      if (result.resultCode === 0) {
        return {
          success: true,
          paymentUrl: result.payUrl,
          transactionId: orderId,
          gatewayOrderId: result.orderId,
          qrCode: result.qrCodeUrl,
          deeplink: result.deeplink,
          data: {
            gateway: 'momo',
            amount: request.amount,
            currency: request.currency
          }
        };
      } else {
        throw new Error(`MoMo error: ${result.message}`);
      }

    } catch (error) {
      return this.handleError(error, 'createPayment');
    }
  }

  async handleCallback(callbackData: MoMoCallback): Promise<PaymentCallback> {
    try {
      this.logTransaction('handleCallback', callbackData);

      // Verify signature
      const isValidSignature = this.verifyMoMoSignature(callbackData);

      if (!isValidSignature) {
        throw new Error('Invalid signature');
      }

      const success = callbackData.resultCode === 0;
      const extraData = JSON.parse(callbackData.extraData || '{}');

      return {
        success,
        transactionId: callbackData.orderId,
        gatewayOrderId: callbackData.transId.toString(),
        amount: callbackData.amount,
        currency: 'VND',
        responseCode: callbackData.resultCode.toString(),
        message: callbackData.message,
        signature: callbackData.signature,
        rawData: callbackData
      };

    } catch (error) {
      const err = error as Error;
      throw new Error(`MoMo callback handling failed: ${err.message}`);
    }
  }

  async queryPaymentStatus(transactionId: string): Promise<PaymentStatus> {
    try {
      this.logTransaction('queryPaymentStatus', { transactionId });

      const requestId = this.generateTransactionId();
      const rawSignature = `accessKey=${this.momoConfig.accessKey}&orderId=${transactionId}&partnerCode=${this.momoConfig.partnerCode}&requestId=${requestId}`;
      const signature = this.generateSignature(rawSignature);

      const queryData = {
        partnerCode: this.momoConfig.partnerCode,
        requestId,
        orderId: transactionId,
        signature,
        lang: 'vi'
      };

      const response = await axios.post(`${this.momoConfig.endpoint}/query`, queryData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = response.data;
      const status = this.mapMoMoStatus(result.resultCode);

      return {
        transactionId,
        status,
        amount: result.amount || 0,
        currency: 'VND',
        gatewayResponse: result
      };

    } catch (error) {
      console.error('MoMo query status error:', error);
      return {
        transactionId,
        status: 'failed',
        amount: 0,
        currency: 'VND',
        gatewayResponse: { error: (error as Error).message }
      };
    }
  }

  async refundPayment(request: RefundRequest): Promise<RefundResponse> {
    try {
      this.logTransaction('refundPayment', request);

      const requestId = this.generateTransactionId();
      const amount = this.formatAmount(request.amount);
      const transId = request.gatewayOrderId || request.transactionId;

      const rawSignature = `accessKey=${this.momoConfig.accessKey}&amount=${amount}&description=${request.reason}&orderId=${request.transactionId}&partnerCode=${this.momoConfig.partnerCode}&requestId=${requestId}&transId=${transId}`;
      const signature = this.generateSignature(rawSignature);

      const refundData = {
        partnerCode: this.momoConfig.partnerCode,
        requestId,
        orderId: request.transactionId,
        amount,
        transId,
        lang: 'vi',
        description: request.reason,
        signature
      };

      const response = await axios.post(`${this.momoConfig.endpoint}/refund`, refundData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = response.data;
      const success = result.resultCode === 0;

      return {
        success,
        refundId: success ? result.refundTrans : undefined,
        refundAmount: success ? request.amount : 0,
        message: result.message,
        error: success ? undefined : result.message
      };

    } catch (error) {
      return {
        success: false,
        refundAmount: 0,
        error: `MoMo refund failed: ${(error as Error).message}`
      };
    }
  }

  verifySignature(data: any, signature: string): boolean {
    return this.verifyMoMoSignature(data);
  }

  private verifyMoMoSignature(callbackData: MoMoCallback): boolean {
    try {
      const { signature, ...dataToVerify } = callbackData;
      
      const rawSignature = `accessKey=${this.momoConfig.accessKey}&amount=${dataToVerify.amount}&extraData=${dataToVerify.extraData}&message=${dataToVerify.message}&orderId=${dataToVerify.orderId}&orderInfo=${dataToVerify.orderInfo}&orderType=${dataToVerify.orderType}&partnerCode=${dataToVerify.partnerCode}&payType=${dataToVerify.payType}&requestId=${dataToVerify.requestId}&responseTime=${dataToVerify.responseTime}&resultCode=${dataToVerify.resultCode}&transId=${dataToVerify.transId}`;
      
      const computedSignature = this.generateSignature(rawSignature);
      return computedSignature === signature;
    } catch (error) {
      console.error('MoMo signature verification error:', error);
      return false;
    }
  }

  private generateSignature(data: string): string {
    return crypto
      .createHmac('sha256', this.momoConfig.secretKey)
      .update(data, 'utf8')
      .digest('hex');
  }

  private mapMoMoStatus(resultCode: number): 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' {
    switch (resultCode) {
      case 0:
        return 'completed';
      case 9000:
        return 'pending';
      case 8000:
        return 'processing';
      case 1006:
        return 'cancelled';
      default:
        return 'failed';
    }
  }
}
