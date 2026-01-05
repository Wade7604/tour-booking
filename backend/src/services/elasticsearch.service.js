const { getElasticsearch } = require("../config/elasticsearch.config");

class ElasticsearchService {
  constructor() {
    this.client = null;
  }

  // Get client instance
  getClient() {
    if (!this.client) {
      this.client = getElasticsearch();
    }
    return this.client;
  }

  // ==================== USER METHODS ====================

  // Index a user document
  async indexUser(user) {
    try {
      const client = this.getClient();

      await client.index({
        index: "users",
        id: user.id,
        document: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          phone: user.phone,
          role: user.role,
          status: user.status,
          provider: user.provider,
          avatar: user.avatar,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        refresh: true,
      });

      console.log(`✅ Indexed user: ${user.id}`);
    } catch (error) {
      console.error("❌ Error indexing user:", error);
      throw error;
    }
  }

  // Update a user document
  async updateUser(userId, updateData) {
    try {
      const client = this.getClient();

      await client.update({
        index: "users",
        id: userId,
        doc: {
          ...updateData,
          updatedAt: new Date().toISOString(),
        },
        refresh: true,
      });

      console.log(`✅ Updated user in ES: ${userId}`);
    } catch (error) {
      console.error("❌ Error updating user:", error);
      throw error;
    }
  }

  // Delete a user document
  async deleteUser(userId) {
    try {
      const client = this.getClient();

      await client.delete({
        index: "users",
        id: userId,
        refresh: true,
      });

      console.log(`✅ Deleted user from ES: ${userId}`);
    } catch (error) {
      if (error.meta?.statusCode === 404) {
        console.log(`⏭️  User not found in ES: ${userId}`);
        return;
      }
      console.error("❌ Error deleting user:", error);
      throw error;
    }
  }

  // Search users
  async searchUsers(searchTerm, page = 1, limit = 20, filters = {}) {
    try {
      const client = this.getClient();
      const from = (page - 1) * limit;

      const mustQueries = [];
      const shouldQueries = [];

      if (searchTerm && searchTerm.trim()) {
        shouldQueries.push(
          { match: { fullName: { query: searchTerm, boost: 2 } } },
          { match: { email: { query: searchTerm, boost: 1.5 } } },
          { wildcard: { "fullName.keyword": `*${searchTerm}*` } },
          { wildcard: { "email.keyword": `*${searchTerm}*` } }
        );
      }

      if (filters.role) {
        mustQueries.push({ term: { role: filters.role } });
      }
      if (filters.status) {
        mustQueries.push({ term: { status: filters.status } });
      }
      if (filters.provider) {
        mustQueries.push({ term: { provider: filters.provider } });
      }

      const query = {
        bool: {
          must: mustQueries.length > 0 ? mustQueries : [{ match_all: {} }],
          should: shouldQueries.length > 0 ? shouldQueries : undefined,
          minimum_should_match: shouldQueries.length > 0 ? 1 : undefined,
        },
      };

      const response = await client.search({
        index: "users",
        from,
        size: limit,
        query,
        sort: [{ createdAt: { order: "desc" } }],
      });

      const users = response.hits.hits.map((hit) => ({
        ...hit._source,
        _score: hit._score,
      }));

      const total = response.hits.total.value;

      return { users, total };
    } catch (error) {
      console.error("❌ Error searching users:", error);
      throw error;
    }
  }

  // Get user aggregations
  async getUserAggregations() {
    try {
      const client = this.getClient();

      const response = await client.search({
        index: "users",
        size: 0,
        aggs: {
          by_role: {
            terms: { field: "role" },
          },
          by_status: {
            terms: { field: "status" },
          },
          by_provider: {
            terms: { field: "provider" },
          },
        },
      });

      return {
        byRole: response.aggregations.by_role.buckets.reduce((acc, bucket) => {
          acc[bucket.key] = bucket.doc_count;
          return acc;
        }, {}),
        byStatus: response.aggregations.by_status.buckets.reduce(
          (acc, bucket) => {
            acc[bucket.key] = bucket.doc_count;
            return acc;
          },
          {}
        ),
        byProvider: response.aggregations.by_provider.buckets.reduce(
          (acc, bucket) => {
            acc[bucket.key] = bucket.doc_count;
            return acc;
          },
          {}
        ),
        total: response.hits.total.value,
      };
    } catch (error) {
      console.error("❌ Error getting aggregations:", error);
      throw error;
    }
  }

  // ==================== DESTINATION METHODS ====================

  // Index a destination to Elasticsearch
  async indexDestination(destination) {
    try {
      const client = this.getClient();

      await client.index({
        index: "destinations",
        id: destination.id,
        document: {
          id: destination.id,
          name: destination.name,
          slug: destination.slug,
          description: destination.description,
          country: destination.country,
          city: destination.city,
          images: destination.images || [],
          status: destination.status,
          createdAt: destination.createdAt,
          updatedAt: destination.updatedAt,
        },
        refresh: true,
      });

      console.log(`✅ Indexed destination: ${destination.id}`);
    } catch (error) {
      console.error("❌ Failed to index destination:", error);
      throw error;
    }
  }

  // Update a destination in Elasticsearch
  async updateDestination(destId, updateData) {
    try {
      const client = this.getClient();

      await client.update({
        index: "destinations",
        id: destId,
        doc: {
          ...updateData,
          updatedAt: new Date().toISOString(),
        },
        refresh: true,
      });

      console.log(`✅ Updated destination in ES: ${destId}`);
    } catch (error) {
      console.error("❌ Failed to update destination:", error);
      throw error;
    }
  }

  // Delete a destination from Elasticsearch
  async deleteDestination(destId) {
    try {
      const client = this.getClient();

      await client.delete({
        index: "destinations",
        id: destId,
        refresh: true,
      });

      console.log(`✅ Deleted destination from ES: ${destId}`);
    } catch (error) {
      if (error.meta?.statusCode === 404) {
        console.log(`⏭️  Destination not found in ES: ${destId}`);
        return;
      }
      console.error("❌ Failed to delete destination:", error);
      throw error;
    }
  }

  // Search destinations in Elasticsearch
  async searchDestinations(searchTerm, page = 1, limit = 10, filters = {}) {
    try {
      const client = this.getClient();
      const must = [];

      if (searchTerm && searchTerm.trim()) {
        must.push({
          multi_match: {
            query: searchTerm,
            fields: ["name^3", "city^2", "country^2", "description"],
            fuzziness: "AUTO",
          },
        });
      }

      if (filters.status) {
        must.push({ term: { status: filters.status } });
      }
      if (filters.country) {
        must.push({ term: { "country.keyword": filters.country } });
      }
      if (filters.city) {
        must.push({ term: { "city.keyword": filters.city } });
      }

      const from = (page - 1) * limit;

      const result = await client.search({
        index: "destinations",
        from,
        size: limit,
        query: {
          bool: {
            must: must.length > 0 ? must : [{ match_all: {} }],
          },
        },
        sort: [{ createdAt: { order: "desc" } }],
      });

      const destinations = result.hits.hits.map((hit) => hit._source);
      const total = result.hits.total.value;

      return { destinations, total };
    } catch (error) {
      console.error("❌ Elasticsearch search failed:", error);
      throw error;
    }
  }

  // Get destination aggregations (statistics)
  async getDestinationAggregations() {
    try {
      const client = this.getClient();

      const result = await client.search({
        index: "destinations",
        size: 0,
        aggs: {
          total: {
            value_count: {
              field: "id.keyword",
            },
          },
          by_status: {
            terms: {
              field: "status.keyword",
              size: 10,
            },
          },
          by_country: {
            terms: {
              field: "country.keyword",
              size: 20,
            },
          },
          by_city: {
            terms: {
              field: "city.keyword",
              size: 50,
            },
          },
        },
      });

      const aggs = result.aggregations;

      return {
        total: aggs.total.value,
        byStatus: aggs.by_status.buckets.reduce((acc, bucket) => {
          acc[bucket.key] = bucket.doc_count;
          return acc;
        }, {}),
        byCountry: aggs.by_country.buckets.reduce((acc, bucket) => {
          acc[bucket.key] = bucket.doc_count;
          return acc;
        }, {}),
        byCity: aggs.by_city.buckets.reduce((acc, bucket) => {
          acc[bucket.key] = bucket.doc_count;
          return acc;
        }, {}),
      };
    } catch (error) {
      console.error("❌ Failed to get destination aggregations:", error);
      throw error;
    }
  }
}

module.exports = new ElasticsearchService();
