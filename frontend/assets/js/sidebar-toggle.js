// Sidebar Toggle Functionality
// Add this script to all admin pages

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('mainContent') || document.querySelector('.main-content');
  
  if (sidebar && mainContent) {
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('sidebar-collapsed');
    
    // Save state to localStorage
    const isCollapsed = sidebar.classList.contains('collapsed');
    localStorage.setItem('sidebarCollapsed', isCollapsed);
  }
}

// Restore sidebar state on page load
document.addEventListener('DOMContentLoaded', function() {
  const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('mainContent') || document.querySelector('.main-content');
  
  if (isCollapsed && sidebar && mainContent) {
    sidebar.classList.add('collapsed');
    mainContent.classList.add('sidebar-collapsed');
  }
});
