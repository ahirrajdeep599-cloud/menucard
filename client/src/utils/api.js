const API_BASE = '/api';

// In-memory CSRF token
let inMemoryCsrfToken = null;

export function setCsrfToken(token) {
  inMemoryCsrfToken = token;
}

export function getCsrfToken() {
  return inMemoryCsrfToken;
}

async function request(endpoint, options = {}) {
  const headers = {
    ...options.headers,
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  // Include CSRF Token header for state-changing operations
  if (inMemoryCsrfToken) {
    headers['X-CSRF-Token'] = inMemoryCsrfToken;
  }

  // Always send HttpOnly cookies with requests
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('API server offline (non-JSON response received)');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Public
  getMenu: () => request('/menu'),

  // Auth (HttpOnly Cookie-based)
  login: async (identifier, password) => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password })
    });
    if (res.csrfToken) {
      setCsrfToken(res.csrfToken);
    }
    return res;
  },
  verifyToken: async () => {
    const res = await request('/auth/verify');
    if (!res || !res.authenticated) {
      throw new Error('Unauthorized');
    }
    return res;
  },
  logout: async () => {
    try {
      await request('/auth/logout', { method: 'POST' });
    } finally {
      setCsrfToken(null);
    }
  },
  changePassword: (currentPassword, newPassword) => request('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword })
  }),

  // Settings
  getSettings: () => request('/settings'),
  updateSettings: (settings) => request('/settings', {
    method: 'PUT',
    body: JSON.stringify(settings)
  }),

  // Categories
  getCategories: () => request('/categories'),
  createCategory: (name) => request('/categories', {
    method: 'POST',
    body: JSON.stringify({ name })
  }),
  updateCategory: (id, data) => request('/categories/' + id, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  reorderCategories: (orderList) => request('/categories-reorder', {
    method: 'PUT',
    body: JSON.stringify({ orderList })
  }),
  deleteCategory: (id) => request('/categories/' + id, {
    method: 'DELETE'
  }),

  // Items
  getItems: () => request('/items'),
  createItem: (item) => request('/items', {
    method: 'POST',
    body: JSON.stringify(item)
  }),
  updateItem: (id, item) => request('/items/' + id, {
    method: 'PUT',
    body: JSON.stringify(item)
  }),
  updatePrice: (id, price) => request('/items/' + id + '/price', {
    method: 'PATCH',
    body: JSON.stringify({ price })
  }),
  updateAvailability: (id, isAvailable) => request('/items/' + id + '/availability', {
    method: 'PATCH',
    body: JSON.stringify({ isAvailable })
  }),
  deleteItem: (id) => request('/items/' + id, {
    method: 'DELETE'
  }),

  // Media
  uploadImage: async (file, type = 'dishes') => {
    const formData = new FormData();
    formData.append('image', file);
    return request('/upload?type=' + type, {
      method: 'POST',
      body: formData
    });
  },
  scanMedia: () => request('/media/scan'),

  // Audit Logs & Backups
  getAuditLogs: () => request('/logs'),
  exportBackupUrl: () => `${API_BASE}/backup/export`,
  exportCsvUrl: () => `${API_BASE}/backup/export-csv`
};
