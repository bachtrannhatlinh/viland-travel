import { Request, Response } from 'express';
import { supabase, TABLES } from '../../config/supabase';

export class BookingSupabaseController {
  static async createBooking(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      // Tách passengers khỏi req.body nếu có
      const { passengers, ...bookingDataRaw } = req.body;
      const bookingData = { ...bookingDataRaw, user_id: userId };
      // Insert booking
      const { data: booking, error: bookingError } = await supabase
        .from(TABLES.BOOKINGS)
        .insert(bookingData)
        .select()
        .single();
      if (bookingError) throw bookingError;

      // Nếu có passengers, insert passengers liên kết booking_id
      if (Array.isArray(passengers) && passengers.length > 0) {
        const passengersData = passengers.map((p: any) => ({ ...p, booking_id: booking.id }));
        const { error: passengersError } = await supabase
          .from(TABLES.PASSENGERS)
          .insert(passengersData);
        if (passengersError) {
          // Rollback booking nếu insert passengers lỗi
          await supabase.from(TABLES.BOOKINGS).delete().eq('id', booking.id);
          return res.status(500).json({ message: 'Error creating passengers', error: passengersError });
        }
      }
      return res.status(201).json(booking);
    } catch (error) {
      return res.status(500).json({ message: 'Error creating booking', error });
    }
  }

  static async getBookingByNumber(req: Request, res: Response) {
    try {
      const { bookingNumber } = req.params;
      console.log("[CONFIRM] API /bookings/confirmation - bookingNumber:", bookingNumber);
      const { data, error } = await supabase
        .from(TABLES.BOOKINGS)
        .select(`
          *,
          flight:flights(*),
          passengers(*),
          payment:payments(*)
        `)
        .eq('booking_number', bookingNumber)
        .maybeSingle();
      if (error) throw error;
      if (!data) {
        console.log("[CONFIRM] Booking not found for:", bookingNumber);
        return res.status(404).json({ message: 'Booking not found' });
      }
      // Bổ sung arrival_date vào object flight nếu có
      let result = { ...data };
      if (result.flight && result.flight.arrival_date === undefined) {
        // arrival_date có thể là arrivalDate hoặc arrival_date tùy DB, kiểm tra và gán lại
        result.flight.arrival_date = result.flight.arrival_date || result.flight.arrivalDate || null;
      }
      return res.json(result);
    } catch (error) {
      console.error("[CONFIRM] Error in getBookingByNumber:", error);
      return res.status(500).json({ message: 'Error getting booking', error });
    }
  }

  static async updateBookingStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const { data, error } = await supabase
        .from(TABLES.BOOKINGS)
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      if (!data) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      return res.json(data);
    } catch (error) {
      return res.status(500).json({ message: 'Error updating booking status', error });
    }
  }
}
