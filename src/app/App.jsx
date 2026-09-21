// App : navigation et fournisseurs globaux.
import { lazy, Suspense, useLayoutEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from '../context/cart/CartContext';
import { AuthProvider } from '../context/auth/AuthContext';
import { ToastProvider } from '../context/toast/ToastContext';
import { ConfirmProvider } from '../context/confirm/ConfirmContext';

import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import PageMeta from '../components/meta/PageMeta';
import NotFound from '../pages/not-found/NotFound';

import Home from '../pages/home/Home';
import ChatWidget from '../components/chat/ChatWidget';
import '../components/loading/RouteLoading.css';

const Shop = lazy(() => import('../pages/shop/Shop'));
const Blog = lazy(() => import('../pages/blog/Blog'));
const BlogArticle = lazy(() => import('../pages/blog/BlogArticle'));
const Community = lazy(() => import('../pages/community/Community'));
const Account = lazy(() => import('../pages/account/Account'));
const CustomBouquet = lazy(() => import('../pages/custom-bouquet/CustomBouquet'));
const ProductDetail = lazy(() => import('../pages/product/ProductDetail'));
const Cart = lazy(() => import('../pages/cart/Cart'));
const OrderSuccess = lazy(() => import('../pages/orders/OrderSuccess'));
const OrderCancelled = lazy(() => import('../pages/orders/OrderCancelled'));
const ForgotPassword = lazy(() => import('../pages/account/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/account/ResetPassword'));
const VerifyEmail = lazy(() => import('../pages/account/VerifyEmail'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const loadInformationPages = () => import('../pages/information/InformationPages');
const ContactPage = lazy(() => loadInformationPages().then((module) => ({ default: module.ContactPage })));
const LegalNoticePage = lazy(() => loadInformationPages().then((module) => ({ default: module.LegalNoticePage })));
const ConditionsPage = lazy(() => loadInformationPages().then((module) => ({ default: module.ConditionsPage })));
const PrivacyPage = lazy(() => loadInformationPages().then((module) => ({ default: module.PrivacyPage })));
const CookiesPage = lazy(() => loadInformationPages().then((module) => ({ default: module.CookiesPage })));

function RouteLoading() {
  return <div className="route-loading" role="status" aria-label="Chargement de la page"><div className="route-loading__mark" /><div className="route-loading__line" /><div className="route-loading__line route-loading__line--short" /><span className="visually-hidden">Chargement de la page</span></div>;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  // A new page always starts at its heading, including browser history navigation.
  useLayoutEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}


export default function App() {
  return (
    <ConfirmProvider>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <BrowserRouter basename={import.meta.env.BASE_URL}>
              <ScrollToTop />
              <PageMeta />
              <Navbar />
              <ChatWidget /> {/* Le widget est chargé une fois et reste actif sur toutes les pages */}
              <main>
                <Suspense fallback={<RouteLoading />}><Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/boutique" element={<Shop />} />
                  <Route path="/produit/:id" element={<ProductDetail />} />
                  <Route path="/panier" element={<Cart />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:id" element={<BlogArticle />} />
                  <Route path="/communaute" element={<Community />} />
                  <Route path="/compte" element={<Account />} />
                  <Route path="/personnaliser" element={<CustomBouquet />} />
                  <Route path="/commande/succes" element={<OrderSuccess />} />
                  <Route path="/commande/annulee" element={<OrderCancelled />} />
                  <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
                  <Route path="/reinitialiser-mot-de-passe" element={<ResetPassword />} />
                  <Route path="/verification-email" element={<VerifyEmail />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/mentions-legales" element={<LegalNoticePage />} />
                  <Route path="/cgv" element={<ConditionsPage />} />
                  <Route path="/confidentialite" element={<PrivacyPage />} />
                  <Route path="/rgpd" element={<PrivacyPage />} />
                  <Route path="/cookies" element={<CookiesPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes></Suspense>
              </main>

              <Footer />
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </ConfirmProvider>
  );
}
