import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, MessageSquare, ShieldCheck, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQS = [
  {
    q: 'How do I post a classified advertisement?',
    a: 'Click the "Post an Ad" button in the top navigation bar. Our 6-step guided wizard will guide you through picking a category, entering a title and description, specifying price and condition, adding location details, uploading photos, and previewing before publishing.',
  },
  {
    q: 'Is posting an ad free on Craigslist Modern?',
    a: 'Yes! Standard personal advertisements, goods for sale, housing, community notices, and gigs are completely free to post.',
  },
  {
    q: 'How does buyer-seller messaging work?',
    a: 'When you find a listing you are interested in, click "Contact Seller". You can send an in-platform inquiry. Your email address and phone number remain completely private unless you explicitly choose to share them.',
  },
  {
    q: 'How do I mark my item as sold?',
    a: 'Go to your Account Dashboard -> "My Listings". Click the "Mark as Sold" button next to your posting. You can re-activate or delete the post at any time.',
  },
  {
    q: 'Why does Craigslist Modern ask for location permission?',
    a: 'We only check browser geolocation if you explicitly click "Locate Nearest Region" on the location page. We never track your GPS automatically. You can also pick any city manually from the menu.',
  },
  {
    q: 'What should I do if I suspect a fraudulent listing?',
    a: 'Click the Flag icon on the listing page to open the "Report this listing" modal. Select the reason (scam, prohibited item, spam, etc.) and our trust and safety moderation queue will review it.',
  },
];

export const HelpFaqPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center mx-auto">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Help Center & Frequently Asked Questions
        </h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          Answers to common questions about buying, selling, safety, and managing accounts on our marketplace.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-4">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between text-left py-2 font-bold text-slate-900 hover:text-brand-600 transition-colors"
              >
                <span className="text-base">{faq.q}</span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </button>
              {isOpen && (
                <p className="text-sm text-slate-600 mt-2 leading-relaxed pl-1 pr-6">
                  {faq.a}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Contact Support Banner */}
      <div className="bg-slate-100/80 rounded-2xl p-6 text-center space-y-2 border border-slate-200">
        <h3 className="font-bold text-slate-900 text-base">Still have questions?</h3>
        <p className="text-xs text-slate-500">
          Our community team is here to assist with safety inquiries, listing disputes, and account recovery.
        </p>
        <div className="pt-2">
          <Link
            to="/safety"
            className="text-xs font-bold text-brand-600 hover:text-brand-800 underline"
          >
            Review our Scam Prevention & Safe Meeting Guide →
          </Link>
        </div>
      </div>
    </div>
  );
};
