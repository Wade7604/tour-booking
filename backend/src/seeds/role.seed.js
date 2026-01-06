const RoleModel = require("../models/role.model");

const roles = [
  {
    name: "admin",
    displayName: "Administrator",
    description: "Full system access",
    isSystem: true,
    permissions: [
      // User permissions
      "user:view",
      "user:create",
      "user:update",
      "user:update-own",
      "user:delete",
      // Tour permissions
      "tour:view",
      "tour:create",
      "tour:update",
      "tour:delete",
      // Destination permissions
      "destination:view",
      "destination:create",
      "destination:update",
      "destination:delete",
      // Booking permissions
      "booking:view",
      "booking:view-own",
      "booking:create",
      "booking:update",
      "booking:delete",
      // Role permissions
      "role:view",
      "role:create",
      "role:update",
      "role:delete",
      // Permission permissions
      "permission:view",
      "permission:create",
      "permission:update",
      "permission:delete",
    ],
  },
  {
    name: "manager",
    displayName: "Manager",
    description: "Manage tours, destinations and bookings",
    isSystem: true,
    permissions: [
      "user:view",
      "user:update-own",
      "tour:view",
      "tour:create",
      "tour:update",
      "tour:delete",
      "destination:view",
      "destination:create",
      "destination:update",
      "destination:delete",
      "booking:view",
      "booking:view-own",
      "booking:create",
      "booking:update",
      "role:view",
      "permission:view",
    ],
  },
  {
    name: "user",
    displayName: "User",
    description: "Regular user - can book tours",
    isSystem: true,
    permissions: [
      "user:update-own",
      "tour:view",
      "destination:view",
      "booking:view-own",
      "booking:create",
    ],
  },
  {
    name: "guest",
    displayName: "Guest",
    description: "Guest user - view only",
    isSystem: true,
    permissions: ["tour:view", "destination:view"],
  },
];

const seedRoles = async () => {
  try {
    console.log("🌱 Seeding roles...");

    for (const roleData of roles) {
      try {
        // Try to find the existing role
        const existingRole = await RoleModel.findByName(roleData.name);

        if (existingRole) {
          // Role exists - update it
          const roleId = existingRole.id;
          await RoleModel.update(roleId, {
            displayName: roleData.displayName,
            description: roleData.description,
            permissions: roleData.permissions,
          });
          console.log(
            `🔄 Updated role: ${roleData.name} (${roleData.permissions.length} permissions)`
          );
        } else {
          // Role doesn't exist - create it
          await RoleModel.create(roleData);
          console.log(
            `✅ Created role: ${roleData.name} (${roleData.permissions.length} permissions)`
          );
        }
      } catch (error) {
        // If role doesn't exist, create it
        if (error.message === "Role not found") {
          await RoleModel.create(roleData);
          console.log(
            `✅ Created role: ${roleData.name} (${roleData.permissions.length} permissions)`
          );
        } else {
          throw error;
        }
      }
    }

    console.log("✅ Roles seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding roles:", error);
    throw error;
  }
};

module.exports = seedRoles;
