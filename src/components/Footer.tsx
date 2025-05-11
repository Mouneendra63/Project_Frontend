import { Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-teal-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <p className="flex items-center"><Phone className="h-5 w-5 mr-2" /> +91 90357 21357</p>
          <p className="flex items-center"><Mail className="h-5 w-5 mr-2" /> doctorekaveera@gmail.com</p>
          <p className="flex items-center"><MapPin className="h-5 w-5 mr-2" /> 123 Healing Street, City</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-teal-300">Home</Link></li>
            <li><Link to="/about" className="hover:text-teal-300">About</Link></li>
            <li><Link to="/reviews" className="hover:text-teal-300">Reviews</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Working Hours</h3>
          <ul className="space-y-2">
            <li>Monday - Friday: 9:00 AM - 6:00 PM</li>
            <li>Saturday: 9:00 AM - 2:00 PM</li>
            <li>Sunday: Closed</li>
          </ul>
        </div>
      </div>
      <div className="text-center py-4 border-t border-teal-800">
        &copy; 2024 HealingHands. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;