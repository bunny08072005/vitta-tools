import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import CalculatorPage from './pages/CalculatorPage';
import VittaAI from './ai/VittaAI';
import InsuranceAdvisor from './insurance/InsuranceAdvisor';
import Contact from './components/Contact';
import './App.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function ContactPage() {
  return (
    <div style={{ paddingTop: 'var(--nav-height)' }}>
      <Contact />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ai-advisor" element={<VittaAI />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/calculator/:slug" element={<CalculatorPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/insurance" element={<InsuranceAdvisor />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
