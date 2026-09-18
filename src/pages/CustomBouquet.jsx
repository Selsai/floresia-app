import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiChevronLeft, FiChevronRight, FiCheck, FiShoppingCart, FiPlus, FiMinus, FiX } from 'react-icons/fi';
import { flowersApi } from '../services/api';
import './CustomBouquet.css';

// ─── Données statiques (occasions et rubans ne viennent pas de la base) ──────

const OCCASIONS = [
  { id: 'birthday',  name: 'Anniversaire',  icon: '🎂' },
  { id: 'wedding',   name: 'Mariage',        icon: '💍' },
  { id: 'valentine', name: 'Saint-Valentin', icon: '💝' },
  { id: 'mother',    name: 'Fête des mères', icon: '👩' },
  { id: 'thanks',    name: 'Remerciement',   icon: '🙏' },
  { id: 'love',      name: 'Déclaration',    icon: '❤️' },
];

const RIBBONS = [
  { id: 'red',        name: 'Rouge',       color: '#DC143C' },
  { id: 'pink',       name: 'Rose',        color: '#FFB6C1' },
  { id: 'white',      name: 'Blanc',       color: '#FFFFFF' },
  { id: 'beige',      name: 'Beige',       color: '#D2B48C' },
  { id: 'gold',       name: 'Doré',        color: '#FFD700' },
  { id: 'blue',       name: 'Bleu',        color: '#4D96FF' },
  { id: 'khaki',      name: 'Vert kaki',   color: '#8A9A5B' },
  { id: 'multicolor', name: 'Multicolore', color: 'linear-gradient(90deg,#FF6B6B,#FFD93D,#6BCF7F,#4D96FF)' },
];

const STEPS = [
  { num: 1, label: 'Occasion'     },
  { num: 2, label: 'Fleurs'       },
  { num: 3, label: 'Compléments'  },
  { num: 4, label: 'Finalisation' },
];

function previewLayoutClass(count) {
  if (count === 1) return 'preview-layout-single';
  if (count <= 3)  return 'preview-layout-row';
  return 'preview-layout-grid';
}

// Transforme une fleur venant de l'API vers la forme utilisée par l'UI
// (nom affiché = famille + couleur, catégorie = famille pour les onglets)
function mapFlower(f) {
  return {
    id: f.id,
    name: f.name.trim().toLocaleLowerCase('fr-FR') === f.color.trim().toLocaleLowerCase('fr-FR')
      ? f.name
      : `${f.name} ${f.color}`,
    price: f.price,
    image: f.imageUrl,
    category: f.name,
    meaning: f.description,
  };
}

export default function CustomBouquet() {
  const navigate    = useNavigate();
  const { addToCart } = useCart();

  const [allFlowers, setAllFlowers] = useState([]);
  const [flowersLoading, setFlowersLoading] = useState(true);
  const [flowersError, setFlowersError] = useState('');

  const [currentStep,    setCurrentStep]    = useState(1);
  const [maxReachedStep, setMaxReachedStep] = useState(1);

  const [bouquetConfig, setBouquetConfig] = useState({
    occasion:        '',
    selectedFlowers: [],
    secondaryFlowers:[],
    ribbonColor:     '',
    message:         '',
  });

  useEffect(() => {
    flowersApi
      .list()
      .then(setAllFlowers)
      .catch((err) => setFlowersError(err.message))
      .finally(() => setFlowersLoading(false));
  }, []);

  const mainFlowersRaw      = useMemo(() => allFlowers.filter((f) => !f.isSecondary), [allFlowers]);
  const secondaryFlowersRaw = useMemo(() => allFlowers.filter((f) => f.isSecondary), [allFlowers]);

  const mainFlowers      = useMemo(() => mainFlowersRaw.map(mapFlower), [mainFlowersRaw]);
  const secondaryFlowers = useMemo(() => secondaryFlowersRaw.map(mapFlower), [secondaryFlowersRaw]);

  const FLOWERS_BY_CATEGORY = useMemo(
    () =>
      mainFlowers.reduce((acc, flower) => {
        if (!acc[flower.category]) acc[flower.category] = [];
        acc[flower.category].push(flower);
        return acc;
      }, {}),
    [mainFlowers],
  );

  // ── Dérivés ────────────────────────────────────────────────────────────────

  const calculatePrice = () => {
    let p = 0;
    bouquetConfig.selectedFlowers.forEach(f  => { p += f.price * f.quantity; });
    bouquetConfig.secondaryFlowers.forEach(id => {
      const sf = secondaryFlowers.find(f => f.id === id);
      if (sf) p += sf.price;
    });
    return p;
  };

  const getTotalStems    = () => bouquetConfig.selectedFlowers.reduce((t, f) => t + f.quantity, 0);
  const selectedRibbon   = RIBBONS.find(r => r.id === bouquetConfig.ribbonColor);

  // ── Gestion des fleurs ─────────────────────────────────────────────────────

  const addFlower = (flower) =>
    setBouquetConfig(prev => ({
      ...prev,
      selectedFlowers: prev.selectedFlowers.find(f => f.id === flower.id)
        ? prev.selectedFlowers.map(f => f.id === flower.id ? { ...f, quantity: f.quantity + 1 } : f)
        : [...prev.selectedFlowers, { ...flower, quantity: 1 }],
    }));

  const removeFlower = (id) =>
    setBouquetConfig(prev => ({
      ...prev,
      selectedFlowers: prev.selectedFlowers.filter(f => f.id !== id),
    }));

  const updateFlowerQuantity = (id, delta) =>
    setBouquetConfig(prev => ({
      ...prev,
      selectedFlowers: prev.selectedFlowers.map(f =>
        f.id === id ? { ...f, quantity: Math.max(1, f.quantity + delta) } : f
      ),
    }));

  // ── Navigation ─────────────────────────────────────────────────────────────

  const canProceedFromStep = (step) => {
    if (step === 1) return bouquetConfig.occasion !== '';
    if (step === 2) return bouquetConfig.selectedFlowers.length > 0;
    return true;
  };

  const handleNext = () => {
    if (currentStep < 4 && canProceedFromStep(currentStep)) {
      const next = currentStep + 1;
      setCurrentStep(next);
      setMaxReachedStep(prev => Math.max(prev, next));
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleStepClick = (num) => {
    if (num <= maxReachedStep) setCurrentStep(num);
  };

  // ── Panier ─────────────────────────────────────────────────────────────────

  const addBouquetToCart = () => {
    const occ = OCCASIONS.find(o => o.id === bouquetConfig.occasion);
    addToCart({
      id:       Date.now(),
      name:     `Bouquet Personnalisé — ${occ.name}`,
      price:    calculatePrice(),
      image:    bouquetConfig.selectedFlowers[0]?.image || '/assets/produit-1.png',
      category: 'Personnalisé',
      customConfig: { ...bouquetConfig, occasionName: occ.name, totalStems: getTotalStems() },
    });
    navigate('/panier');
  };

  // ── Rendu ──────────────────────────────────────────────────────────────────

  if (flowersLoading) {
    return (
      <div className="custom-bouquet">
        <div className="container"><p>Chargement des fleurs…</p></div>
      </div>
    );
  }

  if (flowersError) {
    return (
      <div className="custom-bouquet">
        <div className="container"><p className="auth-error">{flowersError}</p></div>
      </div>
    );
  }

  return (
    <div className="custom-bouquet">

      <div className="custom-header">
        <div className="container">
          <h1>Créez votre bouquet sur mesure</h1>
          <p>Composez un bouquet unique en combinant vos fleurs préférées</p>
        </div>
      </div>

      <div className="progress-section">
        <div className="container">
          <div className="progress-steps">
            {STEPS.map(step => {
              const isCompleted = currentStep > step.num;
              const isActive    = currentStep >= step.num;
              const isCurrent   = currentStep === step.num;
              const isClickable = step.num <= maxReachedStep;

              return (
                <button
                  key={step.num}
                  className={[
                    'progress-step',
                    isActive    ? 'active'    : '',
                    isCurrent   ? 'current'   : '',
                    !isClickable ? 'locked'   : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => handleStepClick(step.num)}
                  disabled={!isClickable}
                  title={!isClickable ? 'Complétez les étapes précédentes d\'abord' : step.label}
                >
                  <div className="step-number">
                    {isCompleted ? <FiCheck /> : step.num}
                  </div>
                  <span className="step-label">{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="custom-main">
        <div className="container">
          <div className="custom-layout">

            <div className="config-panel">

              {currentStep === 1 && (
                <div className="step-content">
                  <h2>Pour quelle occasion ?</h2>
                  <p className="step-subtitle">Sélectionnez l'événement que vous souhaitez célébrer</p>
                  <div className="options-grid occasions-grid">
                    {OCCASIONS.map(occ => (
                      <button
                        key={occ.id}
                        className={`option-card ${bouquetConfig.occasion === occ.id ? 'selected' : ''}`}
                        onClick={() => setBouquetConfig(prev => ({ ...prev, occasion: occ.id }))}
                      >
                        <span className="option-icon">{occ.icon}</span>
                        <span className="option-name">{occ.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <Step2Flowers
                  flowersByCategory={FLOWERS_BY_CATEGORY}
                  selectedFlowers={bouquetConfig.selectedFlowers}
                  onAdd={addFlower}
                  onRemove={removeFlower}
                  onUpdateQty={updateFlowerQuantity}
                />
              )}

              {currentStep === 3 && (
                <div className="step-content">
                  <h2>Ajoutez des touches florales</h2>
                  <p className="step-subtitle">Feuillages et fleurs secondaires (optionnel)</p>
                  {secondaryFlowers.length === 0 && (
                    <p>Aucun complément disponible pour le moment. Vous pouvez passer à l'étape suivante.</p>
                  )}
                  <div className="options-grid secondary-grid">
                    {secondaryFlowers.map(flower => (
                      <button
                        key={flower.id}
                        className={`option-card secondary-card ${bouquetConfig.secondaryFlowers.includes(flower.id) ? 'selected' : ''}`}
                        onClick={() =>
                          setBouquetConfig(prev => ({
                            ...prev,
                            secondaryFlowers: prev.secondaryFlowers.includes(flower.id)
                              ? prev.secondaryFlowers.filter(f => f !== flower.id)
                              : [...prev.secondaryFlowers, flower.id],
                          }))
                        }
                      >
                        <img src={flower.image} alt={flower.name} className="secondary-img" />
                        <div className="option-info">
                          <span className="option-name">{flower.name}</span>
                          <span className="option-price">+{flower.price.toFixed(2)} € / tige</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="step-content">
                  <h2>Derniers détails</h2>
                  <p className="step-subtitle">Personnalisez votre bouquet</p>

                  <div className="config-section">
                    <h3>Couleur du ruban</h3>
                    <div className="ribbon-options-new">
                      {RIBBONS.map(ribbon => (
                        <button
                          key={ribbon.id}
                          className={`ribbon-option-new ${bouquetConfig.ribbonColor === ribbon.id ? 'selected' : ''}`}
                          onClick={() => setBouquetConfig(prev => ({ ...prev, ribbonColor: ribbon.id }))}
                        >
                          <div
                            className="ribbon-colored"
                            style={ribbon.id === 'multicolor'
                              ? { background: ribbon.color }
                              : { backgroundColor: ribbon.color }}
                          />
                          <span>{ribbon.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="config-section">
                    <h3>Message personnalisé <span className="optional-label">(optionnel)</span></h3>
                    <textarea
                      placeholder="Ajoutez un message sur la carte accompagnant votre bouquet…"
                      value={bouquetConfig.message}
                      onChange={e => setBouquetConfig(prev => ({ ...prev, message: e.target.value }))}
                      maxLength={150}
                      rows={4}
                    />
                    <span className="char-count">{bouquetConfig.message.length} / 150</span>
                  </div>
                </div>
              )}

              <div className="step-navigation">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="btn-nav btn-previous"
                >
                  <FiChevronLeft /> Précédent
                </button>

                {currentStep < 4 ? (
                  <button
                    onClick={handleNext}
                    disabled={!canProceedFromStep(currentStep)}
                    className="btn-nav btn-next"
                  >
                    Suivant <FiChevronRight />
                  </button>
                ) : (
                  <button onClick={addBouquetToCart} className="btn-add-cart">
                    <FiShoppingCart /> Ajouter au panier — {calculatePrice().toFixed(2)} €
                  </button>
                )}
              </div>

            </div>

            <aside className="preview-panel">
              <div className="preview-sticky">
                <h3>Aperçu de votre bouquet</h3>

                <div className="bouquet-preview">
                  <div className="preview-visual">
                    {bouquetConfig.selectedFlowers.length > 0 ? (
                      <>
                        <div className={`preview-flowers-wrap ${previewLayoutClass(bouquetConfig.selectedFlowers.length)}`}>
                          {bouquetConfig.selectedFlowers.map((flower, i) => (
                            <img
                              key={i}
                              src={flower.image}
                              alt={flower.name}
                              className="preview-flower-small"
                              title={`${flower.quantity}× ${flower.name}`}
                            />
                          ))}
                        </div>

                        {bouquetConfig.ribbonColor && selectedRibbon && (
                          <div className="preview-ribbon-container">
                            <div
                              className="preview-ribbon-colored"
                              style={bouquetConfig.ribbonColor === 'multicolor'
                                ? { background: selectedRibbon.color }
                                : { backgroundColor: selectedRibbon.color }}
                            />
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="preview-placeholder">
                        <span>🌸</span>
                        <p>Votre bouquet apparaîtra ici</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bouquet-summary">
                  <h4>Votre composition</h4>
                  <ul>
                    {bouquetConfig.occasion && (
                      <li><strong>Occasion :</strong> {OCCASIONS.find(o => o.id === bouquetConfig.occasion)?.name}</li>
                    )}
                    {bouquetConfig.selectedFlowers.map((f, i) => (
                      <li key={i}><strong>{f.quantity}×</strong> {f.name}</li>
                    ))}
                    {bouquetConfig.selectedFlowers.length > 0 && (
                      <li className="total-stems"><strong>Total :</strong> {getTotalStems()} tiges</li>
                    )}
                    {bouquetConfig.secondaryFlowers.length > 0 && (
                      <li>
                        <strong>Compléments :</strong>{' '}
                        {bouquetConfig.secondaryFlowers.map(id => secondaryFlowers.find(f => f.id === id)?.name).join(', ')}
                      </li>
                    )}
                    {selectedRibbon && (
                      <li><strong>Ruban :</strong> {selectedRibbon.name}</li>
                    )}
                  </ul>
                </div>

                {bouquetConfig.selectedFlowers.length > 0 && (
                  <div className="preview-price">
                    <span>Prix total</span>
                    <strong>{calculatePrice().toFixed(2)} €</strong>
                  </div>
                )}
              </div>
            </aside>

          </div>
        </div>
      </div>

    </div>
  );
}

// ─── Sous-composant Step 2 : onglets par catégorie + liste scrollable ─────────

function Step2Flowers({ flowersByCategory, selectedFlowers, onAdd, onRemove, onUpdateQty }) {
  const categories     = Object.keys(flowersByCategory);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const flowers        = flowersByCategory[activeCategory] || [];

  return (
    <div className="step-content step2-flowers">
      <h2>Composez votre bouquet</h2>
      <p className="step-subtitle">Naviguez par famille de fleurs et ajustez les quantités</p>

      <div className="category-tabs" role="tablist">
        {categories.map(cat => {
          const qty = selectedFlowers
            .filter(f => f.category === cat)
            .reduce((t, f) => t + f.quantity, 0);

          return (
            <button
              key={cat}
              role="tab"
              aria-selected={cat === activeCategory}
              className={`category-tab ${cat === activeCategory ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
              {qty > 0 && <span className="tab-badge">{qty}</span>}
            </button>
          );
        })}
      </div>

      <div className="flowers-scroll-area" role="tabpanel">
        {flowers.map(flower => {
          const selected = selectedFlowers.find(f => f.id === flower.id);
          return (
            <div key={flower.id} className={`flower-item ${selected ? 'selected' : ''}`}>
              <img src={flower.image} alt={flower.name} className="flower-item-img" />
              <div className="flower-item-info">
                <h4>{flower.name}</h4>
                <p className="flower-meaning">{flower.meaning}</p>
                <span className="flower-price">{flower.price.toFixed(2)} € / tige</span>
              </div>
              {selected ? (
                <div className="quantity-controls">
                  <button aria-label="Diminuer"  onClick={() => onUpdateQty(flower.id, -1)}><FiMinus /></button>
                  <span>{selected.quantity}</span>
                  <button aria-label="Augmenter" onClick={() => onUpdateQty(flower.id,  1)}><FiPlus /></button>
                  <button aria-label="Retirer" className="btn-remove" onClick={() => onRemove(flower.id)}><FiX /></button>
                </div>
              ) : (
                <button className="btn-add-flower" onClick={() => onAdd(flower)}>
                  <FiPlus /> Ajouter
                </button>
              )}
            </div>
          );
        })}
      </div>

      {selectedFlowers.length > 0 && (
        <div className="selection-recap">
          <span className="recap-label">Ma sélection</span>
          <div className="recap-chips">
            {selectedFlowers.map((f, i) => (
              <span key={i} className="recap-chip">
                {f.quantity}× {f.name}
                <button onClick={() => onRemove(f.id)} aria-label={`Retirer ${f.name}`}>
                  <FiX />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
