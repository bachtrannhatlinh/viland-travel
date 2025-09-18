
import { Request, Response } from 'express';

export class PaymentController {
	async createPayment(req: Request, res: Response) {
		try {
			const { bookingNumber, amount, method, currency = 'VND', transactionId, gateway } = req.body;
			if (!bookingNumber || !amount || !method) {
				return res.status(400).json({ success: false, message: 'Missing required fields: bookingNumber, amount, method' });
			}

			// Lấy booking_id từ booking_number
			const { supabase, TABLES } = await import('../../config/supabase');
			const { data: bookingData, error: bookingFindError } = await supabase
				.from(TABLES.BOOKINGS)
				.select('id')
				.eq('booking_number', bookingNumber)
				.single();
			if (bookingFindError || !bookingData) {
				return res.status(404).json({ success: false, message: 'Booking not found' });
			}
			const bookingId = bookingData.id;

			// Lưu hoặc cập nhật payment (upsert theo booking_number + method)
			const paidAt = new Date().toISOString();
			const { data: payment, error: paymentError } = await supabase
				.from(TABLES.PAYMENTS)
				.upsert([
					{
						booking_id: bookingId,
						booking_number: bookingNumber,
						amount,
						method,
						currency,
						transaction_id: transactionId || null,
						status: 'success',
						gateway,
						paid_at: paidAt,
					}
				], { onConflict: 'booking_number,method' })
				.select()
				.single();
			if (paymentError) throw paymentError;

			// Luôn cập nhật trạng thái booking, paid_amount, payment_method
			const { data: booking, error: bookingError } = await supabase
				.from(TABLES.BOOKINGS)
				.update({
					status: 'paid',
					updated_at: paidAt,
					paid_amount: amount,
					payment_method: method
				})
				.eq('booking_number', bookingNumber)
				.select()
				.single();
			if (bookingError) throw bookingError;

			return res.status(200).json({ success: true, message: 'Payment created and booking updated', payment, booking });
		} catch (error: any) {
			return res.status(500).json({ success: false, message: 'Error creating payment', error: error.message });
		}
	}

	async handleCallback(req: Request, res: Response) {
		res.status(200).json({ success: true, message: 'Callback handled (mock)' });
	}

	async handleReturn(req: Request, res: Response) {
		res.status(200).json({ success: true, message: 'Return handled (mock)' });
	}

	async queryPaymentStatus(req: Request, res: Response) {
		res.status(200).json({ success: true, message: 'Query payment status (mock)' });
	}

	async processRefund(req: Request, res: Response) {
		res.status(200).json({ success: true, message: 'Refund processed (mock)' });
	}

	async verifySignature(req: Request, res: Response) {
		res.status(200).json({ success: true, message: 'Signature verified (mock)' });
	}

	async getGateways(req: Request, res: Response) {
		res.status(200).json({ success: true, gateways: ['vnpay', 'momo', 'zalopay', 'onepay'] });
	}

	async healthCheck(req: Request, res: Response) {
		res.status(200).json({ success: true, message: 'Payment service healthy' });
	}
}
