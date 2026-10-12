import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MessageSquare,
  Send,
  Pin,
  Clock,
  User,
  Share2,
  ThumbsUp,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { INITIAL_TOPICS } from '../data/forumData';
import { Button } from '../components/ui/Button';

interface Comment {
  id: string;
  author: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  likes: number;
}

const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'c-1',
    author: 'Kunal Verma',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    content:
      'Indiranagar is definitely more walkable for 100ft road cafes and metro connectivity. For ORR commute, take the purple line to Baiyappanahalli or use feeder buses. Water depends on whether the building has Cauvery or tanker supply—always confirm with the landlord!',
    createdAt: '1 hour ago',
    likes: 8,
  },
  {
    id: 'c-2',
    author: 'Ananya Roy',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    content:
      'Koramangala 3rd and 4th blocks are quiet and have green avenues, but peak hour traffic getting towards Bellandur or Marathahalli can be challenging during monsoon. Look at Murugeshpalya or Domlur as midway options as well.',
    createdAt: '45 mins ago',
    likes: 5,
  },
];

export const ForumTopicPage: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const topic =
    INITIAL_TOPICS.find((t) => t.id === topicId) || INITIAL_TOPICS[0];

  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [replyText, setReplyText] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const handlePostReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newComment: Comment = {
      id: `c-${Date.now()}`,
      author: user?.displayName || 'Community Member',
      authorAvatar: user?.avatarUrl || undefined,
      content: replyText.trim(),
      createdAt: 'Just now',
      likes: 1,
    };

    setComments([...comments, newComment]);
    setReplyText('');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/forums"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Discussion Boards</span>
        </Link>
      </div>

      {/* Main Topic Header & Body */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {topic.isPinned && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[11px]">
                <Pin className="w-3 h-3" /> Pinned
              </span>
            )}
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold">
              {topic.board}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500 font-medium">{topic.city}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {topic.createdAt}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {topic.title}
          </h1>

          {/* Author bar */}
          <div className="flex items-center justify-between pt-2 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              {topic.authorAvatar ? (
                <img
                  src={topic.authorAvatar}
                  alt={topic.author}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs">
                  {topic.author.charAt(0)}
                </div>
              )}
              <div>
                <span className="font-bold text-sm text-slate-900 block leading-tight">
                  {topic.author}
                </span>
                <span className="text-xs text-slate-400">Discussion Starter</span>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{isCopied ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
          {topic.content}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100">
          {topic.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Community Replies Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-brand-600" />
            <span>Community Replies ({comments.length})</span>
          </h2>
          <span className="text-xs text-slate-400">Public Community Forum</span>
        </div>

        {/* Replies List */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {comment.authorAvatar ? (
                    <img
                      src={comment.authorAvatar}
                      alt={comment.author}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                      {comment.author.charAt(0)}
                    </div>
                  )}
                  <div>
                    <span className="font-bold text-xs text-slate-900">
                      {comment.author}
                    </span>
                    <span className="text-[11px] text-slate-400 ml-2">
                      {comment.createdAt}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-400 hover:text-brand-600 cursor-pointer">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{comment.likes}</span>
                </div>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed pl-9">
                {comment.content}
              </p>
            </div>
          ))}
        </div>

        {/* Reply Box */}
        <form
          onSubmit={handlePostReply}
          className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-3 shadow-xs"
        >
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Add Your Reply
          </label>
          <textarea
            required
            rows={3}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Share your thoughts, recommendations, or answer this question..."
            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-400">
              Posting publicly to {topic.board}
            </span>
            <Button type="submit" size="sm" className="gap-1.5">
              <Send className="w-3.5 h-3.5" />
              <span>Post Reply</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForumTopicPage;
