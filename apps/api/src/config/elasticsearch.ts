// Elasticsearch configuration - temporarily disabled for development
// This file will be properly configured when Elasticsearch is needed

export class ElasticsearchService {
  private client: any = null;

  constructor() {
    console.log('⚠️  Elasticsearch service is temporarily disabled for development');
  }

  async connect(): Promise<void> {
    console.log('⚠️  Elasticsearch connection skipped - service disabled');
  }

  async ping(): Promise<boolean> {
    return false;
  }

  async createIndex(indexName: string, mapping: any): Promise<void> {
    console.log(`⚠️  Elasticsearch index creation skipped: ${indexName}`);
  }

  async search(indexName: string, query: any, options: any = {}): Promise<any> {
    console.log(`⚠️  Elasticsearch search skipped for index: ${indexName}`);
    return { hits: { hits: [], total: { value: 0 } } };
  }

  async searchTours(searchParams: any): Promise<any> {
    console.log('⚠️  Tour search via Elasticsearch skipped');
    return { hits: { hits: [], total: { value: 0 } } };
  }

  async searchFlights(searchParams: any): Promise<any> {
    console.log('⚠️  Flight search via Elasticsearch skipped');
    return { hits: { hits: [], total: { value: 0 } } };
  }

  async searchHotels(searchParams: any): Promise<any> {
    console.log('⚠️  Hotel search via Elasticsearch skipped');
    return { hits: { hits: [], total: { value: 0 } } };
  }

  async searchCars(searchParams: any): Promise<any> {
    console.log('⚠️  Car search via Elasticsearch skipped');
    return { hits: { hits: [], total: { value: 0 } } };
  }

  async getSuggestions(indexName: string, field: string, text: string, size: number = 5): Promise<string[]> {
    console.log('⚠️  Elasticsearch suggestions skipped');
    return [];
  }

  async getAggregations(indexName: string, aggregations: any): Promise<any> {
    console.log('⚠️  Elasticsearch aggregations skipped');
    return {};
  }
}

// Export default instance
const elasticsearchService = new ElasticsearchService();
export default elasticsearchService;

// Legacy exports for compatibility
export const elasticsearchClient = elasticsearchService;
export const searchService = elasticsearchService;
export const initializeElasticsearch = async () => {
  console.log('⚠️  Elasticsearch initialization skipped');
};