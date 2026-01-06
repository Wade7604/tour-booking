const CloudinaryService = require("../services/cloudinary.service");

class UploadController {
  /**
   * Upload user avatar
   * Route: POST /api/uploads/avatar (own) or POST /api/uploads/avatar/:userId (admin)
   */
  async uploadAvatar(req, res) {
    try {
      // Get userId from params (admin upload for others) or from authenticated user (own upload)
      const userId = req.params.userId || req.user.userId;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      // Validate image file
      CloudinaryService.validateImageFile(req.file);

      // If uploading for own account (no userId in params), ensure it matches authenticated user
      if (!req.params.userId && userId !== req.user.userId) {
        return res.status(403).json({
          success: false,
          message: "You can only upload your own avatar",
        });
      }

      // Upload avatar to Cloudinary
      const result = await CloudinaryService.uploadAvatar(req.file, userId);

      // Update user avatar in database
      const UserService = require("../services/user.service");
      await UserService.updateUser(userId, { avatar: result.url });

      return res.status(200).json({
        success: true,
        message: "Avatar uploaded successfully",
        data: {
          url: result.url,
          publicId: result.publicId,
          thumbnail: CloudinaryService.getThumbnail(result.publicId),
        },
      });
    } catch (error) {
      console.error("Upload avatar error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to upload avatar",
      });
    }
  }

  /**
   * Upload destination images
   */
  async uploadDestinationImages(req, res) {
    try {
      const { destinationId } = req.params;

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No files uploaded",
        });
      }

      // Validate image files
      CloudinaryService.validateImageFiles(req.files);

      // Upload images to Cloudinary
      const results = await CloudinaryService.uploadDestinationImages(
        req.files,
        destinationId
      );

      return res.status(200).json({
        success: true,
        message: "Images uploaded successfully",
        data: results.map((result, index) => ({
          url: result.url,
          publicId: result.publicId,
          thumbnail: CloudinaryService.getThumbnail(result.publicId),
          order: index,
        })),
      });
    } catch (error) {
      console.error("Upload destination images error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to upload images",
      });
    }
  }

  /**
   * Delete single destination image
   */
  async deleteDestinationImage(req, res) {
    try {
      const { publicId } = req.body;

      if (!publicId) {
        return res.status(400).json({
          success: false,
          message: "Public ID is required",
        });
      }

      const result = await CloudinaryService.deleteAvatar(publicId);

      return res.status(200).json({
        success: true,
        message: "Image deleted successfully",
        data: result,
      });
    } catch (error) {
      console.error("Delete destination image error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to delete image",
      });
    }
  }

  /**
   * Delete multiple destination images
   */
  async deleteMultipleDestinationImages(req, res) {
    try {
      const { publicIds } = req.body;

      if (!publicIds || !Array.isArray(publicIds)) {
        return res.status(400).json({
          success: false,
          message: "Public IDs array is required",
        });
      }

      const result = await CloudinaryService.deleteDestinationImages(publicIds);

      return res.status(200).json({
        success: true,
        message: "Images deleted successfully",
        data: result,
      });
    } catch (error) {
      console.error("Delete destination images error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to delete images",
      });
    }
  }

  /**
   * Get optimized image URL
   */
  async getOptimizedImageUrl(req, res) {
    try {
      const { publicId, width, height, quality } = req.query;

      if (!publicId) {
        return res.status(400).json({
          success: false,
          message: "Public ID is required",
        });
      }

      const options = {};
      if (width) options.width = parseInt(width);
      if (height) options.height = parseInt(height);
      if (quality) options.quality = quality;

      const url = CloudinaryService.getOptimizedImageUrl(publicId, options);

      return res.status(200).json({
        success: true,
        data: { url },
      });
    } catch (error) {
      console.error("Get optimized URL error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to get optimized URL",
      });
    }
  }

  /**
   * Get thumbnail URL
   */
  async getThumbnailUrl(req, res) {
    try {
      const { publicId, width, height } = req.query;

      if (!publicId) {
        return res.status(400).json({
          success: false,
          message: "Public ID is required",
        });
      }

      const thumbnailWidth = width ? parseInt(width) : 300;
      const thumbnailHeight = height ? parseInt(height) : 300;

      const url = CloudinaryService.getThumbnail(
        publicId,
        thumbnailWidth,
        thumbnailHeight
      );

      return res.status(200).json({
        success: true,
        data: { url },
      });
    } catch (error) {
      console.error("Get thumbnail URL error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to get thumbnail URL",
      });
    }
  }
}

module.exports = new UploadController();
