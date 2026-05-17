import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, MessageCircle } from 'lucide-react';
import { NAV_ITEMS, CONTACT_INFO } from '../constants';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-950 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo & About */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-primary-900 font-display font-bold text-xl">Y</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg leading-tight text-white">YSK POULTRY</span>
                <span className="text-[10px] uppercase tracking-widest font-semibold text-primary-400">Farm & Supply</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium broiler production and frozen chicken supply in Ibadan. Committed to hygiene, health, and commercial excellence since 2023.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-9 h-9 rounded-full bg-primary-900 flex items-center justify-center hover:bg-primary-700 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-primary-900 flex items-center justify-center hover:bg-primary-700 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-primary-900 flex items-center justify-center hover:bg-primary-700 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-4">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-gray-400 hover:text-accent-400 transition-colors text-sm inline-flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-700 mr-2 group-hover:bg-accent-500 transition-colors" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display font-bold text-lg mb-6">Our Services</h3>
            <ul className="space-y-4">
              {['Broiler Production', 'Frozen Chicken Supply', 'Brooding Services', 'Bulk Poultry Supply'].map((service) => (
                <li key={service}>
                  <Link
                    to="/services"
                    className="text-gray-400 hover:text-accent-400 transition-colors text-sm"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display font-bold text-lg mb-6">Contact Details</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-sm text-gray-400">
                <MapPin className="w-5 h-5 text-accent-500 shrink-0" />
                <span>{CONTACT_INFO.address}</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-gray-400">
                <Phone className="w-5 h-5 text-accent-500 shrink-0" />
                <a href={`tel:${CONTACT_INFO.phone}`} className="hover:text-accent-400 transition-colors">
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li className="flex items-center space-x-3 text-sm text-gray-400">
                <MessageCircle className="w-5 h-5 text-accent-500 shrink-0" />
                <a href={`https://wa.me/${CONTACT_INFO.whatsapp}`} className="hover:text-accent-400 transition-colors">
                  WhatsApp Us
                </a>
              </li>
              <li className="flex items-center space-x-3 text-sm text-gray-400">
                <Mail className="w-5 h-5 text-accent-500 shrink-0" />
                <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-accent-400 transition-colors">
                  {CONTACT_INFO.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-primary-900 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest gap-4">
          <p>© {new Date().getFullYear()} YSK Poultry Farm • Road 5, Lamona, Oluhunda Akobo Ibadan</p>
          <div className="flex gap-6">
            <span className="hover:text-white transition-colors cursor-pointer">FB: yskpoultry</span>
            <span className="hover:text-white transition-colors cursor-pointer">IG: @yskfarm_ibadan</span>
            <span className="text-accent-400">Call: {CONTACT_INFO.phone}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
