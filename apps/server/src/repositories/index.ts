import { Repository } from 'typeorm';
import { AppDataSource } from '../config/postgresql';
import { User, UserStatus } from '../entities/User.entity';
import { Booking, BookingStatus } from '../entities/Booking.entity';
import { Payment, PaymentStatus } from '../entities/Payment.entity';
import { Tour, TourStatus } from '../entities/Tour.entity';
import { Flight, FlightStatus } from '../entities/Flight.entity';
import { Hotel, HotelStatus } from '../entities/Hotel.entity';
import { CarRental, CarStatus, CarType } from '../entities/CarRental.entity';
import { Driver, DriverStatus } from '../entities/Driver.entity';
import { News, NewsStatus } from '../entities/News.entity';
import { Contact, ContactStatus } from '../entities/Contact.entity';
import { Review, ReviewStatus } from '../entities/Review.entity';
import { Partner, PartnerStatus } from '../entities/Partner.entity';

export class RepositoryService {
  private static instance: RepositoryService;
  
  private userRepository: Repository<User>;
  private bookingRepository: Repository<Booking>;
  private paymentRepository: Repository<Payment>;
  private tourRepository: Repository<Tour>;
  private flightRepository: Repository<Flight>;
  private hotelRepository: Repository<Hotel>;
  private carRentalRepository: Repository<CarRental>;
  private driverRepository: Repository<Driver>;
  private newsRepository: Repository<News>;
  private contactRepository: Repository<Contact>;
  private reviewRepository: Repository<Review>;
  private partnerRepository: Repository<Partner>;

  private constructor() {
    this.initializeRepositories();
  }

  public static getInstance(): RepositoryService {
    if (!RepositoryService.instance) {
      RepositoryService.instance = new RepositoryService();
    }
    return RepositoryService.instance;
  }

  private initializeRepositories(): void {
    this.userRepository = AppDataSource.getRepository(User);
    this.bookingRepository = AppDataSource.getRepository(Booking);
    this.paymentRepository = AppDataSource.getRepository(Payment);
    this.tourRepository = AppDataSource.getRepository(Tour);
    this.flightRepository = AppDataSource.getRepository(Flight);
    this.hotelRepository = AppDataSource.getRepository(Hotel);
    this.carRentalRepository = AppDataSource.getRepository(CarRental);
    this.driverRepository = AppDataSource.getRepository(Driver);
    this.newsRepository = AppDataSource.getRepository(News);
    this.contactRepository = AppDataSource.getRepository(Contact);
    this.reviewRepository = AppDataSource.getRepository(Review);
    this.partnerRepository = AppDataSource.getRepository(Partner);
  }

  // User Repository
  get users(): Repository<User> {
    return this.userRepository;
  }

  // Booking Repository
  get bookings(): Repository<Booking> {
    return this.bookingRepository;
  }

  // Payment Repository
  get payments(): Repository<Payment> {
    return this.paymentRepository;
  }

  // Tour Repository
  get tours(): Repository<Tour> {
    return this.tourRepository;
  }

  // Flight Repository
  get flights(): Repository<Flight> {
    return this.flightRepository;
  }

  // Hotel Repository
  get hotels(): Repository<Hotel> {
    return this.hotelRepository;
  }

  // Car Rental Repository
  get carRentals(): Repository<CarRental> {
    return this.carRentalRepository;
  }

  // Driver Repository
  get drivers(): Repository<Driver> {
    return this.driverRepository;
  }

  // News Repository
  get news(): Repository<News> {
    return this.newsRepository;
  }

  // Contact Repository
  get contacts(): Repository<Contact> {
    return this.contactRepository;
  }

  // Review Repository
  get reviews(): Repository<Review> {
    return this.reviewRepository;
  }

  // Partner Repository
  get partners(): Repository<Partner> {
    return this.partnerRepository;
  }

  // Custom User methods
  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
      relations: ['bookings']
    });
  }

  async findUserByPhone(phone: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { phone }
    });
  }

  async findActiveUsers(): Promise<User[]> {
    return await this.userRepository.find({
      where: { status: UserStatus.ACTIVE }
    });
  }

  // Custom Booking methods
  async findBookingsByUser(userId: string): Promise<Booking[]> {
    return await this.bookingRepository.find({
      where: { userId },
      relations: ['payments'],
      order: { createdAt: 'DESC' }
    });
  }

  async findBookingByNumber(bookingNumber: string): Promise<Booking | null> {
    return await this.bookingRepository.findOne({
      where: { bookingNumber },
      relations: ['user', 'payments']
    });
  }

  async findPendingBookings(): Promise<Booking[]> {
    return await this.bookingRepository.find({
      where: { status: BookingStatus.PENDING },
      relations: ['user']
    });
  }

  // Custom Payment methods
  async findPaymentsByBooking(bookingId: string): Promise<Payment[]> {
    return await this.paymentRepository.find({
      where: { bookingId },
      order: { createdAt: 'DESC' }
    });
  }

  async findSuccessfulPayments(): Promise<Payment[]> {
    return await this.paymentRepository.find({
      where: { status: PaymentStatus.COMPLETED },
      relations: ['booking']
    });
  }

  // Custom Tour methods
  async findActiveTours(): Promise<Tour[]> {
    return await this.tourRepository.find({
      where: { status: TourStatus.ACTIVE },
      order: { rating: 'DESC' }
    });
  }

  async findToursByDestination(destination: string): Promise<Tour[]> {
    return await this.tourRepository.find({
      where: { destination, status: TourStatus.ACTIVE }
    });
  }

  async findPopularTours(limit: number = 10): Promise<Tour[]> {
    return await this.tourRepository.find({
      where: { status: TourStatus.ACTIVE },
      order: { rating: 'DESC', reviewCount: 'DESC' },
      take: limit
    });
  }

  // Custom Flight methods
  async findFlightsByRoute(departureAirport: string, arrivalAirport: string): Promise<Flight[]> {
    return await this.flightRepository.find({
      where: {
        departureAirport,
        arrivalAirport,
        status: FlightStatus.SCHEDULED
      },
      order: { departureDate: 'ASC' }
    });
  }

  async findFlightsByDate(departureDate: Date): Promise<Flight[]> {
    const startOfDay = new Date(departureDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(departureDate);
    endOfDay.setHours(23, 59, 59, 999);

    return await this.flightRepository.createQueryBuilder('flight')
      .where('flight.departureDate >= :startOfDay', { startOfDay })
      .andWhere('flight.departureDate <= :endOfDay', { endOfDay })
      .andWhere('flight.status = :status', { status: FlightStatus.SCHEDULED })
      .orderBy('flight.departureDate', 'ASC')
      .getMany();
  }

  // Custom Hotel methods
  async findHotelsByCity(city: string): Promise<Hotel[]> {
    return await this.hotelRepository.createQueryBuilder('hotel')
      .where('hotel.location->\'city\' = :city', { city })
      .andWhere('hotel.status = :status', { status: HotelStatus.ACTIVE })
      .orderBy('hotel.rating', 'DESC')
      .getMany();
  }

  async findTopRatedHotels(limit: number = 10): Promise<Hotel[]> {
    return await this.hotelRepository.find({
      where: { status: HotelStatus.ACTIVE },
      order: { rating: 'DESC', starRating: 'DESC' },
      take: limit
    });
  }

  // Custom Car Rental methods
  async findAvailableCars(location: string): Promise<CarRental[]> {
    return await this.carRentalRepository.createQueryBuilder('car')
      .where('car.location->\'city\' = :location', { location })
      .andWhere('car.status = :status', { status: CarStatus.AVAILABLE })
      .orderBy('car.pricePerDay', 'ASC')
      .getMany();
  }

  async findCarsByType(type: CarType): Promise<CarRental[]> {
    return await this.carRentalRepository.find({
      where: { type, status: CarStatus.AVAILABLE },
      order: { pricePerDay: 'ASC' }
    });
  }

  // Custom Driver methods
  async findActiveDrivers(): Promise<Driver[]> {
    return await this.driverRepository.find({
      where: { status: DriverStatus.ACTIVE, isVerified: true },
      order: { rating: 'DESC' }
    });
  }

  async findDriversByLocation(city: string): Promise<Driver[]> {
    return await this.driverRepository.createQueryBuilder('driver')
      .where('driver.location->\'currentCity\' = :city', { city })
      .andWhere('driver.status = :status', { status: DriverStatus.ACTIVE })
      .andWhere('driver.isVerified = :verified', { verified: true })
      .orderBy('driver.rating', 'DESC')
      .getMany();
  }

  async findDriversByServiceType(serviceType: string): Promise<Driver[]> {
    return await this.driverRepository.createQueryBuilder('driver')
      .where('driver.serviceType @> :serviceType', { serviceType: JSON.stringify([serviceType]) })
      .andWhere('driver.status = :status', { status: DriverStatus.ACTIVE })
      .andWhere('driver.isVerified = :verified', { verified: true })
      .orderBy('driver.rating', 'DESC')
      .getMany();
  }

  // Custom News methods
  async findPublishedNews(limit: number = 10): Promise<News[]> {
    return await this.newsRepository.find({
      where: { status: NewsStatus.PUBLISHED },
      order: { publishedAt: 'DESC' },
      take: limit
    });
  }

  async findFeaturedNews(limit: number = 5): Promise<News[]> {
    return await this.newsRepository.find({
      where: { 
        status: NewsStatus.PUBLISHED,
        featured: true 
      },
      order: { publishedAt: 'DESC' },
      take: limit
    });
  }

  async findNewsByCategory(category: string, limit: number = 10): Promise<News[]> {
    return await this.newsRepository.find({
      where: { 
        status: NewsStatus.PUBLISHED,
        category: category as any
      },
      order: { publishedAt: 'DESC' },
      take: limit
    });
  }

  // Custom Contact methods
  async findPendingContacts(): Promise<Contact[]> {
    return await this.contactRepository.find({
      where: { status: ContactStatus.NEW },
      order: { createdAt: 'DESC' }
    });
  }

  async findContactsByType(type: string): Promise<Contact[]> {
    return await this.contactRepository.find({
      where: { type: type as any },
      order: { createdAt: 'DESC' }
    });
  }

  // Custom Review methods
  async findApprovedReviews(serviceType?: string, limit: number = 20): Promise<Review[]> {
    const where: any = { status: ReviewStatus.APPROVED };
    if (serviceType) {
      where.serviceType = serviceType;
    }

    return await this.reviewRepository.find({
      where,
      order: { createdAt: 'DESC' },
      take: limit
    });
  }

  async findReviewsByService(serviceType: string, serviceId: string): Promise<Review[]> {
    return await this.reviewRepository.find({
      where: {
        serviceType: serviceType as any,
        serviceId,
        status: ReviewStatus.APPROVED
      },
      order: { createdAt: 'DESC' }
    });
  }

  async findPendingReviews(): Promise<Review[]> {
    return await this.reviewRepository.find({
      where: { status: ReviewStatus.PENDING },
      order: { createdAt: 'ASC' }
    });
  }

  // Custom Partner methods
  async findActivePartners(): Promise<Partner[]> {
    return await this.partnerRepository.find({
      where: { status: PartnerStatus.ACTIVE },
      order: { displayOrder: 'ASC', name: 'ASC' }
    });
  }

  async findFeaturedPartners(): Promise<Partner[]> {
    return await this.partnerRepository.find({
      where: { 
        status: PartnerStatus.ACTIVE,
        featured: true 
      },
      order: { displayOrder: 'ASC' }
    });
  }

  async findPartnersByType(type: string): Promise<Partner[]> {
    return await this.partnerRepository.find({
      where: { 
        type: type as any,
        status: PartnerStatus.ACTIVE 
      },
      order: { name: 'ASC' }
    });
  }

  // Transaction support
  async transaction<T>(operation: (repositories: RepositoryService) => Promise<T>): Promise<T> {
    return await AppDataSource.transaction(async () => {
      return await operation(this);
    });
  }
}

// Export singleton instance
export const repositoryService = RepositoryService.getInstance();
