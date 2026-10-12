import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  PlusCircle,
  Search,
  Users,
  Flame,
  Clock,
  Pin,
  Tag,
  ArrowRight,
  Send,
  X,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { ForumTopic, INITIAL_TOPICS, FORUM_BOARDS } from '../data/forumData';

export const ForumsPage: React.FC = () => {
  const { selectedLocation } = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [topics, setTopics] = useState<ForumTopic[]>(INITIAL_TOPICS);
  const [selectedBoard, setSelectedBoard] = useState<string>('All Boards');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewTopicModalOpen, setIsNewTopicModalOpen] = useState(false);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newBoard, setNewBoard] = useState('General Discussion');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  const filteredTopics = topics.filter((t) => {
    const matchesBoard = selectedBoard === 'All Boards' || t.board === selectedBoard;
    const matchesQuery =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesBoard && matchesQuery;
  });

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newTopic: ForumTopic = {
      id: `topic-${Date.now()}`,
      board: newBoard,
      title: newTitle.trim(),
      author: user?.displayName || 'Community Member',
      authorAvatar: user?.avatarUrl || undefined,
      city: selectedLocation,
      repliesCount: 0,
      viewsCount: 1,
      createdAt: 'Just now',
      content: newContent.trim(),
      tags: newTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    setTopics([newTopic, ...topics]);
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setIsNewTopicModalOpen(false);
      setNewTitle('');
      setNewContent('');
      setNewTags('');
    }, 900);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
              Community Message Boards
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Discussion Forums
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Topic-based message boards for advice, local city conversations, flatmate searches,
            tech discussions, and neighborhood tips in {selectedLocation}.
          </p>
        </div>

        <Button
          onClick={() => setIsNewTopicModalOpen(true)}
          className="shrink-0 self-start md:self-auto gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Start a Discussion</span>
        </Button>
      </div>

      {/* Boards Filter Bar & Search */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Board Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
          {FORUM_BOARDS.map((board) => (
            <button
              key={board}
              onClick={() => setSelectedBoard(board)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                selectedBoard === board
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80'
              }`}
            >
              {board}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search discussions & tags..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
      </div>

      {/* Topics List */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filteredTopics.length > 0 ? (
          filteredTopics.map((topic) => (
            <div
              key={topic.id}
              className="p-5 sm:p-6 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {topic.isPinned && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[11px]">
                      <Pin className="w-3 h-3" /> Pinned
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-700">
                    {topic.board}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500">{topic.city}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-400">{topic.createdAt}</span>
                </div>

                <Link
                  to={`/forums/${topic.id}`}
                  className="block font-bold text-base sm:text-lg text-slate-900 hover:text-brand-600 transition-colors leading-snug"
                >
                  {topic.title}
                </Link>

                <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                  {topic.content}
                </p>

                {/* Author & Tags */}
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                  <div className="flex items-center gap-1.5 font-medium text-slate-700">
                    {topic.authorAvatar ? (
                      <img
                        src={topic.authorAvatar}
                        alt={topic.author}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 text-[10px] font-bold flex items-center justify-center">
                        {topic.author.charAt(0)}
                      </div>
                    )}
                    <span>{topic.author}</span>
                  </div>

                  {topic.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 sm:min-w-[100px] border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60">
                  <MessageSquare className="w-4 h-4 text-brand-600" />
                  <span>{topic.repliesCount} replies</span>
                </div>
                <span className="text-[11px] text-slate-400">
                  {topic.viewsCount} views
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-sm text-slate-500 space-y-2">
            <p className="font-bold text-slate-800">No discussions found in this board.</p>
            <p className="text-xs text-slate-400">
              Be the first to start a conversation in {selectedBoard}!
            </p>
            <Button
              size="sm"
              onClick={() => setIsNewTopicModalOpen(true)}
              className="mt-2"
            >
              Start New Topic
            </Button>
          </div>
        )}
      </div>

      {/* New Topic Modal */}
      {isNewTopicModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-brand-600" />
                <h3 className="font-extrabold text-lg text-slate-900">
                  Start New Forum Discussion
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewTopicModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formSuccess ? (
              <div className="p-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-base text-slate-900">Discussion Posted!</h4>
                <p className="text-xs text-slate-500">Your topic is now live on the forum boards.</p>
              </div>
            ) : (
              <form onSubmit={handleCreateTopic} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Select Topic Board *
                  </label>
                  <select
                    value={newBoard}
                    onChange={(e) => setNewBoard(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                  >
                    {FORUM_BOARDS.filter((b) => b !== 'All Boards').map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Topic Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Recommendations for best high-speed fiber in HSR Layout?"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Discussion Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Provide details or questions for community members to reply..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="e.g. Bengaluru, Broadband, Internet"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsNewTopicModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Publish Discussion</Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ForumsPage;
