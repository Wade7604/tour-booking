const express = require("express");
const router = express.Router();
const TourController = require("../controllers/tour.controller");
const { authenticateUser } = require("../middlewares/auth.middleware");
const { checkPermission } = require("../middlewares/permission.middleware");
const { PERMISSIONS } = require("../utils/constants");

// ===== PUBLIC ROUTES =====

// Get all tours (public)
router.get("/", TourController.getAllTours);

// Search tours
router.get("/search", TourController.searchTours);

// Get tour by slug
router.get("/slug/:slug", TourController.getTourBySlug);

// Get tours by destination
router.get("/destination/:destinationId", TourController.getToursByDestination);

// Get tour by ID
router.get("/:id", TourController.getTourById);

// ===== PROTECTED ROUTES (Require Authentication) =====

// Get tour statistics
router.get(
  "/statistics/overview",
  authenticateUser,
  checkPermission(PERMISSIONS.TOUR_VIEW),
  TourController.getTourStatistics
);

// Create new tour
router.post(
  "/",
  authenticateUser,
  checkPermission(PERMISSIONS.TOUR_CREATE),
  TourController.createTour
);

// Update tour
router.put(
  "/:id",
  authenticateUser,
  checkPermission(PERMISSIONS.TOUR_UPDATE),
  TourController.updateTour
);

// Delete tour
router.delete(
  "/:id",
  authenticateUser,
  checkPermission(PERMISSIONS.TOUR_DELETE),
  TourController.deleteTour
);

// Update tour status
router.patch(
  "/:id/status",
  authenticateUser,
  checkPermission(PERMISSIONS.TOUR_UPDATE),
  TourController.updateTourStatus
);

// ===== IMAGE MANAGEMENT =====

// Add images to tour
router.post(
  "/:id/images",
  authenticateUser,
  checkPermission(PERMISSIONS.TOUR_UPDATE),
  TourController.addImages
);

// Remove image from tour
router.delete(
  "/:id/images/:imageUrl",
  authenticateUser,
  checkPermission(PERMISSIONS.TOUR_UPDATE),
  TourController.removeImage
);

// Set cover image
router.patch(
  "/:id/cover-image",
  authenticateUser,
  checkPermission(PERMISSIONS.TOUR_UPDATE),
  TourController.setCoverImage
);

// ===== AVAILABLE DATES MANAGEMENT =====

// Add available date
router.post(
  "/:id/dates",
  authenticateUser,
  checkPermission(PERMISSIONS.TOUR_UPDATE),
  TourController.addAvailableDate
);

// Update available date
router.put(
  "/:id/dates/:dateIndex",
  authenticateUser,
  checkPermission(PERMISSIONS.TOUR_UPDATE),
  TourController.updateAvailableDate
);

// Remove available date
router.delete(
  "/:id/dates/:dateIndex",
  authenticateUser,
  checkPermission(PERMISSIONS.TOUR_UPDATE),
  TourController.removeAvailableDate
);

module.exports = router;
