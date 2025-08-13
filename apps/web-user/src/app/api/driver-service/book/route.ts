import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { itineraryId, driverId, totalAmount, paymentMethod } = body || {};

    if (!itineraryId || !driverId || !totalAmount || !paymentMethod) {
      return NextResponse.json({ success: false, message: 'Thiếu thông tin đặt tài xế' }, { status: 400 });
    }

    const bookingNumber = 'BKDRV-' + Date.now();
    const transactionId = 'TXN-' + Date.now();

    // Simulate different gateways similar to hotels/car-rental
    const responses: Record<string, any> = {
      vnpay: {
        success: true,
        message: 'Chuyển hướng đến VNPay',
        redirectUrl: `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=${totalAmount * 100}&vnp_Command=pay&vnp_CreateDate=${new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14)}&vnp_CurrCode=VND&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=${encodeURIComponent('Thanh toan dat tai xe Go_Safe')}&vnp_OrderType=other&vnp_ReturnUrl=${encodeURIComponent('http://localhost:3000/payment/return')}&vnp_TmnCode=DEMO&vnp_TxnRef=${bookingNumber}&vnp_Version=2.1.0`,
        bookingNumber,
        transactionId,
      },
      momo: {
        success: true,
        message: 'Chuyển hướng đến MoMo',
        redirectUrl: `https://test-payment.momo.vn/gw_payment/transactionProcessor?amount=${totalAmount}&orderId=${bookingNumber}&orderInfo=${encodeURIComponent('Thanh toan dat tai xe')}&returnUrl=${encodeURIComponent('http://localhost:3000/payment/return')}`,
        bookingNumber,
        transactionId,
      },
      zalopay: {
        success: true,
        message: 'Chuyển hướng đến ZaloPay',
        redirectUrl: `https://sb-openapi.zalopay.vn/v2/create?app_id=2553&app_trans_id=${bookingNumber}&app_user=demo&amount=${totalAmount}&description=${encodeURIComponent('Thanh toan dat tai xe')}&bank_code=&callback_url=${encodeURIComponent('http://localhost:3001/api/payment/zalopay/callback')}`,
        bookingNumber,
        transactionId,
      },
      onepay: {
        success: true,
        message: 'Đặt tài xế thành công (Demo)',
        bookingNumber,
        transactionId,
      },
    };

    const response = responses[paymentMethod] || responses.onepay;

    console.log('Driver booking created:', { bookingNumber, itineraryId, driverId, totalAmount, paymentMethod });

    return NextResponse.json(response);
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e?.message || 'Server error' }, { status: 500 });
  }
}

