import { PaymentRequest, PaymentResponse, PaymentCallback, PaymentStatus, RefundRequest, RefundResponse } from '../../types/payment.types';

export abstract class PaymentGateway {
  protected gatewayName: string;
  protected config: any;

  constructor(gatewayName: string, config: any) {
    this.gatewayName = gatewayName;
    this.config = config;
  }

  // Abstract methods that must be implemented by each payment gateway
  abstract createPayment(request: PaymentRequest): Promise<PaymentResponse>;
  abstract handleCallback(callbackData: any): Promise<PaymentCallback>;
  abstract queryPaymentStatus(transactionId: string): Promise<PaymentStatus>;
  abstract refundPayment(request: RefundRequest): Promise<RefundResponse>;
  abstract verifySignature(data: any, signature: string): boolean;

  // Common utility methods
  protected generateTransactionId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${this.gatewayName.toUpperCase()}_${timestamp}_${random}`;
  }

  protected formatAmount(amount: number, currency: string = 'VND'): number {
    // Most Vietnamese payment gateways expect amount in VND without decimal
    if (currency === 'VND') {
      return Math.round(amount);
    }
    return amount;
  }

  protected formatDateTime(date: Date = new Date()): string {
    // Format: yyyyMMddHHmmss
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }

  protected getCurrentTimestamp(): number {
    return Math.floor(Date.now() / 1000);
  }

  protected buildQueryString(params: Record<string, any>): string {
    const sortedKeys = Object.keys(params).sort();
    const pairs = sortedKeys
      .filter(key => params[key] !== undefined && params[key] !== null && params[key] !== '')
      .map(key => `${key}=${encodeURIComponent(params[key])}`);
    return pairs.join('&');
  }

  protected removeEmptyValues(obj: Record<string, any>): Record<string, any> {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined && value !== null && value !== '') {
        result[key] = value;
      }
    }
    return result;
  }

  protected validateConfig(): boolean {
    if (!this.config) {
      throw new Error(`Configuration is required for ${this.gatewayName}`);
    }
    return true;
  }

  protected handleError(error: any, context: string): PaymentResponse {
    console.error(`${this.gatewayName} ${context} error:`, error);
    
    return {
      success: false,
      error: error.message || `${this.gatewayName} payment failed`,
      data: {
        context,
        originalError: error
      }
    };
  }

  protected logTransaction(action: string, data: any): void {
    console.log(`${this.gatewayName} ${action}:`, {
      timestamp: new Date().toISOString(),
      gateway: this.gatewayName,
      action,
      data: this.sanitizeLogData(data)
    });
  }

  private sanitizeLogData(data: any): any {
    if (!data || typeof data !== 'object') return data;
    
    const sensitive = ['password', 'secret', 'key', 'hash', 'signature', 'token'];
    const sanitized = { ...data };
    
    for (const key of Object.keys(sanitized)) {
      if (sensitive.some(s => key.toLowerCase().includes(s))) {
        sanitized[key] = '***REDACTED***';
      }
    }
    
    return sanitized;
  }

  // Getter methods
  public getGatewayName(): string {
    return this.gatewayName;
  }

  public getConfig(): any {
    return { ...this.config };
  }

  // Status mapping helper
  protected mapGatewayStatus(gatewayStatus: string): 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' {
    // This should be overridden by each gateway implementation
    return 'pending';
  }
}
