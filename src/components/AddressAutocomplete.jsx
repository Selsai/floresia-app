import { useState, useRef, useEffect } from 'react';

const PARIS_ZIP_REGEX = /^750(0[1-9]|1[0-9]|20)$/;

export default function AddressAutocomplete({ onSelect }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [outOfZoneMessage, setOutOfZoneMessage] = useState('');
  const [coords, setCoords] = useState(null);

  const wrapperRef = useRef(null);

  const updateCoords = () => {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 6,
        left: rect.left,
        width: rect.width,
      });
    }
  };

  const handleChange = async (e) => {
    const value = e.target.value;
    setQuery(value);
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
      if (features.length > 0) updateCoords();
    } catch (err) {
      console.error('Erreur autocomplete adresse :', err);
      setSuggestions([]);
    }
  };

  const handleSelect = (feature) => {
    const { properties, geometry } = feature;
    const zipCode = properties.postcode;

    if (!PARIS_ZIP_REGEX.test(zipCode)) {
      setOutOfZoneMessage(
        'Florésia ne livre actuellement que dans Paris intramuros (75001 à 75020).'
      );
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

  // Recalcule la position si le formulaire scrolle pendant que le dropdown est ouvert
  useEffect(() => {
    if (suggestions.length === 0) return;
    const handleScroll = () => updateCoords();
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [suggestions.length]);

  return (
    <div className="address-autocomplete" ref={wrapperRef}>
      <input
        type="text"
        placeholder="Commencez à taper votre adresse à Paris…"
        value={query}
        onChange={handleChange}
      />

      {suggestions.length > 0 && coords && (
        <ul
          className="address-suggestions"
          style={{
            position: 'fixed',
            top: coords.top,
            left: coords.left,
            width: coords.width,
          }}
        >
          {suggestions.map((f) => (
            <li key={f.properties.id} onClick={() => handleSelect(f)}>
              {f.properties.label}
            </li>
          ))}
        </ul>
      )}

      {outOfZoneMessage && <p className="address-out-of-zone">{outOfZoneMessage}</p>}
    </div>
  );
}