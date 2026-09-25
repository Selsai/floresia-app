// Rôle : Tests automatisés de cette fonctionnalité.
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi } from 'vitest';
import { AuthContext } from '../src/context/auth/auth-context';
import { CartProvider } from '../src/context/cart/CartContext';
import { ConfirmProvider } from '../src/context/confirm/ConfirmContext';
import { ToastProvider } from '../src/context/toast/ToastContext';
import { CUSTOM_BOUQUET_PRODUCT_ID } from '../src/services/api';
export const product = { id: 'p', name: 'Romance', description: 'Un bouquet de roses', price: 32, imageUrl: '/rose.png', category: 'MARIAGE', isCustomizable: true };
export const article = { id: 'a', title: 'Entretenir ses roses', content: 'Conseils pour vos roses.', excerpt: 'Conseils floraux', category: 'Conseils', createdAt: '2026-09-01', imageUrl: '/rose.png', displayAuthorName: 'Flora', readTime: '5 min' };
export const flowers = [
  { id: 'r', name: 'Rose', color: 'Rose', description: 'Rose tendre', price: 3.5, imageUrl: '/flowers/rose-pink.png', stock: 100, isSecondary: false },
  { id: 'e', name: 'Eucalyptus', color: 'Vert', description: 'Feuillage', price: 2, imageUrl: '/flowers/eucalyptus.png', stock: 100, isSecondary: true },
];
export const address = { id: 'addr', userId: 'u', label: 'Maison', fullName: 'Flora Test', street: '1 rue des Tests', city: 'Paris', zipCode: '75001', phone: '0612345678', country: 'France', isDefault: true };
export const member = { id: 'u', firstName: 'Flora', lastName: 'Test', email: 'flora@example.test', role: 'USER', phone: '0612345678', isEmailVerified: true, createdAt: '2026-01-01' };
export function fakeApi(overrides = {}) {
  const data = {
    '/products': [product, { ...product, id: 'q', name: 'Jardin Secret', price: 52, category: 'ANNIVERSAIRE' }, { ...product, id: CUSTOM_BOUQUET_PRODUCT_ID, name: 'Placeholder', price: 0 }],
    '/products/p': product, '/flowers': flowers, '/articles': [article], '/articles/a': article,
    '/addresses': [address], '/orders': [], '/favorites': [], '/testimonials': [], '/gallery': [],
    '/comments/article/a': [], '/comments/article/a/commenters': [], '/comments/admin/all': [],
    '/auth/me': member, '/auth/login': { token: 'test-token', user: member },
    '/chatbot/message': { reply: 'Les roses coûtent 3,50 € la tige.' },
    ...overrides,
  };
  const fetchMock = vi.fn(async (url, options = {}) => {
    const path = new URL(url).pathname;
    const result = data[path];
    if (result instanceof Error) throw result;
    if (!(path in data)) throw new Error('Appel non prévu dans le test : ' + path);
    return { ok: true, status: 200, json: async () => typeof result === 'function' ? result(options) : result };
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}
export function renderPage(Component, { path = '/', route = '*', signedIn = false, role = 'USER', state, cart } = {}) {
  if (cart) localStorage.setItem('floresia-cart', JSON.stringify(cart));
  const auth = { user: signedIn ? { ...member, role } : null, token: signedIn ? 'test-token' : null, isAuthenticated: signedIn, isLoading: false, login: vi.fn().mockResolvedValue({ success: true, user: member }), register: vi.fn().mockResolvedValue({ success: true, user: member }), logout: vi.fn(), updateUser: vi.fn(), getRememberedEmail: () => '' };
  const view = render(
    <ConfirmProvider><ToastProvider><AuthContext.Provider value={auth}><CartProvider>
      <MemoryRouter initialEntries={[{ pathname: path.split('?')[0], search: path.includes('?') ? '?' + path.split('?')[1] : '', state }]}>
        <Routes><Route path={route} element={<Component />} />{route !== '*' && <Route path="*" element={<p>Destination</p>} />}</Routes>
      </MemoryRouter>
    </CartProvider></AuthContext.Provider></ToastProvider></ConfirmProvider>
  );
  return { ...view, auth };
}