# GoSafe Booking Tour

Ứng dụng đặt booking tour du lịch với kiến trúc Micro Frontend hiện đại.

## 🚀 Tính năng chính

### Khách hàng
- **Trang chủ**: Banner, dịch vụ nổi bật, lý do chọn chúng tôi
- **Dịch vụ đa dạng**:
  - 🛫 Vé máy bay: Tìm chuyến → Đặt vé → Thanh toán
  - 🗺️ Tour du lịch: Xem lịch trình → Đặt tour → Thanh toán
  - 🏨 Booking khách sạn: Chọn phòng → Đặt phòng → Thanh toán
  - 🚗 Thuê xe du lịch: Chọn xe → Chọn thời gian → Đặt xe → Thanh toán
  - 🛡️ Dịch vụ lái xe Go_Safe: Nhập lịch trình → Đặt tài xế → Thanh toán
- **Nội dung**: Tin tức, kiến thức du lịch, đánh giá khách hàng
- **Hỗ trợ**: Form liên hệ nhanh, thông tin đối tác

## 🏗️ Kiến trúc

```
Client (Next.js SPA)
        ↓
API Gateway (BFF Layer)
        ↓
──────────────────────────────────────
|  🎯 Service Booking Tour          |
|  ✈️ Service Booking Vé Máy Bay    |
|  🏨 Service Booking Khách sạn     |
|  🚗 Service Thuê xe               |
|  🛡️ Service Go_Safe               |
|  💳 Service Thanh toán            |
|  📝 Service CMS (blog, banner)    |
|  🔐 Service Auth + User Management|
──────────────────────────────────────
        ↓
    Database (SQL + Search Engine)
```

## 🛠️ Công nghệ sử dụng

### Frontend
- **Framework**: Next.js 14 (App Router) với TypeScript
- **Styling**: TailwindCSS cho responsive design
- **State Management**: Zustand
- **API Client**: React Query (@tanstack/react-query)
- **Icons**: Lucide React
- **Form Handling**: React Hook Form + Zod validation
- **Build Tool**: Turbo (Monorepo)

### Kiến trúc Monorepo
- **Root**: Turborepo configuration
- **Apps**: 
  - `web`: Main customer-facing application
  - `admin`: Admin dashboard (future)
- **Packages**: Shared components và utilities

## 📦 Cài đặt và chạy dự án

### Yêu cầu hệ thống
- Node.js 18+ 
- npm 9+

### Cài đặt dependencies

```bash
# Cài đặt dependencies cho toàn bộ monorepo
npm install

# Hoặc từ thư mục gốc
cd d:/gosafe/gosafe-booking-tour
npm install
```

### Chạy ứng dụng

```bash
# Chạy tất cả services trong development mode
npm run dev

# Hoặc chỉ chạy web app
cd apps/web
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:3000`

### Build production

```bash
# Build tất cả apps
npm run build

# Build riêng web app
cd apps/web
npm run build
npm run start
```

## 📁 Cấu trúc thư mục

```
gosafe-booking-tour/
├── apps/
│   └── web/                    # Main customer app
│       ├── src/
│       │   ├── app/           # Next.js 14 App Router
│       │   │   ├── globals.css
│       │   │   ├── layout.tsx
│       │   │   ├── page.tsx   # Homepage
│       │   │   └── providers.tsx
│       │   └── components/
│       │       ├── layout/    # Header, Footer
│       │       └── home/      # Homepage sections
│       ├── package.json
│       ├── next.config.js
│       ├── tailwind.config.js
│       └── tsconfig.json
├── packages/                   # Shared packages (future)
├── package.json               # Root package.json
├── turbo.json                 # Turborepo config
└── README.md
```

## 🎨 Design System

### Colors
- **Primary**: Blue palette (#0ea5e9, #0284c7, #0369a1)
- **Secondary**: Orange palette (#f97316, #ea580c, #c2410c)
- **Neutral**: Gray palette

### Components
- **Buttons**: `.btn-primary`, `.btn-secondary`
- **Cards**: `.card` với shadow và border radius
- **Responsive**: Mobile-first approach

## 🚀 Roadmap phát triển

### Phase 1 - MVP (Hiện tại)
- [x] Setup cấu trúc Monorepo với Turborepo
- [x] Thiết kế và implement Homepage
- [x] Responsive design với TailwindCSS
- [x] Navigation và Footer
- [ ] Cài đặt dependencies và test

### Phase 2 - Core Features
- [ ] Trang danh mục dịch vụ
- [ ] Form search và booking
- [ ] Tích hợp API Gateway
- [ ] Authentication system

### Phase 3 - Advanced Features  
- [ ] Payment integration
- [ ] Admin dashboard
- [ ] CMS cho blog và banner
- [ ] Microservices backend

### Phase 4 - Optimization
- [ ] SEO optimization với Next.js SSR/SSG
- [ ] Performance monitoring
- [ ] Multi-language support (i18next)
- [ ] PWA features

## 💡 Hướng dẫn phát triển

### Thêm component mới
```bash
# Tạo component trong thư mục phù hợp
mkdir src/components/[category]
touch src/components/[category]/ComponentName.tsx
```

### Styling guidelines
- Sử dụng TailwindCSS utilities
- Mobile-first responsive design
- Consistent spacing với Tailwind spacing scale
- Sử dụng CSS custom properties cho theme colors

### State Management
- Sử dụng Zustand cho global state
- React Query cho server state
- Local state với useState cho UI state

## 🤝 Contributing

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📞 Liên hệ

- **Website**: https://gosafe.vn
- **Email**: info@gosafe.vn
- **Hotline**: 1900 1234

---

© 2024 GoSafe. All rights reserved.
