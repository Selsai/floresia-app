// Rôle : Tests automatisés de cette fonctionnalité.
import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import Cart from '../src/pages/cart/Cart';
import { fakeApi, renderPage, product, address } from './fixtures';
import { CUSTOM_BOUQUET_PRODUCT_ID } from '../src/services/api';

describe('Panier : transmission de commande et refus', () => {
  beforeEach(() => { fakeApi(); });
  it('ne crée pas de commande lorsqu’aucune adresse n’existe', async () => {
    const fetchMock = fakeApi({ '/addresses': [] });
    renderPage(Cart, { signedIn: true, cart: [{ ...product, quantity: 1 }] });
    fireEvent.click(screen.getByRole('button', { name: 'Passer la commande' }));
    expect(await screen.findByText(/Veuillez renseigner une adresse/)).toBeInTheDocument();
    expect(fetchMock.mock.calls.some(([url]) => new URL(url).pathname === '/orders')).toBe(false);
  });
  it('refuse un retrait sans magasin sélectionné', async () => {
    const fetchMock = fakeApi();
    renderPage(Cart, { signedIn: true, cart: [{ ...product, quantity: 1 }] });
    fireEvent.click(screen.getByRole('button', { name: /Retrait/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Passer la commande' }));
    expect(screen.getByText('Sélectionnez un magasin pour le retrait.')).toBeInTheDocument();
    expect(fetchMock.mock.calls.some(([url]) => new URL(url).pathname === '/orders')).toBe(false);
  });
  it('envoie les identifiants et quantités, conserve le panier avant confirmation', async () => {
    const fetchMock = fakeApi({ '/orders': { id: 'o' }, '/payment/checkout-session': { checkoutUrl: window.location.href } });
    const cart = [{
      id: 'custom-test', name: 'Bouquet personnalisé', price: 12.5, quantity: 1, category: 'Personnalisé',
      customConfig: { selectedFlowers: [{ id: 'r', name: 'Rose', quantity: 3 }], secondaryFlowers: ['e'], occasionName: 'Mariage', ribbonColor: 'pink', message: 'Félicitations' },
    }];
    renderPage(Cart, { signedIn: true, cart });

    fireEvent.click(screen.getByRole('button', { name: 'Passer la commande' }));
    await waitFor(() => expect(sessionStorage.getItem('floresia-checkout')).not.toBeNull());
    const orderCall = fetchMock.mock.calls.find(([url]) => new URL(url).pathname === '/orders');
    const payload = JSON.parse(orderCall[1].body);
    expect(payload.addressId).toBe(address.id);
    expect(payload).not.toHaveProperty('totalAmount');
    expect(payload.items[0]).not.toHaveProperty('unitPrice');
    expect(payload.items[0].productId).toBe(CUSTOM_BOUQUET_PRODUCT_ID);
    expect(payload.items[0].customBouquet.flowers).toEqual([{ flowerId: 'r', quantity: 3 }, { flowerId: 'e', quantity: 1 }]);
    expect(JSON.parse(localStorage.getItem('floresia-cart'))).toHaveLength(1);
  });
  it('conserve le panier et explique une erreur de création', async () => {
    fakeApi({ '/orders': new Error('Stock insuffisant') });
    renderPage(Cart, { signedIn: true, cart: [{ ...product, quantity: 1 }] });
    fireEvent.click(screen.getByRole('button', { name: 'Passer la commande' }));
    expect(await screen.findByText('Stock insuffisant')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('floresia-cart'))).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Passer la commande' })).not.toBeDisabled();
  });
});