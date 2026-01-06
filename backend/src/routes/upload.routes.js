const express = require("express");
const router = express.Router();
const UploadController = require("../controllers/upload.controller");
const { uploadSingle, uploadMultiple } = require("../config/multer.config");
const { authenticateUser } = require("../middlewares/auth.middleware");
const { checkPermission } = require("../middlewares/permission.middleware");

/**
 * @route   POST /api/uploads/avatar
 * @desc    Upload user avatar (own avatar only)
 * @access  Private (Requires user:update-own permission)
 */
router.post(
  "/avatar",
  authenticateUser,
  checkPermission("user:update-own"),
  uploadSingle("avatar"),
  UploadController.uploadAvatar
);

/**
 * @route   POST /api/uploads/avatar/:userId
 * @desc    Upload avatar for specific user (admin only)
 * @access  Private (Requires user:update permission)
 */
router.post(
  "/avatar/:userId",
  authenticateUser,
  checkPermission("user:update"),
  uploadSingle("avatar"),
  UploadController.uploadAvatar
);

/**
 * @route   POST /api/uploads/destinations/:destinationId/images
 * @desc    Upload destination images
 * @access  Private (Requires destination:update permission)
 */
router.post(
  "/destinations/:destinationId/images",
  authenticateUser,
  checkPermission("destination:update"),
  uploadMultiple("images", 10),
  UploadController.uploadDestinationImages
);

/**
 * @route   DELETE /api/uploads/destinations/:destinationId/image
 * @desc    Delete single destination image
 * @access  Private (Requires destination:update permission)
 */
router.delete(
  "/destinations/:destinationId/image",
  authenticateUser,
  checkPermission("destination:update"),
  UploadController.deleteDestinationImage
);

/**
 * @route   DELETE /api/uploads/destinations/:destinationId/images
 * @desc    Delete multiple destination images
 * @access  Private (Requires destination:delete permission)
 */
router.delete(
  "/destinations/:destinationId/images",
  authenticateUser,
  checkPermission("destination:delete"),
  UploadController.deleteMultipleDestinationImages
);

/**
 * @route   GET /api/uploads/optimize
 * @desc    Get optimized image URL
 * @access  Public
 */
router.get("/optimize", UploadController.getOptimizedImageUrl);

/**
 * @route   GET /api/uploads/thumbnail
 * @desc    Get thumbnail URL
 * @access  Public
 */
router.get("/thumbnail", UploadController.getThumbnailUrl);

module.exports = router;
