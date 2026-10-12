import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  MessageSquare,
  Send,
  User,
  ShieldAlert,
  Clock,
  CheckCheck,
  ChevronLeft,
  Tag,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Conversation, Message } from '../types';
import { Button } from '../components/ui/Button';

export const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeConvoId = searchParams.get('convo');

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoadingConvos, setIsLoadingConvos] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = async () => {
    try {
      const res = await api.getConversations();
      setConversations(res.conversations);

      if (res.conversations.length > 0 && !activeConvoId) {
        setSearchParams({ convo: res.conversations[0].id });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingConvos(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchMessages = async (convoId: string) => {
    try {
      setIsLoadingMessages(true);
      const res = await api.getMessages(convoId);
      setActiveConversation(res.conversation);
      setMessages(res.messages);
      scrollToBottom();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (activeConvoId) {
      fetchMessages(activeConvoId);
    }
  }, [activeConvoId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConvoId || !newMessage.trim() || isSending) return;

    const content = newMessage.trim();
    setNewMessage('');
    setIsSending(true);

    try {
      const res = await api.sendMessage(activeConvoId, content);
      setMessages((prev) => [...prev, res.message]);
      scrollToBottom();
      fetchConversations();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const otherParticipant = activeConversation?.otherUser || null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col md:flex-row h-[750px]">
        {/* Left: Conversations Sidebar */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col ${
            activeConvoId ? 'hidden md:flex' : 'flex'
          }`}
        >
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-brand-600" />
              Conversations
            </h2>
            <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
              {conversations.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {isLoadingConvos ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading messages...</div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-400 space-y-2">
                <p>No messages yet.</p>
                <p className="text-xs text-slate-400">
                  When you inquire about a listing, the chat will appear here.
                </p>
              </div>
            ) : (
              conversations.map((c) => {
                const isSelected = c.id === activeConvoId;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSearchParams({ convo: c.id })}
                    className={`w-full text-left p-4 hover:bg-slate-50 transition-colors flex items-start gap-3 ${
                      isSelected ? 'bg-brand-50/70 border-l-4 border-brand-600' : ''
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0">
                      {c.otherUser?.displayName?.charAt(0) || 'U'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {c.otherUser?.displayName}
                        </p>
                        <span className="text-[10px] text-slate-400">
                          {new Date(c.updatedAt).toLocaleDateString()}
                        </span>
                      </div>

                      {c.listing && (
                        <p className="text-[11px] text-brand-700 font-semibold truncate mt-0.5">
                          Re: {c.listing.title}
                        </p>
                      )}

                      <p className="text-xs text-slate-500 truncate mt-1">
                        {c.lastMessage?.content || 'No messages yet'}
                      </p>
                    </div>

                    {c.unreadCount && c.unreadCount > 0 ? (
                      <span className="w-2 h-2 rounded-full bg-brand-600 shrink-0 mt-2" />
                    ) : null}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Active Message Thread */}
        <div
          className={`flex-1 flex flex-col ${
            !activeConvoId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {activeConvoId && activeConversation ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSearchParams({})}
                    className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-200"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
                    {otherParticipant?.displayName?.charAt(0) || 'U'}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {otherParticipant?.displayName}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Buyer / Seller Marketplace Chat
                    </p>
                  </div>
                </div>

                {activeConversation.listing && (
                  <Link
                    to={`/listing/${activeConversation.listing.id}`}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs"
                  >
                    <span>View Listing</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>

              {/* Security Advisory Strip */}
              <div className="bg-amber-50/60 border-b border-amber-200/50 px-4 py-2 flex items-center gap-2 text-[11px] text-amber-800">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>
                  Never send wire transfers, cashier checks, or gift cards. Inspect goods in person in a public location.
                </span>
              </div>

              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/30">
                {isLoadingMessages ? (
                  <div className="text-center text-xs text-slate-400 py-10">
                    Loading conversation history...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-xs text-slate-400 py-10">
                    Start the conversation by typing your inquiry below.
                  </div>
                ) : (
                  messages.map((m) => {
                    const isMe = m.senderId === user?.id;
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-md rounded-2xl px-4 py-2.5 text-sm ${
                            isMe
                              ? 'bg-brand-600 text-white rounded-br-none shadow-xs'
                              : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-xs'
                          }`}
                        >
                          <p className="leading-relaxed whitespace-pre-wrap">{m.content}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 px-1">
                          {new Date(m.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-white">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                  <Button type="submit" variant="primary" disabled={!newMessage.trim() || isSending}>
                    <Send className="w-4 h-4 mr-1.5" />
                    Send
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <MessageSquare className="w-12 h-12 text-slate-300 mb-3" />
              <h3 className="text-base font-bold text-slate-700">Select a Conversation</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Pick a buyer inquiry or listing chat on the left to read and send messages.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
