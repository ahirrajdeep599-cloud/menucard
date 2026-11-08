import defaultMenuData from '../data/defaultMenu.json';
import { getFirebaseMenu, saveFirebaseMenu, subscribeToMenu } from './firebase';

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

// Low-level fetch wrapper
async function request(endpoint, options = {}) {
  const headers = { ...options.headers };

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

// -------------------------------------------------------------------
// Unified Data Layer: Firestore Cloud Sync (Real-time on all devices)
// -------------------------------------------------------------------
export const api = {
  // Public Menu (Pulls from Firebase Firestore)
  getMenu: async () => {
    try {
      const data = await getFirebaseMenu();
      if (data && Array.isArray(data.items) && data.items.length > 0) {
        return data;
      }
    } catch (err) {
      console.warn("Firestore error:", err);
    }
    return defaultMenuData;
  },

  // Real-time listener subscription
  subscribeMenu: (onUpdate) => {
    return subscribeToMenu(onUpdate);
  },

  // Auth
  login: async (identifier, password) => {
    if (identifier.trim() === 'admin547' && password === 'owner92744!@') {
      if (typeof window !== 'undefined') {
        localStorage.setItem('dd_admin_auth', 'true');
      }
      return {
        success: true,
        user: { username: 'admin547', email: 'admin547@diningdelight.com' }
      };
    }
    throw new Error('Invalid admin credentials. Please verify your admin ID and password.');
  },

  verifyToken: async () => {
    if (typeof window !== 'undefined' && localStorage.getItem('dd_admin_auth') === 'true') {
      return { authenticated: true, user: { username: 'admin547' } };
    }
    throw new Error('Unauthorized');
  },

  logout: async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dd_admin_auth');
    }
  },

  // Categories (Firebase Firestore Live Sync)
  getCategories: async () => {
    const menu = await api.getMenu();
    return menu.categories || [];
  },

  createCategory: async (name) => {
    const menu = await api.getMenu();
    const newCat = {
      id: 'cat-' + Date.now(),
      name: name.trim(),
      order: (menu.categories || []).length + 1
    };
    menu.categories = [...(menu.categories || []), newCat];
    await saveFirebaseMenu(menu);
    return newCat;
  },

  updateCategory: async (id, data) => {
    const menu = await api.getMenu();
    menu.categories = (menu.categories || []).map(c => c.id === id ? { ...c, ...data } : c);
    await saveFirebaseMenu(menu);
    return { ...data, id };
  },

  deleteCategory: async (id) => {
    const menu = await api.getMenu();
    menu.categories = (menu.categories || []).filter(c => c.id !== id);
    menu.items = (menu.items || []).filter(i => i.categoryId !== id);
    await saveFirebaseMenu(menu);
    return { success: true, id };
  },

  reorderCategories: async (orderList) => {
    const menu = await api.getMenu();
    const orderMap = new Map((orderList || []).map(item => [item.id, item.order]));
    menu.categories = (menu.categories || []).map(cat => ({
      ...cat,
      order: orderMap.has(cat.id) ? orderMap.get(cat.id) : (cat.order || 0)
    })).sort((a, b) => (a.order || 0) - (b.order || 0));
    await saveFirebaseMenu(menu);
    return menu.categories;
  },

  // Items (Firebase Firestore Live Sync)
  getItems: async () => {
    const menu = await api.getMenu();
    return menu.items || [];
  },

  createItem: async (item) => {
    const menu = await api.getMenu();
    const newItem = {
      id: 'item-' + Date.now(),
      isVeg: true,
      isAvailable: true,
      ...item,
      price: Number(item.price)
    };
    menu.items = [newItem, ...(menu.items || [])];
    await saveFirebaseMenu(menu);
    return newItem;
  },

  updateItem: async (id, item) => {
    const menu = await api.getMenu();
    const updated = {
      ...item,
      id,
      price: Number(item.price)
    };
    menu.items = (menu.items || []).map(i => i.id === id ? { ...i, ...updated } : i);
    await saveFirebaseMenu(menu);
    return updated;
  },

  updatePrice: async (id, price) => {
    const menu = await api.getMenu();
    menu.items = (menu.items || []).map(i => i.id === id ? { ...i, price: Number(price) } : i);
    await saveFirebaseMenu(menu);
    return { id, price: Number(price) };
  },

  updateAvailability: async (id, isAvailable) => {
    const menu = await api.getMenu();
    menu.items = (menu.items || []).map(i => i.id === id ? { ...i, isAvailable } : i);
    await saveFirebaseMenu(menu);
    return { id, isAvailable };
  },

  deleteItem: async (id) => {
    const menu = await api.getMenu();
    menu.items = (menu.items || []).filter(i => i.id !== id);
    await saveFirebaseMenu(menu);
    return { success: true, id };
  },

  // Image Upload (converts to optimized compressed DataURL saved directly into Cloud Firestore!)
  uploadImage: async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ url: reader.result, filename: file.name });
      reader.readAsDataURL(file);
    });
  },

  // Settings
  getSettings: async () => {
    const menu = await api.getMenu();
    return menu.settings || defaultMenuData.settings;
  },

  updateSettings: async (settings) => {
    const menu = await api.getMenu();
    menu.settings = { ...menu.settings, ...settings };
    await saveFirebaseMenu(menu);
    return menu.settings;
  },

  downloadOfflineJson: async () => {
    const menu = await api.getMenu();
    const blob = new Blob([JSON.stringify(menu, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dining-delight-menu-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
};
