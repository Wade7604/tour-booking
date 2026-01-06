// assets/js/auth-middleware.js
class AuthMiddleware {
  static currentUser = null;

  // Lấy thông tin user hiện tại
  static async getCurrentUser() {
    if (this.currentUser) return this.currentUser;

    const token = localStorage.getItem("idToken");
    if (!token) return null;

    try {
      const response = await API.getCurrentUser();
      if (response.success) {
        this.currentUser = response.data;
        return this.currentUser;
      }
    } catch (error) {
      console.error("Get user failed:", error);
      localStorage.removeItem("idToken");
    }
    return null;
  }

  // Kiểm tra có permission cụ thể không
  static async hasPermission(permissionName) {
    const user = await this.getCurrentUser();
    if (!user) return false;

    return (
      user.permissions?.some((perm) => perm.name === permissionName) || false
    );
  }

  // Kiểm tra có role cụ thể không
  static async hasRole(roleName) {
    const user = await this.getCurrentUser();
    if (!user) return false;

    // Check user.role (string)
    if (user.role === roleName) return true;

    // Or check roleDetails.name
    if (user.roleDetails?.name === roleName) return true;

    return false;
  }

  // Kiểm tra có ít nhất 1 trong các permissions
  static async hasAnyPermission(permissionNames = []) {
    const user = await this.getCurrentUser();
    if (!user) return false;

    return permissionNames.some((permName) =>
      user.permissions?.some((perm) => perm.name === permName)
    );
  }

  // Kiểm tra có đủ TẤT CẢ permissions
  static async hasAllPermissions(permissionNames = []) {
    const user = await this.getCurrentUser();
    if (!user) return false;

    return permissionNames.every((permName) =>
      user.permissions?.some((perm) => perm.name === permName)
    );
  }

  // Kiểm tra quyền truy cập trang và redirect nếu không đủ quyền
  static async requirePermission(permissionName, redirectUrl = "/index.html") {
    const hasAccess = await this.hasPermission(permissionName);

    if (!hasAccess) {
      this.showAccessDenied();
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 2000);
      return false;
    }

    return true;
  }

  // Kiểm tra quyền cho nhiều permissions (phải có ít nhất 1)
  static async requireAnyPermission(
    permissionNames = [],
    redirectUrl = "/index.html"
  ) {
    const hasAccess = await this.hasAnyPermission(permissionNames);

    if (!hasAccess) {
      this.showAccessDenied();
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 2000);
      return false;
    }

    return true;
  }

  // Kiểm tra phải có role cụ thể
  static async requireRole(roleName, redirectUrl = "/index.html") {
    const hasRole = await this.hasRole(roleName);

    if (!hasRole) {
      this.showAccessDenied();
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 2000);
      return false;
    }

    return true;
  }

  // Hiển thị thông báo không có quyền
  static showAccessDenied() {
    const alertHtml = `
      <div class="position-fixed top-0 start-50 translate-middle-x mt-3" style="z-index: 9999; width: 500px;">
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          <i class="bi bi-exclamation-triangle-fill"></i>
          <strong>Access Denied!</strong> You don't have permission to access this page.
          <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("afterbegin", alertHtml);
  }

  // Ẩn/hiện elements dựa trên permission
  static async setupPermissionUI() {
    const user = await this.getCurrentUser();
    if (!user) return;

    // Tìm tất cả elements có attribute data-permission
    document.querySelectorAll("[data-permission]").forEach((element) => {
      const requiredPerm = element.getAttribute("data-permission");
      const hasPerm = user.permissions?.some(
        (perm) => perm.name === requiredPerm
      );

      if (!hasPerm) {
        element.style.display = "none";
      }
    });

    // Tìm tất cả elements có attribute data-any-permission
    document.querySelectorAll("[data-any-permission]").forEach((element) => {
      const requiredPerms = element
        .getAttribute("data-any-permission")
        .split(",");
      const hasAnyPerm = requiredPerms.some((permName) =>
        user.permissions?.some((perm) => perm.name === permName.trim())
      );

      if (!hasAnyPerm) {
        element.style.display = "none";
      }
    });

    // Tìm tất cả elements có attribute data-role
    document.querySelectorAll("[data-role]").forEach((element) => {
      const requiredRole = element.getAttribute("data-role");
      const hasRole =
        user.role === requiredRole || user.roleDetails?.name === requiredRole;

      if (!hasRole) {
        element.style.display = "none";
      }
    });
  }

  // Logout
  static logout() {
    localStorage.removeItem("idToken");
    this.currentUser = null;
    window.location.href = "/login";
  }
}

// Hàm logout global
function logout() {
  if (confirm("Are you sure you want to logout?")) {
    AuthMiddleware.logout();
  }
}
