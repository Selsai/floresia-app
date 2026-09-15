import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ConfirmProvider } from './context/ConfirmContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Shop from './pages/Shop';
import Blog from './pages/Blog';
import BlogArticle from './pages/BlogArticle';
import Community from './pages/Community';
import Account from './pages/Account';
import CustomBouquet from './pages/CustomBouquet';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import OrderSuccess from './pages/OrderSuccess';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <ConfirmProvider>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <BrowserRouter basename={import.meta.env.BASE_URL}>
              <Navbar />

              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/boutique" element={<Shop />} />
                  <Route path="/produit/:id" element={<ProductDetail />} />
                  <Route path="/panier" element={<Cart />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:id" element={<BlogArticle />} />
                  <Route path="/communaute" element={<Community />} />
                  <Route path="/compte" element={<Account />} />
                  <Route
                    path="/personnaliser"
                    element={<CustomBouquet />}
                  />
                  <Route
                    path="/commande/succes"
                    element={<OrderSuccess />}
                  />
                  <Route
                    path="/mot-de-passe-oublie"
                    element={<ForgotPassword />}
                  />
                  <Route
                    path="/reinitialiser-mot-de-passe"
                    element={<ResetPassword />}
                  />
                  <Route
                    path="/verification-email"
                    element={<VerifyEmail />}
                  />
                  <Route
                    path="/admin"
                    element={<AdminDashboard />}
                  />
                </Routes>
              </main>

              <Footer />
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </ConfirmProvider>
  );
}
