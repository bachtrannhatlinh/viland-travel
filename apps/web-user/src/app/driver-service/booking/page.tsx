'use client';

import { useState } from 'react';
import { Section } from '@/components/ui/section';
import { Typography } from '@/components/ui/typography';
import ItineraryForm, { ItineraryData } from '@/components/driver-service/ItineraryForm';
import DriverList, { Driver } from '@/components/driver-service/DriverList';
import DriverPaymentProcess, { DriverBookingPayload, PaymentResult } from '@/components/driver-service/PaymentProcess';
import BookingConfirmation from '@/components/driver-service/BookingConfirmation';
import { Button } from '@/components/ui/button';

 type Step = 'itinerary' | 'select-driver' | 'payment' | 'done';

export default function DriverServiceBookingPage() {
  const [step, setStep] = useState<Step>('itinerary');
  const [itineraryId, setItineraryId] = useState<string>('');
  const [itinerary, setItinerary] = useState<ItineraryData | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [paymentPayload, setPaymentPayload] = useState<DriverBookingPayload | null>(null);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);

  const handleSubmitItinerary = async (data: ItineraryData) => {
    // Mock create itinerary on server
    const res = await fetch('/api/driver-service/itinerary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    setItineraryId(json.itineraryId);
    setItinerary(data);
    setStep('select-driver');
  };

  const handleSelectDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    const payload: DriverBookingPayload = {
      itineraryId,
      driverId: driver.id,
      totalAmount: driver.price,
      paymentMethod: 'onepay',
    };
    setPaymentPayload(payload);
    setStep('payment');
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
