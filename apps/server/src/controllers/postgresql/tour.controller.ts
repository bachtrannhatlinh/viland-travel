import { Request, Response } from 'express';
import { repositoryService } from '../../repositories';
import { TourStatus } from '../../entities/Tour.entity';

export const getTours = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, difficulty, featured, limit = 20, page = 1 } = req.query;
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;
    const where: any = { status: TourStatus.ACTIVE };
    if (category) where.type = category;
    if (difficulty) where.difficulty = difficulty;
    if (featured) where.featured = featured === 'true';
    const [tours, total] = await repositoryService.tours.findAndCount({ where, take, skip, order: { rating: 'DESC' } });
    res.json({
      success: true,
      data: tours,
      pagination: {
        page: Number(page),
        limit: take,
        total
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
    const tour = await repositoryService.tours.findOne({ where: { id, status: TourStatus.ACTIVE } });
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

export const searchTours = async (req: Request, res: Response): Promise<void> => {
  try {
    const { destination, category, minPrice, maxPrice, duration, limit = 20 } = req.query;
    const take = Number(limit);
    const where: any = { status: TourStatus.ACTIVE };
    if (destination) where.destination = destination;
    if (category) where.type = category;
    if (duration) where.duration = Number(duration);
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price['$gte'] = Number(minPrice);
      if (maxPrice) where.price['$lte'] = Number(maxPrice);
    }
    // Xây dựng query nâng cao cho price
    const query = repositoryService.tours.createQueryBuilder('tour').where('tour.status = :status', { status: TourStatus.ACTIVE });
    if (destination) query.andWhere('tour.destination = :destination', { destination });
    if (category) query.andWhere('tour.type = :type', { type: category });
    if (duration) query.andWhere('tour.duration = :duration', { duration: Number(duration) });
    if (minPrice) query.andWhere('tour.price >= :minPrice', { minPrice: Number(minPrice) });
    if (maxPrice) query.andWhere('tour.price <= :maxPrice', { maxPrice: Number(maxPrice) });
    query.take(take);
    const tours = await query.getMany();
    res.json({
      success: true,
      data: tours,
      filters: {
        categories: [...new Set(tours.map(t => t.type))],
        difficulties: [...new Set(tours.map(t => t.difficulty))],
        destinations: [...new Set(tours.map(t => t.destination))],
        priceRange: tours.length > 0 ? {
          min: Math.min(...tours.map(t => Number(t.price))),
          max: Math.max(...tours.map(t => Number(t.price)))
        } : { min: 0, max: 0 }
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