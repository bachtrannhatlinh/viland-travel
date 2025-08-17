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
  ZaloPayRequest,
  ZaloPayResponse
} from '../../types/payment.types';

interface ZaloPayConfig {
  appId: string;
  key1: string;
  key2: string;
  endpoint: string;
  callbackUrl: string;
}

export class ZaloPayGateway extends PaymentGateway {
  private zaloPayConfig: ZaloPayConfig;

  constructor(config: ZaloPayConfig) {
    super('zalopay', config);
    this.zaloPayConfig = config;
    this.validateConfig();
  }

  protected validateConfig(): boolean {
    const required = ['appId', 'key1', 'key2', 'endpoint'];
    for (const field of required) {
      if (!this.zaloPayConfig[field as keyof ZaloPayConfig]) {
        throw new Error(`ZaloPay configuration missing: ${field}`);
      }
    }
    return true;
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      this.logTransaction('createPayment', { bookingId: request.bookingId, amount: request.amount });

      const appTransId = this.generateZaloPayTransactionId();
      const amount = this.formatAmount(request.amount);
      
      const embedData = JSON.stringify({
        bookingId: request.bookingId,
        redirecturl: request.returnUrl || this.zaloPayConfig.callbackUrl
      });

      const zaloPayRequest: Omit<ZaloPayRequest, 'mac'> = {
        app_id: parseInt(this.zaloPayConfig.appId),
        app_trans_id: appTransId,
        app_user: 'user_' + (request.userId || 'guest'),
        app_time: Date.now(),
        amount,
        item: JSON.stringify([{
          name: request.description || 'Tour booking payment',
          quantity: 1,
          price: amount
        }]),
        description: request.description || `Payment for booking ${request.bookingId}`,
        embed_data: embedData,
        bank_code: request.bankCode || '',
        callback_url: this.zaloPayConfig.callbackUrl
      };

      // Generate MAC
      const data = `${zaloPayRequest.app_id}|${zaloPayRequest.app_trans_id}|${zaloPayRequest.app_user}|${zaloPayRequest.amount}|${zaloPayRequest.app_time}|${zaloPayRequest.embed_data}|${zaloPayRequest.item}`;
      const mac = this.generateMac(data, this.zaloPayConfig.key1);

      const zaloPayRequestWithMac: ZaloPayRequest = {
        ...zaloPayRequest,
        mac
      };

      // Make request to ZaloPay
      const response = await axios.post(`${this.zaloPayConfig.endpoint}/create`, zaloPayRequestWithMac, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const result = response.data;

      if (result.return_code === 1) {
        return {
          success: true,
          paymentUrl: result.order_url,
          transactionId: appTransId,
          gatewayOrderId: result.zp_trans_token,
          data: {
            gateway: 'zalopay',
            amount: request.amount,
            currency: request.currency,
            zpTransToken: result.zp_trans_token
          }
        };
      } else {
        throw new Error(`ZaloPay error: ${result.return_message}`);
      }

    } catch (error) {
      return this.handleError(error, 'createPayment');
    }
  }

  async handleCallback(callbackData: ZaloPayResponse): Promise<PaymentCallback> {
    try {
      this.logTransaction('handleCallback', callbackData);

      // Verify MAC
      const isValidMac = this.verifyMac(callbackData);

      if (!isValidMac) {
        throw new Error('Invalid MAC signature');
      }

      const success = callbackData.status === 1;
      const embedData = JSON.parse(callbackData.embed_data || '{}');

      return {
        success,
        transactionId: callbackData.app_trans_id || '',
        gatewayOrderId: callbackData.zp_trans_id || '',
        amount: callbackData.amount || 0,
        currency: 'VND',
        responseCode: (callbackData.status || 0).toString(),
        message: success ? 'Payment successful' : 'Payment failed',
        signature: callbackData.mac || '',
        rawData: callbackData
      };

    } catch (error) {
      const err = error as Error;
      throw new Error(`ZaloPay callback handling failed: ${err.message}`);
    }
  }

  async queryPaymentStatus(transactionId: string): Promise<PaymentStatus> {
    try {
      this.logTransaction('queryPaymentStatus', { transactionId });

      const data = `${this.zaloPayConfig.appId}|${transactionId}|${this.zaloPayConfig.key1}`;
      const mac = this.generateMac(data, this.zaloPayConfig.key1);

      const queryData = {
        app_id: this.zaloPayConfig.appId,
        app_trans_id: transactionId,
        mac
      };

      const response = await axios.post(`${this.zaloPayConfig.endpoint}/query`, queryData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const result = response.data;
      const status = this.mapZaloPayStatus(result.return_code, result.is_processing);

      return {
        transactionId,
        status,
        amount: result.amount || 0,
        currency: 'VND',
        gatewayResponse: result
      };

    } catch (error) {
      console.error('ZaloPay query status error:', error);
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

      const mRefundId = this.generateZaloPayTransactionId();
      const timestamp = Date.now();
      const amount = this.formatAmount(request.amount);

      const data = `${this.zaloPayConfig.appId}|${request.gatewayOrderId}|${amount}|${request.reason}|${timestamp}`;
      const mac = this.generateMac(data, this.zaloPayConfig.key1);

      const refundData = {
        app_id: this.zaloPayConfig.appId,
        zp_trans_id: request.gatewayOrderId,
        amount,
        description: request.reason,
        timestamp,
        m_refund_id: mRefundId,
        mac
      };

      const response = await axios.post(`${this.zaloPayConfig.endpoint}/refund`, refundData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const result = response.data;
      const success = result.return_code === 1;

      return {
        success,
        refundId: success ? mRefundId : undefined,
        refundAmount: success ? request.amount : 0,
        message: result.return_message,
        error: success ? undefined : result.return_message
      };

    } catch (error) {
      return {
        success: false,
        refundAmount: 0,
        error: `ZaloPay refund failed: ${(error as Error).message}`
      };
    }
  }

  verifySignature(data: any, signature: string): boolean {
    return this.verifyMac(data);
  }

  private verifyMac(callbackData: ZaloPayResponse): boolean {
    try {
      const { mac, ...dataToVerify } = callbackData;
      const data = `${dataToVerify.app_id}|${dataToVerify.app_trans_id}|${dataToVerify.app_user}|${dataToVerify.amount}|${dataToVerify.app_time}|${dataToVerify.embed_data}|${dataToVerify.item}`;
      const computedMac = this.generateMac(data, this.zaloPayConfig.key2);
      return computedMac === mac;
    } catch (error) {
      console.error('ZaloPay MAC verification error:', error);
      return false;
    }
  }

  private generateMac(data: string, key: string): string {
    return crypto
      .createHmac('sha256', key)
      .update(data, 'utf8')
      .digest('hex');
  }

  private generateZaloPayTransactionId(): string {
    const timestamp = new Date();
    const yymmdd = timestamp.toISOString().slice(2, 10).replace(/-/g, '');
    const randomId = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `${yymmdd}_${randomId}`;
  }

  private mapZaloPayStatus(returnCode: number, isProcessing?: boolean): 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' {
    if (returnCode === 1) {
      return 'completed';
    } else if (returnCode === 2) {
      return 'failed';
    } else if (returnCode === 3) {
      return 'pending';
    } else if (isProcessing) {
      return 'processing';
    } else {
      return 'failed';
    }
  }
}
