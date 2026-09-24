import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import ConsentManager, { CONSENT_KEY } from '../src/components/consent/ConsentManager';

describe('gestion du consentement', () => {
  beforeEach(() => localStorage.clear());
  it('enregistre un refus sans charger de script de mesure', () => {
    render(<ConsentManager />);
    fireEvent.click(screen.getByRole('button', { name: 'Tout refuser' }));
    expect(JSON.parse(localStorage.getItem(CONSENT_KEY)).analytics).toBe(false);
    expect(document.querySelector('script[data-floresia-ga]')).toBeNull();
  });
  it('permet de rouvrir et personnaliser le choix', async () => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ necessary: true, analytics: false }));
    render(<ConsentManager />);
    window.dispatchEvent(new Event('floresia:open-consent'));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    expect(screen.getByLabelText('Stockage nécessaire toujours activé')).toBeDisabled();
  });
});
