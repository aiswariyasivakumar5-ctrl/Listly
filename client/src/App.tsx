import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Public Pages
import { HomePage } from './pages/HomePage';
import { CityPickerPage } from './pages/CityPickerPage';
import { ForumsPage } from './pages/ForumsPage';
import { ForumTopicPage } from './pages/ForumTopicPage';
import { LocationSelectPage } from './pages/LocationSelectPage';
import { BrowseCategoriesPage } from './pages/BrowseCategoriesPage';
import { CategoryLandingPage } from './pages/CategoryLandingPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { ListingDetailPage } from './pages/ListingDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { AboutPage } from './pages/AboutPage';
import { HelpFaqPage } from './pages/HelpFaqPage';
import { SafetyPage } from './pages/SafetyPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';

// Authenticated Pages
import { DashboardPage } from './pages/DashboardPage';
import { MyListingsPage } from './pages/MyListingsPage';
import { CreateListingPage } from './pages/CreateListingPage';
import { EditListingPage } from './pages/EditListingPage';
import { SavedListingsPage } from './pages/SavedListingsPage';
import { MessagesPage } from './pages/MessagesPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <Routes>
      {/* First whole page is CityPickerPage */}
      <Route path="/" element={<CityPickerPage />} />
      <Route path="/locations" element={<CityPickerPage />} />

      {/* Other pages are inside AppLayout */}
      <Route element={<AppLayout />}>
        <Route path="/marketplace" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/forums" element={<ForumsPage />} />
        <Route path="/forums/:topicId" element={<ForumTopicPage />} />
        <Route path="/categories" element={<BrowseCategoriesPage />} />
        <Route path="/category/:slug" element={<CategoryLandingPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/listing/:id" element={<ListingDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/help" element={<HelpFaqPage />} />
        <Route path="/safety" element={<SafetyPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/listings"
          element={
            <ProtectedRoute>
              <MyListingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post"
          element={
            <ProtectedRoute>
              <CreateListingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-listing/:id"
          element={
            <ProtectedRoute>
              <EditListingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/saved"
          element={
            <ProtectedRoute>
              <SavedListingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
