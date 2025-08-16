# ViLand Travel Database Architecture

## Tổng quan
Hệ thống ViLand Travel sử dụng kiến trúc multi-database với 3 hệ quản trị cơ sở dữ liệu chính:

- **PostgreSQL**: Cơ sở dữ liệu chính cho dữ liệu quan hệ
- **Redis**: Cache và quản lý session
- **Elasticsearch**: Tìm kiếm nâng cao

## 🗄️ PostgreSQL - Cơ sở dữ liệu chính

### Entities (Bảng)

#### 1. Users (`users`)
- Quản lý thông tin người dùng
- Roles: `customer`, `admin`, `partner`
- Status: `active`, `inactive`, `suspended`
- Chứa preferences (JSONB) và address (JSONB)

#### 2. Bookings (`bookings`)
- Quản lý đặt chỗ cho tất cả dịch vụ
- Types: `tour`, `flight`, `hotel`, `car_rental`, `driver_service`
- Status: `pending`, `confirmed`, `cancelled`, `completed`, `expired`
- Chi tiết booking trong JSONB

#### 3. Payments (`payments`)
- Quản lý thanh toán
- Methods: `credit_card`, `bank_transfer`, `vnpay`, `momo`, etc.
- Status: `pending`, `completed`, `failed`, `refunded`
- Tích hợp với payment gateway

#### 4. Tours (`tours`)
- Quản lý thông tin tour
- Types: `cultural`, `adventure`, `beach`, `mountain`, etc.
- Difficulty: `easy`, `moderate`, `challenging`, `difficult`
- Chứa itinerary, images, location (JSONB)

#### 5. Flights (`flights`)
- Quản lý chuyến bay
- Pricing theo class (economy, business, first)
- Status theo thời gian thực
- Amenities và baggage policy

#### 6. Hotels (`hotels`)
- Quản lý khách sạn
- Category: `hotel`, `resort`, `hostel`, `apartment`
- Rooms với nested pricing và availability
- Amenities phân loại theo nhóm

#### 7. Car Rentals (`car_rentals`)
- Quản lý thuê xe
- Types: `economy`, `luxury`, `suv`, etc.
- Features, insurance, rental terms
- Availability calendar

#### 8. Drivers (`drivers`)
- Quản lý tài xế
- Service types: `airport_transfer`, `city_tour`, `intercity`
- Vehicle info và documents verification
- Pricing theo service type

### Relationships
```
User 1---* Booking *---1 Payment
Tour 1---* Booking
Flight 1---* Booking
Hotel 1---* Booking
CarRental 1---* Booking
Driver 1---* Booking
```

## 🚀 Redis - Caching & Sessions

### Cache Types

#### 1. Search Results Cache
- **Key pattern**: `search:{type}:{hash}`
- **TTL**: 5-60 minutes
- **Usage**: Cache kết quả tìm kiếm flights, hotels, tours

#### 2. Session Cache
- **Key pattern**: `session:user:{userId}`
- **TTL**: 24 hours
- **Usage**: User session data, preferences

#### 3. Rate Limiting
- **Key pattern**: `rate_limit:{identifier}`
- **TTL**: Based on window
- **Usage**: API rate limiting

#### 4. Popular Searches
- **Key pattern**: `popular:{type}`
- **TTL**: 2 hours
- **Usage**: Trending destinations, searches

### Redis Databases
- **DB 0**: General caching
- **DB 1**: Session management

## 🔍 Elasticsearch - Search Engine

### Indices

#### 1. Tours Index
- **Mapping**: Full-text search cho name, description
- **Filters**: destination, type, price range, rating
- **Sort**: rating, price, duration
- **Aggregations**: Popular destinations, price ranges

#### 2. Flights Index
- **Mapping**: Route-based search
- **Filters**: airports, dates, class, airline
- **Sort**: price, departure time, duration
- **Real-time**: Status updates

#### 3. Hotels Index
- **Mapping**: Location và amenity search
- **Filters**: city, category, star rating, amenities
- **Sort**: rating, price, distance
- **Geo**: Location-based search

#### 4. Destinations Index
- **Mapping**: Auto-complete cho destinations
- **Suggest**: Typeahead search
- **Popular**: Trending destinations

### Search Features
- **Multi-language**: Vietnamese analyzer
- **Fuzzy search**: Typo tolerance
- **Autocomplete**: Instant suggestions
- **Geo search**: Distance-based results
- **Faceted search**: Filter combinations

## 📁 File Structure

```
src/
├── config/
│   ├── database.ts          # Main database service
│   ├── postgresql.ts        # PostgreSQL config
│   ├── redis.ts            # Redis config & cache service
│   └── elasticsearch.ts    # Elasticsearch config & search service
├── entities/
│   ├── User.entity.ts
│   ├── Booking.entity.ts
│   ├── Payment.entity.ts
│   ├── Tour.entity.ts
│   ├── Flight.entity.ts
│   ├── Hotel.entity.ts
│   ├── CarRental.entity.ts
│   └── Driver.entity.ts
├── repositories/
│   └── index.ts            # Repository service với custom methods
└── utils/
    └── database-init.ts    # Initialization & seeding
```

## ⚙️ Configuration

### Environment Variables

```env
# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=ViLand Travel_user
DB_PASSWORD=ViLand Travel_password
DB_NAME=ViLand Travel_booking

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
REDIS_SESSION_DB=1

# Elasticsearch
ELASTICSEARCH_NODE=http://localhost:9200
ELASTICSEARCH_USERNAME=
ELASTICSEARCH_PASSWORD=
```

## 🚀 Usage

### 1. Initialize Database
```typescript
import { initializeDatabase, seedInitialData } from './utils/database-init';

// Khởi tạo tất cả database connections
await initializeDatabase();

// Seed dữ liệu mẫu (chỉ development)
await seedInitialData();
```

### 2. Repository Usage
```typescript
import { repositoryService } from './repositories';

// Find users
const users = await repositoryService.findActiveUsers();
const user = await repositoryService.findUserByEmail('user@example.com');

// Find tours
const tours = await repositoryService.findToursByDestination('Ha Long Bay');
const popularTours = await repositoryService.findPopularTours(10);
```

### 3. Cache Usage
```typescript
import { cacheService } from './config/redis';

// Cache search results
await cacheService.cacheSearchResults('flight-search-key', results, 600);
const cached = await cacheService.getSearchResults('flight-search-key');

// Session management
await cacheService.cacheUserSession(userId, sessionData);
const session = await cacheService.getUserSession(userId);
```

### 4. Search Usage
```typescript
import { searchService } from './config/elasticsearch';

// Search tours
const tourResults = await searchService.searchTours({
  query: 'Ha Long Bay',
  type: 'nature',
  priceRange: { min: 1000000, max: 5000000 }
});

// Search flights
const flightResults = await searchService.searchFlights({
  from: 'HAN',
  to: 'SGN',
  departureDate: '2024-01-15',
  passengers: 2
});
```

## 🛠️ Development

### 1. Database Schema Updates
- Sử dụng TypeORM migrations cho production
- Development: `synchronize: true` tự động sync schema

### 2. Cache Management
- Implement cache invalidation strategies
- Monitor cache hit rates
- Use appropriate TTL values

### 3. Search Index Management
- Regular index optimization
- Bulk indexing for large datasets
- Monitor search performance

## 📊 Monitoring & Health Checks

```typescript
import { databaseService } from './config/database';

// Health check tất cả databases
const health = await databaseService.healthCheck();
console.log(health);
/*
{
  postgresql: true,
  redis: true,
  elasticsearch: true,
  overall: true
}
*/
```

## 🔧 Troubleshooting

### Common Issues

1. **PostgreSQL Connection Failed**
   - Check connection string
   - Verify database exists
   - Check user permissions

2. **Redis Connection Failed**
   - Verify Redis server running
   - Check host/port configuration
   - Check authentication

3. **Elasticsearch Connection Failed**
   - Verify ES cluster running
   - Check node URL
   - Verify authentication credentials

4. **TypeORM Entity Errors**
   - Enable TypeScript decorators
   - Check entity imports
   - Verify enum values

### Performance Tips

1. **PostgreSQL**
   - Use indexes for frequent queries
   - Optimize JSONB queries
   - Connection pooling

2. **Redis**
   - Set appropriate TTL
   - Use pipelining for bulk operations
   - Monitor memory usage

3. **Elasticsearch**
   - Use filters instead of queries when possible
   - Optimize mapping settings
   - Regular index maintenance

## 📈 Scaling Considerations

### PostgreSQL
- Read replicas for read-heavy workloads
- Partitioning for large tables
- Connection pooling

### Redis
- Redis Cluster for high availability
- Separate cache and session databases
- Memory optimization

### Elasticsearch
- Multi-node cluster
- Index templates
- Snapshot/restore strategy

---

**Lưu ý**: Đây là architecture phức tạp, cần setup và cấu hình cẩn thận cho từng environment (development, staging, production).
