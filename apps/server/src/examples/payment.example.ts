import { PaymentService } from '../services/payment/PaymentService';
import { PaymentRequest } from '../types/payment.types';

/**
 * Example usage of Payment Service
 * This file demonstrates how to use the payment integration system
 */

async function examplePaymentFlow() {
  try {
    // Initialize payment service
    console.log('🚀 Initializing Payment Service...');
    const paymentService = PaymentService.fromEnv();

    // Check available gateways
    const availableGateways = paymentService.getAvailableGateways();
    console.log('✅ Available gateways:', availableGateways);

    // Health check
    const health = await paymentService.healthCheck();
    console.log('💊 Health check:', health);

    // Example payment request
    const paymentRequest: PaymentRequest = {
      bookingId: 'BOOK_001',
      userId: 'USER_123',
      amount: 1500000, // 1,500,000 VND
      currency: 'VND',
      description: 'Thanh toán tour Hạ Long 3 ngày 2 đêm',
      customerInfo: {
        name: 'Nguyễn Văn An',
        email: 'an.nguyen@example.com',
        phone: '0912345678'
      },
      returnUrl: 'https://vilandtravel.com/payment/return',
      bankCode: 'NCB' // For specific bank (optional)
    };

    console.log('\n📝 Payment Request:', JSON.stringify(paymentRequest, null, 2));

    // Test different gateways
    for (const gateway of availableGateways) {
      console.log(`\n💳 Testing ${gateway.toUpperCase()} gateway...`);
      
      try {
        // Create payment
        const paymentResponse = await paymentService.createPayment(paymentRequest, gateway);
        
        if (paymentResponse.success) {
          console.log(`✅ ${gateway} payment created successfully:`);
          console.log(`   - Payment URL: ${paymentResponse.paymentUrl}`);
          console.log(`   - Transaction ID: ${paymentResponse.transactionId}`);
          console.log(`   - Gateway Order ID: ${paymentResponse.gatewayOrderId}`);
          
          if (paymentResponse.qrCode) {
            console.log(`   - QR Code: ${paymentResponse.qrCode}`);
          }
          
          if (paymentResponse.deeplink) {
            console.log(`   - Deeplink: ${paymentResponse.deeplink}`);
          }

          // Example: Query payment status after creation
          if (paymentResponse.transactionId) {
            console.log(`🔍 Querying payment status for ${paymentResponse.transactionId}...`);
            const status = await paymentService.queryPaymentStatus(paymentResponse.transactionId, gateway);
            console.log(`📊 Payment Status: ${status.status}`);
          }

        } else {
          console.log(`❌ ${gateway} payment failed: ${paymentResponse.error}`);
        }
        
      } catch (error) {
        console.error(`❌ Error with ${gateway}:`, (error as Error).message);
      }
    }

    // Example callback handling (simulation)
    console.log('\n📞 Simulating callback handling...');
    
    // VNPay callback simulation
    if (availableGateways.includes('vnpay')) {
      const vnpayCallback = {
        vnp_Amount: '150000000', // 1,500,000 VND in cents
        vnp_BankCode: 'NCB',
        vnp_BankTranNo: 'VNP14379142',
        vnp_CardType: 'ATM',
        vnp_OrderInfo: 'Thanh toan tour Ha Long',
        vnp_PayDate: '20231201120000',
        vnp_ResponseCode: '00',
        vnp_TmnCode: 'VILANDTRAVEL01',
        vnp_TransactionNo: '14379142',
        vnp_TransactionStatus: '00',
        vnp_TxnRef: 'BOOK_001_1701422400',
        vnp_SecureHash: 'sample_hash_here'
      };

      try {
        console.log('🔐 Testing VNPay signature verification...');
        const isValid = paymentService.verifySignature(vnpayCallback, vnpayCallback.vnp_SecureHash, 'vnpay');
        console.log(`✅ VNPay signature valid: ${isValid}`);
      } catch (error) {
        console.log('⚠️ VNPay signature verification test skipped (requires valid config)');
      }
    }

    // Example refund request
    console.log('\n💰 Testing refund functionality...');
    const refundRequest = {
      transactionId: 'BOOK_001_1701422400',
      gatewayOrderId: '14379142',
      amount: 500000, // Partial refund: 500,000 VND
      reason: 'Khách hàng yêu cầu hoàn tiền một phần'
    };

    for (const gateway of availableGateways) {
      try {
        const refundResult = await paymentService.refundPayment(refundRequest, gateway);
        
        if (refundResult.success) {
          console.log(`✅ ${gateway} refund successful: ${refundResult.refundId}`);
        } else {
          console.log(`ℹ️ ${gateway} refund info: ${refundResult.error}`);
        }
      } catch (error) {
        console.log(`⚠️ ${gateway} refund test skipped: ${(error as Error).message}`);
      }
    }

    console.log('\n🎉 Payment system test completed successfully!');
    
  } catch (error) {
    console.error('❌ Payment system test failed:', error);
  }
}

/**
 * Example webhook/callback handlers
 */
export const exampleWebhookHandlers = {
  
  // VNPay return handler
  vnpayReturn: async (queryParams: any) => {
    console.log('🔄 VNPay return handler called');
    const paymentService = PaymentService.fromEnv();
    
    try {
      const result = await paymentService.handleCallback(queryParams, 'vnpay');
      
      if (result.success) {
        console.log('✅ Payment successful, redirect to success page');
        return { success: true, redirectUrl: '/payment/success' };
      } else {
        console.log('❌ Payment failed, redirect to failure page');
        return { success: false, redirectUrl: '/payment/failed' };
      }
      
    } catch (error) {
      console.error('❌ VNPay return handler error:', error);
      return { success: false, redirectUrl: '/payment/error' };
    }
  },

  // ZaloPay callback handler
  zaloPayCallback: async (callbackData: any) => {
    console.log('📞 ZaloPay callback handler called');
    const paymentService = PaymentService.fromEnv();
    
    try {
      const result = await paymentService.handleCallback(callbackData, 'zalopay');
      
      // ZaloPay expects specific response format
      return {
        return_code: result.success ? 1 : -1,
        return_message: result.success ? 'success' : 'failed'
      };
      
    } catch (error) {
      console.error('❌ ZaloPay callback handler error:', error);
      return { return_code: -1, return_message: 'error' };
    }
  },

  // MoMo IPN handler
  momoIPN: async (ipnData: any) => {
    console.log('📞 MoMo IPN handler called');
    const paymentService = PaymentService.fromEnv();
    
    try {
      const result = await paymentService.handleCallback(ipnData, 'momo');
      
      // Log the transaction for business logic
      console.log('💾 Updating booking status in database...');
      
      // Return 204 status (MoMo requirement)
      return { statusCode: 204 };
      
    } catch (error) {
      console.error('❌ MoMo IPN handler error:', error);
      return { statusCode: 500 };
    }
  }
};

/**
 * Configuration validation helper
 */
export function validatePaymentConfig() {
  console.log('🔍 Validating payment configuration...');
  
  const requiredEnvVars = {
    vnpay: ['VNPAY_TMN_CODE', 'VNPAY_HASH_SECRET', 'VNPAY_URL'],
    zalopay: ['ZALOPAY_APP_ID', 'ZALOPAY_KEY1', 'ZALOPAY_KEY2'],
    momo: ['MOMO_PARTNER_CODE', 'MOMO_ACCESS_KEY', 'MOMO_SECRET_KEY'],
    onepay: ['ONEPAY_MERCHANT_ID', 'ONEPAY_ACCESS_CODE', 'ONEPAY_SECURE_SECRET']
  };

  const configStatus: Record<string, boolean> = {};

  for (const [gateway, vars] of Object.entries(requiredEnvVars)) {
    const hasAllVars = vars.every(varName => process.env[varName]);
    configStatus[gateway] = hasAllVars;
    
    if (hasAllVars) {
      console.log(`✅ ${gateway.toUpperCase()} configuration complete`);
    } else {
      console.log(`⚠️ ${gateway.toUpperCase()} configuration incomplete. Missing: ${vars.filter(v => !process.env[v]).join(', ')}`);
    }
  }

  return configStatus;
}

// Run example if this file is executed directly
if (require.main === module) {
  console.log('🧪 Running Payment System Example...\n');
  
  // First validate configuration
  validatePaymentConfig();
  
  // Then run the example
  examplePaymentFlow().catch(console.error);
}
