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
  VNPayRequest,
  VNPayResponse
} from '../../types/payment.types';

interface VNPayConfig {
  tmnCode: string;
  hashSecret: string;
  url: string;
  apiUrl: string;
  returnUrl: string;
  notifyUrl: string;
}

export class VNPayGateway extends PaymentGateway {
  private vnpayConfig: VNPayConfig;

  constructor(config: VNPayConfig) {
    super('vnpay', config);
    this.vnpayConfig = config;
    this.validateConfig();
  }

  protected validateConfig(): boolean {
    const required = ['tmnCode', 'hashSecret', 'url', 'returnUrl'];
    for (const field of required) {
      if (!this.vnpayConfig[field as keyof VNPayConfig]) {
        throw new Error(`VNPay configuration missing: ${field}`);
      }
    }
    return true;
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      this.logTransaction('createPayment', { bookingId: request.bookingId, amount: request.amount });

      const txnRef = this.generateTransactionId();
      const createDate = this.formatDateTime();
      const amount = this.formatAmount(request.amount) * 100; // VNPay expects amount in smallest currency unit
      
      const vnpayRequest: VNPayRequest = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: this.vnpayConfig.tmnCode,
        vnp_Amount: amount.toString(),
        vnp_CurrCode: 'VND',
        vnp_TxnRef: txnRef,
        vnp_OrderInfo: request.description || `Thanh toan don hang ${request.bookingId}`,
        vnp_OrderType: 'other',
        vnp_Locale: 'vn',
        vnp_ReturnUrl: request.returnUrl || this.vnpayConfig.returnUrl,
        vnp_IpAddr: '127.0.0.1', // Should be actual client IP
        vnp_CreateDate: createDate
      };

      // Generate secure hash
      const signData = this.buildSignData(vnpayRequest);
      vnpayRequest.vnp_SecureHash = this.generateSecureHash(signData);

      // Build payment URL
      const paymentUrl = this.buildPaymentUrl(vnpayRequest);

      return {
        success: true,
        paymentUrl,
        transactionId: txnRef,
        gatewayOrderId: txnRef,
        data: {
          gateway: 'vnpay',
          amount: request.amount,
          currency: request.currency
        }
      };

    } catch (error) {
      return this.handleError(error, 'createPayment');
    }
  }

  async handleCallback(callbackData: VNPayResponse): Promise<PaymentCallback> {
    try {
      this.logTransaction('handleCallback', callbackData);

      // Verify signature
      const { vnp_SecureHash, ...dataToVerify } = callbackData;
      const isValidSignature = this.verifySignature(dataToVerify, vnp_SecureHash);

      if (!isValidSignature) {
        throw new Error('Invalid signature');
      }

      const success = callbackData.vnp_ResponseCode === '00' && callbackData.vnp_TransactionStatus === '00';
      const amount = parseInt(callbackData.vnp_Amount) / 100; // Convert back from smallest unit

      return {
        success,
        transactionId: callbackData.vnp_TxnRef,
        gatewayOrderId: callbackData.vnp_TransactionNo,
        amount,
        currency: 'VND',
        responseCode: callbackData.vnp_ResponseCode,
        message: this.getVNPayResponseMessage(callbackData.vnp_ResponseCode),
        signature: vnp_SecureHash,
        rawData: callbackData
      };

    } catch (error) {
      const err = error as Error;
      throw new Error(`VNPay callback handling failed: ${err.message}`);
    }
  }

  async queryPaymentStatus(transactionId: string): Promise<PaymentStatus> {
    try {
      this.logTransaction('queryPaymentStatus', { transactionId });

      const requestData = {
        vnp_Version: '2.1.0',
        vnp_Command: 'querydr',
        vnp_TmnCode: this.vnpayConfig.tmnCode,
        vnp_TxnRef: transactionId,
        vnp_OrderInfo: `Query transaction ${transactionId}`,
        vnp_TransactionDate: this.formatDateTime(),
        vnp_CreateDate: this.formatDateTime(),
        vnp_IpAddr: '127.0.0.1'
      };

      // Generate secure hash for query
      const signData = this.buildSignData(requestData);
      const secureHash = this.generateSecureHash(signData);

      const response = await axios.post(this.vnpayConfig.apiUrl, {
        ...requestData,
        vnp_SecureHash: secureHash
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = response.data;
      const status = this.mapVNPayStatus(result.vnp_ResponseCode, result.vnp_TransactionStatus);

      return {
        transactionId,
        status,
        amount: parseInt(result.vnp_Amount || '0') / 100,
        currency: 'VND',
        gatewayResponse: result
      };

    } catch (error) {
      console.error('VNPay query status error:', error);
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

      const refundData = {
        vnp_Version: '2.1.0',
        vnp_Command: 'refund',
        vnp_TmnCode: this.vnpayConfig.tmnCode,
        vnp_TransactionType: '03', // Full refund
        vnp_TxnRef: request.transactionId,
        vnp_Amount: (this.formatAmount(request.amount) * 100).toString(),
        vnp_OrderInfo: request.reason,
        vnp_TransactionNo: request.transactionId,
        vnp_TransactionDate: this.formatDateTime(),
        vnp_CreateBy: 'system',
        vnp_CreateDate: this.formatDateTime(),
        vnp_IpAddr: '127.0.0.1'
      };

      // Generate secure hash
      const signData = this.buildSignData(refundData);
      const secureHash = this.generateSecureHash(signData);

      const response = await axios.post(this.vnpayConfig.apiUrl, {
        ...refundData,
        vnp_SecureHash: secureHash
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = response.data;
      const success = result.vnp_ResponseCode === '00';

      return {
        success,
        refundId: result.vnp_TransactionNo || undefined,
        refundAmount: success ? request.amount : 0,
        message: this.getVNPayResponseMessage(result.vnp_ResponseCode),
        error: success ? undefined : result.vnp_Message
      };

    } catch (error) {
      return {
        success: false,
        refundAmount: 0,
        error: `VNPay refund failed: ${(error as Error).message}`
      };
    }
  }

  verifySignature(data: any, signature: string): boolean {
    try {
      const signData = this.buildSignData(data);
      const computedSignature = this.generateSecureHash(signData);
      return computedSignature === signature;
    } catch (error) {
      console.error('VNPay signature verification error:', error);
      return false;
    }
  }

  private buildSignData(data: any): string {
    // Remove signature field and empty values
    const cleanData = this.removeEmptyValues(data);
    delete cleanData.vnp_SecureHash;
    delete cleanData.vnp_SecureHashType;

    // Sort keys and build query string
    return this.buildQueryString(cleanData);
  }

  private generateSecureHash(data: string): string {
    return crypto
      .createHmac('sha512', this.vnpayConfig.hashSecret)
      .update(data, 'utf-8')
      .digest('hex');
  }

  private buildPaymentUrl(request: VNPayRequest): string {
    const cleanData = this.removeEmptyValues(request);
    const queryString = this.buildQueryString(cleanData);
    return `${this.vnpayConfig.url}?${queryString}`;
  }

  private mapVNPayStatus(responseCode: string, transactionStatus?: string): 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' {
    if (responseCode === '00' && transactionStatus === '00') {
      return 'completed';
    } else if (responseCode === '07') {
      return 'processing';
    } else if (responseCode === '24') {
      return 'cancelled';
    } else if (responseCode === '09' || responseCode === '10') {
      return 'pending';
    } else {
      return 'failed';
    }
  }

  private getVNPayResponseMessage(responseCode: string): string {
    const messages: Record<string, string> = {
      '00': 'Giao dịch thành công',
      '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
      '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
      '10': 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
      '11': 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
      '12': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
      '13': 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP).',
      '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
      '51': 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
      '65': 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
      '75': 'Ngân hàng thanh toán đang bảo trì.',
      '79': 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định.',
      '99': 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)'
    };

    return messages[responseCode] || 'Lỗi không xác định';
  }
}
