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
    const tour = await supabaseService.getTourById(id);
    if (!tour) {
      res.status(404).json({
        success: false,
        message: 'Tour not found'
      });
      return;
    }
    res.json({
      success: true,
      data: tour
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error getting tour details',
      error: error.message
    });
  }
};
