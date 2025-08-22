import { Request, Response } from 'express';
import { supabaseService } from '../../config/supabase';

export const getTours = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, difficulty, featured, limit = 20, page = 1 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const tours = await supabaseService.getTours({
      category: category as string,
      difficulty: difficulty as string,
      featured: featured === 'true',
      limit: Number(limit),
      offset
    });
    res.json({
      success: true,
      data: tours,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: tours.length
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error getting tours',
      error: error.message
    });
  }
};

export const getTourById = async (req: Request, res: Response): Promise<void> => {
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
        message: 'Tour not found'
      });
      return;
    }
    // Bổ sung field availability nếu chưa có (mock data)
    const now = new Date();
    const mockAvailability = [
      {
        startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7).toISOString(),
        endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10).toISOString(),
        availableSlots: 10,
        isAvailable: true
      },
      {
        startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14).toISOString(),
        endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 17).toISOString(),
        availableSlots: 5,
        isAvailable: true
      }
    ];
    const tourWithAvailability = {
      ...tourTyped,
      availability: Array.isArray(tourTyped.availability) ? tourTyped.availability : mockAvailability
    };
    res.json({
      success: true,
      data: tourWithAvailability
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error getting tour details',
      error: error.message
    });
  }
};

export const searchTours = async (req: Request, res: Response): Promise<void> => {
  try {
    const { destination, category, minPrice, maxPrice, duration, limit = 20 } = req.query;
    
    const tours = await supabaseService.searchTours({
      destination: destination as string,
      category: category as string,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      duration: duration ? Number(duration) : undefined,
      limit: Number(limit)
    });

    res.json({
      success: true,
      data: tours,
      filters: {
        categories: [...new Set(tours.map(t => t.category))],
        difficulties: [...new Set(tours.map(t => t.difficulty))],
        destinations: [...new Set(tours.flatMap(t => t.destinations))],
        priceRange: {
          min: Math.min(...tours.map(t => t.price_adult)),
          max: Math.max(...tours.map(t => t.price_adult))
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error searching tours',
      error: error.message
    });
  }
};
