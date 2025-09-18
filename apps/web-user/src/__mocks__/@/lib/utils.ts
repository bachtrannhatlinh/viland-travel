export const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

export const API_CONFIG = {
  BASE_URL: 'http://localhost:5000',
  VERSION: 'v1',
  get FULL_URL() {
    return `${this.BASE_URL}/api/${this.VERSION}`;
  },
};

export const apiClient = {
  async get() { return {}; },
  async post() { return {}; },
  async put() { return {}; },
  async delete() { return {}; },
};
