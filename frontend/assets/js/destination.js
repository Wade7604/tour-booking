// Destination API Service
class DestinationAPI {
  // Get all destinations with pagination and filters
  static async getAllDestinations(page = 1, limit = 20, filters = {}) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (filters.status) params.append("status", filters.status);
      if (filters.country) params.append("country", filters.country);
      if (filters.city) params.append("city", filters.city);

      return await API.request(`/destinations?${params.toString()}`);
    } catch (error) {
      console.error("Get all destinations error:", error);
      throw error;
    }
  }

  // Search destinations
  static async searchDestinations(query, page = 1, limit = 20, filters = {}) {
    try {
      const params = new URLSearchParams({
        q: query,
        page: page.toString(),
        limit: limit.toString(),
      });

      if (filters.status) params.append("status", filters.status);
      if (filters.country) params.append("country", filters.country);
      if (filters.city) params.append("city", filters.city);

      return await API.request(`/destinations/search?${params.toString()}`);
    } catch (error) {
      console.error("Search destinations error:", error);
      throw error;
    }
  }

  // Get destination by ID
  static async getDestinationById(id) {
    try {
      return await API.request(`/destinations/${id}`);
    } catch (error) {
      console.error("Get destination by ID error:", error);
      throw error;
    }
  }

  // Get destination by slug
  static async getDestinationBySlug(slug) {
    try {
      return await API.request(`/destinations/slug/${slug}`);
    } catch (error) {
      console.error("Get destination by slug error:", error);
      throw error;
    }
  }

  // Create new destination
  static async createDestination(destinationData) {
    try {
      return await API.request("/destinations", {
        method: "POST",
        body: JSON.stringify(destinationData),
      });
    } catch (error) {
      console.error("Create destination error:", error);
      throw error;
    }
  }

  // Update destination
  static async updateDestination(id, destinationData) {
    try {
      return await API.request(`/destinations/${id}`, {
        method: "PUT",
        body: JSON.stringify(destinationData),
      });
    } catch (error) {
      console.error("Update destination error:", error);
      throw error;
    }
  }

  // Delete destination
  static async deleteDestination(id) {
    try {
      return await API.request(`/destinations/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Delete destination error:", error);
      throw error;
    }
  }

  // Update destination status
  static async updateDestinationStatus(id, status) {
    try {
      return await API.request(`/destinations/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      console.error("Update destination status error:", error);
      throw error;
    }
  }

  // Get destination statistics
  static async getDestinationStatistics() {
    try {
      return await API.request("/destinations/statistics/overview");
    } catch (error) {
      console.error("Get destination statistics error:", error);
      throw error;
    }
  }

  // Add images to destination
  static async addImages(id, images) {
    try {
      return await API.request(`/destinations/${id}/images`, {
        method: "POST",
        body: JSON.stringify({ images }),
      });
    } catch (error) {
      console.error("Add images error:", error);
      throw error;
    }
  }

  // Remove images from destination
  static async removeImages(id, images) {
    try {
      return await API.request(`/destinations/${id}/images`, {
        method: "DELETE",
        body: JSON.stringify({ images }),
      });
    } catch (error) {
      console.error("Remove images error:", error);
      throw error;
    }
  }

  // Get destinations by country
  static async getDestinationsByCountry(country, page = 1, limit = 20) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      return await API.request(
        `/destinations/country/${country}?${params.toString()}`
      );
    } catch (error) {
      console.error("Get destinations by country error:", error);
      throw error;
    }
  }

  // Reindex destination in Elasticsearch
  static async reindexDestination(id) {
    try {
      return await API.request(`/destinations/${id}/reindex`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Reindex destination error:", error);
      throw error;
    }
  }

  // Reindex all destinations
  static async reindexAllDestinations() {
    try {
      return await API.request("/destinations/elasticsearch/reindex", {
        method: "POST",
      });
    } catch (error) {
      console.error("Reindex all destinations error:", error);
      throw error;
    }
  }

  // Check Elasticsearch health
  static async checkElasticsearchHealth() {
    try {
      return await API.request("/destinations/elasticsearch/health");
    } catch (error) {
      console.error("Elasticsearch health check error:", error);
      throw error;
    }
  }
}

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = DestinationAPI;
}
