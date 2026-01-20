const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Tour Booking API",
      version: "1.0.0",
      description: "API documentation for Tour Booking System - A comprehensive platform for managing tours, destinations, bookings, and users",
      contact: {
        name: "API Support",
        email: "kimtruongthinh.nguyen@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Development server",
      },
      {
        url: "https://tour-booking-1-wbjc.onrender.com/api",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Firebase JWT token from authentication",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Error message",
            },
            errors: {
              type: "array",
              items: {
                type: "object",
              },
            },
          },
        },
        Success: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Operation successful",
            },
            data: {
              type: "object",
            },
          },
        },
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              example: "user123",
            },
            email: {
              type: "string",
              example: "user@example.com",
            },
            displayName: {
              type: "string",
              example: "John Doe",
            },
            phoneNumber: {
              type: "string",
              example: "+1234567890",
            },
            photoURL: {
              type: "string",
              example: "https://example.com/photo.jpg",
            },
            role: {
              type: "string",
              enum: ["admin", "user", "manager"],
              example: "user",
            },
            status: {
              type: "string",
              enum: ["active", "inactive", "banned"],
              example: "active",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Destination: {
          type: "object",
          properties: {
            id: {
              type: "string",
              example: "dest123",
            },
            name: {
              type: "string",
              example: "Paris",
            },
            slug: {
              type: "string",
              example: "paris",
            },
            country: {
              type: "string",
              example: "France",
            },
            description: {
              type: "string",
              example: "The city of light",
            },
            images: {
              type: "array",
              items: {
                type: "string",
              },
              example: ["https://example.com/image1.jpg"],
            },
            highlights: {
              type: "array",
              items: {
                type: "string",
              },
              example: ["Eiffel Tower", "Louvre Museum"],
            },
            bestTimeToVisit: {
              type: "string",
              example: "April to October",
            },
            status: {
              type: "string",
              enum: ["active", "inactive"],
              example: "active",
            },
            tourCount: {
              type: "number",
              example: 5,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Tour: {
          type: "object",
          properties: {
            id: {
              type: "string",
              example: "tour123",
            },
            title: {
              type: "string",
              example: "7-Day Paris Adventure",
            },
            slug: {
              type: "string",
              example: "7-day-paris-adventure",
            },
            destination: {
              $ref: "#/components/schemas/Destination",
            },
            description: {
              type: "string",
              example: "Experience the best of Paris",
            },
            shortDescription: {
              type: "string",
              example: "Amazing Paris tour",
            },
            duration: {
              type: "object",
              properties: {
                days: {
                  type: "number",
                  example: 7,
                },
                nights: {
                  type: "number",
                  example: 6,
                },
              },
            },
            groupSize: {
              type: "object",
              properties: {
                min: {
                  type: "number",
                  example: 2,
                },
                max: {
                  type: "number",
                  example: 15,
                },
              },
            },
            price: {
              type: "object",
              properties: {
                adult: {
                  type: "number",
                  example: 1500,
                },
                child: {
                  type: "number",
                  example: 750,
                },
                currency: {
                  type: "string",
                  example: "USD",
                },
              },
            },
            images: {
              type: "array",
              items: {
                type: "string",
              },
            },
            coverImage: {
              type: "string",
              example: "https://example.com/cover.jpg",
            },
            itinerary: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  day: {
                    type: "number",
                    example: 1,
                  },
                  title: {
                    type: "string",
                    example: "Arrival in Paris",
                  },
                  description: {
                    type: "string",
                    example: "Welcome to Paris!",
                  },
                  activities: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                },
              },
            },
            inclusions: {
              type: "array",
              items: {
                type: "string",
              },
              example: ["Hotel accommodation", "Breakfast"],
            },
            exclusions: {
              type: "array",
              items: {
                type: "string",
              },
              example: ["Flights", "Personal expenses"],
            },
            availableDates: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  startDate: {
                    type: "string",
                    format: "date",
                  },
                  endDate: {
                    type: "string",
                    format: "date",
                  },
                  availableSlots: {
                    type: "number",
                  },
                  price: {
                    type: "object",
                  },
                },
              },
            },
            status: {
              type: "string",
              enum: ["active", "inactive", "draft"],
              example: "active",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Booking: {
          type: "object",
          properties: {
            id: {
              type: "string",
              example: "booking123",
            },
            bookingCode: {
              type: "string",
              example: "BK-20240115-ABC123",
            },
            user: {
              $ref: "#/components/schemas/User",
            },
            tour: {
              $ref: "#/components/schemas/Tour",
            },
            tourDate: {
              type: "object",
              properties: {
                startDate: {
                  type: "string",
                  format: "date",
                },
                endDate: {
                  type: "string",
                  format: "date",
                },
              },
            },
            participants: {
              type: "object",
              properties: {
                adults: {
                  type: "number",
                  example: 2,
                },
                children: {
                  type: "number",
                  example: 1,
                },
              },
            },
            contactInfo: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  example: "John Doe",
                },
                email: {
                  type: "string",
                  example: "john@example.com",
                },
                phone: {
                  type: "string",
                  example: "+1234567890",
                },
              },
            },
            totalAmount: {
              type: "number",
              example: 3750,
            },
            paidAmount: {
              type: "number",
              example: 1000,
            },
            status: {
              type: "string",
              enum: ["pending", "confirmed", "paid", "cancelled", "completed"],
              example: "pending",
            },
            paymentStatus: {
              type: "string",
              enum: ["unpaid", "partial", "paid"],
              example: "partial",
            },
            payments: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  amount: {
                    type: "number",
                  },
                  method: {
                    type: "string",
                  },
                  date: {
                    type: "string",
                    format: "date-time",
                  },
                  note: {
                    type: "string",
                  },
                },
              },
            },
            specialRequests: {
              type: "string",
              example: "Vegetarian meals",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Role: {
          type: "object",
          properties: {
            id: {
              type: "string",
              example: "role123",
            },
            name: {
              type: "string",
              example: "admin",
            },
            description: {
              type: "string",
              example: "Administrator role",
            },
            permissions: {
              type: "array",
              items: {
                type: "string",
              },
              example: ["user:view", "user:create"],
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Permission: {
          type: "object",
          properties: {
            id: {
              type: "string",
              example: "perm123",
            },
            name: {
              type: "string",
              example: "user:view",
            },
            resource: {
              type: "string",
              example: "user",
            },
            action: {
              type: "string",
              example: "view",
            },
            description: {
              type: "string",
              example: "View user information",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Health",
        description: "Health check endpoint",
      },
      {
        name: "Auth",
        description: "Authentication and authorization endpoints",
      },
      {
        name: "Users",
        description: "User management endpoints",
      },
      {
        name: "Destinations",
        description: "Destination management endpoints",
      },
      {
        name: "Tours",
        description: "Tour management endpoints",
      },
      {
        name: "Bookings",
        description: "Booking management endpoints",
      },
      {
        name: "Roles",
        description: "Role management endpoints",
      },
      {
        name: "Permissions",
        description: "Permission management endpoints",
      },
      {
        name: "Uploads",
        description: "File upload endpoints",
      },
      {
        name: "Chatbot",
        description: "AI Chatbot endpoints",
      },
    ],
    paths: {
      "/health": {
        get: {
          tags: ["Health"],
          summary: "Health check",
          description: "Check if the server is running",
          responses: {
            200: {
              description: "Server is running",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      message: { type: "string", example: "Server is running" },
                      timestamp: { type: "string", format: "date-time" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      // ========== AUTH ENDPOINTS ==========
      "/auth/google": {
        post: {
          tags: ["Auth"],
          summary: "Sign in with Google",
          description: "Authenticate using Google OAuth",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["idToken"],
                  properties: {
                    idToken: {
                      type: "string",
                      description: "Google ID token",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Successfully authenticated",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      message: { type: "string" },
                      data: {
                        type: "object",
                        properties: {
                          user: { $ref: "#/components/schemas/User" },
                          token: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: "Invalid token",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
      "/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Register with email and password",
          description: "Create a new user account",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password", "displayName"],
                  properties: {
                    email: { type: "string", format: "email" },
                    password: { type: "string", minLength: 6 },
                    displayName: { type: "string" },
                    phoneNumber: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "User created successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      message: { type: "string" },
                      data: {
                        type: "object",
                        properties: {
                          user: { $ref: "#/components/schemas/User" },
                          token: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: "Validation error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
      "/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login with email and password",
          description: "Authenticate using email and password",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: { type: "string", format: "email" },
                    password: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Successfully authenticated",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: {
                        type: "object",
                        properties: {
                          user: { $ref: "#/components/schemas/User" },
                          token: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
            401: {
              description: "Invalid credentials",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
      "/auth/sign-out": {
        post: {
          tags: ["Auth"],
          summary: "Sign out",
          description: "Sign out the current user",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Successfully signed out",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      message: { type: "string" },
                    },
                  },
                },
              },
            },
            401: {
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
      "/auth/me": {
        get: {
          tags: ["Auth"],
          summary: "Get current user",
          description: "Get the currently authenticated user's information",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "User information retrieved",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: { $ref: "#/components/schemas/User" },
                    },
                  },
                },
              },
            },
            401: {
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
      "/auth/profile": {
        put: {
          tags: ["Auth"],
          summary: "Update profile",
          description: "Update the current user's profile",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    displayName: { type: "string" },
                    phoneNumber: { type: "string" },
                    photoURL: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Profile updated successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: { $ref: "#/components/schemas/User" },
                    },
                  },
                },
              },
            },
            401: {
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
      // ========== DESTINATION ENDPOINTS ==========
      "/destinations": {
        get: {
          tags: ["Destinations"],
          summary: "Get all destinations",
          description: "Retrieve a list of all destinations with pagination",
          parameters: [
            {
              in: "query",
              name: "page",
              schema: { type: "integer", default: 1 },
              description: "Page number",
            },
            {
              in: "query",
              name: "limit",
              schema: { type: "integer", default: 10 },
              description: "Items per page",
            },
            {
              in: "query",
              name: "status",
              schema: { type: "string", enum: ["active", "inactive"] },
              description: "Filter by status",
            },
          ],
          responses: {
            200: {
              description: "Destinations retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: {
                        type: "object",
                        properties: {
                          destinations: {
                            type: "array",
                            items: { $ref: "#/components/schemas/Destination" },
                          },
                          pagination: {
                            type: "object",
                            properties: {
                              page: { type: "integer" },
                              limit: { type: "integer" },
                              total: { type: "integer" },
                              totalPages: { type: "integer" },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["Destinations"],
          summary: "Create destination",
          description: "Create a new destination (requires destination:create permission)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "country", "description"],
                  properties: {
                    name: { type: "string" },
                    country: { type: "string" },
                    description: { type: "string" },
                    images: { type: "array", items: { type: "string" } },
                    highlights: { type: "array", items: { type: "string" } },
                    bestTimeToVisit: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Destination created successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: { $ref: "#/components/schemas/Destination" },
                    },
                  },
                },
              },
            },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden - Insufficient permissions" },
          },
        },
      },
      "/destinations/{id}": {
        get: {
          tags: ["Destinations"],
          summary: "Get destination by ID",
          description: "Retrieve a single destination by ID",
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
              description: "Destination ID",
            },
          ],
          responses: {
            200: {
              description: "Destination found",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: { $ref: "#/components/schemas/Destination" },
                    },
                  },
                },
              },
            },
            404: { description: "Destination not found" },
          },
        },
        put: {
          tags: ["Destinations"],
          summary: "Update destination",
          description: "Update a destination (requires destination:update permission)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    country: { type: "string" },
                    description: { type: "string" },
                    images: { type: "array", items: { type: "string" } },
                    highlights: { type: "array", items: { type: "string" } },
                    bestTimeToVisit: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Destination updated successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: { $ref: "#/components/schemas/Destination" },
                    },
                  },
                },
              },
            },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
            404: { description: "Not found" },
          },
        },
        delete: {
          tags: ["Destinations"],
          summary: "Delete destination",
          description: "Delete a destination (requires destination:delete permission)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: {
              description: "Destination deleted successfully",
            },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
            404: { description: "Not found" },
          },
        },
      },
      "/destinations/slug/{slug}": {
        get: {
          tags: ["Destinations"],
          summary: "Get destination by slug",
          description: "Retrieve a destination by its URL slug",
          parameters: [
            {
              in: "path",
              name: "slug",
              required: true,
              schema: { type: "string" },
              description: "Destination slug",
            },
          ],
          responses: {
            200: {
              description: "Destination found",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: { $ref: "#/components/schemas/Destination" },
                    },
                  },
                },
              },
            },
            404: { description: "Destination not found" },
          },
        },
      },
      "/destinations/search": {
        get: {
          tags: ["Destinations"],
          summary: "Search destinations",
          description: "Search destinations using Elasticsearch",
          parameters: [
            { in: "query", name: "q", schema: { type: "string" }, description: "Search query" },
            { in: "query", name: "country", schema: { type: "string" }, description: "Filter by country" },
          ],
          responses: {
            200: { description: "Search results" },
          },
        },
      },
      "/destinations/country/{country}": {
        get: {
          tags: ["Destinations"],
          summary: "Get destinations by country",
          parameters: [{ in: "path", name: "country", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Destinations list" } },
        },
      },
      "/destinations/statistics/overview": {
        get: {
          tags: ["Destinations"],
          summary: "Get destination statistics",
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "Statistics data" } },
        },
      },
      "/destinations/{id}/status": {
        patch: {
          tags: ["Destinations"],
          summary: "Update destination status",
          security: [{ bearerAuth: [] }],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["status"],
                  properties: { status: { type: "string", enum: ["active", "inactive"] } },
                },
              },
            },
          },
          responses: { 200: { description: "Status updated" } },
        },
      },
      "/destinations/{id}/images": {
        post: {
          tags: ["Destinations"],
          summary: "Add images to destination",
          security: [{ bearerAuth: [] }],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["images"],
                  properties: { images: { type: "array", items: { type: "string" } } },
                },
              },
            },
          },
          responses: { 200: { description: "Images added" } },
        },
      },
      "/destinations/elasticsearch/health": {
        get: {
          tags: ["Destinations"],
          summary: "Elasticsearch health check",
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "Healthy" } },
        },
      },
      "/destinations/elasticsearch/reindex": {
        post: {
          tags: ["Destinations"],
          summary: "Reindex all destinations",
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "Reindexing started" } },
        },
      },
      "/destinations/{id}/reindex": {
        post: {
          tags: ["Destinations"],
          summary: "Reindex specific destination",
          security: [{ bearerAuth: [] }],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Reindexed" } },
        },
      },
      // ========== TOUR ENDPOINTS ==========
      "/tours": {
        get: {
          tags: ["Tours"],
          summary: "Get all tours",
          description: "Retrieve a list of all tours with pagination and filters",
          parameters: [
            {
              in: "query",
              name: "page",
              schema: { type: "integer", default: 1 },
            },
            {
              in: "query",
              name: "limit",
              schema: { type: "integer", default: 10 },
            },
            {
              in: "query",
              name: "status",
              schema: { type: "string" },
            },
            {
              in: "query",
              name: "destinationId",
              schema: { type: "string" },
            },
          ],
          responses: {
            200: {
              description: "Tours retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: {
                        type: "object",
                        properties: {
                          tours: {
                            type: "array",
                            items: { $ref: "#/components/schemas/Tour" },
                          },
                          pagination: { type: "object" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["Tours"],
          summary: "Create tour",
          description: "Create a new tour (requires tour:create permission)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["title", "destination", "description", "duration", "price"],
                  properties: {
                    title: { type: "string" },
                    destination: { type: "string" },
                    description: { type: "string" },
                    shortDescription: { type: "string" },
                    duration: {
                      type: "object",
                      properties: {
                        days: { type: "number" },
                        nights: { type: "number" },
                      },
                    },
                    price: {
                      type: "object",
                      properties: {
                        adult: { type: "number" },
                        child: { type: "number" },
                        currency: { type: "string", default: "USD" },
                      },
                    },
                    groupSize: { type: "object" },
                    itinerary: { type: "array" },
                    inclusions: { type: "array" },
                    exclusions: { type: "array" },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Tour created successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: { $ref: "#/components/schemas/Tour" },
                    },
                  },
                },
              },
            },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
          },
        },
      },
      "/tours/{id}": {
        get: {
          tags: ["Tours"],
          summary: "Get tour by ID",
          description: "Retrieve a single tour by ID",
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: {
              description: "Tour found",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: { $ref: "#/components/schemas/Tour" },
                    },
                  },
                },
              },
            },
            404: { description: "Tour not found" },
          },
        },
        put: {
          tags: ["Tours"],
          summary: "Update tour",
          description: "Update a tour (requires tour:update permission)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    duration: { type: "object" },
                    price: { type: "object" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Tour updated successfully" },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
            404: { description: "Not found" },
          },
        },
        delete: {
          tags: ["Tours"],
          summary: "Delete tour",
          description: "Delete a tour (requires tour:delete permission)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Tour deleted successfully" },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
            404: { description: "Not found" },
          },
        },
      },
      "/tours/slug/{slug}": {
        get: {
          tags: ["Tours"],
          summary: "Get tour by slug",
          description: "Retrieve a tour by its URL slug",
          parameters: [
            { in: "path", name: "slug", required: true, schema: { type: "string" } },
          ],
          responses: {
            200: {
              description: "Tour found",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: { $ref: "#/components/schemas/Tour" },
                    },
                  },
                },
              },
            },
            404: { description: "Tour not found" },
          },
        },
      },
      "/tours/search": {
        get: {
          tags: ["Tours"],
          summary: "Search tours",
          parameters: [
            { in: "query", name: "q", schema: { type: "string" } },
            { in: "query", name: "minPrice", schema: { type: "number" } },
            { in: "query", name: "maxPrice", schema: { type: "number" } },
          ],
          responses: { 200: { description: "Search results" } },
        },
      },
      "/tours/destination/{destinationId}": {
        get: {
          tags: ["Tours"],
          summary: "Get tours by destination",
          parameters: [{ in: "path", name: "destinationId", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Tours list" } },
        },
      },
      "/tours/statistics/overview": {
        get: {
          tags: ["Tours"],
          summary: "Get tour statistics",
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "Statistics data" } },
        },
      },
      "/tours/{id}/status": {
        patch: {
          tags: ["Tours"],
          summary: "Update tour status",
          security: [{ bearerAuth: [] }],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["status"],
                  properties: { status: { type: "string", enum: ["active", "inactive", "draft"] } },
                },
              },
            },
          },
          responses: { 200: { description: "Status updated" } },
        },
      },
      "/tours/{id}/images": {
        post: {
          tags: ["Tours"],
          summary: "Add images to tour",
          security: [{ bearerAuth: [] }],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["images"],
                  properties: { images: { type: "array", items: { type: "string" } } },
                },
              },
            },
          },
          responses: { 200: { description: "Images added" } },
        },
      },
      "/tours/{id}/cover-image": {
        patch: {
          tags: ["Tours"],
          summary: "Set tour cover image",
          security: [{ bearerAuth: [] }],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["imageUrl"],
                  properties: { imageUrl: { type: "string" } },
                },
              },
            },
          },
          responses: { 200: { description: "Cover image set" } },
        },
      },
      "/tours/{id}/dates": {
        post: {
          tags: ["Tours"],
          summary: "Add available date",
          security: [{ bearerAuth: [] }],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          requestBody: { required: true, content: { "application/json": { schema: { type: "object" } } } },
          responses: { 201: { description: "Date added" } },
        },
      },
      "/tours/{id}/dates/{dateIndex}": {
        put: {
          tags: ["Tours"],
          summary: "Update available date",
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: "path", name: "id", required: true, schema: { type: "string" } },
            { in: "path", name: "dateIndex", required: true, schema: { type: "integer" } },
          ],
          requestBody: { required: true, content: { "application/json": { schema: { type: "object" } } } },
          responses: { 200: { description: "Date updated" } },
        },
        delete: {
          tags: ["Tours"],
          summary: "Remove available date",
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: "path", name: "id", required: true, schema: { type: "string" } },
            { in: "path", name: "dateIndex", required: true, schema: { type: "integer" } },
          ],
          responses: { 200: { description: "Date removed" } },
        },
      },
      // ========== BOOKING ENDPOINTS ==========
      "/bookings": {
        post: {
          tags: ["Bookings"],
          summary: "Create booking",
          description: "Create a new booking (requires booking:create permission)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["tourId", "tourDate", "participants", "contactInfo"],
                  properties: {
                    tourId: { type: "string" },
                    tourDate: {
                      type: "object",
                      properties: {
                        startDate: { type: "string", format: "date" },
                        endDate: { type: "string", format: "date" },
                      },
                    },
                    participants: {
                      type: "object",
                      properties: {
                        adults: { type: "number", minimum: 1 },
                        children: { type: "number", minimum: 0 },
                      },
                    },
                    contactInfo: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        email: { type: "string", format: "email" },
                        phone: { type: "string" },
                      },
                    },
                    specialRequests: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Booking created successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: { $ref: "#/components/schemas/Booking" },
                    },
                  },
                },
              },
            },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
          },
        },
      },
      "/bookings/my-bookings": {
        get: {
          tags: ["Bookings"],
          summary: "Get my bookings",
          description: "Get the current user's bookings",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "query",
              name: "status",
              schema: { type: "string" },
              description: "Filter by status",
            },
            {
              in: "query",
              name: "page",
              schema: { type: "integer", default: 1 },
            },
            {
              in: "query",
              name: "limit",
              schema: { type: "integer", default: 10 },
            },
          ],
          responses: {
            200: {
              description: "Bookings retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: {
                        type: "object",
                        properties: {
                          bookings: {
                            type: "array",
                            items: { $ref: "#/components/schemas/Booking" },
                          },
                          pagination: { type: "object" },
                        },
                      },
                    },
                  },
                },
              },
            },
            401: { description: "Unauthorized" },
          },
        },
      },
      "/bookings/{id}": {
        get: {
          tags: ["Bookings"],
          summary: "Get booking by ID",
          description: "Get a booking by ID (own bookings only)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: {
              description: "Booking found",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: { $ref: "#/components/schemas/Booking" },
                    },
                  },
                },
              },
            },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
            404: { description: "Not found" },
          },
        },
        put: {
          tags: ["Bookings"],
          summary: "Update booking",
          description: "Update a booking (own bookings only)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    participants: { type: "object" },
                    contactInfo: { type: "object" },
                    specialRequests: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Booking updated successfully" },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
            404: { description: "Not found" },
          },
        },
        delete: {
          tags: ["Bookings"],
          summary: "Delete booking",
          description: "Delete a booking (only pending bookings)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Booking deleted successfully" },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
            404: { description: "Not found" },
          },
        },
      },
      "/bookings/{id}/cancel": {
        post: {
          tags: ["Bookings"],
          summary: "Cancel booking",
          description: "Cancel a booking",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    reason: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Booking cancelled successfully" },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
            404: { description: "Not found" },
          },
        },
      },
      "/bookings/admin/all": {
        get: {
          tags: ["Bookings"],
          summary: "Get all bookings (Admin)",
          description: "Get all bookings (requires booking:view permission)",
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: "query", name: "page", schema: { type: "integer", default: 1 } },
            { in: "query", name: "limit", schema: { type: "integer", default: 10 } },
            { in: "query", name: "status", schema: { type: "string" } },
          ],
          responses: {
            200: {
              description: "Bookings retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: {
                        type: "object",
                        properties: {
                          bookings: { type: "array", items: { $ref: "#/components/schemas/Booking" } },
                          pagination: { type: "object" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/bookings/admin/statistics": {
        get: {
          tags: ["Bookings"],
          summary: "Get booking statistics (Admin)",
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "Statistics data" } },
        },
      },
      "/bookings/admin/tour/{tourId}": {
        get: {
          tags: ["Bookings"],
          summary: "Get bookings by tour (Admin)",
          security: [{ bearerAuth: [] }],
          parameters: [{ in: "path", name: "tourId", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Bookings list" } },
        },
      },
      "/bookings/admin/{id}": {
        get: {
          tags: ["Bookings"],
          summary: "Get booking by ID (Admin)",
          security: [{ bearerAuth: [] }],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Booking data" } },
        },
      },
      "/bookings/code/{code}": {
        get: {
          tags: ["Bookings"],
          summary: "Get booking by code",
          security: [{ bearerAuth: [] }],
          parameters: [{ in: "path", name: "code", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Booking data" } },
        },
      },
      "/bookings/admin/{id}/payment": {
        post: {
          tags: ["Bookings"],
          summary: "Add payment (Admin)",
          security: [{ bearerAuth: [] }],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          requestBody: { required: true, content: { "application/json": { schema: { type: "object" } } } },
          responses: { 200: { description: "Payment added" } },
        },
      },
      "/bookings/{id}/payment": {
        post: {
          tags: ["Bookings"],
          summary: "Add payment (User)",
          security: [{ bearerAuth: [] }],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          requestBody: { required: true, content: { "application/json": { schema: { type: "object" } } } },
          responses: { 200: { description: "Payment added" } },
        },
      },
      "/bookings/admin/{id}/status": {
        patch: {
          tags: ["Bookings"],
          summary: "Update booking status (Admin)",
          description: "Update booking status (requires booking:update permission)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["status"],
                  properties: {
                    status: {
                      type: "string",
                      enum: ["pending", "confirmed", "paid", "cancelled", "completed"],
                    },
                    note: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Status updated successfully" },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
            404: { description: "Not found" },
          },
        },
      },
      // ========== USER ENDPOINTS ==========
      "/users": {
        get: {
          tags: ["Users"],
          summary: "Get all users (Admin)",
          description: "Get all users with pagination and search (requires user:view permission)",
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: "query", name: "page", schema: { type: "integer", default: 1 } },
            { in: "query", name: "limit", schema: { type: "integer", default: 10 } },
          ],
          responses: {
            200: {
              description: "Users retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: {
                        type: "object",
                        properties: {
                          users: { type: "array", items: { $ref: "#/components/schemas/User" } },
                          pagination: { type: "object" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["Users"],
          summary: "Create user (Admin)",
          description: "Create a new user (requires user:create permission)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "displayName"],
                  properties: {
                    email: { type: "string", format: "email" },
                    displayName: { type: "string" },
                    phoneNumber: { type: "string" },
                    role: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "User created successfully" },
          },
        },
      },
      "/users/search": {
        get: {
          tags: ["Users"],
          summary: "Search users",
          security: [{ bearerAuth: [] }],
          parameters: [{ in: "query", name: "q", schema: { type: "string" } }],
          responses: {
            200: { description: "Search results" },
          },
        },
      },
      "/users/role/{role}": {
        get: {
          tags: ["Users"],
          summary: "Get users by role",
          security: [{ bearerAuth: [] }],
          parameters: [{ in: "path", name: "role", required: true, schema: { type: "string" } }],
          responses: {
            200: { description: "Users list" },
          },
        },
      },
      "/users/statistics": {
        get: {
          tags: ["Users"],
          summary: "Get user statistics",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Statistics data" },
          },
        },
      },
      "/users/{id}/status": {
        patch: {
          tags: ["Users"],
          summary: "Update user status",
          security: [{ bearerAuth: [] }],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["status"],
                  properties: { status: { type: "string", enum: ["active", "inactive", "banned"] } },
                },
              },
            },
          },
          responses: {
            200: { description: "Status updated" },
          },
        },
      },
      "/users/{id}/role": {
        patch: {
          tags: ["Users"],
          summary: "Update user role",
          security: [{ bearerAuth: [] }],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["role"],
                  properties: { role: { type: "string" } },
                },
              },
            },
          },
          responses: {
            200: { description: "Role updated" },
          },
        },
      },
      "/users/elasticsearch/health": {
        get: {
          tags: ["Users"],
          summary: "Elasticsearch health check",
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "Healthy" } },
        },
      },
      "/users/elasticsearch/reindex": {
        post: {
          tags: ["Users"],
          summary: "Reindex all users",
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "Reindexing started" } },
        },
      },
      "/users/me": {
        get: {
          tags: ["Users"],
          summary: "Get own profile",
          description: "Get the current user's profile",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Profile retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: { $ref: "#/components/schemas/User" },
                    },
                  },
                },
              },
            },
            401: { description: "Unauthorized" },
          },
        },
        put: {
          tags: ["Users"],
          summary: "Update own profile",
          description: "Update the current user's profile",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    displayName: { type: "string" },
                    phoneNumber: { type: "string" },
                    photoURL: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Profile updated successfully" },
            401: { description: "Unauthorized" },
          },
        },
      },
      "/users/{id}": {
        get: {
          tags: ["Users"],
          summary: "Get user by ID",
          description: "Get a user by ID (requires user:view permission)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: {
              description: "User found",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: { $ref: "#/components/schemas/User" },
                    },
                  },
                },
              },
            },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
            404: { description: "Not found" },
          },
        },
        put: {
          tags: ["Users"],
          summary: "Update user",
          description: "Update a user (requires user:update permission)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    displayName: { type: "string" },
                    phoneNumber: { type: "string" },
                    status: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "User updated successfully" },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
            404: { description: "Not found" },
          },
        },
        delete: {
          tags: ["Users"],
          summary: "Delete user",
          description: "Delete a user (requires user:delete permission)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "User deleted successfully" },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
            404: { description: "Not found" },
          },
        },
      },
      // ========== CHATBOT ENDPOINTS ==========
      "/chatbot/chat": {
        post: {
          tags: ["Chatbot"],
          summary: "Chat with AI",
          description: "Send a message to the AI chatbot",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["message"],
                  properties: {
                    message: { type: "string", description: "User message" },
                    conversationHistory: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          role: { type: "string", enum: ["user", "model"] },
                          parts: { type: "array", items: { type: "object" } },
                        },
                      },
                      description: "Optional conversation history",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Chat response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: {
                        type: "object",
                        properties: {
                          response: { type: "string" },
                          suggestions: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                text: { type: "string" },
                                type: { type: "string" },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            400: { description: "Bad request" },
          },
        },
      },
      "/chatbot/suggestions": {
        get: {
          tags: ["Chatbot"],
          summary: "Get quick suggestions",
          description: "Get quick suggestion prompts for the chatbot",
          responses: {
            200: {
              description: "Suggestions retrieved",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            text: { type: "string" },
                            icon: { type: "string" },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/chatbot/health": {
        get: {
          tags: ["Chatbot"],
          summary: "Chatbot health check",
          description: "Check if the chatbot service is healthy",
          responses: {
            200: {
              description: "Service is healthy",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      message: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/chatbot/clear-cache": {
        post: {
          tags: ["Chatbot"],
          summary: "Clear chatbot cache (Admin)",
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "Cache cleared" } },
        },
      },
      // ========== UPLOAD ENDPOINTS ==========
      "/uploads/avatar": {
        post: {
          tags: ["Uploads"],
          summary: "Upload own avatar",
          description: "Upload avatar for the current user",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    avatar: {
                      type: "string",
                      format: "binary",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Avatar uploaded successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: {
                        type: "object",
                        properties: {
                          url: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
            401: { description: "Unauthorized" },
          },
        },
      },
      "/uploads/avatar/{userId}": {
        post: {
          tags: ["Uploads"],
          summary: "Upload avatar for specific user (Admin)",
          security: [{ bearerAuth: [] }],
          parameters: [{ in: "path", name: "userId", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: { "multipart/form-data": { schema: { type: "object", properties: { avatar: { type: "string", format: "binary" } } } } },
          },
          responses: { 200: { description: "Avatar uploaded" } },
        },
      },
      "/uploads/destinations/{destinationId}/images": {
        post: {
          tags: ["Uploads"],
          summary: "Upload destination images",
          description: "Upload images for a destination (requires destination:update permission)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "destinationId",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    images: {
                      type: "array",
                      items: {
                        type: "string",
                        format: "binary",
                      },
                      maxItems: 10,
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Images uploaded successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: {
                        type: "object",
                        properties: {
                          urls: {
                            type: "array",
                            items: { type: "string" },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
          },
        },
        delete: {
          tags: ["Uploads"],
          summary: "Delete multiple destination images",
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: "path", name: "destinationId", required: true, schema: { type: "string" } },
          ],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { type: "object", properties: { imageUrls: { type: "array", items: { type: "string" } } } } } },
          },
          responses: { 200: { description: "Images deleted" } },
        },
      },
      "/uploads/destinations/{destinationId}/image": {
        delete: {
          tags: ["Uploads"],
          summary: "Delete single destination image",
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: "path", name: "destinationId", required: true, schema: { type: "string" } },
            { in: "query", name: "imageUrl", required: true, schema: { type: "string" } },
          ],
          responses: { 200: { description: "Image deleted" } },
        },
      },
      "/uploads/tours/{tourId}/images": {
        post: {
          tags: ["Uploads"],
          summary: "Upload tour images",
          description: "Upload images for a tour (requires tour:update permission)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "tourId",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    images: {
                      type: "array",
                      items: {
                        type: "string",
                        format: "binary",
                      },
                      maxItems: 10,
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Images uploaded successfully" },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
          },
        },
      },
      "/uploads/tours/{tourId}/image": {
        delete: {
          tags: ["Uploads"],
          summary: "Delete single tour image",
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: "path", name: "tourId", required: true, schema: { type: "string" } },
            { in: "query", name: "imageUrl", required: true, schema: { type: "string" } },
          ],
          responses: { 200: { description: "Image deleted" } },
        },
      },
      "/uploads/optimize": {
        get: {
          tags: ["Uploads"],
          summary: "Get optimized image URL",
          parameters: [
            { in: "query", name: "url", required: true, schema: { type: "string" } },
            { in: "query", name: "width", schema: { type: "integer" } },
            { in: "query", name: "quality", schema: { type: "integer" } },
          ],
          responses: { 200: { description: "Optimized URL" } },
        },
      },
      "/uploads/thumbnail": {
        get: {
          tags: ["Uploads"],
          summary: "Get thumbnail URL",
          parameters: [
            { in: "query", name: "url", required: true, schema: { type: "string" } },
          ],
          responses: { 200: { description: "Thumbnail URL" } },
        },
      },
      // ========== PERMISSION ENDPOINTS ==========
      "/permissions": {
        get: {
          tags: ["Permissions"],
          summary: "Get all permissions",
          description: "Retrieve a list of all permissions (Admin only)",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Permissions retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Permission" },
                      },
                    },
                  },
                },
              },
            },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
          },
        },
        post: {
          tags: ["Permissions"],
          summary: "Create permission",
          description: "Create a new permission (Admin only)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "resource", "action"],
                  properties: {
                    name: { type: "string", example: "user:view" },
                    resource: { type: "string", example: "user" },
                    action: { type: "string", example: "view" },
                    description: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Permission created successfully" },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
          },
        },
      },
      "/permissions/{id}": {
        get: {
          tags: ["Permissions"],
          summary: "Get permission by ID",
          security: [{ bearerAuth: [] }],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          responses: {
            200: {
              description: "Permission found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Permission" },
                },
              },
            },
            404: { description: "Not found" },
          },
        },
        put: {
          tags: ["Permissions"],
          summary: "Update permission",
          security: [{ bearerAuth: [] }],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Permission" },
              },
            },
          },
          responses: {
            200: { description: "Updated successfully" },
          },
        },
        delete: {
          tags: ["Permissions"],
          summary: "Delete permission",
          security: [{ bearerAuth: [] }],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          responses: {
            204: { description: "Deleted successfully" },
          },
        },
      },
      "/permissions/resource/{resource}": {
        get: {
          tags: ["Permissions"],
          summary: "Get permissions by resource",
          security: [{ bearerAuth: [] }],
          parameters: [{ in: "path", name: "resource", required: true, schema: { type: "string" } }],
          responses: {
            200: {
              description: "Permissions retrieved",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Permission" },
                  },
                },
              },
            },
          },
        },
      },
      // ========== ROLE ENDPOINTS ==========
      "/roles": {
        get: {
          tags: ["Roles"],
          summary: "Get all roles",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Roles retrieved",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Role" },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["Roles"],
          summary: "Create role",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name"],
                  properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                    permissions: { type: "array", items: { type: "string" } },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Created" },
          },
        },
      },
      "/roles/{id}": {
        get: {
          tags: ["Roles"],
          summary: "Get role by ID",
          security: [{ bearerAuth: [] }],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          responses: {
            200: {
              description: "Role found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Role" },
                },
              },
            },
          },
        },
        put: {
          tags: ["Roles"],
          summary: "Update role",
          security: [{ bearerAuth: [] }],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Role" },
              },
            },
          },
          responses: {
            200: { description: "Updated" },
          },
        },
        delete: {
          tags: ["Roles"],
          summary: "Delete role",
          security: [{ bearerAuth: [] }],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          responses: {
            204: { description: "Deleted" },
          },
        },
      },
      "/roles/{id}/permissions": {
        post: {
          tags: ["Roles"],
          summary: "Add permission to role",
          security: [{ bearerAuth: [] }],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["permission"],
                  properties: { permission: { type: "string" } },
                },
              },
            },
          },
          responses: {
            200: { description: "Permission added" },
          },
        },
        delete: {
          tags: ["Roles"],
          summary: "Remove permission from role",
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: "path", name: "id", required: true, schema: { type: "string" } },
            { in: "query", name: "permission", required: true, schema: { type: "string" } },
          ],
          responses: {
            200: { description: "Permission removed" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"], // Path to the API routes for additional JSDoc comments
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
