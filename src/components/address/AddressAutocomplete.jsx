// AddressAutocomplete : suggestions et validation des adresses.
import { useState } from 'react';

const PARIS_ZIP_REGEX = /^750(0[1-9]|1[0-9]|20)$/;

export default function AddressAutocomplete({ onSelect, onClear, initialValue = '' }) {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [outOfZoneMessage, setOutOfZoneMessage] = useState('');

  const handleChange = async (e) => {
    // Recherche des adresses après la saisie.
    const value = e.target.value;
    setQuery(value);
    onClear?.();
    setOutOfZoneMessage('');

    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(value)}&citycode=75056&limit=5`
      );
      const data = await res.json();
      const features = Array.isArray(data?.features) ? data.features : [];
      setSuggestions(features);
    } catch (err) {
      console.error('Erreur autocomplete adresse :', err);
      setSuggestions([]);
    }
  };

  const handleSelect = (feature) => {
    // Transmet l’adresse et ses coordonnées.
    const { properties, geometry } = feature;
    const zipCode = properties.postcode;

    if (!PARIS_ZIP_REGEX.test(zipCode)) {
      setOutOfZoneMessage(
        'Florésia ne livre actuellement que dans Paris intramuros (75001 à 75020).'
      );
      setSuggestions([]);
      return;
    }

    if (!properties.housenumber) {
      setOutOfZoneMessage('Sélectionnez une adresse précise avec un numéro de rue.');
      setSuggestions([]);
      return;
    }

    setQuery(properties.label);
    setSuggestions([]);
    onSelect({
      street: `${properties.housenumber || ''} ${properties.street || properties.name}`.trim(),
      city: properties.city,
      zipCode,
      lat: geometry.coordinates[1],
      lng: geometry.coordinates[0],
    });
  };

  return (
    <div className="address-autocomplete">
      <input
        type="text"
        aria-label="Adresse à Paris"
        placeholder="Commencez à taper votre adresse à Paris…"
        value={query}
        onChange={handleChange}
      />

      {suggestions.length > 0 && (
        <ul className="address-suggestions">
          {suggestions.map((f) => (
            <li key={f.properties.id}>
              <button type="button" onClick={() => handleSelect(f)}>{f.properties.label}</button>
            </li>
          ))}
        </ul>
      )}

      {outOfZoneMessage && <p className="address-out-of-zone">{outOfZoneMessage}</p>}
    </div>
  );
}
