import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiChevronLeft, FiChevronRight, FiCheck, FiShoppingCart, FiPlus, FiMinus, FiX } from 'react-icons/fi';
import './CustomBouquet.css';

// Import des fleurs
import roseRouge from '../assets/flowers/rose-red.png';
import roseRose from '../assets/flowers/rose-lilas.png';
import roseBlanche from '../assets/flowers/rose-white.png';
import roseJaune from '../assets/flowers/rose-yellow.png';
import roseSaumon from '../assets/flowers/rose-saumon.png';

import pivoineRose from '../assets/flowers/pivoine-rose.png';
import pivoineBlanche from '../assets/flowers/pivoine-white.png';
import pivoineOrange from '../assets/flowers/pivoine-orange.png';
import pivoineSaumon from '../assets/flowers/pivone-saumon.png';

import tulipeRose from '../assets/flowers/tulipe-pink.png';
import tulipeRouge from '../assets/flowers/tulipe-rouge.png';
import tulipeBlanche from '../assets/flowers/tulipe-blanche.png';
import tulipeJaune from '../assets/flowers/tulipe-jaune.png';
import tulipeFushia from '../assets/flowers/tulipe-fushia.png';
import tulipeLilas from '../assets/flowers/tulipe-lilas.png';
import tulipeSaumon from '../assets/flowers/tulipe-saumon.png';
import tulipeOrange from '../assets/flowers/tulipe-orange.png';

import lysPink from '../assets/flowers/lys-pink.png';
import lysWhite from '../assets/flowers/lys-white.png';

import renonculeRose from '../assets/flowers/renoncule-pink.png';
import renonculeRouge from '../assets/flowers/renoncule-red.png';
import renonculeSaumon from '../assets/flowers/renoncule-saumon.png';
import renonculeBlanche from '../assets/flowers/renoncule-white.png';

import dahliaPink from '../assets/flowers/dahlia-pink.png';
import dahliaJaune from '../assets/flowers/dahlia-jaune.png';
import dahliaFushia from '../assets/flowers/dahlia-fushia.png';
import dahliaSaumon from '../assets/flowers/dahlia-saumon.png';
import dahliaWhite from '../assets/flowers/dahlia-white.png';
import dahliaBlue from '../assets/flowers/dahlia-blue.png';

import margueriteOrange from '../assets/flowers/marguerite-orange.png';
import margueritePink from '../assets/flowers/marguerite-pink.png';
import margueriteWhite from '../assets/flowers/marguerite-white.png';

import hortensiaBlue from '../assets/flowers/hortensia-blue.png';
import hortensiaPink from '../assets/flowers/hortensia-pink.png';
import hortensiaPurple from '../assets/flowers/hortensia-purple.png';
import hortensiaWhite from '../assets/flowers/hortensia-white.png';

import oeillet from '../assets/flowers/oeillet-pink.png';
import oeilletBlue from '../assets/flowers/oeillet-blue.png';
import oeilletSaumon from '../assets/flowers/oeillet-saumon.png';
import oeilletWhite from '../assets/flowers/oeillet-white.png';

import gypsophileBlue from '../assets/flowers/gysophile-blue.png';
import gypsophilePink from '../assets/flowers/gysophile-pink.png';
import gypsophileWhite from '../assets/flowers/gysophile-white.png';
import gypsophileYellow from '../assets/flowers/gysophile-yellow.png';

import feuillageEucalyptus from '../assets/flowers/feuillage-eucalyptus.png';
import feuillageFougere from '../assets/flowers/feuillage-fougere.png';
import feuillageRuscus from '../assets/flowers/feuillage-ruscus.png';

import astilbePink from '../assets/flowers/astilbe-pink.png';
import astilbeRed from '../assets/flowers/astilbe-red.png';
import astilbeSaumon from '../assets/flowers/astilbe-saumon.png';

// ─── Données statiques (hors composant) ──────────────────────────────────────

const OCCASIONS = [
  { id: 'birthday',  name: 'Anniversaire',  icon: '🎂' },
  { id: 'wedding',   name: 'Mariage',        icon: '💍' },
  { id: 'valentine', name: 'Saint-Valentin', icon: '💝' },
  { id: 'mother',    name: 'Fête des mères', icon: '👩' },
  { id: 'thanks',    name: 'Remerciement',   icon: '🙏' },
  { id: 'love',      name: 'Déclaration',    icon: '❤️' },
];

const ALL_FLOWERS = [
  { id: 'rose-red',        name: 'Rose Rouge',        price: 3.50, image: roseRouge,        category: 'Rose',       meaning: 'Passion et amour ardent'  },
  { id: 'rose-pink',       name: 'Rose Rose',          price: 3.50, image: roseRose,         category: 'Rose',       meaning: 'Tendresse et admiration'  },
  { id: 'rose-white',      name: 'Rose Blanche',       price: 3.50, image: roseBlanche,      category: 'Rose',       meaning: 'Pureté et innocence'      },
  { id: 'rose-yellow',     name: 'Rose Jaune',         price: 3.50, image: roseJaune,        category: 'Rose',       meaning: 'Amitié et joie'           },
  { id: 'rose-salmon',     name: 'Rose Saumon',        price: 3.50, image: roseSaumon,       category: 'Rose',       meaning: 'Gratitude'                },
  { id: 'peony-pink',      name: 'Pivoine Rose',       price: 5.00, image: pivoineRose,      category: 'Pivoine',    meaning: 'Amour romantique'         },
  { id: 'peony-white',     name: 'Pivoine Blanche',    price: 5.00, image: pivoineBlanche,   category: 'Pivoine',    meaning: 'Honneur et sincérité'     },
  { id: 'peony-orange',    name: 'Pivoine Orange',     price: 5.00, image: pivoineOrange,    category: 'Pivoine',    meaning: 'Bonheur éclatant'         },
  { id: 'peony-salmon',    name: 'Pivoine Saumon',     price: 5.00, image: pivoineSaumon,    category: 'Pivoine',    meaning: 'Douceur'                  },
  { id: 'tulip-pink',      name: 'Tulipe Rose',        price: 2.50, image: tulipeRose,       category: 'Tulipe',     meaning: 'Affection'                },
  { id: 'tulip-red',       name: 'Tulipe Rouge',       price: 2.50, image: tulipeRouge,      category: 'Tulipe',     meaning: 'Amour véritable'          },
  { id: 'tulip-white',     name: 'Tulipe Blanche',     price: 2.50, image: tulipeBlanche,    category: 'Tulipe',     meaning: 'Pardon'                   },
  { id: 'tulip-yellow',    name: 'Tulipe Jaune',       price: 2.50, image: tulipeJaune,      category: 'Tulipe',     meaning: 'Joie'                     },
  { id: 'tulip-fushia',    name: 'Tulipe Fushia',      price: 2.50, image: tulipeFushia,     category: 'Tulipe',     meaning: 'Passion intense'          },
  { id: 'tulip-purple',    name: 'Tulipe Lilas',       price: 2.50, image: tulipeLilas,      category: 'Tulipe',     meaning: 'Royauté'                  },
  { id: 'tulip-salmon',    name: 'Tulipe Saumon',      price: 2.50, image: tulipeSaumon,     category: 'Tulipe',     meaning: 'Chaleur'                  },
  { id: 'tulip-orange',    name: 'Tulipe Orange',      price: 2.50, image: tulipeOrange,     category: 'Tulipe',     meaning: 'Énergie'                  },
  { id: 'lily-white',      name: 'Lys Blanc',          price: 4.00, image: lysWhite,         category: 'Lys',        meaning: 'Pureté divine'            },
  { id: 'lily-pink',       name: 'Lys Rose',           price: 4.00, image: lysPink,          category: 'Lys',        meaning: 'Prospérité'               },
  { id: 'renoncule-pink',  name: 'Renoncule Rose',     price: 3.00, image: renonculeRose,    category: 'Renoncule',  meaning: 'Charme'                   },
  { id: 'renoncule-red',   name: 'Renoncule Rouge',    price: 3.00, image: renonculeRouge,   category: 'Renoncule',  meaning: 'Attraction'               },
  { id: 'renoncule-white', name: 'Renoncule Blanche',  price: 3.00, image: renonculeBlanche, category: 'Renoncule',  meaning: 'Pureté'                   },
  { id: 'renoncule-salmon',name: 'Renoncule Saumon',   price: 3.00, image: renonculeSaumon,  category: 'Renoncule',  meaning: 'Tendresse'                },
  { id: 'dahlia-pink',     name: 'Dahlia Rose',        price: 4.50, image: dahliaPink,       category: 'Dahlia',     meaning: 'Élégance'                 },
  { id: 'dahlia-yellow',   name: 'Dahlia Jaune',       price: 4.50, image: dahliaJaune,      category: 'Dahlia',     meaning: 'Joie pure'                },
  { id: 'dahlia-fushia',   name: 'Dahlia Fushia',      price: 4.50, image: dahliaFushia,     category: 'Dahlia',     meaning: 'Vitalité'                 },
  { id: 'dahlia-salmon',   name: 'Dahlia Saumon',      price: 4.50, image: dahliaSaumon,     category: 'Dahlia',     meaning: 'Raffinement'              },
  { id: 'dahlia-white',    name: 'Dahlia Blanc',       price: 4.50, image: dahliaWhite,      category: 'Dahlia',     meaning: 'Dignité'                  },
  { id: 'dahlia-blue',     name: 'Dahlia Bleu',        price: 4.50, image: dahliaBlue,       category: 'Dahlia',     meaning: 'Sérénité'                 },
  { id: 'marguerite-white',name: 'Marguerite Blanche', price: 2.00, image: margueriteWhite,  category: 'Marguerite', meaning: 'Innocence'                },
  { id: 'marguerite-pink', name: 'Marguerite Rose',    price: 2.00, image: margueritePink,   category: 'Marguerite', meaning: 'Gaieté'                   },
  { id: 'marguerite-orange',name:'Marguerite Orange',  price: 2.00, image: margueriteOrange, category: 'Marguerite', meaning: 'Enthousiasme'             },
  { id: 'hortensia-blue',  name: 'Hortensia Bleu',     price: 5.50, image: hortensiaBlue,    category: 'Hortensia',  meaning: 'Sincérité'                },
  { id: 'hortensia-pink',  name: 'Hortensia Rose',     price: 5.50, image: hortensiaPink,    category: 'Hortensia',  meaning: 'Romance'                  },
  { id: 'hortensia-purple',name: 'Hortensia Violet',   price: 5.50, image: hortensiaPurple,  category: 'Hortensia',  meaning: 'Profondeur'               },
  { id: 'hortensia-white', name: 'Hortensia Blanc',    price: 5.50, image: hortensiaWhite,   category: 'Hortensia',  meaning: 'Grâce'                    },
  { id: 'oeillet-pink',    name: 'Œillet Rose',        price: 2.50, image: oeillet,          category: 'Œillet',     meaning: 'Gratitude'                },
  { id: 'oeillet-blue',    name: 'Œillet Bleu',        price: 2.50, image: oeilletBlue,      category: 'Œillet',     meaning: 'Fidélité'                 },
  { id: 'oeillet-salmon',  name: 'Œillet Saumon',      price: 2.50, image: oeilletSaumon,    category: 'Œillet',     meaning: 'Admiration'               },
  { id: 'oeillet-white',   name: 'Œillet Blanc',       price: 2.50, image: oeilletWhite,     category: 'Œillet',     meaning: 'Amour pur'                },
];

const SECONDARY_FLOWERS = [
  { id: 'eucalyptus',       name: 'Eucalyptus',        price: 2.00, image: feuillageEucalyptus },
  { id: 'gypsophile-white', name: 'Gypsophile Blanc',  price: 1.50, image: gypsophileWhite     },
  { id: 'gypsophile-pink',  name: 'Gypsophile Rose',   price: 1.50, image: gypsophilePink      },
  { id: 'gypsophile-blue',  name: 'Gypsophile Bleu',   price: 1.50, image: gypsophileBlue      },
  { id: 'gypsophile-yellow',name: 'Gypsophile Jaune',  price: 1.50, image: gypsophileYellow    },
  { id: 'fougere',          name: 'Fougère',           price: 1.80, image: feuillageFougere    },
  { id: 'ruscus',           name: 'Ruscus',            price: 2.20, image: feuillageRuscus     },
  { id: 'astilbe-pink',     name: 'Astilbe Rose',      price: 2.50, image: astilbePink         },
  { id: 'astilbe-red',      name: 'Astilbe Rouge',     price: 2.50, image: astilbeRed          },
  { id: 'astilbe-salmon',   name: 'Astilbe Saumon',    price: 2.50, image: astilbeSaumon       },
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

// Fleurs regroupées par catégorie — calculé une seule fois au chargement du module
const FLOWERS_BY_CATEGORY = ALL_FLOWERS.reduce((acc, flower) => {
  if (!acc[flower.category]) acc[flower.category] = [];
  acc[flower.category].push(flower);
  return acc;
}, {});

const STEPS = [
  { num: 1, label: 'Occasion'     },
  { num: 2, label: 'Fleurs'       },
  { num: 3, label: 'Compléments'  },
  { num: 4, label: 'Finalisation' },
];

// ─── Helper : classe CSS de layout selon le nombre de fleurs dans l'aperçu ───
function previewLayoutClass(count) {
  if (count === 1) return 'preview-layout-single';
  if (count <= 3)  return 'preview-layout-row';
  return 'preview-layout-grid';
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function CustomBouquet() {
  const navigate    = useNavigate();
  const { addToCart } = useCart();

  const [currentStep,    setCurrentStep]    = useState(1);
  // maxReachedStep : empêche de sauter en avant via la barre de progression
  const [maxReachedStep, setMaxReachedStep] = useState(1);

  const [bouquetConfig, setBouquetConfig] = useState({
    occasion:        '',
    selectedFlowers: [],   // { ...flower, quantity }
    secondaryFlowers:[],   // string[] d'IDs
    ribbonColor:     '',   // '' = pas encore choisi → ruban invisible
    message:         '',
  });

  // ── Dérivés ────────────────────────────────────────────────────────────────

  const calculatePrice = () => {
    let p = 0;
    bouquetConfig.selectedFlowers.forEach(f  => { p += f.price * f.quantity; });
    bouquetConfig.secondaryFlowers.forEach(id => {
      const sf = SECONDARY_FLOWERS.find(f => f.id === id);
      if (sf) p += sf.price * 5;
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

  // Clic sur la barre de progression : retour libre, avance bloquée
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

  return (
    <div className="custom-bouquet">

      {/* HEADER */}
      <div className="custom-header">
        <div className="container">
          <h1>Créez votre bouquet sur mesure</h1>
          <p>Composez un bouquet unique en combinant vos fleurs préférées</p>
        </div>
      </div>

      {/* BARRE DE PROGRESSION */}
      <div className="progress-section">
        <div className="container">
          <div className="progress-steps">
            {STEPS.map(step => {
              const isCompleted = currentStep > step.num;
              const isActive    = currentStep >= step.num;
              const isCurrent   = currentStep === step.num;
              const isClickable = step.num <= maxReachedStep; // retour = OK, avance = bloqué

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

      {/* CONTENU PRINCIPAL */}
      <div className="custom-main">
        <div className="container">
          <div className="custom-layout">

            {/* PANNEAU GAUCHE */}
            <div className="config-panel">

              {/* ÉTAPE 1 — Occasion */}
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

              {/* ÉTAPE 2 — Sélection des fleurs (onglets + scroll) */}
              {currentStep === 2 && (
                <Step2Flowers
                  flowersByCategory={FLOWERS_BY_CATEGORY}
                  selectedFlowers={bouquetConfig.selectedFlowers}
                  onAdd={addFlower}
                  onRemove={removeFlower}
                  onUpdateQty={updateFlowerQuantity}
                />
              )}

              {/* ÉTAPE 3 — Compléments */}
              {currentStep === 3 && (
                <div className="step-content">
                  <h2>Ajoutez des touches florales</h2>
                  <p className="step-subtitle">Feuillages et fleurs secondaires (optionnel)</p>
                  <div className="options-grid secondary-grid">
                    {SECONDARY_FLOWERS.map(flower => (
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
                          <span className="option-price">+{flower.price.toFixed(2)} €</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ÉTAPE 4 — Finalisation */}
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

              {/* NAVIGATION */}
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

            {/* PANNEAU DROIT — APERÇU */}
            <aside className="preview-panel">
              <div className="preview-sticky">
                <h3>Aperçu de votre bouquet</h3>

                <div className="bouquet-preview">
                  <div className="preview-visual">
                    {bouquetConfig.selectedFlowers.length > 0 ? (
                      <>
                        {/*
                          FIX positionnement :
                          - 1 fleur  → centrée seule
                          - 2–3      → rangée centrée horizontalement
                          - 4+       → grille auto-fill équilibrée
                        */}
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

                        {/* Ruban — uniquement si sélectionné */}
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

                {/* RÉSUMÉ */}
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
                        {bouquetConfig.secondaryFlowers.map(id => SECONDARY_FLOWERS.find(f => f.id === id)?.name).join(', ')}
                      </li>
                    )}
                    {selectedRibbon && (
                      <li><strong>Ruban :</strong> {selectedRibbon.name}</li>
                    )}
                  </ul>
                </div>

                {/* PRIX */}
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

      {/* ── ONGLETS CATÉGORIES ── */}
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

      {/* ── LISTE SCROLLABLE ── */}
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

      {/* ── RÉCAP CHIPS sélection courante ── */}
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