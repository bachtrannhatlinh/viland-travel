import { Request, Response } from 'express';
import { supabase, TABLES } from '../../config/supabase';

export class BookingSupabaseController {
  static async createBooking(req: Request, res: Response) {
    try {
      const { data, error } = await supabase
        .from(TABLES.BOOKINGS)
        .insert(req.body)
        .select()
        .single();
      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Error creating booking', error });
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
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: 'Error getting booking', error });
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
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: 'Error updating booking status', error });
    }
  }
}
