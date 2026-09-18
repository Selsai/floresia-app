// Point d'entrée unique pour tous les appels à l'API Florésia

export const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Id du produit "placeholder" utilisé pour rattacher les bouquets personnalisés
// aux commandes. Ne doit jamais être affiché dans le catalogue.
export const CUSTOM_BOUQUET_PRODUCT_ID = 'cmtxj1mhg000c99uhklj59h39';

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = Array.isArray(data?.message)
      ? data.message.join(', ')
      : data?.message || 'Une erreur est survenue.';

    throw new Error(message);
  }

  return data;
}

export const authApi = {
  register: (payload) =>
    request('/auth/register', {
      method: 'POST',
      body: payload,
    }),

  login: (payload) =>
    request('/auth/login', {
      method: 'POST',
      body: payload,
    }),

  me: (token) =>
    request('/auth/me', {
      token,
    }),

  updateProfile: (payload, token) =>
    request('/auth/me', {
      method: 'PATCH',
      body: payload,
      token,
    }),

  changePassword: (payload, token) =>
    request('/auth/change-password', {
      method: 'PATCH',
      body: payload,
      token,
    }),

  sendVerificationCode: (email) =>
    request('/auth/send-verification-code', {
      method: 'POST',
      body: { email },
    }),

  verifyEmail: (payload) =>
    request('/auth/verify-email', {
      method: 'POST',
      body: payload,
    }),

  forgotPassword: (email) =>
    request('/auth/forgot-password', {
      method: 'POST',
      body: { email },
    }),

  resetPassword: (payload) =>
    request('/auth/reset-password', {
      method: 'POST',
      body: payload,
    }),
};

export const addressesApi = {
  list: (token) =>
    request('/addresses', {
      token,
    }),

  create: (payload, token) =>
    request('/addresses', {
      method: 'POST',
      body: payload,
      token,
    }),

  update: (id, payload, token) =>
    request(`/addresses/${id}`, {
      method: 'PATCH',
      body: payload,
      token,
    }),

  remove: (id, token) =>
    request(`/addresses/${id}`, {
      method: 'DELETE',
      token,
    }),
};

export const productsApi = {
  list: () =>
    request('/products'),

  getOne: (id) =>
    request(`/products/${id}`),
};

export const flowersApi = {
  list: () => request('/flowers'),
};

export const favoritesApi = {
  list: (token) =>
    request('/favorites', {
      token,
    }),

  add: (productId, token) =>
    request(`/favorites/${productId}`, {
      method: 'POST',
      token,
    }),

  remove: (productId, token) =>
    request(`/favorites/${productId}`, {
      method: 'DELETE',
      token,
    }),
};

export const ordersApi = {
  list: (token) =>
    request('/orders', {
      token,
    }),

  create: (payload, token) =>
    request('/orders', {
      method: 'POST',
      body: payload,
      token,
    }),
};

export const paymentApi = {
  createCheckoutSession: (orderId, token) =>
    request('/payment/checkout-session', {
      method: 'POST',
      body: { orderId },
      token,
    }),
};

// Résout une URL d'image renvoyée par le backend
// (ex: /uploads/comments/xxx.jpg)
// en URL absolue vers l'API — nécessaire car ces fichiers sont servis
// par le backend, contrairement aux images statiques du front.

export function resolveUploadUrl(path) {
  if (!path) return null;

  return path.startsWith('http')
    ? path
    : `${API_URL}${path}`;
}

export const articlesApi = {
  list: () =>
    request('/articles'),

  getOne: (id) =>
    request(`/articles/${id}`),
};

export const testimonialsApi = {
  list: () =>
    request('/testimonials'),

  submit: (payload, token) =>
    request('/testimonials/mine', {
      method: 'POST',
      body: payload,
      token,
    }),

  remove: (id, token) =>
    request(`/testimonials/${id}`, {
      method: 'DELETE',
      token,
    }),
};

export const galleryApi = {
  list: () =>
    request('/gallery'),

  submit: async (formData, token) => {
    const res = await fetch(`${API_URL}/gallery/mine`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const message = Array.isArray(data?.message)
        ? data.message.join(', ')
        : data?.message || 'Une erreur est survenue.';

      throw new Error(message);
    }

    return data;
  },

  remove: (id, token) =>
    request(`/gallery/${id}`, {
      method: 'DELETE',
      token,
    }),
};

export const commentsApi = {
  listByArticle: (articleId) =>
    request(`/comments/article/${articleId}`),

  listCommenters: (articleId) =>
    request(`/comments/article/${articleId}/commenters`),

  // Récupère tous les commentaires pour le futur dashboard admin
  listAllForAdmin: (token) =>
    request('/comments/admin/all', {
      token,
    }),

  create: async (formData, token) => {
    const res = await fetch(`${API_URL}/comments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      }, // pas de Content-Type : géré automatiquement pour le multipart
      body: formData,
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const message = Array.isArray(data?.message)
        ? data.message.join(', ')
        : data?.message || 'Une erreur est survenue.';

      throw new Error(message);
    }

    return data;
  },

  remove: (id, token) =>
    request(`/comments/${id}`, {
      method: 'DELETE',
      token,
    }),
};

// Frontend — ajout chatbotApi
export const chatbotApi = {
  sendMessage: (message, history) =>
    request('/chatbot/message', { method: 'POST', body: { message, history } }),
};