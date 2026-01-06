// ===== Admin Shared Utilities =====
// Reusable functions for all admin pages

const AdminUtils = {
  // ===== HTML Escaping =====
  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  // ===== Date Formatting =====
  formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  },

  formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  formatRelativeTime(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return this.formatDate(dateString);
  },

  // ===== Pagination =====
  renderPagination(paginationEl, pagination, onPageChange) {
    if (!paginationEl) return;

    paginationEl.innerHTML = '';
    const { page, totalPages } = pagination;

    // Previous button
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${page === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" data-page="${page - 1}">Previous</a>`;
    paginationEl.appendChild(prevLi);

    // Page numbers
    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, page + 2);

    // First page
    if (startPage > 1) {
      const li = document.createElement('li');
      li.className = 'page-item';
      li.innerHTML = `<a class="page-link" href="#" data-page="1">1</a>`;
      paginationEl.appendChild(li);
      
      if (startPage > 2) {
        const dots = document.createElement('li');
        dots.className = 'page-item disabled';
        dots.innerHTML = `<span class="page-link">...</span>`;
        paginationEl.appendChild(dots);
      }
    }

    // Page range
    for (let i = startPage; i <= endPage; i++) {
      const li = document.createElement('li');
      li.className = `page-item ${i === page ? 'active' : ''}`;
      li.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
      paginationEl.appendChild(li);
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        const dots = document.createElement('li');
        dots.className = 'page-item disabled';
        dots.innerHTML = `<span class="page-link">...</span>`;
        paginationEl.appendChild(dots);
      }
      
      const li = document.createElement('li');
      li.className = 'page-item';
      li.innerHTML = `<a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a>`;
      paginationEl.appendChild(li);
    }

    // Next button
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${page === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" data-page="${page + 1}">Next</a>`;
    paginationEl.appendChild(nextLi);

    // Add click handlers
    paginationEl.querySelectorAll('a.page-link').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPage = parseInt(link.dataset.page);
        if (targetPage && targetPage !== page && onPageChange) {
          onPageChange(targetPage);
        }
      });
    });
  },

  // ===== Debounce =====
  debounce(func, delay = 500) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  },

  // ===== Query Parameters =====
  buildQueryParams(params) {
    const query = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        query.append(key, params[key]);
      }
    });
    return query.toString();
  },

  // ===== Loading States =====
  showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.style.display = 'block';
    }
  },

  hideLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.style.display = 'none';
    }
  },

  showElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.style.display = 'block';
    }
  },

  hideElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.style.display = 'none';
    }
  },

  // ===== Alerts =====
  showAlert(containerId, message, type = 'info') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
      ${this.escapeHtml(message)}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    container.innerHTML = '';
    container.appendChild(alertDiv);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      alertDiv.classList.remove('show');
      setTimeout(() => alertDiv.remove(), 150);
    }, 5000);
  },

  clearAlerts(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = '';
    }
  },

  // ===== Toast Notifications =====
  showToast(message, type = 'success', duration = 3000) {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toastContainer';
      toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
      toastContainer.style.zIndex = '9999';
      document.body.appendChild(toastContainer);
    }

    // Icon and color mapping
    const config = {
      success: { icon: 'check-circle-fill', bg: 'success', text: 'white' },
      danger: { icon: 'exclamation-triangle-fill', bg: 'danger', text: 'white' },
      warning: { icon: 'exclamation-circle-fill', bg: 'warning', text: 'dark' },
      info: { icon: 'info-circle-fill', bg: 'info', text: 'white' }
    };

    const { icon, bg, text } = config[type] || config.info;

    // Create toast element
    const toastId = `toast-${Date.now()}`;
    const toastEl = document.createElement('div');
    toastEl.id = toastId;
    toastEl.className = `toast align-items-center text-${text} bg-${bg} border-0`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');
    
    toastEl.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          <i class="bi bi-${icon} me-2"></i>
          ${this.escapeHtml(message)}
        </div>
        <button type="button" class="btn-close btn-close-${text} me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    `;

    toastContainer.appendChild(toastEl);

    // Initialize and show toast
    const toast = new bootstrap.Toast(toastEl, {
      autohide: true,
      delay: duration
    });
    toast.show();

    // Remove toast element after it's hidden
    toastEl.addEventListener('hidden.bs.toast', () => {
      toastEl.remove();
    });
  },

  // ===== Counter Animation =====
  animateCounter(element, target, duration = 1000) {
    if (!element) return;
    
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, 16);
  },

  // ===== Modal Helpers =====
  showModal(modalId) {
    const modalEl = document.getElementById(modalId);
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
      return modal;
    }
    return null;
  },

  hideModal(modalId) {
    const modalEl = document.getElementById(modalId);
    if (modalEl) {
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) {
        modal.hide();
      }
    }
  },

  // ===== Badge Helpers =====
  createBadge(text, variant = 'primary') {
    return `<span class="badge bg-${variant}">${this.escapeHtml(text)}</span>`;
  },

  createStatusBadge(status) {
    const variants = {
      active: 'success',
      inactive: 'secondary',
      pending: 'warning',
      banned: 'danger',
      approved: 'success',
      rejected: 'danger',
    };
    const variant = variants[status?.toLowerCase()] || 'secondary';
    return this.createBadge(status, variant);
  },

  // ===== Table Helpers =====
  createActionButton(icon, title, onClick, variant = 'outline-primary', permission = null) {
    const permAttr = permission ? `data-permission="${permission}"` : '';
    return `
      <button class="btn btn-sm btn-${variant}" 
              onclick="${onClick}" 
              title="${title}"
              style="position: relative; z-index: 10; pointer-events: auto;"
              ${permAttr}>
        <i class="bi bi-${icon}"></i>
      </button>
    `;
  },

  createActionButtons(actions) {
    return `
      <div class="btn-group btn-group-sm">
        ${actions.map(action => this.createActionButton(
          action.icon,
          action.title,
          action.onClick,
          action.variant || 'outline-primary',
          action.permission
        )).join('')}
      </div>
    `;
  },

  // ===== Confirmation Dialog =====
  confirm(message, onConfirm, onCancel = null) {
    if (window.confirm(message)) {
      if (onConfirm) onConfirm();
    } else {
      if (onCancel) onCancel();
    }
  },

  // ===== Local Storage Helpers =====
  saveToStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },

  loadFromStorage(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return defaultValue;
    }
  },

  removeFromStorage(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  },

  // ===== Logout Helper =====
  logout() {
    localStorage.clear();
    window.location.href = '/login/index.html';
  },

  // ===== Number Formatting =====
  formatNumber(num) {
    if (num === null || num === undefined) return '0';
    return num.toLocaleString('en-US');
  },

  formatCurrency(amount, currency = 'USD') {
    if (amount === null || amount === undefined) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  },

  // ===== Truncate Text =====
  truncate(text, maxLength = 50) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  },
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdminUtils;
}
