import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Calendar, MapPin, Users, QrCode, ArrowRight, Grid, List,
  Sparkles, Ticket, Shield, CheckCircle2, RefreshCw, X, Award, Plus
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../ui/Button';
import EventCalendar from './EventCalendar';

interface Event {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  attendees: number;
  capacity?: number;
  isFree: boolean;
  price?: number;
  needsVolunteers?: boolean;
  format?: 'In-Person' | 'Hybrid' | 'Virtual';
  mode?: 'Individual' | 'Team Event';
  status?: 'Active' | 'Upcoming' | 'Completed';
}

interface EventDiscoveryHubProps {
  events: Event[];
  onViewDetails: (ev: Event) => void;
  onGetQR: (ev: Event) => void;
  onCreateEvent?: () => void;
}

export default function EventDiscoveryHub({ events, onViewDetails, onGetQR, onCreateEvent }: EventDiscoveryHubProps) {
  const { isDark } = useTheme();
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'calendar'>('grid');
  const [selectedChip, setSelectedChip] = useState<string>('All');

  // Filter Drawer State
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFormat, setSelectedFormat] = useState<string>('All');
  const [selectedPricing, setSelectedPricing] = useState<string>('All');
  const [selectedSort, setSelectedSort] = useState<string>('date');

  const cardBg = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm';
  const textPri = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const textSub = isDark ? 'text-zinc-400' : 'text-zinc-500';

  const quickChips = ['All', 'Today', 'This Week', 'AI Events', 'Free Events', 'Hackathons', 'Workshops', 'Virtual'];

  const clearAllFilters = () => {
    setSearch('');
    setSelectedChip('All');
    setSelectedCategory('All');
    setSelectedFormat('All');
    setSelectedPricing('All');
  };

  // Filter & Sort Logic
  const filteredEvents = events.filter(ev => {
    const matchSearch = ev.title.toLowerCase().includes(search.toLowerCase()) || ev.category.toLowerCase().includes(search.toLowerCase()) || ev.location.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === 'All' || ev.category === selectedCategory;
    const matchFormat = selectedFormat === 'All' || (ev.format && ev.format === selectedFormat);
    const matchPricing = selectedPricing === 'All' || (selectedPricing === 'Free' ? ev.isFree : !ev.isFree);

    let matchChip = true;
    if (selectedChip === 'Free Events') matchChip = ev.isFree;
    if (selectedChip === 'AI Events') matchChip = ev.category.includes('AI') || ev.category.includes('Artificial');
    if (selectedChip === 'Hackathons') matchChip = ev.category.includes('Hackathon');

    return matchSearch && matchCategory && matchFormat && matchPricing && matchChip;
  });

  return (
    <div className="space-y-6">
      {/* Header & Sticky Global Search Bar */}
      <div className={`p-6 rounded-2xl border ${cardBg} space-y-4`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className={`text-2xl font-black ${textPri}`}>Advanced Event Discovery</h1>
            <p className={`text-xs font-medium ${textSub}`}>Search, filter, sort, publish, and view platform events in grid or calendar views</p>
          </div>

          {/* Action Buttons & View Switcher Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {onCreateEvent && (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onCreateEvent}
                  leftIcon={<Plus className="w-4 h-4 text-zinc-950" />}
                >
                  Create Event
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onCreateEvent}
                  leftIcon={<Sparkles className="w-4 h-4 text-amber-500" />}
                >
                  Event Creator
                </Button>
              </>
            )}

            <div className="flex items-center gap-1 bg-zinc-800/40 p-1 rounded-xl border border-zinc-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-amber-500 text-zinc-950 shadow-sm' : `${textSub} hover:${textPri}`
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  viewMode === 'list' ? 'bg-amber-500 text-zinc-950 shadow-sm' : `${textSub} hover:${textPri}`
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`p-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  viewMode === 'calendar' ? 'bg-amber-500 text-zinc-950 shadow-sm' : `${textSub} hover:${textPri}`
                }`}
                title="Calendar View"
              >
                <Calendar className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar & Quick Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search event title, venue, organizer, tags..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-medium outline-none transition-all ${
                isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-amber-500' : 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-amber-500'
              }`}
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedSort}
              onChange={e => setSelectedSort(e.target.value)}
              className={`px-3 py-2.5 rounded-xl border text-xs font-bold outline-none cursor-pointer ${
                isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
              }`}
            >
              <option value="date">Sort by Event Date</option>
              <option value="newest">Sort by Newest First</option>
              <option value="popular">Sort by Most Popular</option>
              <option value="az">Sort Alphabetically (A-Z)</option>
            </select>

            <button
              onClick={clearAllFilters}
              className="px-3.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold border border-zinc-700 transition-all cursor-pointer whitespace-nowrap"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Quick Filter Chips */}
        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-zinc-800/40">
          {quickChips.map(chip => (
            <button
              key={chip}
              onClick={() => setSelectedChip(chip)}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                selectedChip === chip ? 'bg-amber-500 text-zinc-950 shadow-sm' : `${textSub} hover:${textPri}`
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* CALENDAR VIEW MODE */}
      {viewMode === 'calendar' && (
        <EventCalendar events={events} onSelectEvent={onViewDetails} />
      )}

      {/* GRID VIEW MODE */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create New Event Card */}
          {onCreateEvent && (
            <motion.div
              whileHover={{ y: -4 }}
              onClick={onCreateEvent}
              className={`p-6 rounded-2xl border-2 border-dashed ${
                isDark ? 'border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10' : 'border-amber-500/50 bg-amber-50/50 hover:bg-amber-50'
              } flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[260px] group`}
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-zinc-950 mb-3 shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6 stroke-[3]" />
              </div>
              <h3 className={`text-base font-extrabold mb-1 ${textPri} group-hover:text-amber-500 transition-colors`}>Create New Event</h3>
              <p className={`text-xs max-w-xs leading-relaxed ${textSub}`}>Launch event creator to generate title, agenda, rules & FAQs.</p>
            </motion.div>
          )}

          {filteredEvents.map((ev, idx) => {
            const cap = ev.capacity || 500;
            const pct = Math.min(Math.round((ev.attendees / cap) * 100), 100);

            return (
              <motion.div
                key={ev.id}
                whileHover={{ y: -4 }}
                className={`p-5 rounded-2xl border ${cardBg} transition-all cursor-pointer flex flex-col justify-between space-y-4`}
                onClick={() => onViewDetails(ev)}
              >
                <div className="space-y-3">
                  {/* Category & Status */}
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      {ev.category}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {ev.isFree ? 'FREE ENTRY' : `$${ev.price}`}
                    </span>
                  </div>

                  <h3 className={`text-base font-black leading-snug ${textPri}`}>{ev.title}</h3>

                  <div className={`space-y-1.5 text-xs font-semibold ${textSub}`}>
                    <p className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" /> {ev.date}
                    </p>
                    <p className="flex items-center gap-2 truncate">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400" /> {ev.location}
                    </p>
                  </div>

                  {/* Registered Fill Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className={textSub}>Capacity Fill</span>
                      <span className="text-amber-400">{ev.attendees} / {cap} Seats</span>
                    </div>
                    <div className={`h-1.5 rounded-full ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`}>
                      <div className="h-1.5 rounded-full bg-amber-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-zinc-800/40 flex items-center justify-between gap-2">
                  <button
                    onClick={e => { e.stopPropagation(); onViewDetails(ev); }}
                    className="text-xs font-bold text-zinc-300 hover:text-white transition-colors"
                  >
                    View Details
                  </button>

                  <button
                    onClick={e => { e.stopPropagation(); onGetQR(ev); }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" /> Ticket Pass
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* LIST VIEW MODE */}
      {viewMode === 'list' && (
        <div className={`rounded-2xl border ${cardBg} overflow-hidden divide-y divide-zinc-800/40`}>
          {filteredEvents.map((ev) => (
            <div
              key={ev.id}
              onClick={() => onViewDetails(ev)}
              className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all cursor-pointer ${
                isDark ? 'hover:bg-zinc-800/40' : 'hover:bg-zinc-50'
              }`}
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    {ev.category}
                  </span>
                  <h3 className={`text-sm font-extrabold ${textPri}`}>{ev.title}</h3>
                </div>
                <p className={`text-xs ${textSub}`}>{ev.date} · {ev.location}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-amber-400">{ev.attendees} Registered</span>
                <button
                  onClick={e => { e.stopPropagation(); onGetQR(ev); }}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 text-zinc-950 text-xs font-black flex items-center gap-1 cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5" /> Pass
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
