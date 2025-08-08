import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      hotelId,
      roomType,
      quantity = 1,
      checkIn,
      checkOut,
      guests,
      contactInfo,
      specialRequests,
      totalAmount,
      paymentMethod
    } = body;

    // Validate required fields
    if (!hotelId || !roomType || !checkIn || !checkOut || !contactInfo || !totalAmount || !paymentMethod) {
      return NextResponse.json(
        {
          success: false,
          message: 'Thiếu thông tin bắt buộc'
        },
        { status: 400 }
      );
    }

    // Generate booking number
    const bookingNumber = 'BK' + Date.now().toString();
    const transactionId = 'TXN' + Date.now().toString();

    // Simulate booking creation and payment processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate different payment method responses
    const responses: Record<string, any> = {
      vnpay: {
        success: true,
        message: 'Chuyển hướng đến VNPay',
        redirectUrl: `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=${totalAmount * 100}&vnp_Command=pay&vnp_CreateDate=${new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14)}&vnp_CurrCode=VND&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=${encodeURIComponent('Thanh toan dat phong khach san')}&vnp_OrderType=other&vnp_ReturnUrl=${encodeURIComponent('http://localhost:3000/payment/return')}&vnp_TmnCode=DEMO&vnp_TxnRef=${bookingNumber}&vnp_Version=2.1.0`,
        bookingNumber,
        transactionId
      },
      momo: {
        success: true,
        message: 'Chuyển hướng đến MoMo',
        redirectUrl: `https://test-payment.momo.vn/v2/gateway/pay?partnerCode=DEMO&requestId=${bookingNumber}&amount=${totalAmount}&orderId=${bookingNumber}&orderInfo=${encodeURIComponent('Thanh toan dat phong')}&returnUrl=${encodeURIComponent('http://localhost:3000/payment/return')}&notifyUrl=${encodeURIComponent('http://localhost:3001/api/payment/momo/callback')}&extraData=`,
        bookingNumber,
        transactionId
      },
      zalopay: {
        success: true,
        message: 'Chuyển hướng đến ZaloPay',
        redirectUrl: `https://sb-openapi.zalopay.vn/v2/create?app_id=2553&app_trans_id=${bookingNumber}&app_user=demo&amount=${totalAmount}&description=${encodeURIComponent('Thanh toan dat phong')}&bank_code=&callback_url=${encodeURIComponent('http://localhost:3001/api/payment/zalopay/callback')}`,
        bookingNumber,
        transactionId
      },
      onepay: {
        success: true,
        message: 'Đặt phòng thành công (Demo)',
        bookingNumber,
        transactionId
      }
    };

    const response = responses[paymentMethod] || responses.onepay;

    // Log booking data for debugging
    console.log('Hotel booking created:', {
      bookingNumber,
      hotelId,
      roomType,
      quantity,
      checkIn,
      checkOut,
      guests,
      contactInfo,
      totalAmount,
      paymentMethod
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Book hotel error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Lỗi khi đặt phòng',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
