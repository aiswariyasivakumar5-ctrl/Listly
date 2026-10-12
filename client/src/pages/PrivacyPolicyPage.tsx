import React from 'react';
import { Shield, Lock, EyeOff } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mt-1">
          Last revised: October 2026 • Craigslist Modern Classifieds
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">1. Our Commitment to User Privacy</h2>
          <p>
            Unlike modern social networks, Craigslist Modern is not an advertising surveillance machine. We do not sell your personal information, rent email lists, or track your movements across third-party websites.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">2. Information We Collect</h2>
          <p>We only collect information necessary to facilitate classified marketplace connections:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li><strong>Account Data:</strong> Your display name, email address, password hash, and optional profile details.</li>
            <li><strong>Listing Information:</strong> Titles, descriptions, prices, photographs, and general neighborhood locations you choose to publish.</li>
            <li><strong>Communications:</strong> Messages exchanged between buyers and sellers on our in-platform communication system.</li>
            <li><strong>Geolocation:</strong> Checked strictly when you click "Locate Nearest Region" after explicit browser permission. GPS data is not persistently retained.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">3. Contact Privacy & Relaying</h2>
          <p>
            When you inquire about a listing, the seller never sees your private email address or telephone number unless you explicitly choose to share it in message text. All messages are stored securely in our relational database and encrypted in transit.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">4. Data Retention & Account Deletion</h2>
          <p>
            You may edit or delete your active postings at any time from your dashboard. Deleted listings and images are permanently removed from our active database.
          </p>
        </section>
      </div>
    </div>
  );
};
