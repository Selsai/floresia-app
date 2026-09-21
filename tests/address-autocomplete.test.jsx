import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AddressAutocomplete from '../src/components/address/AddressAutocomplete';

const address = {
  properties: {
    id: '75056_1234_12',
    label: '12 rue de la Paix 75002 Paris',
    housenumber: '12',
    street: 'rue de la Paix',
    postcode: '75002',
    city: 'Paris',
  },
  geometry: { coordinates: [2.331, 48.869] },
};

describe('sélection d’une adresse de livraison', () => {
  it('ne valide pas une saisie libre et invalide le choix après modification', async () => {
    const onSelect = vi.fn();
    const onClear = vi.fn();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ json: async () => ({ features: [address] }) }));
    render(<AddressAutocomplete onSelect={onSelect} onClear={onClear} />);

    const input = screen.getByRole('textbox', { name: 'Adresse à Paris' });
    fireEvent.change(input, { target: { value: '12 rue de la Paix' } });
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(onSelect).not.toHaveBeenCalled();

    fireEvent.click(await screen.findByRole('button', { name: address.properties.label }));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ street: '12 rue de la Paix', zipCode: '75002' }));

    fireEvent.change(input, { target: { value: 'adresse inventée' } });
    expect(onClear).toHaveBeenCalledTimes(2);
    await waitFor(() => expect(input).toHaveValue('adresse inventée'));
  });

  it('refuse une suggestion sans numéro de rue', async () => {
    const onSelect = vi.fn();
    const streetOnly = { ...address, properties: { ...address.properties, id: 'street', housenumber: '' } };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ json: async () => ({ features: [streetOnly] }) }));
    render(<AddressAutocomplete onSelect={onSelect} />);

    fireEvent.change(screen.getByRole('textbox', { name: 'Adresse à Paris' }), { target: { value: 'rue de la Paix' } });
    fireEvent.click(await screen.findByRole('button', { name: address.properties.label }));
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByText(/adresse précise avec un numéro/)).toBeInTheDocument();
  });
});
