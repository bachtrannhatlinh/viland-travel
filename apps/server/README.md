# ViLand Travel API Backend

Backend API service cho ứng dụng ViLand Travel - nền tảng đặt tour du lịch an toàn và tin cậy.

## 🚀 Tính năng chính

### 🔐 Authentication & Authorization
- Đăng ký/đăng nhập với JWT tokens
- Email verification và password reset
- Role-based access control (customer, admin, staff, driver)
- Refresh token mechanism

### 🏨 Booking Services
- **Tour Booking**: Đặt tour du lịch với nhiều tùy chọn
- **Flight Booking**: Tích hợp API vé máy bay
- **Hotel Booking**: Đặt phòng khách sạn
- **Car Rental**: Thuê xe tự lái
- **Driver Service**: Dịch vụ lái xe Go_Safe

### 💳 Payment Integration
- **VNPAY**: Cổng thanh toán phổ biến tại Việt Nam
- **MoMo**: Ví điện tử MoMo
- **ZaloPay**: Thanh toán qua ZaloPay
- **Stripe**: Thanh toán quốc tế

### 📧 Communication Services
- Email notifications (NodeMailer)
- SMS/ZNS integration
- Push notifications
- Booking confirmations và reminders

### 📊 Management Features
- User management
- Booking management
- Payment processing
- Analytics và reporting
- File upload (Cloudinary)

## 🛠️ Tech Stack

- **Runtime**: Node.js với TypeScript
- **Framework**: Express.js
- **Database**: MongoDB với Mongoose ODM
- **Authentication**: JWT với bcryptjs
- **Validation**: express-validator
- **File Upload**: Multer + Cloudinary
- **Email**: NodeMailer với Handlebars templates
- **Security**: Helmet, CORS, Rate limiting

## 📁 Project Structure

```
src/
├── config/          # Database và configuration
├── controllers/     # Request handlers
├── middleware/      # Custom middleware (auth, error handling)
├── models/          # MongoDB models
├── routes/          # API routes
├── services/        # Business logic services
├── utils/           # Utility functions
├── templates/       # Email templates
└── index.ts         # Entry point
```

## 🚦 API Endpoints

### Authentication
```
POST   /api/auth/register           # Đăng ký
POST   /api/auth/login              # Đăng nhập
POST   /api/auth/logout             # Đăng xuất
POST   /api/auth/refresh-token      # Refresh access token
POST   /api/auth/forgot-password    # Quên mật khẩu
POST   /api/auth/reset-password/:token # Reset mật khẩu
GET    /api/auth/verify-email/:token # Xác thực email
GET    /api/auth/profile            # Lấy profile
PUT    /api/auth/profile            # Cập nhật profile
```

### Tours
```
GET    /api/tours                   # Danh sách tours
GET    /api/tours/search            # Tìm kiếm tours
GET    /api/tours/featured          # Tours nổi bật
GET    /api/tours/:id               # Chi tiết tour
POST   /api/tours                   # Tạo tour (Admin)
PUT    /api/tours/:id               # Cập nhật tour (Admin)
DELETE /api/tours/:id               # Xóa tour (Admin)
POST   /api/tours/:id/reviews       # Đánh giá tour
```

### Flights
```
GET    /api/flights/search          # Tìm kiếm chuyến bay
GET    /api/flights/:id             # Chi tiết chuyến bay
POST   /api/flights/book            # Đặt vé máy bay
GET    /api/flights/bookings/history # Lịch sử đặt vé
PUT    /api/flights/bookings/:id/cancel # Hủy đặt vé
```

### Hotels
```
GET    /api/hotels/search           # Tìm kiếm khách sạn
GET    /api/hotels/:id              # Chi tiết khách sạn
POST   /api/hotels/book             # Đặt phòng
GET    /api/hotels/bookings/history # Lịch sử đặt phòng
PUT    /api/hotels/bookings/:id/cancel # Hủy đặt phòng
```

### Car Rental
```
GET    /api/car-rental/search       # Tìm kiếm xe thuê
GET    /api/car-rental/:id          # Chi tiết xe
POST   /api/car-rental/book         # Thuê xe
GET    /api/car-rental/bookings/history # Lịch sử thuê xe
PUT    /api/car-rental/bookings/:id/cancel # Hủy thuê xe
```

### Driver Service
```
GET    /api/drivers/search          # Tìm kiếm tài xế
GET    /api/drivers/:id             # Chi tiết tài xế
POST   /api/drivers/book            # Đặt tài xế
GET    /api/drivers/bookings/history # Lịch sử đặt tài xế
PUT    /api/drivers/bookings/:id/cancel # Hủy đặt tài xế
```

### Payments
```
POST   /api/payments/create         # Tạo thanh toán
GET    /api/payments/:id/status     # Trạng thái thanh toán
POST   /api/payments/:id/refund     # Hoàn tiền
GET    /api/payments/history        # Lịch sử thanh toán

# Webhooks
POST   /api/payments/vnpay/webhook  # VNPAY webhook
POST   /api/payments/momo/webhook   # MoMo webhook
POST   /api/payments/zalopay/webhook # ZaloPay webhook
POST   /api/payments/stripe/webhook # Stripe webhook
```

### Bookings
```
GET    /api/bookings/my-bookings    # Bookings của user
GET    /api/bookings/:id            # Chi tiết booking
PUT    /api/bookings/:id/cancel     # Hủy booking
PUT    /api/bookings/:id/modify     # Sửa booking
GET    /api/bookings               # Tất cả bookings (Admin)
```

### File Upload
```
POST   /api/upload/single          # Upload file đơn
POST   /api/upload/multiple        # Upload nhiều files
DELETE /api/upload/:id             # Xóa file
GET    /api/upload/:id             # Thông tin file
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js >= 18.0.0
- MongoDB >= 4.4
- npm hoặc yarn

### Environment Variables
Copy `.env.example` thành `.env` và cấu hình:

```bash
cp .env.example .env
```

### Install Dependencies
```bash
npm install
```

### Database Setup
Đảm bảo MongoDB đang chạy và cập nhật `MONGODB_URI` trong `.env`

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/ViLand Travel` |
| `JWT_SECRET` | JWT secret key | `your-super-secret-key` |
| `EMAIL_HOST` | SMTP host | `smtp.gmail.com` |
| `EMAIL_USER` | SMTP username | `your-email@gmail.com` |
| `EMAIL_PASS` | SMTP password | `your-app-password` |
| `VNPAY_TMN_CODE` | VNPAY terminal code | `your-tmn-code` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_test_...` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your-cloud-name` |

## 🔒 Security Features

- **Rate Limiting**: Giới hạn requests để chống DDoS
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Input Validation**: Validation với express-validator
- **Password Hashing**: bcryptjs với salt rounds
- **JWT Security**: Access & refresh tokens
- **File Upload Security**: File type và size validation

## 📊 Monitoring & Logging

- Request logging với Morgan
- Error handling middleware
- Health check endpoint: `/health`
- Performance monitoring ready

## 🚀 Deployment

### Docker (Coming Soon)
```bash
docker build -t ViLand Travel-api .
docker run -p 8000:8000 ViLand Travel-api
```

### Traditional Deployment
1. Build project: `npm run build`
2. Set environment variables
3. Start: `npm start`

## 📈 API Status

| Service | Status | Implementation |
|---------|--------|----------------|
| Authentication | ✅ Ready | Full implementation |
| User Management | 🚧 In Progress | Basic structure |
| Tour Booking | 📋 Planned | API structure ready |
| Flight Booking | 📋 Planned | API structure ready |
| Hotel Booking | 📋 Planned | API structure ready |
| Car Rental | 📋 Planned | API structure ready |
| Driver Service | 📋 Planned | API structure ready |
| Payment Gateway | 📋 Planned | Multi-gateway ready |
| File Upload | 📋 Planned | Cloudinary integration |
| Email Service | ✅ Ready | NodeMailer + templates |

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- **Backend Team**: API development và database design
- **DevOps Team**: Deployment và infrastructure
- **QA Team**: Testing và quality assurance

## 📞 Support

- Email: support@ViLand Travel.vn
- Slack: #ViLand Travel-backend
- Documentation: [API Docs](https://api.ViLand Travel.vn/docs)

---

Made with ❤️ by ViLand Travel Team
