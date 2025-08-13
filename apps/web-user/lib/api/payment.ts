import { request } from './core';

// Payment APIs
export async function createPayment(paymentData: {
  bookingNumber: string;
  amount: number;
  currency?: string;
  gateway?: string;
  customerInfo?: {
    name: string;
    email: string;
    phone: string;
  };
}) {
  return request('/payments/create', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  });
}

export async function getPaymentStatus(gateway: string, transactionId: string) {
  return request(`/payments/status/${gateway}/${transactionId}`);
}