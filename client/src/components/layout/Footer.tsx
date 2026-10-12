import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ShieldAlert, Heart, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 border-t border-slate-800">
      {/* Safety Alert Strip */}
      <div className="bg-brand-900/60 border-b border-brand-800/60 py-3.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-brand-100">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-brand-300 shrink-0" />
            <span>
              <strong>Marketplace Safety Notice:</strong> Always meet in public places, never send wire transfers or prepaid cards, and inspect items in person.
            </span>
          </div>
          <Link
            to="/safety"
            className="text-white underline font-semibold hover:text-brand-200 shrink-0"
          >
            Read Scam Prevention Guide →
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-brand-600/25">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white group-hover:text-brand-300 transition-colors">
                Listly
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              A modern, intuitive, and secure community classifieds platform connecting local communities across India for housing, jobs, goods, services, gigs, and forums.
            </p>
            <div className="text-xs text-slate-500 pt-2">
              Clean typography • Zero clutter • Privacy respecting
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/category/jobs" className="hover:text-white transition-colors">
                  Jobs & Careers
                </Link>
              </li>
              <li>
                <Link to="/category/housing" className="hover:text-white transition-colors">
                  Housing & Rentals
                </Link>
              </li>
              <li>
                <Link to="/category/for-sale" className="hover:text-white transition-colors">
                  For Sale
                </Link>
              </li>
              <li>
                <Link to="/category/services" className="hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/category/gigs" className="hover:text-white transition-colors">
                  Gigs & Tasks
                </Link>
              </li>
              <li>
                <Link to="/forums" className="hover:text-white transition-colors">
                  Discussion Forums
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-brand-400 hover:text-brand-300 font-semibold">
                  Browse All 8 Categories →
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Safety */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Help & Safety
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/safety" className="hover:text-white transition-colors">
                  Safety Guidelines
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-white transition-colors">
                  Help Center & FAQ
                </Link>
              </li>
              <li>
                <Link to="/locations" className="hover:text-white transition-colors">
                  Change Location
                </Link>
              </li>
              <li>
                <Link to="/post" className="hover:text-white transition-colors">
                  Post an Ad
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Company */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Legal & About
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About the Project
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Listly Classifieds. Built for local communities.</p>
          <div className="flex items-center gap-6">
            <Link to="/terms" className="hover:text-slate-400">
              Terms
            </Link>
            <Link to="/privacy" className="hover:text-slate-400">
              Privacy
            </Link>
            <Link to="/safety" className="hover:text-slate-400">
              Scam Prevention
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
