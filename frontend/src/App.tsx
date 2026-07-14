import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AnnouncementBar from './components/AnnouncementBar';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import PrivacyPolicy from './pages/policies/PrivacyPolicy';
import Terms from './pages/policies/Terms';
import Returns from './pages/policies/Returns';
import Delivery from './pages/policies/Delivery';
import Tracking from './pages/policies/Tracking';
import Cookies from './pages/policies/Cookies';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQs from './pages/FAQs';
import Account from './pages/Account';
import { CartProvider } from './contexts/CartContext';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isCheckout = location.pathname === '/checkout';

  return (
    <div className="app-layout">
      {!isCheckout && <AnnouncementBar />}
      {!isCheckout && <Header />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:categorySlug" element={<Shop />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/success" element={<Success />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQs />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/tracking" element={<Tracking />} />
        <Route path="/account" element={<Account />} />
      </Routes>

      {!isCheckout && <Footer />}
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  )
}

export default App
