import { PaymentGateway } from './PaymentGateway.abstract';
import { PaymentRequest, PaymentResponse, PaymentCallback, PaymentStatus, RefundRequest, RefundResponse } from '../../types/payment.types';
import { createSepayOrder, verifySepaySignature } from '../sepay.service';

export class SepayGateway extends PaymentGateway {
  constructor(config: any) {
    super('sepay', config);
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    // Chuyển đổi dữ liệu sang định dạng Sepay yêu cầu
    const params = {
      amount: request.amount,
      orderId: request.bookingId,
      description: request.description,
      returnUrl: this.config.returnUrl,
      notifyUrl: this.config.notifyUrl,
      // ... các trường khác nếu Sepay yêu cầu
    };
    const result = await createSepayOrder(params);
    return {
      success: result.success,
      transactionId: result.orderId || '',
      paymentUrl: result.paymentUrl || '',
      error: result.error || undefined,
    };
  }

  async handleCallback(callbackData: any): Promise<PaymentCallback> {
    // Xác thực chữ ký callback
    const isValid = verifySepaySignature(callbackData, callbackData.signature);
    return {
      success: isValid,
      transactionId: callbackData.transactionId || '',
      gatewayOrderId: callbackData.gatewayOrderId || '',
      amount: callbackData.amount || 0,
      currency: callbackData.currency || 'VND',
      responseCode: callbackData.responseCode || '',
      message: isValid ? 'OK' : 'Invalid signature',
      signature: callbackData.signature || '',
      status: callbackData.status || 'pending',
      rawData: callbackData,
    };
  }

  async queryPaymentStatus(transactionId: string): Promise<PaymentStatus> {
    // TODO: Gọi API Sepay để kiểm tra trạng thái giao dịch
    return {
      transactionId,
      status: 'pending',
      amount: 0,
      currency: 'VND',
      gatewayResponse: {},
    };
  }

  async refundPayment(request: RefundRequest): Promise<RefundResponse> {
    // TODO: Gọi API Sepay để hoàn tiền
    return { success: false, error: 'Not implemented' };
  }

  verifySignature(data: any, signature: string): boolean {
    return verifySepaySignature(data, signature);
  }
}
