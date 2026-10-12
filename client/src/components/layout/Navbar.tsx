import React, { useState } from 'react';
import { Link, useNavigate, useLocation as useRouterLocation } from 'react-router-dom';
import {
  Store,
  MapPin,
  Heart,
  MessageSquare,
  PlusCircle,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Settings,
  Menu,
  X,
  FileText,
  Search,
  Shield,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import { Button } from '../ui/Button';
import { CityPickerModal } from '../ui/CityPickerModal';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { selectedLocation } = useLocation();
  const navigate = useNavigate();
  const routerLocation = useRouterLocation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCityPickerOpen, setIsCityPickerOpen] = useState(false);

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    await logout();
    navigate('/');
  };

  const isSearchPage = routerLocation.pathname === '/search';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & Location */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Redesigned Logo: Only Emblem and Name */}
            <Link to="/marketplace" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-brand-600/25 group-hover:scale-105 transition-all">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                Listly
              </span>
            </Link>

            {/* City Picker Button */}
            <button
              type="button"
              onClick={() => setIsCityPickerOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/90 text-xs font-semibold text-slate-700 transition-colors border border-slate-200/80 cursor-pointer"
              title="Change your city"
            >
              <MapPin className="w-3.5 h-3.5 text-brand-600" />
              <span className="max-w-[150px] truncate">{selectedLocation}</span>
              <span className="text-brand-600 text-[11px] font-bold ml-0.5 hover:underline">Change</span>
            </button>
          </div>

          {/* Quick Search on non-search pages (Desktop) */}
          {!isSearchPage && (
            <div className="hidden lg:flex flex-1 max-w-md mx-4">
              <button
                onClick={() => navigate('/search')}
                className="w-full flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 text-sm border border-slate-200/60 transition-all text-left"
              >
                <Search className="w-4 h-4 text-slate-400" />
                <span>Search listings in {selectedLocation}...</span>
              </button>
            </div>
          )}

          {/* Right Navigation Controls */}
          <div className="hidden sm:flex items-center gap-2 lg:gap-3">
            <Link
              to="/marketplace"
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <span>Marketplace</span>
            </Link>

            <Link
              to="/categories"
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Layers className="w-4 h-4 text-slate-500" />
              <span>Categories</span>
            </Link>

            <Link
              to="/forums"
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4 text-slate-500" />
              <span>Forums</span>
            </Link>

            {user ? (
              <>
                <Link
                  to="/saved"
                  className="p-2 text-slate-600 hover:text-rose-600 hover:bg-slate-100 rounded-xl transition-colors relative"
                  title="Saved Listings"
                >
                  <Heart className="w-5 h-5" />
                  {user._count?.favorites && user._count.favorites > 0 ? (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
                  ) : null}
                </Link>

                <Link
                  to="/messages"
                  className="p-2 text-slate-600 hover:text-brand-600 hover:bg-slate-100 rounded-xl transition-colors relative"
                  title="Messages"
                >
                  <MessageSquare className="w-5 h-5" />
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                  >
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.displayName}
                        className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs">
                        {user.displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-xs font-semibold text-slate-800 max-w-[100px] truncate hidden md:inline">
                      {user.displayName}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-slate-200/80 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-100 mb-1">
                        <p className="text-xs text-slate-400">Signed in as</p>
                        <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
                      </div>

                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        Dashboard
                      </Link>

                      <Link
                        to="/dashboard/listings"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                      >
                        <FileText className="w-4 h-4 text-slate-400" />
                        My Listings
                      </Link>

                      <Link
                        to="/saved"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                      >
                        <Heart className="w-4 h-4 text-slate-400" />
                        Saved Items
                      </Link>

                      <Link
                        to="/settings"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        Settings
                      </Link>

                      <div className="my-1 border-t border-slate-100" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 text-left font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-brand-600 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-2 text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Post an Ad CTA */}
            <Link to="/post">
              <Button variant="primary" size="sm" className="shadow-sm">
                <PlusCircle className="w-4 h-4 mr-1" />
                Post an Ad
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center sm:hidden gap-2">
            <Link to="/post">
              <Button variant="primary" size="sm" className="px-2.5 py-1.5 text-xs">
                Post
              </Button>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          <button
            type="button"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsCityPickerOpen(true);
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-800 text-left"
          >
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-600" />
              {selectedLocation}
            </span>
            <span className="text-xs text-brand-600 font-bold underline">Change City</span>
          </button>

          <Link
            to="/search"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
          >
            <Search className="w-4 h-4 text-slate-400" />
            Search Marketplace
          </Link>

          <Link
            to="/marketplace"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
          >
            <Layers className="w-4 h-4 text-slate-400" />
            Marketplace
          </Link>

          <Link
            to="/categories"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
          >
            <Layers className="w-4 h-4 text-slate-400" />
            Browse Categories
          </Link>

          <Link
            to="/forums"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
          >
            <MessageSquare className="w-4 h-4 text-slate-400" />
            Discussion Forums
          </Link>

          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                <LayoutDashboard className="w-4 h-4 text-slate-400" />
                Dashboard
              </Link>
              <Link
                to="/dashboard/listings"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                <FileText className="w-4 h-4 text-slate-400" />
                My Listings
              </Link>
              <Link
                to="/saved"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                <Heart className="w-4 h-4 text-slate-400" />
                Saved Listings
              </Link>
              <Link
                to="/messages"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                <MessageSquare className="w-4 h-4 text-slate-400" />
                Messages
              </Link>
              <Link
                to="/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                Settings
              </Link>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-xl"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-bold text-slate-800 bg-slate-100 rounded-xl"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-bold text-white bg-brand-600 rounded-xl"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Indian City Picker Modal */}
      <CityPickerModal
        isOpen={isCityPickerOpen}
        onClose={() => setIsCityPickerOpen(false)}
      />
    </header>
  );
};
