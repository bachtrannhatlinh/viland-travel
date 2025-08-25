'use client';

import { useState } from 'react';
import { Section } from '@/components/ui/section';
import { Typography } from '@/components/ui/typography';
import ItineraryForm, { ItineraryData } from '@/components/driver-service/ItineraryForm';
import DriverList, { Driver } from '@/components/driver-service/DriverList';
import DriverPaymentProcess, { DriverBookingPayload, PaymentResult } from '@/components/driver-service/PaymentProcess';
import BookingConfirmation from '@/components/driver-service/BookingConfirmation';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/utils';
import { LoginRequiredDialog } from '@/components/ui/LoginRequiredDialog';

type Step = 'itinerary' | 'select-driver' | 'payment' | 'done';

export default function DriverServiceBookingPage() {
  const [step, setStep] = useState<Step>('itinerary');
  const [itineraryId, setItineraryId] = useState<string>('');
  const [itinerary, setItinerary] = useState<ItineraryData | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [paymentPayload, setPaymentPayload] = useState<DriverBookingPayload | null>(null);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const handleSubmitItinerary = async (data: ItineraryData) => {
    let userId = '';
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('vilandtravel_user');
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          userId = userObj.id || userObj._id || '';
        } catch (e) {
          userId = '';
        }
      }
    }
    const payload = {
      start_location: data.pickupLocation,
      end_location: data.dropoffLocation,
      start_time: data.date + 'T' + data.time,
      end_time: data.date + 'T' + data.time, // Có thể cần sửa nếu có end_time riêng
      notes: data.notes,
      service_type: data.serviceType,
      user_id: userId,
    };
    // Gọi endpoint tạo itinerary
    const json = await apiClient.post('/drivers/itinerary', payload);
    if (json?.success === false || json?.error) {
      setLoginDialogOpen(true);
      console.error('API error:', json?.error || json);
      return;
    }
    let newItineraryId = '';
    if (json?.itineraryId) {
      newItineraryId = json.itineraryId;
    } else if (json?.data?.id) {
      newItineraryId = json.data.id;
    } else if (json?.data?.itineraryId) {
      newItineraryId = json.data.itineraryId;
    }
    if (!newItineraryId || typeof newItineraryId !== 'string') {
      setLoginDialogOpen(true);
      console.error('Không nhận được itineraryId từ backend hoặc itineraryId không hợp lệ:', json);
      return;
    }
    setItineraryId(newItineraryId);
    setItinerary(data);
    setStep('select-driver');
  };

  const handleSelectDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    const validItineraryId = itineraryId || '';
    const payload: DriverBookingPayload = {
      itineraryId: validItineraryId,
      driverId: driver.id,
      totalAmount: driver.price,
      paymentMethod: 'onepay',
    };
    // Gọi API /drivers/book
    (async () => {
      const json = await apiClient.post('/drivers/book', payload);
      if (json?.success === false || json?.error) {
        setLoginDialogOpen(true);
        console.error('API error:', json?.error || json);
        return;
      }
      setPaymentPayload(payload);
      setStep('payment');
    })();
  };

  const handlePaymentComplete = (result: PaymentResult) => {
    setPaymentResult(result);
    setStep('done');
  };

  const reset = () => {
    setStep('itinerary');
    setItineraryId('');
    setItinerary(null);
    setSelectedDriver(null);
    setPaymentPayload(null);
    setPaymentResult(null);
  };

  return (
    <Section className="min-h-screen bg-gray-50">
      <LoginRequiredDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-8">
          <Typography variant="h1" className="text-3xl font-bold">Dịch vụ lái xe Go_Safe</Typography>
          <Typography className="text-gray-600">Nhập lịch trình → Chọn tài xế → Thanh toán</Typography>
        </div>

        {step === 'itinerary' && (
          <ItineraryForm onSubmit={handleSubmitItinerary} />
        )}

        {step === 'select-driver' && itineraryId && (
          <div className="space-y-4">
            <Button variant="ghost" className="p-0" onClick={() => setStep('itinerary')}>← Sửa lịch trình</Button>
            <DriverList itineraryId={itineraryId} onSelectDriver={handleSelectDriver} />
          </div>
        )}

        {step === 'payment' && paymentPayload && (
          <DriverPaymentProcess payload={paymentPayload} onBack={() => setStep('select-driver')} onComplete={handlePaymentComplete} />
        )}

        {step === 'done' && paymentResult && (
          <BookingConfirmation bookingNumber={paymentResult.bookingNumber || 'BK-DV-' + Date.now()} transactionId={paymentResult.transactionId} amount={paymentPayload?.totalAmount || 0} />
        )}

        <div className="mt-8 text-center">
          <Button variant="secondary" onClick={reset}>Bắt đầu lại</Button>
        </div>
      </div>
    </Section>
  );
}
