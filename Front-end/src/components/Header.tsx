import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const userName = localStorage.getItem('name');
  const { setToken } = useAuth();

  useEffect(() => {
    // Check for user info in localStorage
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    if (token && name) {
      setUser({ name });
    } else {
      setUser(null);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    setUser(null);
    setToken(null);
    setDropdownOpen(false);
    navigate('/login');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-gray-900 bg-opacity-90 shadow-lg' : 'bg-transparent'}`} initial={{
      y: -100
    }} animate={{
      y: 0
    }} transition={{
      duration: 0.5
    }}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* ...existing logo and nav code... */}
        <motion.div
          className="flex items-center relative"
          initial="initial"
          animate="animate"
        >
          {/* Animated glowing ring behind logo */}
          <motion.span
            className="absolute left-0 top-0 w-12 h-12 rounded-full"
            style={{ zIndex: 0, boxShadow: "0 0 32px 8px #fb923c" }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut"
            }}
          />
          <motion.img
            src="https://img.icons8.com/fluency/48/dumbbell.png"
            alt="Fitness Guardian Logo"
            className="w-10 h-10 mr-2 drop-shadow relative z-10"
            whileHover={{ scale: 1.2, rotate: 12 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
          <motion.span
            className="text-2xl font-extrabold tracking-tight relative z-10"
            style={{ color: "#fb923c", textShadow: "0 0 0px #fb923c" }}
            animate={{
              color: ["#fb923c", "#fff", "#fb923c"],
              textShadow: [
                "0 0 0px #fb923c",
                "0 0 16px #fb923c, 0 0 32px #fff",
                "0 0 0px #fb923c"
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop"
            }}
          >
            FITNESS GUARDIAN
          </motion.span>
        </motion.div>
        <motion.nav className="hidden md:flex space-x-8" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 0.4
        }}>
          {['Home', 'Programs', 'Reasons', 'Plans', 'Testimonials'].map((item, index) => (
            <a key={item} href={`#${item.toLowerCase()}`} className={`font-medium hover:text-orange-500 transition-colors ${index === 0 ? 'text-orange-500' : 'text-white'}`}>
              {item}
            </a>
          ))}
        </motion.nav>
        <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 0.6
        }}>
         {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              className="bg-white text-gray-900 font-semibold px-4 py-2 rounded hover:bg-orange-500 hover:text-white transition-colors shadow-md"
              onClick={() => setDropdownOpen((open) => !open)}
            >
              {user.name}
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg z-50">
        <button
          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-100"
          onClick={() => {
            setDropdownOpen(false);
            navigate('/profile');
          }}
        >
          Profile
        </button>
        <button
          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-100"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
            )}
          </div>
          ) : (
            <Link to="/login">
              <button className="bg-white text-gray-900 font-semibold px-4 py-2 rounded hover:bg-orange-500 hover:text-white transition-colors shadow-md">
                Join Now
              </button>
            </Link>
          )}
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;