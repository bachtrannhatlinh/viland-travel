import { Request, Response } from 'express';
import { supabase, TABLES } from '../../config/supabase';

export class BookingSupabaseController {
  static async createBooking(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const bookingData = { ...req.body, user_id: userId };
      const { data, error } = await supabase
        .from(TABLES.BOOKINGS)
        .insert(bookingData)
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    } catch (error) {
      return res.status(500).json({ message: 'Error creating booking', error });
    }
  }

  static async getBookingByNumber(req: Request, res: Response) {
    try {
      const { bookingNumber } = req.params;
      const { data, error } = await supabase
        .from(TABLES.BOOKINGS)
        .select(`
          *,
          flight:flights(*),
          passengers(*),
          payment:payments(*)
        `)
        .eq('booking_number', bookingNumber)
        .single();
      if (error) throw error;
      if (!data) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      return res.json(data);
    } catch (error) {
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
