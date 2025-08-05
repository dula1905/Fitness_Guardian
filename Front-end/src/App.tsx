import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import ProgramsSection from './components/ProgramsSection';
import WhyChooseUs from './components/WhyChooseUs';
import PricingSection from './components/PricingSection';
import TestimonialsSection from './components/TestimonialsSection';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import ApiService from './services/ApiService';
import ExerciseInterface from './components/exercise/ExerciseInterface';
import Login from './components/login';
import ExMain from './components/ExMain';
import Profile from './components/Profile';

const GetStartedPage: React.FC = () => (
  <div className="p-10 text-center text-2xl text-orange-500">
    Welcome to the Get Started Page!
  </div>
);

// Helper to conditionally render header/footer
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const hideHeaderFooter = location.pathname === '/login';
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white">
      {!hideHeaderFooter && <Header />}
      {children}
      {!hideHeaderFooter && <Footer />}
    </div>
  );
};

export function App() {
  const [stats, setStats] = useState({
    coaches: 140,
    members: 978,
    programs: 50
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await ApiService.getStats();
        if (response) {
          setStats(response);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero stats={stats} />
                <ProgramsSection />
                <ExMain />
                <WhyChooseUs />
                <PricingSection />
                <TestimonialsSection />
                <Newsletter />
                
                
              </>
            }
          />
          <Route path="/get-started" element={<GetStartedPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Exercises" element={<ExerciseInterface />} />
          <Route path='/Profile' element={<Profile />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}