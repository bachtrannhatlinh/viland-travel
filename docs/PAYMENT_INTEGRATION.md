# Hệ thống Tích hợp Thanh toán GoSafe

Hệ thống tích hợp các cổng thanh toán nội địa Việt Nam cho GoSafe Booking Tour.

## 🚀 Tính năng

- ✅ **VNPay** - Cổng thanh toán phổ biến nhất Việt Nam
- ✅ **ZaloPay** - Ví điện tử của Zalo
- ✅ **MoMo** - Ví điện tử MoMo
- ✅ **OnePay** - Cổng thanh toán quốc tế
- 🔐 **Bảo mật cao** - Xác thực chữ ký và mã hóa
- 📱 **Đa nền tảng** - Hỗ trợ web, mobile
- 🔄 **Webhook/Callback** - Xử lý thông báo real-time
- 💰 **Hoàn tiền** - Hỗ trợ hoàn tiền tự động
- 📊 **Truy vấn trạng thái** - Kiểm tra tình trạng thanh toán

## 📋 Yêu cầu hệ thống

- Node.js >= 16
- TypeScript >= 4.5
- Dependencies: crypto-js, axios, moment, uuid

## ⚙️ Cấu hình

### 1. Cài đặt dependencies

```bash
npm install crypto-js node-forge axios moment uuid
npm install @types/crypto-js @types/uuid --save-dev
```

### 2. Cấu hình biến môi trường

Tạo file `.env.payment` hoặc thêm vào `.env`:

```bash
# VNPay Configuration
VNPAY_TMN_CODE=GOSAFE01
VNPAY_HASH_SECRET=your_vnpay_secret_key
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_API_URL=https://sandbox.vnpayment.vn/merchant_webapi/api/transaction
VNPAY_RETURN_URL=https://your-domain.com/api/payments/return/vnpay
VNPAY_NOTIFY_URL=https://your-domain.com/api/payments/callback/vnpay

# ZaloPay Configuration
ZALOPAY_APP_ID=2553
ZALOPAY_KEY1=PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL
ZALOPAY_KEY2=kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz
ZALOPAY_ENDPOINT=https://sb-openapi.zalopay.vn/v2
ZALOPAY_CALLBACK_URL=https://your-domain.com/api/payments/callback/zalopay

# MoMo Configuration
MOMO_PARTNER_CODE=MOMO
MOMO_ACCESS_KEY=F8BBA842ECF85
MOMO_SECRET_KEY=K951B6PE1waDMi640xX08PD3vg6EkVlz
MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api
MOMO_REDIRECT_URL=https://your-domain.com/api/payments/return/momo
MOMO_IPN_URL=https://your-domain.com/api/payments/callback/momo

# OnePay Configuration
ONEPAY_MERCHANT_ID=TESTONEPAY
ONEPAY_ACCESS_CODE=D67342C2
ONEPAY_SECURE_SECRET=A3EFDFABA8653DF2342E8DAC29B51AF0
ONEPAY_PAYMENT_URL=https://mtf.onepay.vn/paygate/vpcpay.op
ONEPAY_QUERY_URL=https://mtf.onepay.vn/msp/api/v1/merchant/query
ONEPAY_RETURN_URL=https://your-domain.com/api/payments/return/onepay

# Frontend URLs
FRONTEND_URL=https://your-frontend-domain.com
```

## 🚀 Sử dụng

### 1. Khởi tạo Payment Service

```typescript
import { PaymentService } from './services/payment/PaymentService';

// Khởi tạo từ biến môi trường
const paymentService = PaymentService.fromEnv();

// Hoặc khởi tạo với config tùy chỉnh
const paymentService = new PaymentService({
  vnpay: {
    tmnCode: 'GOSAFE01',
    hashSecret: 'your_secret',
    url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    // ... other configs
  }
});
```

### 2. Tạo thanh toán

```typescript
import { PaymentRequest } from './types/payment.types';

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
  returnUrl: 'https://your-site.com/payment/return'
};

// Tạo thanh toán với VNPay
const response = await paymentService.createPayment(paymentRequest, 'vnpay');

if (response.success) {
  // Redirect user to payment URL
  window.location.href = response.paymentUrl;
}
```

### 3. Xử lý callback

```typescript
// Xử lý callback từ cổng thanh toán
app.post('/api/payments/callback/:gateway', async (req, res) => {
  const gateway = req.params.gateway;
  const callbackData = req.body;

  try {
    const result = await paymentService.handleCallback(callbackData, gateway);
    
    if (result.success) {
      // Cập nhật trạng thái booking
      await updateBookingStatus(result.transactionId, 'paid');
      
      // Gửi email xác nhận
      await sendConfirmationEmail(result.transactionId);
    }

    // Trả về response theo yêu cầu của từng gateway
    if (gateway === 'zalopay') {
      res.json({ return_code: result.success ? 1 : -1 });
    } else {
      res.json({ RspCode: result.success ? '00' : '99' });
    }
  } catch (error) {
    console.error('Callback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

### 4. Truy vấn trạng thái

```typescript
// Kiểm tra trạng thái thanh toán
const status = await paymentService.queryPaymentStatus('TRANSACTION_ID', 'vnpay');

console.log('Payment status:', status.status); // 'pending' | 'completed' | 'failed'
```

### 5. Hoàn tiền

```typescript
const refundRequest = {
  transactionId: 'TRANSACTION_ID',
  amount: 500000, // Hoàn 500,000 VND
  reason: 'Khách hàng yêu cầu hủy tour'
};

const refund = await paymentService.refundPayment(refundRequest, 'vnpay');

if (refund.success) {
  console.log('Refund successful:', refund.refundId);
}
```

## 🔗 API Endpoints

### Public Endpoints

- `POST /api/payments/create` - Tạo thanh toán mới
- `POST /api/payments/callback/:gateway` - Webhook từ cổng thanh toán
- `GET /api/payments/return/:gateway` - URL return từ cổng thanh toán
- `GET /api/payments/gateways` - Danh sách cổng thanh toán khả dụng
- `GET /api/payments/health` - Health check

### Protected Endpoints (cần authentication)

- `GET /api/payments/status/:gateway/:transactionId` - Truy vấn trạng thái
- `POST /api/payments/refund/:gateway` - Hoàn tiền
- `POST /api/payments/verify/:gateway` - Xác thực chữ ký

## 📱 Frontend Integration

### React/Next.js Example

```typescript
// components/PaymentButton.tsx
import { useState } from 'react';

interface PaymentButtonProps {
  booking: {
    id: string;
    amount: number;
    description: string;
  };
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  gateway?: 'vnpay' | 'zalopay' | 'momo' | 'onepay';
}

export function PaymentButton({ booking, customer, gateway = 'vnpay' }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          amount: booking.amount,
          currency: 'VND',
          description: booking.description,
          customerInfo: customer,
          gateway
        })
      });

      const result = await response.json();

      if (result.success) {
        // Redirect to payment gateway
        window.location.href = result.data.paymentUrl;
      } else {
        alert('Tạo thanh toán thất bại: ' + result.error);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Có lỗi xảy ra khi tạo thanh toán');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handlePayment} 
      disabled={loading}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
    >
      {loading ? 'Đang tạo thanh toán...' : `Thanh toán ${gateway.toUpperCase()}`}
    </button>
  );
}
```

### Payment Result Page

```typescript
// pages/payment/result.tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function PaymentResult() {
  const router = useRouter();
  const { success, transactionId, amount, message, gateway } = router.query;
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    if (transactionId && gateway) {
      // Verify payment status
      fetch(`/api/payments/status/${gateway}/${transactionId}`)
        .then(res => res.json())
        .then(data => {
          console.log('Payment verification:', data);
          setVerifying(false);
        })
        .catch(err => {
          console.error('Verification error:', err);
          setVerifying(false);
        });
    }
  }, [transactionId, gateway]);

  if (verifying) {
    return <div>Đang xác thực thanh toán...</div>;
  }

  return (
    <div className="payment-result">
      {success === 'true' ? (
        <div className="success">
          <h2>✅ Thanh toán thành công!</h2>
          <p>Mã giao dịch: {transactionId}</p>
          <p>Số tiền: {amount?.toLocaleString()} VND</p>
          <p>Cổng thanh toán: {gateway}</p>
        </div>
      ) : (
        <div className="failure">
          <h2>❌ Thanh toán thất bại</h2>
          <p>Lý do: {message}</p>
          <button onClick={() => router.back()}>Thử lại</button>
        </div>
      )}
    </div>
  );
}
```

## 🧪 Testing

### Chạy test cơ bản

```bash
# Chạy example để test
npx ts-node src/examples/payment.example.ts
```

### Test với Postman

#### 1. Tạo thanh toán

```bash
POST http://localhost:3000/api/payments/create
Content-Type: application/json

{
  "bookingId": "BOOK_001",
  "amount": 1500000,
  "currency": "VND",
  "description": "Thanh toán tour Hạ Long",
  "customerInfo": {
    "name": "Nguyễn Văn An",
    "email": "an.nguyen@example.com",
    "phone": "0912345678"
  },
  "gateway": "vnpay"
}
```

#### 2. Kiểm tra trạng thái

```bash
GET http://localhost:3000/api/payments/status/vnpay/TRANSACTION_ID
```

#### 3. Health check

```bash
GET http://localhost:3000/api/payments/health
```

## 🔧 Troubleshooting

### Lỗi thường gặp

1. **"Gateway not configured"**
   - Kiểm tra biến môi trường
   - Đảm bảo tất cả thông tin cần thiết đã được cấu hình

2. **"Invalid signature"**
   - Kiểm tra secret key
   - Đảm bảo dữ liệu không bị thay đổi trong quá trình truyền

3. **"Payment creation failed"**
   - Kiểm tra kết nối internet
   - Xác thực thông tin merchant
   - Kiểm tra format dữ liệu đầu vào

### Debug mode

```bash
# Bật debug logs
export DEBUG=payment:*
npm start
```

## 📄 Tài liệu tham khảo

- [VNPay Documentation](https://sandbox.vnpayment.vn/apis/)
- [ZaloPay Documentation](https://docs.zalopay.vn/)
- [MoMo Documentation](https://developers.momo.vn/)
- [OnePay Documentation](https://www.onepay.vn/developer/)

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/payment-improvement`)
3. Commit changes (`git commit -am 'Add new payment feature'`)
4. Push to branch (`git push origin feature/payment-improvement`)
5. Tạo Pull Request

## 📞 Hỗ trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra [troubleshooting guide](#-troubleshooting)
2. Xem [issues](https://github.com/your-repo/issues) 
3. Tạo issue mới với thông tin chi tiết

---

**GoSafe Booking Tour** - Hệ thống thanh toán an toàn, nhanh chóng và đáng tin cậy 🚀
