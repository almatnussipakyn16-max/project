import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-white text-xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
              FoodDelivery
            </h3>
            <p className="text-gray-400 mb-4">
              Your favorite food delivered fast to your doorstep. Order from the best restaurants in town!
            </p>
            <div className="flex space-x-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition"
              >
                <FaFacebookF className="text-lg" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition"
              >
                <FaTwitter className="text-lg" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition"
              >
                <FaInstagram className="text-lg" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition"
              >
                <FaLinkedinIn className="text-lg" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/restaurants" className="hover:text-orange-500 transition">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-orange-500 transition">
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/reservations" className="hover:text-orange-500 transition">
                  Reservations
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-orange-500 transition">
                  My Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-orange-500 transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500 transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500 transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500 transition">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <FiMapPin className="text-orange-500 mt-1" />
                <span className="text-gray-400">123 Food Street, NY</span>
              </li>
              <li className="flex items-center gap-2">
                <FiPhone className="text-orange-500" />
                <a href="tel:+1234567890" className="text-gray-400 hover:text-orange-500 transition">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FiMail className="text-orange-500" />
                <a href="mailto:support@fooddelivery.com" className="text-gray-400 hover:text-orange-500 transition">
                  support@fooddelivery.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 text-center text-gray-500">
          <p>&copy; {currentYear} FoodDelivery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
