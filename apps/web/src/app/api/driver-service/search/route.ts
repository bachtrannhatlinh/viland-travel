import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const itineraryId = searchParams.get('itineraryId');

    // For now, return mock drivers based on simple rule
    const mockDrivers = [
      { id: 'drv-1', name: 'Nguyễn Văn A', rating: 4.9, trips: 1200, vehicle: 'Sedan 4 chỗ', price: 350000 },
      { id: 'drv-2', name: 'Trần Thị B', rating: 4.8, trips: 980, vehicle: 'SUV 7 chỗ', price: 450000 },
      { id: 'drv-3', name: 'Lê Văn C', rating: 4.7, trips: 800, vehicle: 'Sedan 4 chỗ', price: 320000 },
    ];

    return NextResponse.json({ success: true, data: mockDrivers, itineraryId });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e?.message || 'Server error' }, { status: 500 });
  }
}

