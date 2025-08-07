import { databaseService } from '../config/database';
import { repositoryService } from '../repositories';
import { cacheService } from '../config/redis';
import { searchService } from '../config/elasticsearch';
import { UserRole, UserStatus } from '../entities/User.entity';
import { TourType, TourDifficulty, TourStatus } from '../entities/Tour.entity';
import { HotelCategory, HotelStatus, RoomType } from '../entities/Hotel.entity';

export async function initializeDatabase(): Promise<void> {
  console.log('🚀 Starting database initialization...');

  try {
    // Initialize all database connections
    await databaseService.initialize();

    // Test all connections
    const health = await databaseService.healthCheck();
    
    if (!health.overall) {
      console.error('❌ Database health check failed:', health);
      throw new Error('Database initialization failed - some services are unavailable');
    }

    console.log('✅ Database health check passed:', health);

    // Initialize repositories (they're lazy-loaded)
    console.log('📦 Repository service ready');

    console.log('✅ Database initialization completed successfully!');
    console.log('Database services available:');
    console.log('  - PostgreSQL: ✅ (Primary database)');
    console.log('  - Redis: ✅ (Caching & Sessions)');
    console.log('  - Elasticsearch: ✅ (Search engine)');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

export async function seedInitialData(): Promise<void> {
  console.log('🌱 Seeding initial data...');

  try {
    // Check if we already have data
    const userCount = await repositoryService.users.count();
    
    if (userCount > 0) {
      console.log('📊 Database already contains data, skipping seed');
      return;
    }

    // Create admin user
    const adminUser = repositoryService.users.create({
      email: 'admin@gosafe.com',
      password: 'admin123', // Should be hashed in real application
      phone: '+84123456789',
      fullName: 'GoSafe Admin',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      isEmailVerified: true,
      isPhoneVerified: true,
      preferences: {
        language: 'vi',
        currency: 'VND',
        notifications: {
          email: true,
          sms: true,
          push: true
        }
      },
      address: {
        street: '123 Admin Street',
        city: 'Ho Chi Minh City',
        state: 'Ho Chi Minh',
        country: 'Vietnam',
        zipCode: '700000'
      }
    });

    await repositoryService.users.save(adminUser);
    console.log('👤 Admin user created');

    // Sample tour data
    const sampleTour = repositoryService.tours.create({
      name: 'Ha Long Bay Discovery Tour',
      description: 'Explore the stunning beauty of Ha Long Bay with limestone karsts and emerald waters.',
      shortDescription: 'Discover Ha Long Bay\'s natural wonders',
      status: TourStatus.ACTIVE,
      type: TourType.NATURE,
      difficulty: TourDifficulty.EASY,
      destination: 'Ha Long Bay',
      departureLocation: 'Hanoi',
      duration: 2,
      price: 1500000,
      currency: 'VND',
      maxParticipants: 20,
      minParticipants: 2,
      rating: 4.8,
      reviewCount: 156,
      images: [
        'https://example.com/halong1.jpg',
        'https://example.com/halong2.jpg'
      ],
      itinerary: [
        {
          day: 1,
          title: 'Arrival and Bay Cruise',
          description: 'Transfer from Hanoi to Ha Long Bay and start the cruise',
          activities: ['Bus transfer', 'Cruise boarding', 'Lunch on boat'],
          meals: ['Lunch', 'Dinner']
        },
        {
          day: 2,
          title: 'Cave Exploration and Return',
          description: 'Explore Sung Sot Cave and return to Hanoi',
          activities: ['Cave exploration', 'Swimming', 'Return transfer'],
          meals: ['Breakfast', 'Lunch']
        }
      ],
      included: [
        'Transportation',
        'Accommodation',
        'Meals as mentioned',
        'English speaking guide',
        'Entrance fees'
      ],
      excluded: [
        'Personal expenses',
        'Tips',
        'Travel insurance'
      ],
      location: {
        address: 'Ha Long Bay, Quang Ninh Province',
        coordinates: {
          lat: 20.9101,
          lng: 107.1839
        },
        city: 'Ha Long',
        country: 'Vietnam'
      }
    });

    await repositoryService.tours.save(sampleTour);
    console.log('🏞️ Sample tour created');

    // Sample hotel data
    const sampleHotel = repositoryService.hotels.create({
      name: 'Luxury Bay Resort',
      description: 'Premium resort with stunning bay views and world-class amenities',
      status: HotelStatus.ACTIVE,
      category: HotelCategory.RESORT,
      starRating: 5,
      rating: 4.7,
      reviewCount: 342,
      location: {
        address: '123 Bay View Road, Ha Long City',
        city: 'Ha Long',
        country: 'Vietnam',
        coordinates: {
          lat: 20.9101,
          lng: 107.1839
        }
      },
      images: [
        'https://example.com/hotel1.jpg',
        'https://example.com/hotel2.jpg'
      ],
      rooms: [
        {
          type: RoomType.DELUXE,
          name: 'Deluxe Bay View',
          description: 'Spacious room with panoramic bay views',
          images: ['https://example.com/room1.jpg'],
          amenities: ['Air conditioning', 'Mini bar', 'Safe'],
          capacity: {
            adults: 2,
            children: 1,
            beds: 1
          },
          size: 35,
          pricing: {
            basePrice: 2500000,
            currency: 'VND'
          },
          availability: {
            total: 50,
            available: 45
          }
        }
      ],
      amenities: {
        general: ['WiFi', 'Air conditioning', 'Room service'],
        business: ['Business center', 'Meeting rooms'],
        wellness: ['Spa', 'Fitness center', 'Swimming pool'],
        dining: ['Restaurant', 'Bar', 'Room service'],
        transportation: ['Airport shuttle', 'Parking'],
        activities: ['Water sports', 'Tour desk']
      }
    });

    await repositoryService.hotels.save(sampleHotel);
    console.log('🏨 Sample hotel created');

    console.log('✅ Initial data seeded successfully!');

  } catch (error) {
    console.error('❌ Data seeding failed:', error);
    throw error;
  }
}

export async function setupElasticsearchData(): Promise<void> {
  console.log('🔍 Setting up Elasticsearch data...');

  try {
    // Index sample tour
    const tours = await repositoryService.tours.find({ take: 10 });
    for (const tour of tours) {
      await searchService.indexDocument('tours', tour.id, tour);
    }

    // Index sample hotels
    const hotels = await repositoryService.hotels.find({ take: 10 });
    for (const hotel of hotels) {
      await searchService.indexDocument('hotels', hotel.id, hotel);
    }

    console.log('✅ Elasticsearch data setup completed');

  } catch (error) {
    console.error('❌ Elasticsearch data setup failed:', error);
    throw error;
  }
}

export { databaseService, repositoryService, cacheService, searchService };
