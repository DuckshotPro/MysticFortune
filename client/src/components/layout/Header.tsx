import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faBars, faCrown, faTrophy, faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user_data');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_data');
    setUser(null);
    window.location.reload();
  };
  
  return (
    <header className="bg-gradient-to-r from-purple-950 to-purple-900 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <FontAwesomeIcon 
              icon={faMoon} 
              className="text-amber-500 text-2xl mr-2 filter drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]" 
            />
            <h1 className="font-['Cinzel'] text-xl sm:text-2xl md:text-3xl text-amber-500">Mystic Fortune</h1>
          </div>
        </Link>
        
        <nav className="hidden md:block">
          <ul className="flex items-center space-x-6">
            <li>
              <a href="#fortune-teller" className="font-['Cinzel'] text-sm hover:text-amber-500 transition-colors">Fortune Teller</a>
            </li>
            <li>
              <a href="#daily-horoscope" className="font-['Cinzel'] text-sm hover:text-amber-500 transition-colors">Daily Horoscope</a>
            </li>
            <li>
              <a href="#favorites" className="font-['Cinzel'] text-sm hover:text-amber-500 transition-colors">My Fortunes</a>
            </li>
            <li>
              <Link href="/achievements" className="font-['Cinzel'] text-sm hover:text-amber-500 transition-colors flex items-center">
                <FontAwesomeIcon icon={faTrophy} className="mr-1 text-xs" /> Achievements
              </Link>
            </li>
            <li>
              <Link href="/premium" className="flex items-center font-['Cinzel'] text-sm bg-gradient-to-r from-amber-500 to-amber-600 text-purple-950 px-3 py-1 rounded-full hover:from-amber-400 hover:to-amber-500 transition-colors">
                <FontAwesomeIcon icon={faCrown} className="mr-1 text-xs" /> Premium
              </Link>
            </li>
            {user ? (
              <li className="flex items-center space-x-2">
                <span className="font-['Cinzel'] text-sm text-amber-400">
                  Welcome, {user.firstName || user.username}
                </span>
                <button 
                  onClick={handleLogout}
                  className="font-['Cinzel'] text-sm hover:text-amber-500 transition-colors"
                  title="Logout"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </button>
              </li>
            ) : (
              <li>
                <Link href="/login" className="flex items-center font-['Cinzel'] text-sm border border-amber-500 text-amber-500 px-3 py-1 rounded-full hover:bg-amber-500 hover:text-purple-950 transition-colors">
                  <FontAwesomeIcon icon={faUser} className="mr-1 text-xs" /> Login
                </Link>
              </li>
            )}
          </ul>
        </nav>
        
        <button 
          className="text-white md:hidden" 
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <FontAwesomeIcon icon={faBars} className="text-xl" />
        </button>
      </div>
      
      {/* Mobile Navigation Menu */}
      <motion.div 
        id="mobile-menu" 
        className={`md:hidden bg-purple-950 ${isMobileMenuOpen ? 'block' : 'hidden'}`}
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isMobileMenuOpen ? 'auto' : 0,
          opacity: isMobileMenuOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        <ul className="px-4 py-2 space-y-3">
          <li>
            <a 
              href="#fortune-teller" 
              className="block py-2 font-['Cinzel'] hover:text-amber-500 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Fortune Teller
            </a>
          </li>
          <li>
            <a 
              href="#daily-horoscope" 
              className="block py-2 font-['Cinzel'] hover:text-amber-500 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Daily Horoscope
            </a>
          </li>
          <li>
            <a 
              href="#favorites" 
              className="block py-2 font-['Cinzel'] hover:text-amber-500 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              My Fortunes
            </a>
          </li>
          <li>
            <Link 
              href="/achievements" 
              className="flex items-center py-2 font-['Cinzel'] hover:text-amber-500 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FontAwesomeIcon icon={faTrophy} className="mr-2 text-xs" /> Achievements
            </Link>
          </li>
          <li className="pt-2 border-t border-purple-800 mt-2">
            <Link 
              href="/premium" 
              className="flex items-center justify-center py-2 font-['Cinzel'] bg-gradient-to-r from-amber-500 to-amber-600 text-purple-950 rounded-md hover:from-amber-400 hover:to-amber-500 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FontAwesomeIcon icon={faCrown} className="mr-2" /> Go Premium
            </Link>
          </li>
        </ul>
      </motion.div>
    </header>
  );
}
