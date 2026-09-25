// Rôle : Tests automatisés de cette fonctionnalité.
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AuthProvider } from '../src/context/auth/AuthContext';
import { useAuth } from '../src/context/auth/auth-context';
import { CartProvider } from '../src/context/cart/CartContext';
import { useCart } from '../src/context/cart/cart-context';
import { ConfirmProvider } from '../src/context/confirm/ConfirmContext';
import { useConfirm } from '../src/context/confirm/confirm-context';
import { ToastProvider } from '../src/context/toast/ToastContext';
import { useToast } from '../src/context/toast/toast-context';
import { fakeApi, product, member, renderPage } from './fixtures';
import Navbar from '../src/components/navbar/Navbar';
import Footer from '../src/components/footer/Footer';
import AddressAutocomplete from '../src/components/address/AddressAutocomplete';
import { distanceKm, nearestStores, fetchNearbyFlorists } from '../src/data/stores';
import { authApi, galleryApi, commentsApi, resolveUploadUrl, API_URL } from '../src/services/api';

function AuthProbe() {
  const auth = useAuth();
  return <><p role="status">{auth.isLoading ? 'loading' : auth.user?.firstName || 'visitor'}</p>
    <button onClick={() => auth.login('flora@example.test', 'password', true)}>Remember</button>
    <button onClick={() => auth.login('flora@example.test', 'password', false)}>Session</button>
    <button onClick={auth.logout}>Logout</button>
    <button onClick={() => auth.register({ ...member, password: 'password' })}>Register</button>
  </>;
}
function CartProbe() {
  const cart = useCart();
  return <><p role="status">{cart.getTotalItems()} articles / {cart.getTotalPrice()} €</p>
    <button onClick={() => cart.addToCart(product, 2)}>Add</button>
    <button onClick={() => cart.updateQuantity(product.id, 1)}>One</button>
    <button onClick={() => cart.updateQuantity(product.id, 0)}>Zero</button>
    <button onClick={cart.clearCart}>Clear</button>
  </>;
}
describe('Comptes, panier et navigation', () => {
  beforeEach(() => { fakeApi(); });
  it('démarre sans compte et sans requête de profil quand aucun token n’existe', () => {
    const fetchMock = fakeApi(); render(<AuthProvider><AuthProbe /></AuthProvider>);
    expect(screen.getByRole('status')).toHaveTextContent('visitor'); expect(fetchMock).not.toHaveBeenCalled();
  });
  it('restaure un compte avec un token stocké', async () => {
    localStorage.setItem('floresia-token', 'saved'); render(<AuthProvider><AuthProbe /></AuthProvider>);
    expect(await screen.findByText('Flora')).toBeInTheDocument();
  });
  it('supprime un token refusé par le serveur', async () => {
    localStorage.setItem('floresia-token', 'invalid'); fakeApi({ '/auth/me': new Error('Invalid JWT') });
    render(<AuthProvider><AuthProbe /></AuthProvider>); await screen.findByText('visitor');
    expect(localStorage.getItem('floresia-token')).toBeNull();
  });
  it('conserve une seule session selon le choix Se souvenir de moi', async () => {
    render(<AuthProvider><AuthProbe /></AuthProvider>);
    fireEvent.click(screen.getByText('Remember')); await screen.findByText('Flora');
    expect(localStorage.getItem('floresia-token')).toBe('test-token');
    fireEvent.click(screen.getByText('Session'));
    await waitFor(() => expect(sessionStorage.getItem('floresia-token')).toBe('test-token'));
    expect(localStorage.getItem('floresia-token')).toBeNull();
    fireEvent.click(screen.getByText('Remember'));
    await waitFor(() => expect(localStorage.getItem('floresia-token')).toBe('test-token'));
    expect(sessionStorage.getItem('floresia-token')).toBeNull();
    fireEvent.click(screen.getByText('Logout'));
    expect(screen.getByRole('status')).toHaveTextContent('visitor'); expect(localStorage.getItem('floresia-token')).toBeNull();
  });
  it('inscrit puis connecte le compte après une inscription réussie', async () => {
    fakeApi({ '/auth/register': {} }); render(<AuthProvider><AuthProbe /></AuthProvider>);
    fireEvent.click(screen.getByText('Register')); await screen.findByText('Flora');
  });
  it.each(['{broken', '{}', '[{"id":"p","price":-1,"quantity":1}]'])('tolère un panier stocké invalide (%s)', (saved) => {
    localStorage.setItem('floresia-cart', saved); render(<CartProvider><CartProbe /></CartProvider>);
    expect(screen.getByRole('status')).toHaveTextContent('0 articles / 0 €');
  });
  it('restaure une ancienne composition dont l’identifiant était numérique', () => {
    localStorage.setItem('floresia-cart', JSON.stringify([{ id: 123, price: 12.5, quantity: 1, category: 'Personnalisé' }]));
    render(<CartProvider><CartProbe /></CartProvider>);
    expect(screen.getByRole('status')).toHaveTextContent('1 articles / 12.5 €');
    expect(JSON.parse(localStorage.getItem('floresia-cart'))[0].id).toBe('123');
  });
  it('cumule, met à jour et retire les quantités du panier', () => {
    render(<CartProvider><CartProbe /></CartProvider>);
    fireEvent.click(screen.getByText('Add')); fireEvent.click(screen.getByText('Add'));
    expect(screen.getByRole('status')).toHaveTextContent('4 articles / 128 €');
    fireEvent.click(screen.getByText('One')); expect(screen.getByRole('status')).toHaveTextContent('1 articles / 32 €');
    fireEvent.click(screen.getByText('Zero')); expect(screen.getByRole('status')).toHaveTextContent('0 articles / 0 €');
    fireEvent.click(screen.getByText('Add')); fireEvent.click(screen.getByText('Clear'));
    expect(JSON.parse(localStorage.getItem('floresia-cart'))).toEqual([]);
  });
  it('propose la personnalisation et ferme le menu mobile après une navigation', () => {
    const { container } = renderPage(Navbar, { cart: [{ ...product, quantity: 2 }] });
    const link = screen.getByRole('link', { name: 'Personnalisation' });
    expect(link).toHaveAttribute('href', '/personnaliser');
    expect(screen.getByRole('link', { name: 'Panier, 2 articles' })).toHaveTextContent('2');
    fireEvent.click(screen.getByRole('button', { name: 'Ouvrir le menu' }));
    expect(container.querySelector('.nav-links')).toHaveClass('active');
    fireEvent.click(link); expect(container.querySelector('.nav-links')).not.toHaveClass('active');
  });
  it('expose les destinations d’information du footer', () => {
    renderPage(Footer); expect(screen.getByRole('link', { name: 'Mentions légales' })).toHaveAttribute('href', '/mentions-legales');
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact');
  });
});
describe('Confirmation et informations temporaires', () => {
  it.each([['Confirmer', true], ['Annuler', false]])('résout la confirmation avec %s', async (label, expected) => {
    const result = vi.fn();
    function Probe() { const { confirm } = useConfirm(); return <button onClick={async () => result(await confirm({ title: 'Suppression', message: 'Continuer ?' }))}>Open</button>; }
    render(<ConfirmProvider><Probe /></ConfirmProvider>); fireEvent.click(screen.getByText('Open'));
    fireEvent.click(screen.getByRole('button', { name: label }));
    await waitFor(() => expect(result).toHaveBeenCalledWith(expected));
    expect(screen.queryByText('Suppression')).not.toBeInTheDocument();
  });
  it('masque un toast après sa durée d’affichage', () => {
    vi.useFakeTimers();
    function Probe() { const { showToast } = useToast(); return <button onClick={() => showToast('Ajout confirmé', { duration: 100 })}>Open</button>; }
    render(<ToastProvider><Probe /></ToastProvider>); fireEvent.click(screen.getByText('Open'));
    expect(screen.getByRole('status')).toHaveTextContent('Ajout confirmé');
    act(() => vi.advanceTimersByTime(100)); expect(screen.queryByRole('status')).not.toBeInTheDocument();
    vi.useRealTimers();
  });
});
describe('Adresse et fleuristes', () => {
  const feature = { properties: { id: '1', label: '1 rue des Tests, Paris', postcode: '75001', housenumber: '1', street: 'rue des Tests', city: 'Paris' }, geometry: { coordinates: [2.35, 48.85] } };
  it('ne recherche pas une saisie trop courte', () => {
    const fetchMock = fakeApi(); render(<AddressAutocomplete onSelect={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText(/Commencez à taper/), { target: { value: 'ab' } });
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('transmet une adresse parisienne et ses coordonnées', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ json: async () => ({ features: [feature] }) }));
    const onSelect = vi.fn(); render(<AddressAutocomplete onSelect={onSelect} />);
    fireEvent.change(screen.getByPlaceholderText(/Commencez à taper/), { target: { value: 'rue' } });
    fireEvent.click(await screen.findByText(feature.properties.label));
    expect(onSelect).toHaveBeenCalledWith({ street: '1 rue des Tests', city: 'Paris', zipCode: '75001', lat: 48.85, lng: 2.35 });
  });
  it('refuse une adresse extérieure à Paris', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ json: async () => ({ features: [{ ...feature, properties: { ...feature.properties, postcode: '69001' } }] }) }));
    const onSelect = vi.fn(); render(<AddressAutocomplete onSelect={onSelect} />);
    fireEvent.change(screen.getByPlaceholderText(/Commencez à taper/), { target: { value: 'rue' } });
    fireEvent.click(await screen.findByText(feature.properties.label));
    expect(onSelect).not.toHaveBeenCalled(); expect(screen.getByText(/ne livre actuellement que dans Paris/)).toBeInTheDocument();
  });
  it('calcule une distance nulle et une distance Paris–Lyon plausible', () => {
    expect(distanceKm(48.85, 2.35, 48.85, 2.35)).toBe(0);
    expect(distanceKm(48.85, 2.35, 45.76, 4.84)).toBeGreaterThan(380);
    expect(distanceKm(48.85, 2.35, 45.76, 4.84)).toBeLessThan(410);
    const stores = nearestStores(48.85, 2.35, 2);
    expect(stores).toHaveLength(2); expect(stores[0].distance).toBeLessThanOrEqual(stores[1].distance);
  });
  it('refuse une recherche de fleuristes sans coordonnées', async () => {
    await expect(fetchNearbyFlorists(null, null)).rejects.toThrow('Coordonnées manquantes');
  });
  it('classe les fleuristes par proximité et limite les résultats', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ elements: [{ id: 1, lat: 48.86, lon: 2.35, tags: { name: 'Fleuriste' } }, { id: 2, lat: 48.85, lon: 2.35, tags: {} }] }) }));
    expect(await fetchNearbyFlorists(48.85, 2.35, 3000, 1)).toEqual([expect.objectContaining({ id: 'osm-2', distance: 0 })]);
  });
});
describe('Client API : erreurs et pièces jointes', () => {
  it.each([null, '', '/uploads/test.png', 'https://example.test/image.png'])('résout une image (%s)', (path) => {
    expect(resolveUploadUrl(path)).toBe(!path ? null : path.startsWith('https') ? path : API_URL + path);
  });
  it('transforme les erreurs de validation du serveur en message lisible', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, json: async () => ({ message: ['Email invalide', 'Mot de passe trop court'] }) }));
    await expect(authApi.login({ email: 'wrong', password: 'short' })).rejects.toThrow('Email invalide, Mot de passe trop court');
  });
  it('préserve un message de repli si la réponse n’est pas du JSON', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, json: async () => { throw new Error('HTML'); } }));
    await expect(authApi.me('token')).rejects.toThrow('Une erreur est survenue.');
  });
  it.each([galleryApi.submit, commentsApi.create])('envoie le multipart sans imposer sa frontière Content-Type', async (send) => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ id: 'uploaded' }) });
    vi.stubGlobal('fetch', fetchMock);
    const form = new FormData(); form.append('content', 'Test');
    expect(await send(form, 'token')).toEqual({ id: 'uploaded' });
    expect(fetchMock).toHaveBeenCalledWith(expect.any(String), { method: 'POST', headers: { Authorization: 'Bearer token' }, body: form });
  });
});
