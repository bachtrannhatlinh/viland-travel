// Sepay service: Tích hợp tạo đơn và xác thực callback Sepay
// Cần cập nhật các thông tin bên dưới theo tài liệu Sepay thực tế

import axios from 'axios';

const SEPAY_API_URL = process.env.SEPAY_API_URL || 'https://api.sepay.vn';
const SEPAY_API_TOKEN = process.env.SEPAY_API_TOKEN || '';
const SEPAY_SECRET_KEY = process.env.SEPAY_SECRET_KEY || '';

export interface SepayCreateOrderParams {
  amount: number;
  orderId: string;
  description: string;
  returnUrl: string;
  notifyUrl: string;
  // ... các trường khác theo Sepay
}

export async function createSepayOrder(params: SepayCreateOrderParams) {
  // Tạo đơn hàng Sepay
  const payload = {
    ...params
    // Không cần apiKey, chỉ cần token
    // ... ký chữ ký nếu Sepay yêu cầu
  };
  // TODO: Thêm logic ký chữ ký nếu Sepay yêu cầu
  const res = await axios.post(
    `${SEPAY_API_URL}/payment/create`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${SEPAY_API_TOKEN}`
      }
    }
  );
  return res.data;
}

export function verifySepaySignature(data: any, signature: string): boolean {
  // TODO: Xác thực chữ ký callback từ Sepay
  // Thường sẽ dùng secret key để hash lại dữ liệu và so sánh với signature
  return true;
}
