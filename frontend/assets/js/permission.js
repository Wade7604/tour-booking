class PermissionManager {
  constructor() {
    this.currentPage = 1;
    this.limit = 20;
    this.searchTimeout = null;
    this.currentFilters = {};
  }

  init() {
    this.setupEventListeners();
    this.loadPermissions();
    this.loadStatistics();
    this.loadResourcesFilter();
  }

  setupEventListeners() {
    const searchInput = document.getElementById("searchPermissions");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
          this.currentPage = 1;
          this.loadPermissions(e.target.value);
        }, 500);
      });
    }

    const filterResource = document.getElementById("filterResource");
    if (filterResource) {
      filterResource.addEventListener("change", (e) => {
        this.currentFilters.resource = e.target.value || undefined;
        this.currentPage = 1;
        this.loadPermissions();
      });
    }

    const refreshBtn = document.getElementById("refreshPermissions");
    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => {
        this.loadPermissions();
        this.loadStatistics();
      });
    }

    // Create button
    const createBtn = document.getElementById("createPermissionBtn");
    if (createBtn) {
      createBtn.addEventListener("click", () => this.showCreateModal());
    }

    // Logout button
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (confirm("Are you sure you want to logout?")) {
          logout();
        }
      });
    }
  }

  async loadPermissions(search = "") {
    const loading = document.getElementById("permissionsLoading");
    const table = document.getElementById("permissionsTable");

    if (loading) loading.style.display = "block";
    if (table) table.style.display = "none";

    try {
      const params = new URLSearchParams();
      params.append("page", this.currentPage);
      params.append("limit", this.limit);

      if (this.currentFilters.resource) {
        const result = await API.request(
          `/permissions/resource/${this.currentFilters.resource}`
        );
        if (result.success) {
          this.displayPermissions(result.data);
        }
      } else {
        const result = await API.request(`/permissions?${params}`);
        if (result.success) {
          let permissions = result.data;

          if (search) {
            permissions = permissions.filter(
              (p) =>
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                (p.description &&
                  p.description.toLowerCase().includes(search.toLowerCase()))
            );
          }

          this.displayPermissions(permissions);
          if (result.pagination) {
            this.displayPagination(result.pagination);
          }
        }
      }
    } catch (error) {
      console.error("Error loading permissions:", error);
      this.showError("Failed to load permissions: " + error.message);
    } finally {
      if (loading) loading.style.display = "none";
      if (table) table.style.display = "block";
    }
  }

  displayPermissions(permissions) {
    const tbody = document.getElementById("permissionsTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (!permissions || permissions.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-4 text-muted">
            <i class="bi bi-inbox" style="font-size: 3rem;"></i>
            <p class="mt-2">No permissions found</p>
          </td>
        </tr>
      `;
      return;
    }

    permissions.forEach((permission) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <span class="fw-semibold">${permission.name}</span>
        </td>
        <td>
          <span class="badge bg-primary">${permission.resource}</span>
        </td>
        <td>
          <span class="badge bg-info">${permission.action}</span>
        </td>
        <td>
          <small class="text-muted">${permission.description || "N/A"}</small>
        </td>
        <td>
          <small class="text-muted">
            ${new Date(permission.createdAt).toLocaleDateString("vi-VN")}
          </small>
        </td>
        <td>
          <div class="btn-group" role="group">
            <button class="btn btn-sm btn-outline-warning" 
                    data-action="edit"
                    data-id="${permission.id}"
                    title="Edit Permission"
                    data-require-permission="permission:update">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger" 
                    data-action="delete"
                    data-id="${permission.id}"
                    data-name="${permission.name}"
                    title="Delete Permission"
                    data-require-permission="permission:delete">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </td>
      `;

      // Attach event listeners
      const editBtn = tr.querySelector('[data-action="edit"]');
      const deleteBtn = tr.querySelector('[data-action="delete"]');

      if (editBtn) {
        editBtn.addEventListener("click", () =>
          this.editPermission(permission.id)
        );
      }

      if (deleteBtn) {
        deleteBtn.addEventListener("click", () =>
          this.confirmDelete(permission.id, permission.name)
        );
      }

      tbody.appendChild(tr);
    });
  }

  displayPagination(pagination) {
    const paginationEl = document.getElementById("permissionsPagination");
    if (!paginationEl) return;

    paginationEl.innerHTML = "";
    if (pagination.totalPages <= 1) return;

    // Previous button
    const prevLi = document.createElement("li");
    prevLi.className = `page-item ${
      pagination.currentPage === 1 ? "disabled" : ""
    }`;
    const prevLink = document.createElement("a");
    prevLink.className = "page-link";
    prevLink.href = "#";
    prevLink.innerHTML = '<i class="bi bi-chevron-left"></i>';
    prevLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (pagination.currentPage > 1) {
        this.goToPage(pagination.currentPage - 1);
      }
    });
    prevLi.appendChild(prevLink);
    paginationEl.appendChild(prevLi);

    // Page numbers
    const startPage = Math.max(1, pagination.currentPage - 2);
    const endPage = Math.min(pagination.totalPages, pagination.currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      const li = document.createElement("li");
      li.className = `page-item ${
        i === pagination.currentPage ? "active" : ""
      }`;
      const link = document.createElement("a");
      link.className = "page-link";
      link.href = "#";
      link.textContent = i;
      link.addEventListener("click", (e) => {
        e.preventDefault();
        this.goToPage(i);
      });
      li.appendChild(link);
      paginationEl.appendChild(li);
    }

    // Next button
    const nextLi = document.createElement("li");
    nextLi.className = `page-item ${
      pagination.currentPage === pagination.totalPages ? "disabled" : ""
    }`;
    const nextLink = document.createElement("a");
    nextLink.className = "page-link";
    nextLink.href = "#";
    nextLink.innerHTML = '<i class="bi bi-chevron-right"></i>';
    nextLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (pagination.currentPage < pagination.totalPages) {
        this.goToPage(pagination.currentPage + 1);
      }
    });
    nextLi.appendChild(nextLink);
    paginationEl.appendChild(nextLi);
  }

  goToPage(page) {
    this.currentPage = page;
    this.loadPermissions();
  }

  async loadStatistics() {
    try {
      const result = await API.request("/permissions");
      if (result.success) {
        const permissions = result.data;
        const resources = new Set(permissions.map((p) => p.resource));
        const actions = new Set(permissions.map((p) => p.action));

        document.getElementById("totalPermissions").textContent =
          permissions.length;
        document.getElementById("totalResources").textContent = resources.size;
        document.getElementById("totalActions").textContent = actions.size;
      }
    } catch (error) {
      console.error("Error loading statistics:", error);
    }
  }

  async loadResourcesFilter() {
    try {
      const result = await API.request("/permissions");
      if (result.success) {
        const resources = [
          ...new Set(result.data.map((p) => p.resource)),
        ].sort();
        const filterSelect = document.getElementById("filterResource");

        resources.forEach((resource) => {
          const option = document.createElement("option");
          option.value = resource;
          option.textContent = resource;
          filterSelect.appendChild(option);
        });
      }
    } catch (error) {
      console.error("Error loading resources:", error);
    }
  }

  showCreateModal() {
    const modalHtml = `
      <div class="modal fade" id="createPermissionModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title"><i class="bi bi-plus-circle"></i> Create Permission</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <form id="createPermissionForm">
              <div class="modal-body">
                <div class="mb-3">
                  <label class="form-label">Permission Name <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" id="createName" placeholder="e.g., user:create" required>
                  <small class="text-muted">Format: resource:action</small>
                </div>
                <div class="mb-3">
                  <label class="form-label">Resource <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" id="createResource" placeholder="e.g., user" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Action <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" id="createAction" placeholder="e.g., create" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Description</label>
                  <textarea class="form-control" id="createDescription" rows="3" placeholder="Describe what this permission allows..."></textarea>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                  <i class="bi bi-x-circle"></i> Cancel
                </button>
                <button type="submit" class="btn btn-primary">
                  <i class="bi bi-check-circle"></i> Create Permission
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    this.removeModal("createPermissionModal");
    document.body.insertAdjacentHTML("beforeend", modalHtml);

    const modal = new bootstrap.Modal(
      document.getElementById("createPermissionModal")
    );
    modal.show();

    document
      .getElementById("createPermissionForm")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        this.createPermission();
      });
  }

  async createPermission() {
    const submitBtn = document.querySelector(
      "#createPermissionForm button[type='submit']"
    );
    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<span class="spinner-border spinner-border-sm"></span> Creating...';

    try {
      const data = {
        name: document.getElementById("createName").value,
        resource: document.getElementById("createResource").value,
        action: document.getElementById("createAction").value,
        description: document.getElementById("createDescription").value || null,
      };

      const result = await API.request("/permissions", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (result.success) {
        this.showSuccess("Permission created successfully!");
        this.removeModal("createPermissionModal");
        this.loadPermissions();
        this.loadStatistics();
        this.loadResourcesFilter();
      }
    } catch (error) {
      this.showError("Failed to create permission: " + error.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML =
        '<i class="bi bi-check-circle"></i> Create Permission';
    }
  }

  async editPermission(permissionId) {
    try {
      const result = await API.request(`/permissions/${permissionId}`);
      if (result.success) {
        this.showEditModal(result.data);
      }
    } catch (error) {
      this.showError("Failed to load permission: " + error.message);
    }
  }

  showEditModal(permission) {
    const modalHtml = `
      <div class="modal fade" id="editPermissionModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header bg-warning text-white">
              <h5 class="modal-title"><i class="bi bi-pencil-square"></i> Edit Permission</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <form id="editPermissionForm">
              <div class="modal-body">
                <div class="mb-3">
                  <label class="form-label">Permission Name <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" id="editName" value="${
                    permission.name
                  }" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Resource <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" id="editResource" value="${
                    permission.resource
                  }" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Action <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" id="editAction" value="${
                    permission.action
                  }" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Description</label>
                  <textarea class="form-control" id="editDescription" rows="3">${
                    permission.description || ""
                  }</textarea>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                  <i class="bi bi-x-circle"></i> Cancel
                </button>
                <button type="submit" class="btn btn-primary">
                  <i class="bi bi-check-circle"></i> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    this.removeModal("editPermissionModal");
    document.body.insertAdjacentHTML("beforeend", modalHtml);

    const modal = new bootstrap.Modal(
      document.getElementById("editPermissionModal")
    );
    modal.show();

    document
      .getElementById("editPermissionForm")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        this.savePermissionEdits(permission.id);
      });
  }

  async savePermissionEdits(permissionId) {
    const submitBtn = document.querySelector(
      "#editPermissionForm button[type='submit']"
    );
    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<span class="spinner-border spinner-border-sm"></span> Saving...';

    try {
      const data = {
        name: document.getElementById("editName").value,
        resource: document.getElementById("editResource").value,
        action: document.getElementById("editAction").value,
        description: document.getElementById("editDescription").value || null,
      };

      const result = await API.request(`/permissions/${permissionId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });

      if (result.success) {
        this.showSuccess("Permission updated successfully!");
        this.removeModal("editPermissionModal");
        this.loadPermissions();
        this.loadStatistics();
      }
    } catch (error) {
      this.showError("Failed to update permission: " + error.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="bi bi-check-circle"></i> Save Changes';
    }
  }

  confirmDelete(permissionId, permissionName) {
    const modalHtml = `
      <div class="modal fade" id="deletePermissionModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header bg-danger text-white">
              <h5 class="modal-title"><i class="bi bi-exclamation-triangle"></i> Delete Permission</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="alert alert-danger">
                <i class="bi bi-exclamation-triangle"></i>
                <strong>Warning!</strong> This action cannot be undone.
              </div>
              <p>Are you sure you want to delete this permission?</p>
              <div class="card">
                <div class="card-body">
                  <h6 class="card-title">${permissionName}</h6>
                  <p class="card-text text-muted mb-0">Permission ID: ${permissionId}</p>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                <i class="bi bi-x-circle"></i> Cancel
              </button>
              <button type="button" class="btn btn-danger" data-action="confirm-delete">
                <i class="bi bi-trash"></i> Yes, Delete Permission
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.removeModal("deletePermissionModal");
    document.body.insertAdjacentHTML("beforeend", modalHtml);

    const modal = new bootstrap.Modal(
      document.getElementById("deletePermissionModal")
    );
    modal.show();

    // Attach event listener
    document
      .querySelector('[data-action="confirm-delete"]')
      .addEventListener("click", () => this.deletePermission(permissionId));
  }

  async deletePermission(permissionId) {
    const deleteBtn = document.querySelector('[data-action="confirm-delete"]');
    deleteBtn.disabled = true;
    deleteBtn.innerHTML =
      '<span class="spinner-border spinner-border-sm"></span> Deleting...';

    try {
      const result = await API.request(`/permissions/${permissionId}`, {
        method: "DELETE",
      });

      if (result.success) {
        this.showSuccess("Permission deleted successfully!");
        this.removeModal("deletePermissionModal");
        this.loadPermissions();
        this.loadStatistics();
      }
    } catch (error) {
      this.showError("Failed to delete permission: " + error.message);
      deleteBtn.disabled = false;
      deleteBtn.innerHTML =
        '<i class="bi bi-trash"></i> Yes, Delete Permission';
    }
  }

  removeModal(modalId) {
    const existingModal = document.getElementById(modalId);
    if (existingModal) {
      const modalInstance = bootstrap.Modal.getInstance(existingModal);
      if (modalInstance) {
        modalInstance.hide();
      }
      existingModal.remove();
    }
    document.querySelectorAll(".modal-backdrop").forEach((b) => b.remove());
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  }

  showSuccess(message) {
    this.showToast(message, "success");
  }

  showError(message) {
    this.showToast(message, "danger");
  }

  showToast(message, type = "info") {
    const toastHtml = `
      <div class="toast align-items-center text-white bg-${type} border-0" role="alert">
        <div class="d-flex">
          <div class="toast-body">${message}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      </div>
    `;

    let toastContainer = document.getElementById("toastContainer");
    if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.id = "toastContainer";
      toastContainer.className =
        "toast-container position-fixed top-0 end-0 p-3";
      toastContainer.style.zIndex = "9999";
      document.body.appendChild(toastContainer);
    }

    toastContainer.insertAdjacentHTML("beforeend", toastHtml);

    const toastElement = toastContainer.lastElementChild;
    const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
    toast.show();

    toastElement.addEventListener("hidden.bs.toast", () => {
      toastElement.remove();
    });
  }
}

// Initialize
const permissionManager = new PermissionManager();

async function initPermissionsPage() {
  const hasAccess = await AuthMiddleware.requirePermission("permission:view");
  if (!hasAccess) return;

  await AuthMiddleware.setupPermissionUI();
  permissionManager.init();
}

document.addEventListener("DOMContentLoaded", initPermissionsPage);
