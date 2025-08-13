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
  OnePayRequest,
  OnePayResponse
} from '../../types/payment.types';

interface OnePayConfig {
  merchantId: string;
  accessCode: string;
  secureSecret: string;
  paymentUrl: string;
  queryUrl: string;
  returnUrl: string;
}

export class OnePayGateway extends PaymentGateway {
  private onePayConfig: OnePayConfig;

  constructor(config: OnePayConfig) {
    super('onepay', config);
    this.onePayConfig = config;
    this.validateConfig();
  }

  protected validateConfig(): boolean {
    const required = ['merchantId', 'accessCode', 'secureSecret', 'paymentUrl'];
    for (const field of required) {
      if (!this.onePayConfig[field as keyof OnePayConfig]) {
        throw new Error(`OnePay configuration missing: ${field}`);
      }
    }
    return true;
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      this.logTransaction('createPayment', { bookingId: request.bookingId, amount: request.amount });

      const orderRef = this.generateTransactionId();
      const amount = this.formatAmount(request.amount) * 100; // OnePay expects amount in cents
      
      const onePayRequest: Omit<OnePayRequest, 'vpc_SecureHash'> = {
        vpc_Version: '2',
        vpc_Command: 'pay',
        vpc_Merchant: this.onePayConfig.merchantId,
        vpc_AccessCode: this.onePayConfig.accessCode,
        vpc_MerchTxnRef: orderRef,
        vpc_OrderInfo: request.description || `Payment for booking ${request.bookingId}`,
        vpc_Amount: amount.toString(),
        vpc_Currency: 'VND',
        vpc_Locale: 'vn',
        vpc_ReturnURL: request.returnUrl || this.onePayConfig.returnUrl,
        vpc_TicketNo: '127.0.0.1', // Client IP
        vpc_Customer_Email: request.customerInfo.email,
        vpc_Customer_Phone: request.customerInfo.phone
      };

      // Generate secure hash
      const hashData = this.buildHashData(onePayRequest);
      const secureHash = this.generateSecureHash(hashData);

      const requestWithHash: OnePayRequest = {
        ...onePayRequest,
        vpc_SecureHash: secureHash
      };

      // Build payment URL
      const paymentUrl = this.buildPaymentUrl(requestWithHash);

      return {
        success: true,
        paymentUrl,
        transactionId: orderRef,
        gatewayOrderId: orderRef,
        data: {
          gateway: 'onepay',
          amount: request.amount,
          currency: request.currency
        }
      };

    } catch (error) {
      return this.handleError(error, 'createPayment');
    }
  }

  async handleCallback(callbackData: OnePayResponse): Promise<PaymentCallback> {
    try {
      this.logTransaction('handleCallback', callbackData);

      // Verify signature
      const isValidSignature = this.verifyOnePaySignature(callbackData);

      if (!isValidSignature) {
        throw new Error('Invalid signature');
      }

      const success = callbackData.vpc_TxnResponseCode === '0' && Boolean(callbackData.vpc_TransactionNo);
      const amount = parseInt(callbackData.vpc_Amount || '0') / 100; // Convert back from cents

      return {
        success,
        transactionId: callbackData.vpc_MerchTxnRef,
        gatewayOrderId: callbackData.vpc_TransactionNo || '',
        amount,
        currency: 'VND',
        responseCode: callbackData.vpc_TxnResponseCode,
        message: this.getOnePayResponseMessage(callbackData.vpc_TxnResponseCode),
        signature: callbackData.vpc_SecureHash,
        rawData: callbackData
      };

    } catch (error) {
      const err = error as Error;
      throw new Error(`OnePay callback handling failed: ${err.message}`);
    }
  }

  async queryPaymentStatus(transactionId: string): Promise<PaymentStatus> {
    try {
      this.logTransaction('queryPaymentStatus', { transactionId });

      const queryData = {
        vpc_Version: '2',
        vpc_Command: 'queryDR',
        vpc_Merchant: this.onePayConfig.merchantId,
        vpc_AccessCode: this.onePayConfig.accessCode,
        vpc_MerchTxnRef: transactionId,
        vpc_User: 'op01',
        vpc_Password: 'op123456'
      };

      // Generate secure hash
      const hashData = this.buildHashData(queryData);
      const secureHash = this.generateSecureHash(hashData);

      const response = await axios.post(this.onePayConfig.queryUrl, {
        ...queryData,
        vpc_SecureHash: secureHash
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const result = response.data;
      const status = this.mapOnePayStatus(result.vpc_TxnResponseCode);

      return {
        transactionId,
        status,
        amount: parseInt(result.vpc_Amount || '0') / 100,
        currency: 'VND',
        gatewayResponse: result
      };

    } catch (error) {
      console.error('OnePay query status error:', error);
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

      // OnePay doesn't support direct refund API, need manual process
      // This is a placeholder implementation
      
      return {
        success: false,
        refundAmount: 0,
        error: 'OnePay refunds must be processed manually through merchant portal'
      };

    } catch (error) {
      return {
        success: false,
        refundAmount: 0,
        error: `OnePay refund failed: ${(error as Error).message}`
      };
    }
  }

  verifySignature(data: any, signature: string): boolean {
    return this.verifyOnePaySignature(data);
  }

  private verifyOnePaySignature(callbackData: OnePayResponse): boolean {
    try {
      const { vpc_SecureHash, ...dataToVerify } = callbackData;
      const hashData = this.buildHashData(dataToVerify);
      const computedHash = this.generateSecureHash(hashData);
      return computedHash.toUpperCase() === vpc_SecureHash.toUpperCase();
    } catch (error) {
      console.error('OnePay signature verification error:', error);
      return false;
    }
  }

  private buildHashData(data: any): string {
    // Remove empty values and signature field
    const cleanData = this.removeEmptyValues(data);
    delete cleanData.vpc_SecureHash;

    // Sort keys and build hash string
    const sortedKeys = Object.keys(cleanData).sort();
    const hashString = sortedKeys
      .filter(key => key.startsWith('vpc_') || key.startsWith('user_'))
      .map(key => `${key}=${cleanData[key]}`)
      .join('&');

    return hashString;
  }

  private generateSecureHash(data: string): string {
    return crypto
      .createHash('sha256')
      .update(this.onePayConfig.secureSecret + data, 'utf8')
      .digest('hex')
      .toUpperCase();
  }

  private buildPaymentUrl(request: OnePayRequest): string {
    const cleanData = this.removeEmptyValues(request);
    const queryString = this.buildQueryString(cleanData);
    return `${this.onePayConfig.paymentUrl}?${queryString}`;
  }

  private mapOnePayStatus(responseCode: string): 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' {
    switch (responseCode) {
      case '0':
        return 'completed';
      case '99':
        return 'cancelled';
      case '1':
      case '2':
      case '3':
        return 'failed';
      default:
        return 'pending';
    }
  }

  private getOnePayResponseMessage(responseCode: string): string {
    const messages: Record<string, string> = {
      '0': 'Giao dịch thành công',
      '1': 'Ngân hàng từ chối giao dịch',
      '2': 'Ngân hàng không phản hồi',
      '3': 'Cửa hàng không tồn tại',
      '4': 'Giao dịch bị nghi ngờ gian lận',
      '5': 'Không đủ số dư',
      '6': 'Lỗi',
      '7': 'Ngân hàng không hỗ trợ giao dịch',
      '8': 'Ngân hàng không thể thực hiện giao dịch',
      '9': 'Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ',
      '99': 'Người dùng hủy giao dịch'
    };

    return messages[responseCode] || 'Lỗi không xác định';
  }
}
