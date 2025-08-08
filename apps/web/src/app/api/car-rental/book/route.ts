import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      carId,
      pickupDate,
      returnDate,
      pickupLocation,
      returnLocation,
      driverInfo,
      contactInfo,
      additionalServices,
      specialRequests,
      totalAmount,
      paymentMethod
    } = body;

    // Validate required fields
    if (!carId || !pickupDate || !returnDate || !driverInfo || !contactInfo || !totalAmount || !paymentMethod) {
      return NextResponse.json(
        {
          success: false,
          message: 'Thiếu thông tin bắt buộc'
        },
        { status: 400 }
      );
    }

    // Generate booking number and transaction ID
    const bookingNumber = 'CR' + Date.now().toString();
    const transactionId = 'TXN' + Date.now().toString();

    // Calculate rental days
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    const rentalDays = Math.max(1, Math.ceil((returnD.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24)));

    // Mock payment processing - different responses based on payment method
    const responses: Record<string, any> = {
      vnpay: {
        success: true,
        message: 'Chuyển hướng đến VNPay',
        redirectUrl: `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=${totalAmount * 100}&vnp_Command=pay&vnp_CreateDate=${new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14)}&vnp_CurrCode=VND&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=${encodeURIComponent('Thanh toan thue xe du lich')}&vnp_OrderType=other&vnp_ReturnUrl=${encodeURIComponent('http://localhost:3000/payment/return')}&vnp_TmnCode=DEMO&vnp_TxnRef=${bookingNumber}&vnp_Version=2.1.0`,
        bookingNumber,
        transactionId
      },
      momo: {
        success: true,
        message: 'Chuyển hướng đến MoMo',
        redirectUrl: `https://test-payment.momo.vn/v2/gateway/pay?partnerCode=DEMO&requestId=${bookingNumber}&amount=${totalAmount}&orderId=${bookingNumber}&orderInfo=${encodeURIComponent('Thanh toan thue xe')}&returnUrl=${encodeURIComponent('http://localhost:3000/payment/return')}&notifyUrl=${encodeURIComponent('http://localhost:3001/api/payment/momo/callback')}&extraData=`,
        bookingNumber,
        transactionId
      },
      zalopay: {
        success: true,
        message: 'Chuyển hướng đến ZaloPay',
        redirectUrl: `https://sb-openapi.zalopay.vn/v2/create?app_id=2553&app_trans_id=${bookingNumber}&app_user=demo&amount=${totalAmount}&description=${encodeURIComponent('Thanh toan thue xe')}&bank_code=&callback_url=${encodeURIComponent('http://localhost:3001/api/payment/zalopay/callback')}`,
        bookingNumber,
        transactionId
      },
      onepay: {
        success: true,
        message: 'Đặt xe thành công (Demo)',
        bookingNumber,
        transactionId
      }
    };

    const response = responses[paymentMethod] || responses.onepay;

    // Log booking data for debugging
    console.log('Car rental booking created:', {
      bookingNumber,
      carId,
      pickupDate,
      returnDate,
      pickupLocation,
      returnLocation,
      driverInfo,
      contactInfo,
      additionalServices,
      specialRequests,
      totalAmount,
      paymentMethod,
      rentalDays
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Book car error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Lỗi khi đặt xe',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
