import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, Shield, Users, Heart, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-md">
          <Compass className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Reimagining the Local Classifieds
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Craigslist has connected neighborhood communities for decades. Our goal is to preserve its independent, egalitarian spirit while fixing 30 years of usability hurdles.
        </p>
      </div>

      {/* Core Improvements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Modern Ergonomics</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Eliminated dense endless walls of plain blue hyperlinks. Replaced with clear visual hierarchy, accessible color contrast, and intuitive card navigation.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Safety & Transparency</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            In-app buyer/seller messaging protects your personal email and telephone number. Dedicated listing flags and clear scam checklists keep communities safe.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Community First</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            No algorithmic rage feeds, no intrusive surveillance ads, and no corporate monopolies. Just local people trading, renting, hiring, and sharing.
          </p>
        </div>
      </div>

      {/* Story Narrative */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-sm space-y-6 text-slate-700 leading-relaxed text-sm">
        <h2 className="text-xl font-bold text-slate-900">Why Redesign Craigslist?</h2>
        <p>
          Founded in the mid-1990s as a friendly email list, Craigslist proved that classifieds didn't need glossy paywalls to serve neighborhoods. However, the modern web has evolved. Users on smartphones struggle with non-responsive menus; buyers cannot reliably filter listings without hitting empty states; and location discovery required scanning hundreds of unstructured text lines.
        </p>
        <p>
          This full-stack redesign addresses those problems from the ground up:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Guided 6-Step Posting:</strong> Replacing confusing radio buttons with clear category selection, photo previews, and review screens.</li>
          <li><strong>Real Database Search:</strong> Parameterized filtering by price ranges, conditions, keywords, and geographic regions.</li>
          <li><strong>Private Messaging:</strong> Direct, asynchronous conversation threads without exposing user phone numbers.</li>
          <li><strong>Accessibility & Responsive Design:</strong> Full keyboard navigation, semantic HTML, and mobile-friendly touch targets.</li>
        </ul>
      </div>

      {/* CTA Strip */}
      <div className="text-center pt-4">
        <Link to="/categories">
          <Button variant="primary" size="lg">
            <span>Explore All Marketplace Channels</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
};
