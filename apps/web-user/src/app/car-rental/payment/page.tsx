'use client'

import { useSearchParams, useRouter } from 'next/navigation';
import { Typography } from '@/components/ui/typography';

export default function CarRentalPaymentPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  const router = useRouter();

  const handleConfirm = () => {
    if (bookingId) {
      router.push(`/car-rental/confirmation?bookingId=${bookingId}`);
    }
  };

  // Chuyển hướng luôn sang trang xác nhận booking
  if (bookingId) {
    if (typeof window !== 'undefined') {
      window.location.replace(`/car-rental/confirmation?bookingId=${bookingId}`);
    }
  }
  return null;
}
