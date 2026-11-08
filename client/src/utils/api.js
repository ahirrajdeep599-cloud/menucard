import defaultMenuData from '../data/defaultMenu.json';

const API_BASE = '/api';
const STORAGE_KEY = 'dd_custom_menu';

// In-memory CSRF token
let inMemoryCsrfToken = null;

export function setCsrfToken(token) {
  inMemoryCsrfToken = token;
}

export function getCsrfToken() {
  return inMemoryCsrfToken;
}

// -------------------------------------------------------------------
// Local Storage Fallback Layer (Enables full editing on static hosting)
// -------------------------------------------------------------------
export function getLocalStore() {
  if (typeof window === 'undefined') return defaultMenuData;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && Array.isArray(parsed.items) && parsed.items.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.warn("Failed to parse saved menu store", e);
    }
  }
  return JSON.parse(JSON.stringify(defaultMenuData));
}

export function saveLocalStore(data) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
  return data;
}

// Low-level fetch wrapper
async function request(endpoint, options = {}) {
  const headers = {
    ...options.headers,
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (inMemoryCsrfToken) {
    headers['X-CSRF-Token'] = inMemoryCsrfToken;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('API server is not responding with JSON');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Public Menu
  getMenu: async () => {
    try {
      const res = await request('/menu');
      if (res && Array.isArray(res.items) && res.items.length > 0) {
        saveLocalStore(res);
        return res;
      }
    } catch (err) {
      // Fallback to local store for static Netlify hosting
    }
    return getLocalStore();
  },

  // Auth (Dual mode: server JWT or client verification)
  login: async (identifier, password) => {
    try {
      const res = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password })
      });
      if (res.csrfToken) {
        setCsrfToken(res.csrfToken);
      }
      return res;
    } catch (err) {
      // Fallback for static hosting
      if (identifier.trim() === 'admin547' && password === 'owner92744!@') {
        return {
          success: true,
          user: { username: 'admin547', email: 'admin547@diningdelight.com' }
        };
      }
      throw new Error(err.message || 'Invalid admin credentials');
    }
  },

  verifyToken: async () => {
    try {
      const res = await request('/auth/verify');
      if (res && res.authenticated) {
        return res;
      }
    } catch (err) {
      // ignore
    }
    if (typeof window !== 'undefined' && localStorage.getItem('dd_admin_auth') === 'true') {
      return { authenticated: true, user: { username: 'admin547' } };
    }
    throw new Error('Unauthorized');
  },

  logout: async () => {
    try {
      await request('/auth/logout', { method: 'POST' });
    } catch (err) {
      // ignore
    } finally {
      setCsrfToken(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('dd_admin_auth');
      }
    }
  },

  changePassword: (currentPassword, newPassword) => request('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword })
  }),

  // Settings
  getSettings: async () => {
    try {
      return await request('/settings');
    } catch (e) {
      return getLocalStore().settings;
    }
  },

  updateSettings: async (settings) => {
    try {
      return await request('/settings', {
        method: 'PUT',
        body: JSON.stringify(settings)
      });
    } catch (e) {
      const store = getLocalStore();
      store.settings = { ...store.settings, ...settings };
      saveLocalStore(store);
      return store.settings;
    }
  },

  // Categories
  getCategories: async () => {
    try {
      return await request('/categories');
    } catch (e) {
      return getLocalStore().categories;
    }
  },

  createCategory: async (name) => {
    try {
      return await request('/categories', {
        method: 'POST',
        body: JSON.stringify({ name })
      });
    } catch (e) {
      const store = getLocalStore();
      const newCat = {
        id: 'cat-' + Date.now(),
        name: name.trim(),
        order: (store.categories || []).length + 1
      };
      store.categories = [...(store.categories || []), newCat];
      saveLocalStore(store);
      return newCat;
    }
  },

  updateCategory: async (id, data) => {
    try {
      return await request('/categories/' + id, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    } catch (e) {
      const store = getLocalStore();
      store.categories = (store.categories || []).map(c => c.id === id ? { ...c, ...data } : c);
      saveLocalStore(store);
      return { ...data, id };
    }
  },

  reorderCategories: async (orderList) => {
    try {
      return await request('/categories-reorder', {
        method: 'PUT',
        body: JSON.stringify({ orderList })
      });
    } catch (e) {
      const store = getLocalStore();
      orderList.forEach(({ id, order }) => {
        const cat = store.categories.find(c => c.id === id);
        if (cat) cat.order = order;
      });
      store.categories.sort((a, b) => a.order - b.order);
      saveLocalStore(store);
      return { success: true };
    }
  },

  deleteCategory: async (id) => {
    try {
      return await request('/categories/' + id, { method: 'DELETE' });
    } catch (e) {
      const store = getLocalStore();
      store.categories = (store.categories || []).filter(c => c.id !== id);
      store.items = (store.items || []).filter(i => i.categoryId !== id);
      saveLocalStore(store);
      return { success: true, id };
    }
  },

  // Items (Dishes)
  getItems: async () => {
    try {
      return await request('/items');
    } catch (e) {
      return getLocalStore().items;
    }
  },

  createItem: async (item) => {
    try {
      return await request('/items', {
        method: 'POST',
        body: JSON.stringify(item)
      });
    } catch (e) {
      const store = getLocalStore();
      const newItem = {
        id: 'item-' + Date.now(),
        isVeg: true,
        isAvailable: true,
        ...item,
        price: Number(item.price)
      };
      store.items = [newItem, ...(store.items || [])];
      saveLocalStore(store);
      return newItem;
    }
  },

  updateItem: async (id, item) => {
    try {
      return await request('/items/' + id, {
        method: 'PUT',
        body: JSON.stringify(item)
      });
    } catch (e) {
      const store = getLocalStore();
      const updated = {
        ...item,
        id,
        price: Number(item.price)
      };
      store.items = (store.items || []).map(i => i.id === id ? { ...i, ...updated } : i);
      saveLocalStore(store);
      return updated;
    }
  },

  updatePrice: async (id, price) => {
    try {
      return await request('/items/' + id + '/price', {
        method: 'PATCH',
        body: JSON.stringify({ price: Number(price) })
      });
    } catch (e) {
      const store = getLocalStore();
      store.items = (store.items || []).map(i => i.id === id ? { ...i, price: Number(price) } : i);
      saveLocalStore(store);
      return { id, price: Number(price) };
    }
  },

  updateAvailability: async (id, isAvailable) => {
    try {
      return await request('/items/' + id + '/availability', {
        method: 'PATCH',
        body: JSON.stringify({ isAvailable })
      });
    } catch (e) {
      const store = getLocalStore();
      store.items = (store.items || []).map(i => i.id === id ? { ...i, isAvailable } : i);
      saveLocalStore(store);
      return { id, isAvailable };
    }
  },

  deleteItem: async (id) => {
    try {
      return await request('/items/' + id, { method: 'DELETE' });
    } catch (e) {
      const store = getLocalStore();
      store.items = (store.items || []).filter(i => i.id !== id);
      saveLocalStore(store);
      return { success: true, id };
    }
  },

  // Image Upload (Works offline via DataURL conversion)
  uploadImage: async (file, type = 'dishes') => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      return await request('/upload?type=' + type, {
        method: 'POST',
        body: formData
      });
    } catch (err) {
      // In static mode, convert file into WebP/JPEG DataURL
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ url: reader.result, filename: file.name });
        reader.readAsDataURL(file);
      });
    }
  },

  scanMedia: async () => {
    try {
      return await request('/media/scan');
    } catch (e) {
      return { brandingFiles: [], dishesFiles: [] };
    }
  },

  // Audit Logs & Export
  getAuditLogs: async () => {
    try {
      return await request('/logs');
    } catch (e) {
      return [];
    }
  },

  exportBackupUrl: () => `${API_BASE}/backup/export`,
  exportCsvUrl: () => `${API_BASE}/backup/export-csv`,

  // Client-side export helper (works offline)
  downloadOfflineJson: () => {
    const data = getLocalStore();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dining-delight-menu-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
};
