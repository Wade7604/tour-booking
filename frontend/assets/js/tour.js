// Tour API Service
class TourAPI {
  constructor() {
    this.baseURL = "/tours";
  }

  // Helper: Build query string from params
  buildQueryString(params = {}) {
    const filtered = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    return filtered ? `?${filtered}` : '';
  }

  // Get all tours
  async getAll(params = {}) {
    const queryString = this.buildQueryString(params);
    return await API.get(`${this.baseURL}${queryString}`);
  }

  // Get tour by ID
  async getById(id) {
    return await API.get(`${this.baseURL}/${id}`);
  }

  // Get tour by slug
  async getBySlug(slug) {
    return await API.get(`${this.baseURL}/slug/${slug}`);
  }

  // Search tours
  async search(query, params = {}) {
    const queryString = this.buildQueryString({ q: query, ...params });
    return await API.get(`${this.baseURL}/search${queryString}`);
  }

  // Get tours by destination
  async getByDestination(destinationId, params = {}) {
    const queryString = this.buildQueryString(params);
    return await API.get(
      `${this.baseURL}/destination/${destinationId}${queryString}`
    );
  }

  // Get tour statistics
  async getStatistics() {
    return await API.get(`${this.baseURL}/statistics/overview`);
  }

  // Create tour
  async create(tourData) {
    return await API.post(this.baseURL, tourData);
  }

  // Update tour
  async update(id, tourData) {
    return await API.put(`${this.baseURL}/${id}`, tourData);
  }

  // Delete tour
  async delete(id) {
    return await API.delete(`${this.baseURL}/${id}`);
  }

  // Update tour status
  async updateStatus(id, status) {
    return await API.patch(`${this.baseURL}/${id}/status`, { status });
  }

  // Add images
  async addImages(id, images) {
    return await API.post(`${this.baseURL}/${id}/images`, { images });
  }

  // Remove image
  async removeImage(id, imageUrl) {
    return await API.delete(
      `${this.baseURL}/${id}/images/${encodeURIComponent(imageUrl)}`
    );
  }

  // Set cover image
  async setCoverImage(id, coverImage) {
    return await API.patch(`${this.baseURL}/${id}/cover-image`, {
      coverImage,
    });
  }

  // Add available date
  async addAvailableDate(id, dateData) {
    return await API.post(`${this.baseURL}/${id}/dates`, dateData);
  }

  // Update available date
  async updateAvailableDate(id, dateIndex, dateData) {
    return await API.put(`${this.baseURL}/${id}/dates/${dateIndex}`, dateData);
  }

  // Remove available date
  async removeAvailableDate(id, dateIndex) {
    return await API.delete(`${this.baseURL}/${id}/dates/${dateIndex}`);
  }

  // Helper: Generate slug from name
  generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  // Helper: Format price
  formatPrice(price, currency = "VND") {
    if (currency === "VND") {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price);
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price);
  }

  // Helper: Format duration
  formatDuration(duration) {
    return `${duration.days} ngày ${duration.nights} đêm`;
  }
}

// Export singleton instance
const tourAPI = new TourAPI();
