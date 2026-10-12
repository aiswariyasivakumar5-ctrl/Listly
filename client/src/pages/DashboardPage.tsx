import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Heart,
  MessageSquare,
  PlusCircle,
  TrendingUp,
  Eye,
  Settings,
  ArrowRight,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Listing, Conversation } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [savedCount, setSavedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        const [listingsRes, convosRes, favsRes] = await Promise.all([
          api.getMyListings(),
          api.getConversations(),
          api.getFavorites(),
        ]);
        setMyListings(listingsRes.listings);
        setConversations(convosRes.conversations);
        setSavedCount(favsRes.listings.length);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const totalViews = myListings.reduce((sum, item) => sum + item.views, 0);
  const activeCount = myListings.filter((l) => l.status === 'ACTIVE').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Account Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back, <strong className="text-slate-800">{user?.displayName}</strong> ({user?.email})
          </p>
        </div>
        <Link to="/post">
          <Button variant="primary">
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Create New Listing
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Ads</span>
            <FileText className="w-4 h-4 text-brand-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{activeCount}</p>
          <span className="text-xs text-slate-400">{myListings.length} total posts</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Views</span>
            <Eye className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{totalViews}</p>
          <span className="text-xs text-slate-400">across all postings</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Messages</span>
            <MessageSquare className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{conversations.length}</p>
          <span className="text-xs text-slate-400">active buyer/seller threads</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Saved Items</span>
            <Heart className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{savedCount}</p>
          <span className="text-xs text-slate-400">bookmarked listings</span>
        </div>
      </div>

      {/* Grid: Recent Listings & Recent Conversations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Your Active Listings */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-600" />
              <h2 className="font-bold text-slate-900 text-lg">Your Listings</h2>
            </div>
            <Link
              to="/dashboard/listings"
              className="text-xs font-bold text-brand-600 hover:text-brand-800"
            >
              Manage all ({myListings.length}) →
            </Link>
          </div>

          {myListings.length === 0 ? (
            <div className="py-10 text-center text-slate-400 space-y-2">
              <p className="text-sm">You haven't posted any advertisements yet.</p>
              <Link to="/post" className="inline-block pt-1">
                <Button variant="outline" size="sm">
                  Post Your First Ad
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {myListings.slice(0, 4).map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.images?.[0]?.url || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200'}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border"
                    />
                    <div className="min-w-0">
                      <Link
                        to={`/listing/${item.id}`}
                        className="text-sm font-bold text-slate-900 hover:text-brand-600 truncate block"
                      >
                        {item.title}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <Badge
                          variant={item.status === 'ACTIVE' ? 'brand' : item.status === 'SOLD' ? 'rose' : 'slate'}
                          size="sm"
                        >
                          {item.status}
                        </Badge>
                        <span>{item.views} views</span>
                      </div>
                    </div>
                  </div>

                  <Link to={`/edit-listing/${item.id}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              <h2 className="font-bold text-slate-900 text-lg">Recent Inquiries</h2>
            </div>
            <Link to="/messages" className="text-xs font-bold text-purple-600 hover:text-purple-800">
              View all messages →
            </Link>
          </div>

          {conversations.length === 0 ? (
            <div className="py-10 text-center text-slate-400 space-y-2">
              <p className="text-sm">No conversations yet.</p>
              <p className="text-xs text-slate-400">
                Messages from interested buyers will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {conversations.slice(0, 4).map((convo) => (
                <Link
                  key={convo.id}
                  to={`/messages?convo=${convo.id}`}
                  className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50 -mx-2 px-2 rounded-xl transition-colors block"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
                      {convo.otherUser.displayName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {convo.otherUser.displayName}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {convo.lastMessage?.content || 'Started inquiry'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] text-slate-400">
                      {new Date(convo.updatedAt).toLocaleDateString()}
                    </span>
                    {convo.unreadCount && convo.unreadCount > 0 ? (
                      <span className="block w-2 h-2 rounded-full bg-brand-600 ml-auto mt-1" />
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
