import React from 'react';
import { Scale, AlertCircle } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Terms of Use</h1>
        <p className="text-sm text-slate-500 mt-1">
          Effective Date: October 2026 • Community Marketplace Agreement
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Craigslist Modern, you agree to comply with these Terms of Use, our Community Safety Guidelines, and all applicable local, state, and federal laws.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">2. Prohibited Content & Activities</h2>
          <p>To ensure a safe environment for all neighbors, the following are strictly prohibited:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li>Weapons, ammunition, explosives, or hazardous chemicals.</li>
            <li>Regulated prescription pharmaceuticals, illegal narcotics, or drug paraphernalia.</li>
            <li>Stolen property, counterfeit goods, or trademark-infringing replicas.</li>
            <li>Unsolicited commercial advertisements, affiliate marketing schemes, or multi-level marketing (MLM).</li>
            <li>Discriminatory housing or employment advertisements violating Fair Housing or Equal Employment Opportunity laws.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">3. User Responsibility & Independence</h2>
          <p>
            Craigslist Modern is a venue that facilitates local peer-to-peer connections. We are not directly involved in the transaction between buyers and sellers. You are solely responsible for inspecting merchandise, ensuring clear vehicle titles, agreeing on rental contracts, and conducting safe face-to-face meetings.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">4. Community Moderation</h2>
          <p>
            We reserve the right to remove postings, suspend accounts, and cooperate with law enforcement regarding listings that violate our safety policies or perpetrate fraud against local residents.
          </p>
        </section>
      </div>
    </div>
  );
};
