import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Compass, AlertCircle, CheckCircle, ArrowRight, KeyRound } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your account email address.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await api.forgotPassword(email.trim());
      setSubmitted(true);
      if (res.resetToken) {
        setResetToken(res.resetToken);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to request password reset.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md">
            <Compass className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900">
            craigslist<span className="text-brand-600 text-sm ml-1">Modern</span>
          </span>
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Reset Your Password
        </h1>
        <p className="text-sm text-slate-500">
          Enter your registered email and we will issue a secure reset link
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-900/5 rounded-3xl border border-slate-200/80 sm:px-10 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {submitted ? (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Reset Request Generated</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                A verification token has been issued for <strong>{email}</strong>.
              </p>

              {resetToken && (
                <div className="p-4 bg-brand-50 border border-brand-200 rounded-2xl text-left space-y-2 mt-4">
                  <p className="text-xs font-bold text-brand-900 uppercase tracking-wider flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-brand-600" />
                    Local Development Direct Reset Link:
                  </p>
                  <Link
                    to={`/reset-password/${resetToken}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-900 underline break-all"
                  >
                    Click here to set your new password →
                  </Link>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100">
                <Link to="/login" className="text-sm font-bold text-slate-700 hover:text-brand-600">
                  Return to sign in
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Account Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
                Request Reset Link
              </Button>

              <div className="text-center text-sm text-slate-500 pt-3">
                <Link to="/login" className="hover:text-slate-800 font-medium">
                  ← Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
