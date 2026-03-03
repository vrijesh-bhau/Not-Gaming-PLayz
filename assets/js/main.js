/**
 * The Antigle - Main JavaScript
 * Author: Mukund
 * Description: Core functionality for the gaming brand website
 */

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
  YOUTUBE_CHANNEL: 'https://youtube.com/@notgamingplayz',
  CACHE_KEY_PREFIX: 'antigle_cache_',
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  THEME_KEY: 'antigle_theme'
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Debounce function to limit execution rate
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Format date to readable string
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Format file size to human-readable string
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Extract YouTube video ID from various URL formats
 */
function extractYouTubeId(url) {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /youtube\.com\/shorts\/([^&\s?]+)/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Generate relative link for a resource/video/update
 */
function generateLink(type, id) {
  return `./${type}.html?id=${encodeURIComponent(id)}`;
}

/**
 * Copy text to clipboard
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    } catch (e) {
      document.body.removeChild(textarea);
      return false;
    }
  }
}

/**
 * Show toast notification
 */
function showToast(message, type = 'success') {
  // Remove existing toasts
  const existingToast = document.querySelector('.toast-notification');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.className = `toast-notification toast-${type}`;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.innerHTML = `
    <span>${message}</span>
  `;
  
  // Add toast styles
  toast.style.cssText = `
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background: var(--bg-secondary);
    color: var(--text-primary);
    padding: 1rem 1.5rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-lg);
    z-index: 10000;
    font-size: 0.95rem;
    opacity: 0;
    transition: all 0.3s ease;
  `;
  
  if (type === 'success') {
    toast.style.borderLeft = '4px solid var(--accent-cyan)';
  } else if (type === 'error') {
    toast.style.borderLeft = '4px solid var(--accent-pink)';
  }
  
  document.body.appendChild(toast);
  
  // Animate in
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });
  
  // Remove after delay
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(100px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ============================================
// DATA FETCHING
// ============================================

/**
 * Fetch JSON data with caching and error handling
 */
async function fetchJSON(path) {
  const cacheKey = CONFIG.CACHE_KEY_PREFIX + path;
  
  // Check sessionStorage cache
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CONFIG.CACHE_DURATION) {
        console.log(`[Cache Hit] ${path}`);
        return data;
      }
    }
  } catch (e) {
    console.warn('SessionStorage not available:', e);
  }
  
  try {
    const response = await fetch(path);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Cache the result
    try {
      sessionStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.warn('Could not cache data:', e);
    }
    
    return data;
  } catch (error) {
    console.error(`Failed to fetch ${path}:`, error);
    throw error;
  }
}

/**
 * Get file size via HEAD request (may fail due to CORS)
 */
async function getFileSize(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    if (response.ok) {
      const size = response.headers.get('Content-Length');
      return size ? parseInt(size, 10) : null;
    }
  } catch (error) {
    // CORS or network error - gracefully fail
    console.log(`Could not get file size for ${url}:`, error.message);
  }
  return null;
}

// ============================================
// THEME MANAGEMENT
// ============================================

/**
 * Initialize theme toggle
 */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;
  
  // Load saved theme or default to dark
  const savedTheme = localStorage.getItem(CONFIG.THEME_KEY) || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeToggle.setAttribute('aria-label', savedTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(CONFIG.THEME_KEY, newTheme);
    themeToggle.setAttribute('aria-label', newTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  });
}

// ============================================
// NAVIGATION
// ============================================

/**
 * Initialize hamburger menu
 */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navbarNav = document.getElementById('navbar-nav');
  if (!hamburger || !navbarNav) return;
  
  hamburger.addEventListener('click', () => {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
    navbarNav.classList.toggle('active');
  });
  
  // Close menu when clicking a link
  navbarNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.setAttribute('aria-expanded', 'false');
      navbarNav.classList.remove('active');
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
      hamburger.setAttribute('aria-expanded', 'false');
      navbarNav.classList.remove('active');
    }
  });
  
  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navbarNav.classList.contains('active')) {
      hamburger.setAttribute('aria-expanded', 'false');
      navbarNav.classList.remove('active');
      hamburger.focus();
    }
  });
}

// ============================================
// MODAL SYSTEM
// ============================================

/**
 * Modal manager for video and post modals
 */
const ModalManager = {
  activeModal: null,
  previousFocus: null,
  
  /**
   * Open video modal with YouTube embed
   */
  openVideoModal(title, youtubeUrl, description) {
    const videoId = extractYouTubeId(youtubeUrl);
    if (!videoId) {
      showToast('Invalid YouTube URL', 'error');
      return;
    }
    
    this.previousFocus = document.activeElement;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'modal-title');
    modal.innerHTML = `
      <div class="modal-container">
        <div class="modal-header">
          <h2 id="modal-title" class="modal-title">${escapeHtml(title)}</h2>
          <button class="modal-close" aria-label="Close modal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="modal-video-container">
            <iframe 
              id="video-iframe"
              src="https://www.youtube.com/embed/${videoId}?rel=0" 
              title="${escapeHtml(title)}"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen>
            </iframe>
          </div>
          <div class="modal-description">
            ${description || '<p>No description available.</p>'}
          </div>
          <div class="modal-actions">
            <a href="${youtubeUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-youtube">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Watch on YouTube
            </a>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    this.activeModal = modal;
    
    // Trap focus
    this.trapFocus(modal);
    
    // Show modal
    requestAnimationFrame(() => {
      modal.classList.add('active');
      modal.querySelector('.modal-close').focus();
    });
    
    // Event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => this.closeModal());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.closeModal();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', this.handleKeyDown);
  },
  
  /**
   * Open post modal for updates
   */
  openPostModal(title, date, content, featuredImage) {
    this.previousFocus = document.activeElement;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay post-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'post-modal-title');
    modal.innerHTML = `
      <div class="modal-container">
        <div class="modal-header">
          <h2 id="post-modal-title" class="modal-title">${escapeHtml(title)}</h2>
          <button class="modal-close" aria-label="Close modal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          ${featuredImage ? `<img src="${featuredImage}" alt="" style="width: 100%; border-radius: var(--radius-md); margin-bottom: 1.5rem;">` : ''}
          <p class="update-date" style="margin-bottom: 1rem; color: var(--text-muted);">${formatDate(date)}</p>
          <div class="post-content">
            ${content}
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    this.activeModal = modal;
    
    // Trap focus
    this.trapFocus(modal);
    
    // Show modal
    requestAnimationFrame(() => {
      modal.classList.add('active');
      modal.querySelector('.modal-close').focus();
    });
    
    // Event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => this.closeModal());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.closeModal();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', this.handleKeyDown);
  },
  
  /**
   * Close active modal
   */
  closeModal() {
    if (!this.activeModal) return;
    
    // Stop video if exists
    const iframe = this.activeModal.querySelector('#video-iframe');
    if (iframe) {
      iframe.src = '';
    }
    
    this.activeModal.classList.remove('active');
    
    setTimeout(() => {
      this.activeModal.remove();
      this.activeModal = null;
      document.removeEventListener('keydown', this.handleKeyDown);
      
      // Restore focus
      if (this.previousFocus) {
        this.previousFocus.focus();
        this.previousFocus = null;
      }
    }, 300);
  },
  
  /**
   * Trap focus within modal
   */
  trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    modal.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    });
  },
  
  /**
   * Handle keyboard events
   */
  handleKeyDown(e) {
    if (e.key === 'Escape') {
      ModalManager.closeModal();
    }
  }
};

// ============================================
// CARD OPTIONS MENU
// ============================================

/**
 * Initialize 3-dot menu for cards
 */
function initCardMenu(button, id, type, title) {
  const card = button.closest('.resource-card, .video-card, .update-card');
  let menu = card.querySelector('.dropdown-menu');
  
  // Create menu if doesn't exist
  if (!menu) {
    menu = document.createElement('div');
    menu.className = 'dropdown-menu';
    menu.setAttribute('role', 'menu');
    menu.innerHTML = `
      <button class="dropdown-item" role="menuitem" data-action="copy-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
        Copy link
      </button>
      <button class="dropdown-item" role="menuitem" data-action="share">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
        Share
      </button>
      <button class="dropdown-item" role="menuitem" data-action="report">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
          <line x1="4" y1="22" x2="4" y2="15"></line>
        </svg>
        Report
      </button>
    `;
    button.parentElement.appendChild(menu);
    
    // Menu item actions
    menu.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', async (e) => {
        e.stopPropagation();
        const action = item.dataset.action;
        const url = window.location.origin + window.location.pathname.replace(/[^/]+$/, '') + `${type}.html?id=${id}`;
        
        switch (action) {
          case 'copy-link':
          case 'share':
            const success = await copyToClipboard(url);
            showToast(success ? 'Link copied to clipboard!' : 'Failed to copy link', success ? 'success' : 'error');
            break;
          case 'report':
            showToast('Report submitted. Thank you!', 'success');
            break;
        }
        
        menu.classList.remove('active');
        button.setAttribute('aria-expanded', 'false');
      });
    });
  }
  
  // Toggle menu
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    
    // Close all other menus
    document.querySelectorAll('.dropdown-menu.active').forEach(m => {
      m.classList.remove('active');
      m.previousElementSibling?.setAttribute('aria-expanded', 'false');
    });
    
    button.setAttribute('aria-expanded', !isExpanded);
    menu.classList.toggle('active');
  });
  
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!button.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('active');
      button.setAttribute('aria-expanded', 'false');
    }
  });
  
  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('active')) {
      menu.classList.remove('active');
      button.setAttribute('aria-expanded', 'false');
      button.focus();
    }
  });
}

// ============================================
// HTML ESCAPING
// ============================================

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ============================================
// RENDER FUNCTIONS
// ============================================

/**
 * Render videos grid
 */
function renderVideos(videos, container, filter = 'all', searchQuery = '') {
  if (!container) return;
  
  // Filter videos
  let filtered = videos;
  
  if (filter !== 'all') {
    filtered = filtered.filter(v => v.category === filter);
  }
  
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(v => 
      v.title.toLowerCase().includes(query) ||
      (v.tags && v.tags.some(tag => tag.toLowerCase().includes(query)))
    );
  }
  
  // Sort by date (newest first)
  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Clear container
  container.innerHTML = '';
  
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-message" style="grid-column: 1 / -1;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
          <line x1="7" y1="2" x2="7" y2="22"></line>
          <line x1="17" y1="2" x2="17" y2="22"></line>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <line x1="2" y1="7" x2="7" y2="7"></line>
          <line x1="2" y1="17" x2="7" y2="17"></line>
          <line x1="17" y1="17" x2="22" y2="17"></line>
          <line x1="17" y1="7" x2="22" y2="7"></line>
        </svg>
        <h3>No videos found</h3>
        <p>Try adjusting your filters or search query.</p>
      </div>
    `;
    return;
  }
  
  // Render cards
  filtered.forEach(video => {
    const card = document.createElement('div');
    card.className = 'glass-card video-card';
    card.innerHTML = `
      <div class="video-thumbnail">
        <img src="${video.thumbnail}" alt="${escapeHtml(video.title)}" loading="lazy">
        <div class="video-play-overlay">
          <div class="play-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </div>
        </div>
      </div>
      <div class="video-info">
        <h3 class="video-title">${escapeHtml(video.title)}</h3>
        <p class="video-description">${escapeHtml(video.description)}</p>
        <div class="video-meta">
          <span>${formatDate(video.date)}</span>
        </div>
        ${video.tags ? `
          <div class="video-tags">
            ${video.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
          </div>
        ` : ''}
      </div>
    `;
    
    // Open modal on click
    card.addEventListener('click', () => {
      ModalManager.openVideoModal(video.title, video.youtube, video.description);
    });
    
    container.appendChild(card);
  });
}

/**
 * Render resources grid
 */
async function renderResources(resources, container, filter = 'all', searchQuery = '') {
  if (!container) return;
  
  // Filter resources
  let filtered = resources;
  
  if (filter !== 'all') {
    filtered = filtered.filter(r => r.category === filter);
  }
  
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(r => 
      r.title.toLowerCase().includes(query) ||
      (r.tags && r.tags.some(tag => tag.toLowerCase().includes(query)))
    );
  }
  
  // Sort by date (newest first)
  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Clear container
  container.innerHTML = '';
  
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-message" style="grid-column: 1 / -1;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
        </svg>
        <h3>No resources found</h3>
        <p>Try adjusting your filters or search query.</p>
      </div>
    `;
    return;
  }
  
  // Render cards
  for (const resource of filtered) {
    const card = document.createElement('div');
    card.className = 'glass-card resource-card';
    card.dataset.id = resource.id;
    
    // Get file size if available
    let fileSizeHtml = '';
    if (resource.download_type === 'file' && resource.file) {
      const size = await getFileSize(resource.file);
      if (size) {
        fileSizeHtml = `<span class="resource-file-size">${formatFileSize(size)}</span>`;
      }
    }
    
    // Generate buttons based on download_type
    let buttonsHtml = '';
    if (resource.download_type === 'file' && resource.file) {
      buttonsHtml = `
        <a href="${resource.file}" download class="btn btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Download
        </a>
      `;
    } else if (resource.download_type === 'external' && resource.external_link) {
      buttonsHtml = `
        <a href="${resource.external_link}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
          Get From Original Creator
        </a>
      `;
    }
    
    // Add "Open Video" button if youtube link exists
    if (resource.youtube) {
      buttonsHtml += `
        <button class="btn btn-secondary btn-open-video">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          Open Video
        </button>
      `;
    }
    
    card.innerHTML = `
      <div class="resource-thumbnail">
        <img src="${resource.thumbnail}" alt="${escapeHtml(resource.title)}" loading="lazy">
        <div class="resource-actions-menu">
          <button class="menu-btn" aria-label="More options" aria-haspopup="true" aria-expanded="false">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="2"></circle>
              <circle cx="12" cy="12" r="2"></circle>
              <circle cx="12" cy="19" r="2"></circle>
            </svg>
          </button>
        </div>
      </div>
      <div class="resource-info">
        <h3 class="resource-title">${escapeHtml(resource.title)}</h3>
        <p class="resource-description truncated">${escapeHtml(resource.description)}</p>
        ${resource.description.length > 120 ? `<button class="read-more-btn">Read more</button>` : ''}
        <div class="resource-meta">
          <span>${formatDate(resource.date)}</span>
          ${fileSizeHtml}
        </div>
        ${resource.tags ? `
          <div class="video-tags">
            ${resource.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
          </div>
        ` : ''}
        <div class="resource-buttons">
          ${buttonsHtml}
        </div>
        ${resource.note ? `<div class="resource-note">${escapeHtml(resource.note)}</div>` : ''}
      </div>
    `;
    
    // Initialize menu button
    const menuBtn = card.querySelector('.menu-btn');
    if (menuBtn) {
      initCardMenu(menuBtn, resource.id, 'resources', resource.title);
    }
    
    // Read more toggle
    const readMoreBtn = card.querySelector('.read-more-btn');
    if (readMoreBtn) {
      readMoreBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const desc = card.querySelector('.resource-description');
        desc.classList.toggle('truncated');
        readMoreBtn.textContent = desc.classList.contains('truncated') ? 'Read more' : 'Read less';
      });
    }
    
    // Open video button
    const openVideoBtn = card.querySelector('.btn-open-video');
    if (openVideoBtn) {
      openVideoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        ModalManager.openVideoModal(resource.title, resource.youtube, resource.description);
      });
    }
    
    container.appendChild(card);
  }
}

/**
 * Render updates grid
 */
function renderUpdates(updates, container, limit = null) {
  if (!container) return;
  
  // Sort by date (newest first)
  const sorted = [...updates].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Apply limit if specified
  const toRender = limit ? sorted.slice(0, limit) : sorted;
  
  // Clear container
  container.innerHTML = '';
  
  if (toRender.length === 0) {
    container.innerHTML = `
      <div class="empty-message" style="grid-column: 1 / -1;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
        <h3>No updates yet</h3>
        <p>Check back soon for news and announcements!</p>
      </div>
    `;
    return;
  }
  
  // Render cards
  toRender.forEach(update => {
    const card = document.createElement('div');
    card.className = 'glass-card update-card';
    card.innerHTML = `
      ${update.featured_image ? `
        <div class="update-image">
          <img src="${update.featured_image}" alt="" loading="lazy">
        </div>
      ` : ''}
      <div class="update-content">
        <p class="update-date">${formatDate(update.date)}</p>
        <h3 class="update-title">${escapeHtml(update.title)}</h3>
        <p class="update-summary">${escapeHtml(update.summary)}</p>
        <button class="btn btn-secondary read-more-update">Read more</button>
      </div>
    `;
    
    // Open post modal
    card.querySelector('.read-more-update').addEventListener('click', () => {
      ModalManager.openPostModal(update.title, update.date, update.content, update.featured_image);
    });
    
    container.appendChild(card);
  });
}

// ============================================
// PAGE INITIALIZATION
// ============================================

/**
 * Initialize home page
 */
async function initHomePage() {
  const featuredVideoContainer = document.getElementById('featured-video');
  const latestUpdatesContainer = document.getElementById('latest-updates');
  
  try {
    // Load videos for featured section
    const videos = await fetchJSON('./content/videos/index.json');
    if (videos && videos.length > 0 && featuredVideoContainer) {
      // Sort by date and get latest
      const latest = videos.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
      
      const videoId = extractYouTubeId(latest.youtube);
      featuredVideoContainer.innerHTML = `
        <div class="glass-card video-card" style="max-width: 600px; margin: 0 auto;">
          <div class="video-thumbnail" style="cursor: pointer;">
            <img src="${latest.thumbnail}" alt="${escapeHtml(latest.title)}" loading="lazy">
            <div class="video-play-overlay">
              <div class="play-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </div>
            </div>
          </div>
          <div class="video-info">
            <h3 class="video-title">${escapeHtml(latest.title)}</h3>
            <p class="video-description">${escapeHtml(latest.description)}</p>
            <div class="video-meta">
              <span>${formatDate(latest.date)}</span>
            </div>
          </div>
        </div>
      `;
      
      // Add click handler
      featuredVideoContainer.querySelector('.video-thumbnail').addEventListener('click', () => {
        ModalManager.openVideoModal(latest.title, latest.youtube, latest.description);
      });
    }
  } catch (error) {
    console.error('Failed to load featured video:', error);
    if (featuredVideoContainer) {
      featuredVideoContainer.innerHTML = `
        <div class="error-message">
          <p>Could not load featured video. Please try again later.</p>
        </div>
      `;
    }
  }
  
  try {
    // Load updates
    const updates = await fetchJSON('./content/updates/index.json');
    if (latestUpdatesContainer) {
      renderUpdates(updates, latestUpdatesContainer, 3);
    }
  } catch (error) {
    console.error('Failed to load updates:', error);
    if (latestUpdatesContainer) {
      latestUpdatesContainer.innerHTML = `
        <div class="error-message" style="grid-column: 1 / -1;">
          <p>Could not load updates. Please try again later.</p>
        </div>
      `;
    }
  }
}

/**
 * Initialize videos page
 */
async function initVideosPage() {
  const container = document.getElementById('videos-grid');
  const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
  const searchInput = document.getElementById('video-search');
  
  if (!container) return;
  
  // Show loading
  container.innerHTML = `
    <div class="loading-spinner" style="grid-column: 1 / -1;">
      <div class="spinner"></div>
    </div>
  `;
  
  try {
    const videos = await fetchJSON('./content/videos/index.json');
    
    let currentFilter = 'all';
    let currentSearch = '';
    
    // Initial render
    renderVideos(videos, container, currentFilter, currentSearch);
    
    // Filter buttons
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderVideos(videos, container, currentFilter, currentSearch);
      });
    });
    
    // Search input
    if (searchInput) {
      searchInput.addEventListener('input', debounce((e) => {
        currentSearch = e.target.value;
        renderVideos(videos, container, currentFilter, currentSearch);
      }, 300));
    }
  } catch (error) {
    console.error('Failed to load videos:', error);
    container.innerHTML = `
      <div class="error-message" style="grid-column: 1 / -1;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h3>Failed to load videos</h3>
        <p>Please check your connection and try again later.</p>
      </div>
    `;
  }
}

/**
 * Initialize resources page
 */
async function initResourcesPage() {
  const container = document.getElementById('resources-grid');
  const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
  const searchInput = document.getElementById('resource-search');
  
  if (!container) return;
  
  // Show loading
  container.innerHTML = `
    <div class="loading-spinner" style="grid-column: 1 / -1;">
      <div class="spinner"></div>
    </div>
  `;
  
  try {
    const resources = await fetchJSON('./content/resources/index.json');
    
    // Update filter buttons to only show categories that exist
    const existingCategories = new Set(resources.map(r => r.category));
    filterBtns.forEach(btn => {
      const filter = btn.dataset.filter;
      if (filter !== 'all' && !existingCategories.has(filter)) {
        btn.style.display = 'none';
      }
    });
    
    let currentFilter = 'all';
    let currentSearch = '';
    
    // Initial render
    await renderResources(resources, container, currentFilter, currentSearch);
    
    // Filter buttons
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderResources(resources, container, currentFilter, currentSearch);
      });
    });
    
    // Search input
    if (searchInput) {
      searchInput.addEventListener('input', debounce((e) => {
        currentSearch = e.target.value;
        renderResources(resources, container, currentFilter, currentSearch);
      }, 300));
    }
    
    // Check for category query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam && existingCategories.has(categoryParam)) {
      const categoryBtn = document.querySelector(`.filter-btn[data-filter="${categoryParam}"]`);
      if (categoryBtn) {
        filterBtns.forEach(b => b.classList.remove('active'));
        categoryBtn.classList.add('active');
        currentFilter = categoryParam;
        renderResources(resources, container, currentFilter, currentSearch);
      }
    }
  } catch (error) {
    console.error('Failed to load resources:', error);
    container.innerHTML = `
      <div class="error-message" style="grid-column: 1 / -1;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h3>Failed to load resources</h3>
        <p>Please check your connection and try again later.</p>
      </div>
    `;
  }
}

/**
 * Initialize updates page
 */
async function initUpdatesPage() {
  const container = document.getElementById('updates-grid');
  
  if (!container) return;
  
  // Show loading
  container.innerHTML = `
    <div class="loading-spinner" style="grid-column: 1 / -1;">
      <div class="spinner"></div>
    </div>
  `;
  
  try {
    const updates = await fetchJSON('./content/updates/index.json');
    renderUpdates(updates, container);
  } catch (error) {
    console.error('Failed to load updates:', error);
    container.innerHTML = `
      <div class="error-message" style="grid-column: 1 / -1;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h3>Failed to load updates</h3>
        <p>Please check your connection and try again later.</p>
      </div>
    `;
  }
}

// ============================================
// DOM READY
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme
  initTheme();
  
  // Initialize navigation
  initHamburger();
  
  // Initialize page-specific functionality
  const path = window.location.pathname;
  
  if (path.endsWith('index.html') || path.endsWith('/') || path === '') {
    initHomePage();
  } else if (path.includes('videos.html')) {
    initVideosPage();
  } else if (path.includes('resources.html')) {
    initResourcesPage();
  } else if (path.includes('updates.html')) {
    initUpdatesPage();
  }
});

// ============================================
// EXPORTS (for testing)
// ============================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    fetchJSON,
    renderVideos,
    renderResources,
    renderUpdates,
    ModalManager,
    extractYouTubeId,
    formatDate,
    formatFileSize,
    escapeHtml
  };
}
