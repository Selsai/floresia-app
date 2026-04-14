import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
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

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
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
              <Route path="/personnaliser" element={<CustomBouquet />} />
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
