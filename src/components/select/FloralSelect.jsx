// Rôle : Composant réutilisable de l’interface.
// FloralSelect : choix des options florales.
import { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import './FloralSelect.css';

export default function FloralSelect({ value, options, onChange, label }) {
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  const button = useRef(null);
  const listId = useId();
  const selected = options.find((option) => option.value === value) || options[0];

  useEffect(() => {
    if (!open) return undefined;
    const closeOutside = (event) => { if (!root.current?.contains(event.target)) setOpen(false); };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, [open]);

  const choose = (option) => {
    // Valide une option et ferme la liste.
    onChange(option.value);
    setOpen(false);
    button.current?.focus();
  };

  const handleKeyDown = (event) => {
    // Rend la liste utilisable au clavier.
    if (event.key === 'Escape') { setOpen(false); button.current?.focus(); }
    if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        requestAnimationFrame(() => root.current?.querySelector('[aria-selected="true"]')?.focus());
      } else {
        const items = [...root.current.querySelectorAll('[role="option"]')];
        const current = items.indexOf(document.activeElement);
        items[(current + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length]?.focus();
      }
    }
    if (open && event.key === 'Tab') setOpen(false);
  };

  return (
    <div className={`floral-select ${open ? 'is-open' : ''}`} ref={root} onKeyDown={handleKeyDown}>
      <button ref={button} type="button" className="floral-select__trigger" aria-label={label} aria-haspopup="listbox" aria-expanded={open} aria-controls={listId} onClick={() => setOpen(!open)}>
        <span>{selected?.label}</span><ChevronDown size={17} aria-hidden="true" />
      </button>
      {open && <div id={listId} className="floral-select__options" role="listbox" aria-label={label}>
        {options.map((option) => <button key={option.value} type="button" role="option" aria-selected={option.value === value} className="floral-select__option" onClick={() => choose(option)}>
          <span>{option.label}</span>{option.value === value && <Check size={16} aria-hidden="true" />}
        </button>)}
      </div>}
    </div>
  );
}
