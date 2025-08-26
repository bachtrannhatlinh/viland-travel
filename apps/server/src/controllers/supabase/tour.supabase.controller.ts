import { Request, Response } from "express";
import { supabaseService } from "../../config/supabase";
import { supabase } from '../../services/supabase.service';
import type { Booking } from "../../config/supabase";

export const bookTour = async (req: Request, res: Response) => {
  try {
    const {
      tour_id,
      selected_date,
      participants,
      contact_info,
      participant_details,
      special_requests,
    } = req.body;
    if (
      !tour_id ||
      !selected_date ||
      !participants ||
      !contact_info ||
      !participant_details
    ) {
      res.status(400).json({
        success: false,
        message:
          "Missing required fields: tour_id, selected_date, participants, contact_info, participant_details",
      });
      return;
    }
    // Validate participants
    const totalparticipants =
      (participants.adults || 0) +
      (participants.children || 0) +
      (participants.infants || 0);
    if (totalparticipants === 0) {
      res.status(400).json({
        success: false,
        message: "At least one participant is required.",
      });
      return;
    }
    // Lấy thông tin tour
    const tour = await supabaseService.getTourById(tour_id);
    if (!tour) {
      res.status(404).json({
        success: false,
        message: "Tour not found",
      });
      return;
    }
    // Tính tổng tiền
    const priceAdult = tour.discount_adult ?? tour.price_adult ?? 0;
    const priceChild = tour.discount_child ?? tour.price_child ?? 0;
    const priceInfant = tour.discount_infant ?? tour.price_infant ?? 0;
    const totalAmount = Math.round(
      (participants.adults || 0) * priceAdult +
      (participants.children || 0) * priceChild +
      (participants.infants || 0) * priceInfant
    );
    // Lấy user_id từ req.user (nếu có xác thực), hoặc gán tạm user_id test nếu chưa có auth
    const userId =
      (req as any).user?.id || "00000000-0000-0000-0000-000000000000";
    const bookingNumber =
      "TOUR" +
      Date.now().toString().slice(-6) +
      Math.random().toString(36).substr(2, 3).toUpperCase();
    const bookingData: Booking = {
      booking_number: bookingNumber,
      booking_type: "tour",
      status: "pending",
      user_id: userId,
      service_id: tour_id,
      contact_info: {
        name: contact_info.fullName,
        email: contact_info.email,
        phone: contact_info.phone,
      },
      participants: {
        adults: participants.adults,
        children: participants.children,
        infants: participants.infants,
      },
      start_date: selected_date,
      total_amount: totalAmount,
      special_requests: special_requests,
      details: { participant_details },
      // Các trường không bắt buộc phía dưới:
      created_at: undefined,
      updated_at: undefined,
    };
    let booking;
    try {
      booking = await supabaseService.createBooking(bookingData);
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: "Error creating booking",
        error: err.message,
      });
      return;
    }
    const response = {
      booking: {
        ...booking,
        tour,
        participant_details,
      },
      paymentInfo: {
        amount: totalAmount,
        currency: tour.currency || "VND",
        description: `Tour booking ${bookingNumber} - ${tour.title}`,
      },
    };
    res.json({
      success: true,
      data: response,
      message: "Tour booked successfully. Please proceed to payment.",
    });
    return;
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error booking tour",
      error: error.message,
    });
    return;
  }
};

export const getTours = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, difficulty, featured, limit = 20, page = 1 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const tours = await supabaseService.getTours({
      category: category as string,
      difficulty: difficulty as string,
      featured: featured === "true",
      limit: Number(limit),
      offset,
    });
    res.json({
      success: true,
      data: tours,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: tours.length,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error getting tours",
      error: error.message,
    });
  }
};

export const getTourById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    // Fetch the tour by id from supabaseService
    const tour = await supabaseService.getTourById(id);
    // Extend the type to include optional availability property
    type TourWithOptionalAvailability = typeof tour & { availability?: any };
    const tourTyped = tour as TourWithOptionalAvailability;

    if (!tour) {
      res.status(404).json({
        success: false,
        message: "Tour not found",
      });
      return;
    }

    // Xử lý images: nếu là signed URL thì giữ nguyên, nếu là path thì tạo signed URL
    if (tour.images && Array.isArray(tour.images)) {
      const processedImages = await Promise.all(
        tour.images.map(async (img: string) => {
          if (img.startsWith('http://') || img.startsWith('https://')) {
            return img;
          }
          const cleanPath = img.startsWith('/') ? img.slice(1) : img;
          const [bucket, ...fileParts] = cleanPath.split('/');
          const filePath = fileParts.join('/');
          const { data } = await supabase.storage.from(bucket).createSignedUrl(filePath, 60 * 60);
          return data?.signedUrl || null;
        })
      );
      tourTyped.images = processedImages.filter((url): url is string => Boolean(url));
    }

    // Bổ sung field availability nếu chưa có (mock data)
    const now = new Date();
    const mockAvailability = [
      {
        startDate: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 7
        ).toISOString(),
        endDate: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 10
        ).toISOString(),
        availableSlots: 10,
        isAvailable: true,
      },
      {
        startDate: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 14
        ).toISOString(),
        endDate: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 17
        ).toISOString(),
        availableSlots: 5,
        isAvailable: true,
      },
    ];
    const tourWithAvailability = {
      ...tourTyped,
      availability: Array.isArray(tourTyped.availability)
        ? tourTyped.availability
        : mockAvailability,
    };
    res.json({
      success: true,
      data: tourWithAvailability,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error getting tour details",
      error: error.message,
    });
  }
};

export const searchTours = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      destination,
      category,
      minPrice,
      maxPrice,
      duration,
      limit = 20,
    } = req.query;

    const tours = await supabaseService.searchTours({
      destination: destination as string,
      category: category as string,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      duration: duration ? Number(duration) : undefined,
      limit: Number(limit),
    });

    res.json({
      success: true,
      data: tours,
      filters: {
        categories: [...new Set(tours.map((t) => t.category))],
        difficulties: [...new Set(tours.map((t) => t.difficulty))],
        destinations: [...new Set(tours.flatMap((t) => t.destinations))],
        priceRange: {
          min: Math.min(...tours.map((t) => t.price_adult)),
          max: Math.max(...tours.map((t) => t.price_adult)),
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error searching tours",
      error: error.message,
    });
  }
};
