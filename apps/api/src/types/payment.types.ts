export interface PaymentRequest {
  bookingId: string;
  userId?: string;
  amount: number;
  currency: string;
  description: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  returnUrl?: string;
  cancelUrl?: string;
  bankCode?: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentUrl?: string;
  transactionId?: string;
  gatewayOrderId?: string;
  qrCode?: string;
  deeplink?: string;
  error?: string;
  data?: any;
}

export interface PaymentCallback {
  success: boolean;
  transactionId: string;
  gatewayOrderId: string;
  amount: number;
  currency: string;
  responseCode: string;
  message: string;
  signature: string;
  rawData: any;
}

export interface PaymentStatus {
  transactionId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  gatewayResponse: any;
}

export interface RefundRequest {
  transactionId: string;
  gatewayOrderId?: string;
  amount: number;
  reason: string;
}

export interface RefundResponse {
  success: boolean;
  refundId?: string;
  refundAmount?: number;
  message?: string;
  error?: string;
}

// VNPAY specific types
export interface VNPayRequest {
  vnp_Version: string;
  vnp_Command: string;
  vnp_TmnCode: string;
  vnp_Amount: string;
  vnp_CurrCode: string;
  vnp_TxnRef: string;
  vnp_OrderInfo: string;
  vnp_OrderType: string;
  vnp_Locale: string;
  vnp_ReturnUrl: string;
  vnp_IpAddr: string;
  vnp_CreateDate: string;
  vnp_SecureHash?: string;
}

export interface VNPayResponse {
  vnp_Amount: string;
  vnp_BankCode: string;
  vnp_BankTranNo: string;
  vnp_CardType: string;
  vnp_OrderInfo: string;
  vnp_PayDate: string;
  vnp_ResponseCode: string;
  vnp_TmnCode: string;
  vnp_TransactionNo: string;
  vnp_TransactionStatus: string;
  vnp_TxnRef: string;
  vnp_SecureHash: string;
}

// ZaloPay specific types
export interface ZaloPayRequest {
  app_id: number; // Changed from string to number
  app_trans_id: string;
  app_user: string;
  app_time: number;
  amount: number;
  item: string;
  description: string;
  embed_data: string;
  bank_code: string;
  mac: string;
  callback_url?: string;
}

export interface ZaloPayResponse {
  return_code: number;
  return_message: string;
  sub_return_code: number;
  sub_return_message: string;
  order_url?: string;
  zp_trans_token?: string;
  order_token?: string;
  // Callback fields
  app_id?: string;
  app_trans_id?: string;
  app_user?: string;
  amount?: number;
  app_time?: number;
  embed_data?: string;
  item?: string;
  zp_trans_id?: string;
  status?: number;
  mac?: string;
}

export interface ZaloPayCallback {
  data: string;
  mac: string;
}

// MoMo specific types
export interface MoMoRequest {
  partnerCode: string;
  partnerName: string;
  storeId: string;
  requestId: string;
  amount: number;
  orderId: string;
  orderInfo: string;
  redirectUrl: string;
  ipnUrl: string;
  lang: string;
  requestType: string;
  autoCapture: boolean;
  extraData: string;
  signature: string;
}

export interface MoMoResponse {
  partnerCode: string;
  requestId: string;
  orderId: string;
  amount: number;
  responseTime: number;
  message: string;
  resultCode: number;
  payUrl?: string;
  deeplink?: string;
  qrCodeUrl?: string;
}

export interface MoMoCallback {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: number;
  orderInfo: string;
  orderType: string;
  transId: number;
  resultCode: number;
  message: string;
  payType: string;
  responseTime: number;
  extraData: string;
  signature: string;
}

// OnePay specific types
export interface OnePayRequest {
  vpc_Version: string;
  vpc_Command: string;
  vpc_AccessCode: string;
  vpc_MerchTxnRef: string;
  vpc_Merchant: string;
  vpc_OrderInfo: string;
  vpc_Amount: string;
  vpc_ReturnURL: string;
  vpc_Locale: string;
  vpc_Currency: string;
  vpc_TicketNo: string;
  vpc_Customer_Email: string;
  vpc_Customer_Phone: string;
  vpc_SecureHash?: string;
}

export interface OnePayResponse {
  vpc_Amount: string;
  vpc_Command: string;
  vpc_CurrencyCode: string;
  vpc_Locale: string;
  vpc_MerchTxnRef: string;
  vpc_Merchant: string;
  vpc_OrderInfo: string;
  vpc_TransactionNo: string;
  vpc_TxnResponseCode: string;
  vpc_Message: string;
  vpc_SecureHash: string;
}

export enum PaymentGateway {
  VNPAY = 'vnpay',
  ZALOPAY = 'zalopay',
  MOMO = 'momo',
  ONEPAY = 'onepay'
}

export enum PaymentStatusEnum {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}
