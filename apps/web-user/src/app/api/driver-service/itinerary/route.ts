import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pickupLocation, dropoffLocation, date, time, serviceType, notes } = body || {};

    if (!pickupLocation || !date || !time) {
      return NextResponse.json({ success: false, message: 'Thiếu thông tin lịch trình' }, { status: 400 });
    }

    const itineraryId = 'ITN-' + Date.now();

    console.log('Create itinerary:', { itineraryId, pickupLocation, dropoffLocation, date, time, serviceType, notes });

    return NextResponse.json({ success: true, itineraryId });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e?.message || 'Server error' }, { status: 500 });
  }
}

