const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Get Cloudinary instance
 */
const getCloudinary = () => {
  return cloudinary;
};

/**
 * Upload single image to Cloudinary from buffer (memory storage)
 * @param {Object} file - Multer file object with buffer property
 * @param {String} folder - Cloudinary folder name
 * @param {Object} options - Additional Cloudinary upload options
 * @returns {Promise} Upload result
 */
const uploadImage = (file, folder = "general", options = {}) => {
  return new Promise((resolve, reject) => {
    // Validate file object
    if (!file || !file.buffer) {
      return reject(new Error("Invalid file object - buffer is required"));
    }

    const uploadOptions = {
      folder: `travel-app/${folder}`,
      resource_type: "auto",
      ...options,
    };

    console.log(`Uploading file to Cloudinary folder: ${folder}`);

    // Create upload stream
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(
            new Error(`Cloudinary upload failed: ${error.message}`)
          );
        }

        console.log("Cloudinary upload successful:", result.public_id);

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
        });
      }
    );

    // Convert buffer to stream and pipe to Cloudinary
    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

/**
 * Upload multiple images to Cloudinary from buffers
 * @param {Array} files - Array of Multer file objects with buffer
 * @param {String} folder - Cloudinary folder name
 * @returns {Promise} Array of upload results
 */
const uploadMultipleImages = async (files, folder = "general") => {
  try {
    if (!Array.isArray(files) || files.length === 0) {
      throw new Error("No files provided");
    }

    console.log(`Uploading ${files.length} files to folder: ${folder}`);

    const uploadPromises = files.map((file) => uploadImage(file, folder));
    const results = await Promise.all(uploadPromises);

    console.log(`Successfully uploaded ${results.length} files`);
    return results;
  } catch (error) {
    console.error("Multiple upload error:", error);
    throw new Error(`Multiple upload failed: ${error.message}`);
  }
};

/**
 * Delete image from Cloudinary
 * @param {String} publicId - Cloudinary public ID
 * @returns {Promise} Deletion result
 */
const deleteImage = async (publicId) => {
  try {
    if (!publicId) {
      throw new Error("Public ID is required");
    }
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Delete image error:", error);
    throw new Error(`Cloudinary delete failed: ${error.message}`);
  }
};

/**
 * Delete multiple images from Cloudinary
 * @param {Array} publicIds - Array of Cloudinary public IDs
 * @returns {Promise} Deletion results
 */
const deleteMultipleImages = async (publicIds) => {
  try {
    if (!Array.isArray(publicIds) || publicIds.length === 0) {
      throw new Error("Public IDs array is required");
    }
    const result = await cloudinary.api.delete_resources(publicIds);
    return result;
  } catch (error) {
    console.error("Delete multiple images error:", error);
    throw new Error(`Multiple delete failed: ${error.message}`);
  }
};

/**
 * Get image details
 * @param {String} publicId - Cloudinary public ID
 * @returns {Promise} Image details
 */
const getImageDetails = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId);
    return result;
  } catch (error) {
    throw new Error(`Get image details failed: ${error.message}`);
  }
};

/**
 * Generate optimized image URL
 * @param {String} publicId - Cloudinary public ID
 * @param {Object} options - Transformation options
 * @returns {String} Optimized image URL
 */
const getOptimizedUrl = (publicId, options = {}) => {
  return cloudinary.url(publicId, {
    fetch_format: "auto",
    quality: "auto",
    ...options,
  });
};

/**
 * Generate thumbnail URL
 * @param {String} publicId - Cloudinary public ID
 * @param {Number} width - Thumbnail width
 * @param {Number} height - Thumbnail height
 * @returns {String} Thumbnail URL
 */
const getThumbnailUrl = (publicId, width = 300, height = 300) => {
  return cloudinary.url(publicId, {
    width,
    height,
    crop: "fill",
    gravity: "auto",
    fetch_format: "auto",
    quality: "auto",
  });
};

module.exports = {
  getCloudinary,
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  deleteMultipleImages,
  getImageDetails,
  getOptimizedUrl,
  getThumbnailUrl,
};
