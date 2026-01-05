const express = require("express");
const router = express.Router();
const DestinationController = require("../controllers/destination.controller");
const { authenticateUser } = require("../middlewares/auth.middleware");
const {
  checkPermission,
  adminOnly,
} = require("../middlewares/permission.middleware");

// Public routes (no auth required)
router.get("/search", DestinationController.searchDestinations);
router.get("/slug/:slug", DestinationController.getDestinationBySlug);
router.get("/country/:country", DestinationController.getDestinationsByCountry);
router.get("/:id", DestinationController.getDestinationById);
router.get("/", DestinationController.getAllDestinations);

// Protected routes (require authentication)
router.use(authenticateUser);

// Elasticsearch routes
router.get(
  "/elasticsearch/health",
  checkPermission("destination:view"),
  DestinationController.checkElasticsearchHealth
);

router.post(
  "/elasticsearch/reindex",
  adminOnly,
  DestinationController.reindexAllDestinations
);

// Statistics
router.get(
  "/statistics/overview",
  checkPermission("destination:view"),
  DestinationController.getDestinationStatistics
);

// CRUD operations
router.post(
  "/",
  checkPermission("destination:create"),
  DestinationController.createDestination
);

router.put(
  "/:id",
  checkPermission("destination:update"),
  DestinationController.updateDestination
);

router.patch(
  "/:id/status",
  checkPermission("destination:update"),
  DestinationController.updateDestinationStatus
);

router.post(
  "/:id/reindex",
  checkPermission("destination:update"),
  DestinationController.reindexDestination
);

router.post(
  "/:id/images",
  checkPermission("destination:update"),
  DestinationController.addImages
);

router.delete(
  "/:id/images",
  checkPermission("destination:update"),
  DestinationController.removeImages
);

router.delete(
  "/:id",
  checkPermission("destination:delete"),
  DestinationController.deleteDestination
);

module.exports = router;
