import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b-4 border-teal-600 text-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Heart className="h-8 w-8 text-teal-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">Ekaveera Homeo</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-teal-600 px-3 py-2">Home</Link>
            <Link to="/about" className="text-gray-700 hover:text-teal-600 px-3 py-2">About</Link>
            <Link to="/reviews" className="text-gray-700 hover:text-teal-600 px-3 py-2">Reviews</Link>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 hover:text-teal-600 p-2">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden px-4 pt-2 pb-4">
          <Link to="/" className="block text-gray-700 hover:text-teal-600 py-2">Home</Link>
          <Link to="/about" className="block text-gray-700 hover:text-teal-600 py-2">About</Link>
          <Link to="/reviews" className="block text-gray-700 hover:text-teal-600 py-2">Reviews</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;