
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AlertTriangle, Bell, Menu, Search, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 py-4">
        <nav className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-resqlink-darkGreen font-semibold text-xl"
          >
            <AlertTriangle className="h-6 w-6 text-resqlink-orange animate-pulse-subtle" />
            <span className="relative">
              <span>ResQ</span>
              <span className="text-resqlink-green">Vision</span>
              <span className="absolute -top-1 -right-2 w-1.5 h-1.5 bg-resqlink-orange rounded-full animate-ping-subtle opacity-75"></span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`link-underline ${isActive('/') ? 'text-resqlink-green font-medium' : 'text-resqlink-darkGreen/80 hover:text-resqlink-darkGreen'}`}
            >
              Home
            </Link>
            <Link 
              to="/dashboard" 
              className={`link-underline ${isActive('/dashboard') ? 'text-resqlink-green font-medium' : 'text-resqlink-darkGreen/80 hover:text-resqlink-darkGreen'}`}
            >
              Dashboard
            </Link>
            {/* <Link 
              to="/insights" 
              className={`link-underline ${isActive('/insights') ? 'text-resqlink-green font-medium' : 'text-resqlink-darkGreen/80 hover:text-resqlink-darkGreen'}`}
            > */}
              {/* Insights
            </Link> */}
            <Link 
              to="/emergency" 
              className={`link-underline ${isActive('/emergency') ? 'text-resqlink-green font-medium' : 'text-resqlink-darkGreen/80 hover:text-resqlink-darkGreen'}`}
            >
              Emergency
            </Link>
          </div>

          {/* Action Icons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* <button className="p-2 rounded-full hover:bg-resqlink-beige/50 transition-colors">
              <Search className="h-5 w-5 text-resqlink-darkGreen/80" />
            </button>
            <button className="relative p-2 rounded-full hover:bg-resqlink-beige/50 transition-colors">
              <Bell className="h-5 w-5 text-resqlink-darkGreen/80" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-resqlink-orange rounded-full"></span>
            </button> */}
            
            <button  className="bg-resqlink-green hover:bg-resqlink-darkGreen text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-sm">
              <Link to="/Report">
              Report Incident
              </Link>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-resqlink-darkGreen" />
            ) : (
              <Menu className="h-6 w-6 text-resqlink-darkGreen" />
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pt-4 pb-6 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`py-2 ${isActive('/') ? 'text-resqlink-green font-medium' : 'text-resqlink-darkGreen/80'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/dashboard" 
                className={`py-2 ${isActive('/dashboard') ? 'text-resqlink-green font-medium' : 'text-resqlink-darkGreen/80'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/insights" 
                className={`py-2 ${isActive('/insights') ? 'text-resqlink-green font-medium' : 'text-resqlink-darkGreen/80'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Insights
              </Link>
              <Link 
                to="/emergency" 
                className={`py-2 ${isActive('/emergency') ? 'text-resqlink-green font-medium' : 'text-resqlink-darkGreen/80'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Emergency
              </Link>
              <button className="bg-resqlink-green hover:bg-resqlink-darkGreen text-white px-4 py-2 rounded-lg transition-colors mt-2 shadow-sm">
                Report Incident
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
