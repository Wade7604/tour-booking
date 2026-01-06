const {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  deleteMultipleImages,
  getOptimizedUrl,
  getThumbnailUrl,
} = require("../config/cloudinary.config");

class CloudinaryService {
  /**
   * Upload user avatar
   */
  async uploadAvatar(file, userId) {
    try {
      const result = await uploadImage(file, "avatars", {
        public_id: `avatar_${userId}`,
        overwrite: true,
        transformation: [
          { width: 500, height: 500, crop: "fill", gravity: "face" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      });

      return result;
    } catch (error) {
      throw new Error(`Upload avatar failed: ${error.message}`);
    }
  }

  /**
   * Upload destination images
   */
  async uploadDestinationImages(files, destinationId) {
    try {
      const results = await uploadMultipleImages(files, "destinations");

      // Add destination ID to public_id for reference
      const imagesWithMetadata = results.map((result, index) => ({
        ...result,
        destinationId,
        order: index,
      }));

      return imagesWithMetadata;
    } catch (error) {
      throw new Error(`Upload destination images failed: ${error.message}`);
    }
  }

  /**
   * Upload single destination image
   */
  async uploadDestinationImage(file, destinationId) {
    try {
      const result = await uploadImage(file, "destinations", {
        transformation: [
          { width: 1920, height: 1080, crop: "limit" },
          { quality: "auto:good" },
          { fetch_format: "auto" },
        ],
      });

      return {
        ...result,
        destinationId,
      };
    } catch (error) {
      throw new Error(`Upload destination image failed: ${error.message}`);
    }
  }

  /**
   * Delete avatar
   */
  async deleteAvatar(publicId) {
    try {
      const result = await deleteImage(publicId);
      return result;
    } catch (error) {
      throw new Error(`Delete avatar failed: ${error.message}`);
    }
  }

  /**
   * Delete destination images
   */
  async deleteDestinationImages(publicIds) {
    try {
      if (!Array.isArray(publicIds) || publicIds.length === 0) {
        throw new Error("Public IDs array is required");
      }

      const result = await deleteMultipleImages(publicIds);
      return result;
    } catch (error) {
      throw new Error(`Delete destination images failed: ${error.message}`);
    }
  }

  /**
   * Get optimized image URL
   */
  getOptimizedImageUrl(publicId, options = {}) {
    try {
      return getOptimizedUrl(publicId, options);
    } catch (error) {
      throw new Error(`Get optimized URL failed: ${error.message}`);
    }
  }

  /**
   * Get thumbnail URL
   */
  getThumbnail(publicId, width = 300, height = 300) {
    try {
      return getThumbnailUrl(publicId, width, height);
    } catch (error) {
      throw new Error(`Get thumbnail failed: ${error.message}`);
    }
  }

  /**
   * Extract public ID from Cloudinary URL
   */
  extractPublicId(cloudinaryUrl) {
    try {
      // Extract public_id from URL
      // Example: https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg
      const parts = cloudinaryUrl.split("/");
      const uploadIndex = parts.findIndex((part) => part === "upload");
      if (uploadIndex === -1) return null;

      // Get everything after 'upload/v{version}/'
      const publicIdParts = parts.slice(uploadIndex + 2);
      const publicIdWithExt = publicIdParts.join("/");

      // Remove file extension
      const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "");
      return publicId;
    } catch (error) {
      return null;
    }
  }

  /**
   * Validate image file
   */
  validateImageFile(file) {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!file) {
      throw new Error("No file provided");
    }

    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error(
        "Invalid file type. Only JPEG, PNG, and WebP are allowed"
      );
    }

    if (file.size > maxSize) {
      throw new Error("File size exceeds 10MB limit");
    }

    return true;
  }

  /**
   * Validate multiple image files
   */
  validateImageFiles(files, maxCount = 10) {
    if (!Array.isArray(files) || files.length === 0) {
      throw new Error("No files provided");
    }

    if (files.length > maxCount) {
      throw new Error(`Maximum ${maxCount} files allowed`);
    }

    files.forEach((file, index) => {
      try {
        this.validateImageFile(file);
      } catch (error) {
        throw new Error(`File ${index + 1}: ${error.message}`);
      }
    });

    return true;
  }
}

module.exports = new CloudinaryService();
