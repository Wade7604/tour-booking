const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");
const { authenticateUser } = require("../middlewares/auth.middleware");
const {
  checkPermission,
  adminOnly,
} = require("../middlewares/permission.middleware");

// All routes require authentication
router.use(authenticateUser);

// ===== ELASTICSEARCH ROUTES =====
// GET /api/users/elasticsearch/health - Elasticsearch health check
router.get(
  "/elasticsearch/health",
  checkPermission("user:view"),
  UserController.checkElasticsearchHealth
);

// POST /api/users/elasticsearch/reindex - Reindex all users (admin only)
router.post(
  "/elasticsearch/reindex",
  adminOnly,
  UserController.reindexAllUsers
);

// ===== STATISTICS ROUTES =====
// GET /api/users/statistics - Get user statistics
router.get(
  "/statistics",
  checkPermission("user:view"),
  UserController.getUserStatistics
);

// ===== SEARCH & FILTER ROUTES =====
// GET /api/users/search - Search users
router.get("/search", checkPermission("user:view"), UserController.searchUsers);

// GET /api/users/role/:role - Get users by role
router.get(
  "/role/:role",
  checkPermission("user:view"),
  UserController.getUsersByRole
);

// ===== OWN PROFILE ROUTES (user:update-own) =====
// GET /api/users/me - Get own profile
router.get("/me", UserController.getOwnProfile);

// PUT /api/users/me - Update own profile
router.put(
  "/me",
  checkPermission("user:update-own"),
  UserController.updateOwnProfile
);

// ===== ADMIN ROUTES (requires specific permissions) =====
// GET /api/users - Get all users
router.get("/", checkPermission("user:view"), UserController.getAllUsers);

// GET /api/users/:id - Get user by ID
router.get("/:id", checkPermission("user:view"), UserController.getUserById);

// POST /api/users - Create new user
router.post("/", checkPermission("user:create"), UserController.createUser);

// PUT /api/users/:id - Update user (admin)
router.put("/:id", checkPermission("user:update"), UserController.updateUser);

// PATCH /api/users/:id/status - Update user status
router.patch(
  "/:id/status",
  checkPermission("user:update"),
  UserController.updateUserStatus
);

// PATCH /api/users/:id/role - Update user role (admin only)
router.patch("/:id/role", adminOnly, UserController.updateUserRole);

// POST /api/users/:id/reindex - Reindex a user
router.post(
  "/:id/reindex",
  checkPermission("user:update"),
  UserController.reindexUser
);

// DELETE /api/users/:id - Delete user
router.delete(
  "/:id",
  checkPermission("user:delete"),
  UserController.deleteUser
);

module.exports = router;
