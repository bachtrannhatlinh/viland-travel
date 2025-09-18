require('@testing-library/jest-dom');

// Mock the utils module before any tests run
jest.mock('@/lib/utils', () => ({
  cn: (...classes) => classes.filter(Boolean).join(' '),
  API_CONFIG: {
    BASE_URL: 'http://localhost:5000',
    VERSION: 'v1',
    get FULL_URL() {
      return `${this.BASE_URL}/api/${this.VERSION}`;
    },
  },
  apiClient: {
    get: jest.fn().mockResolvedValue({}),
    post: jest.fn().mockResolvedValue({}),
    put: jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue({}),
  },
}));
