const DestinationModel = require("../models/destination.model");
const { MESSAGES, DESTINATION_STATUS } = require("../utils/constants");
const slugify = require("slugify");

class DestinationService {
  // Create destination
  async createDestination(data) {
    try {
      // Generate slug from name if not provided
      if (!data.slug) {
        data.slug = slugify(data.name, { lower: true, strict: true });
      }

      // Check if slug already exists
      const slugExists = await DestinationModel.slugExists(data.slug);
      if (slugExists) {
        throw new Error("Slug already exists");
      }

      // Validate status
      if (
        data.status &&
        !Object.values(DESTINATION_STATUS).includes(data.status)
      ) {
        throw new Error("Invalid status");
      }

      const destination = await DestinationModel.create(data);
      return destination;
    } catch (error) {
      throw error;
    }
  }

  // Get destination by ID
  async getDestinationById(destId) {
    try {
      const destination = await DestinationModel.findById(destId);

      if (!destination) {
        throw new Error(MESSAGES.NOT_FOUND);
      }

      return destination;
    } catch (error) {
      throw error;
    }
  }

  // Get destination by slug
  async getDestinationBySlug(slug) {
    try {
      const destination = await DestinationModel.findBySlug(slug);

      if (!destination) {
        throw new Error(MESSAGES.NOT_FOUND);
      }

      return destination;
    } catch (error) {
      throw error;
    }
  }

  // Get all destinations with pagination
  async getAllDestinations(page, limit, filters) {
    try {
      return await DestinationModel.findAll(page, limit, filters);
    } catch (error) {
      throw error;
    }
  }

  // Update destination
  async updateDestination(destId, data) {
    try {
      const destination = await DestinationModel.findById(destId);
      if (!destination) {
        throw new Error(MESSAGES.NOT_FOUND);
      }

      // If updating slug, check if new slug exists
      if (data.slug && data.slug !== destination.slug) {
        const slugExists = await DestinationModel.slugExists(data.slug);
        if (slugExists) {
          throw new Error("Slug already exists");
        }
      }

      const updatedDestination = await DestinationModel.update(destId, data);
      return updatedDestination;
    } catch (error) {
      throw error;
    }
  }

  // Delete destination
  async deleteDestination(destId) {
    try {
      const destination = await DestinationModel.findById(destId);
      if (!destination) {
        throw new Error(MESSAGES.NOT_FOUND);
      }

      await DestinationModel.delete(destId);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Update destination status
  async updateDestinationStatus(destId, status) {
    try {
      const destination = await DestinationModel.findById(destId);
      if (!destination) {
        throw new Error(MESSAGES.NOT_FOUND);
      }

      // Validate status
      if (!Object.values(DESTINATION_STATUS).includes(status)) {
        throw new Error("Invalid status");
      }

      const updatedDestination = await DestinationModel.update(destId, {
        status,
      });
      return updatedDestination;
    } catch (error) {
      throw error;
    }
  }

  // Get destinations by country
  async getDestinationsByCountry(country, page, limit) {
    try {
      return await DestinationModel.findByCountry(country, page, limit);
    } catch (error) {
      throw error;
    }
  }

  // Search destinations
  async searchDestinations(searchTerm, page, limit, filters) {
    try {
      return await DestinationModel.search(searchTerm, page, limit, filters);
    } catch (error) {
      throw error;
    }
  }

  // Get destination statistics
  async getDestinationStatistics() {
    try {
      return await DestinationModel.getStatistics();
    } catch (error) {
      throw error;
    }
  }

  // Reindex single destination
  async reindexDestination(destId) {
    try {
      const destination = await DestinationModel.findById(destId);
      if (!destination) {
        throw new Error(MESSAGES.NOT_FOUND);
      }

      const ElasticsearchService = require("./elasticsearch.service");
      await ElasticsearchService.indexDestination(destination);

      return destination;
    } catch (error) {
      throw error;
    }
  }

  // Reindex all destinations
  async reindexAllDestinations() {
    try {
      const { destinations } = await DestinationModel.findAll(1, 1000);

      const ElasticsearchService = require("./elasticsearch.service");

      let indexed = 0;
      let failed = 0;

      for (const destination of destinations) {
        try {
          await ElasticsearchService.indexDestination(destination);
          indexed++;
        } catch (error) {
          console.error(
            `Failed to index destination ${destination.id}:`,
            error
          );
          failed++;
        }
      }

      return {
        total: destinations.length,
        indexed,
        failed,
        message: `Reindexed ${indexed} destinations, ${failed} failed`,
      };
    } catch (error) {
      throw error;
    }
  }

  // Add images to destination
  async addImages(destId, images) {
    try {
      const destination = await DestinationModel.findById(destId);
      if (!destination) {
        throw new Error(MESSAGES.NOT_FOUND);
      }

      const currentImages = destination.images || [];
      const updatedImages = [...currentImages, ...images];

      const updatedDestination = await DestinationModel.update(destId, {
        images: updatedImages,
      });

      return updatedDestination;
    } catch (error) {
      throw error;
    }
  }

  // Remove images from destination
  async removeImages(destId, imageUrls) {
    try {
      const destination = await DestinationModel.findById(destId);
      if (!destination) {
        throw new Error(MESSAGES.NOT_FOUND);
      }

      const currentImages = destination.images || [];
      const updatedImages = currentImages.filter(
        (img) => !imageUrls.includes(img)
      );

      const updatedDestination = await DestinationModel.update(destId, {
        images: updatedImages,
      });

      return updatedDestination;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new DestinationService();
