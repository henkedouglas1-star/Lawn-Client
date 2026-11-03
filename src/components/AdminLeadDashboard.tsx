import React, { useState, useEffect } from 'react';
import { X, ClipboardList, Shield, Calendar, CheckCircle2, AlertCircle, RefreshCw, LogOut, ExternalLink, Plus, Briefcase, FileText, Check, Clock } from 'lucide-react';
import { BusinessConfig, Lead, Job, JobStatus } from '../types';
import { initAuth, googleSignIn, getAccessToken, logout, fetchCalendarEvents, createConsultationEvent, CalendarEvent } from '../services/calendarAuth';
import { User } from 'firebase/auth';

interface AdminLeadDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  config: BusinessConfig;
  leads: Lead[];
}

export function AdminLeadDashboard({ isOpen, onClose, config, leads }: AdminLeadDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'leads' | 'jobs' | 'calendar' | 'events' | 'config'>('overview');
  
  // Data stores
  const [jobs, setJobs] = useState<Job[]>([]);
  const [eventLogs, setEventLogs] = useState<any[]>([]);

  // New Job Form Modal / State
  const [showNewJobModal, setShowNewJobModal] = useState(false);
  const [newJobLeadId, setNewJobLeadId] = useState(leads[0]?.leadId || '');
  const [newJobService, setNewJobService] = useState(config.services[0].title);
  const [newJobDesc, setNewJobDesc] = useState('');
  const [newJobQuotedCents, setNewJobQuotedCents] = useState('7500000');

  // Google Auth & Calendar State
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [loadingCalendar, setLoadingCalendar] = useState(false);
  const [calendarError, setCalendarError] = useState('');
  
  // New Booking Form State
  const [selectedLeadId, setSelectedLeadId] = useState(leads[0]?.leadId || '');
  const [bookingDate, setBookingDate] = useState('2026-11-06T10:00');
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchAllData();
      const unsubscribe = initAuth(
        (authUser, token) => {
          setUser(authUser);
          setAccessToken(token);
          setNeedsAuth(false);
          loadCalendar(token);
        },
        () => {
          setUser(null);
          setAccessToken(null);
          setNeedsAuth(true);
        }
      );
      return () => unsubscribe();
    }
  }, [isOpen]);

  const fetchAllData = async () => {
    try {
      const [jobsRes, eventsRes] = await Promise.all([
        fetch('/api/jobs'),
        fetch('/api/events')
      ]);

      const jobsData = await jobsRes.json();
      const eventsData = await eventsRes.json();

      setJobs(jobsData);
      setEventLogs(eventsData);
    } catch (e) {
      console.error('Failed to fetch management data:', e);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const lead = leads.find(l => l.leadId === newJobLeadId);
    if (!lead) return;

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: lead.leadId,
          customerName: lead.customerName,
          customerEmail: lead.email,
          serviceType: newJobService,
          jobDescription: newJobDesc || lead.projectDescription,
          quotedAmountCents: Number(newJobQuotedCents),
          finalInvoiceAmountCents: Number(newJobQuotedCents),
          jobStatus: 'Accepted'
        })
      });
      if (res.ok) {
        setShowNewJobModal(false);
        setNewJobDesc('');
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateJobStatus = async (jobId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobStatus: newStatus })
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setCalendarError('');
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setAccessToken(result.accessToken);
        setNeedsAuth(false);
        loadCalendar(result.accessToken);
      }
    } catch (err: any) {
      setCalendarError(err.message || 'Google sign-in failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setAccessToken(null);
    setNeedsAuth(true);
    setCalendarEvents([]);
  };

  const loadCalendar = async (token: string) => {
    setLoadingCalendar(true);
    setCalendarError('');
    try {
      const events = await fetchCalendarEvents(token);
      setCalendarEvents(events);
    } catch (err: any) {
      setCalendarError('Failed to load Google Calendar events.');
    } finally {
      setLoadingCalendar(false);
    }
  };

  const handleScheduleEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
      alert('Please sign in with Google first.');
      return;
    }

    const lead = leads.find(l => l.leadId === selectedLeadId);
    if (!lead) return;

    const confirmed = window.confirm(
      `Confirm scheduling Google Calendar consultation event for client "${lead.customerName}" (${lead.projectType}) on ${new Date(bookingDate).toLocaleString()}?`
    );
    if (!confirmed) return;

    try {
      const newEvent = await createConsultationEvent(
        accessToken,
        lead.customerName,
        lead.email,
        lead.projectType,
        new Date(bookingDate).toISOString()
      );
      setBookingSuccessMsg(`Successfully created Google Calendar event: "${newEvent.summary}"!`);
      loadCalendar(accessToken);
    } catch (err: any) {
      alert(`Error creating calendar event: ${err.message}`);
    }
  };

  if (!isOpen) return null;

  const totalInquiries = leads.length;
  const qualifiedLeads = leads.filter(l => l.qualificationStatus === 'Qualified').length;
  const activeProjectsCount = jobs.filter(j => j.jobStatus === 'In Progress' || j.jobStatus === 'Accepted').length;
  const completedJobsCount = jobs.filter(j => j.jobStatus === 'Completed').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-[90vh]">
        {/* Header */}
        <div className="bg-[#1E3A2F] text-white p-6 flex items-center justify-between border-b border-[#2C4A3E]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37] text-[#1E3A2F] flex items-center justify-center font-bold font-serif">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-xl text-white">Aravat Landscaping Management Portal</h3>
                <span className="bg-[#D4AF37] text-[#1E3A2F] text-xs font-bold px-2.5 py-0.5 rounded-full">
                  Internal Operations
                </span>
              </div>
              <p className="text-xs text-[#D4AF37]">
                San Francisco Bay Area • Client Inquiries, Projects & Consultation Schedule
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white bg-[#2C4A3E] p-2.5 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-tabs */}
        <div className="bg-[#F9F8F6] border-b border-gray-200 px-6 py-3 flex gap-2 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`cursor-pointer px-4 py-2 rounded-xl transition-all ${
              activeSubTab === 'overview' ? 'bg-[#1E3A2F] text-white shadow' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveSubTab('leads')}
            className={`cursor-pointer px-4 py-2 rounded-xl transition-all ${
              activeSubTab === 'leads' ? 'bg-[#1E3A2F] text-white shadow' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Customer Inquiries ({leads.length})
          </button>
          <button
            onClick={() => setActiveSubTab('jobs')}
            className={`cursor-pointer px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeSubTab === 'jobs' ? 'bg-[#1E3A2F] text-white shadow' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Landscaping Projects ({jobs.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('calendar')}
            className={`cursor-pointer px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeSubTab === 'calendar' ? 'bg-[#1E3A2F] text-white shadow' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Google Calendar</span>
          </button>
          <button
            onClick={() => setActiveSubTab('events')}
            className={`cursor-pointer px-4 py-2 rounded-xl transition-all ${
              activeSubTab === 'events' ? 'bg-[#1E3A2F] text-white shadow' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Activity Audit Log ({eventLogs.length})
          </button>
          <button
            onClick={() => setActiveSubTab('config')}
            className={`cursor-pointer px-4 py-2 rounded-xl transition-all ${
              activeSubTab === 'config' ? 'bg-[#1E3A2F] text-white shadow' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Business Config
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {activeSubTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h4 className="font-serif font-bold text-xl text-[#1E3A2F]">Aravat Operations Overview</h4>
                <p className="text-xs text-gray-500 mt-1">Summary of incoming customer inquiries, qualified landscape projects, and appointment schedule.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#F9F8F6] p-6 rounded-2xl border border-gray-200">
                  <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total Inquiries</span>
                  <h3 className="font-serif font-bold text-4xl text-[#1E3A2F] mt-2">{totalInquiries}</h3>
                  <p className="text-[11px] text-emerald-600 font-medium mt-1">Bay Area Leads Captured</p>
                </div>
                <div className="bg-[#F9F8F6] p-6 rounded-2xl border border-gray-200">
                  <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Qualified Leads</span>
                  <h3 className="font-serif font-bold text-4xl text-[#1E3A2F] mt-2">{qualifiedLeads}</h3>
                  <p className="text-[11px] text-emerald-600 font-medium mt-1">Ready for Consultation</p>
                </div>
                <div className="bg-[#F9F8F6] p-6 rounded-2xl border border-gray-200">
                  <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Active Projects</span>
                  <h3 className="font-serif font-bold text-4xl text-[#1E3A2F] mt-2">{activeProjectsCount}</h3>
                  <p className="text-[11px] text-[#D4AF37] font-semibold mt-1">In Design & Construction</p>
                </div>
                <div className="bg-[#1E3A2F] text-white p-6 rounded-2xl shadow-xl">
                  <span className="text-xs text-[#D4AF37] font-semibold uppercase tracking-wider">Completed Jobs</span>
                  <h3 className="font-serif font-bold text-4xl text-[#D4AF37] mt-2">{completedJobsCount}</h3>
                  <p className="text-[11px] text-gray-300 font-medium mt-1">Bay Area Portfolio</p>
                </div>
              </div>

              <div className="bg-[#F9F8F6] p-6 rounded-2xl border border-gray-200 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h5 className="font-serif font-bold text-base text-[#1E3A2F]">Quick Project Management</h5>
                  <p className="text-xs text-gray-500">Record a new landscape project for a qualified customer inquiry.</p>
                </div>
                <button
                  onClick={() => setShowNewJobModal(true)}
                  className="cursor-pointer bg-[#1E3A2F] hover:bg-[#2C4A3E] text-white px-5 py-3 rounded-xl text-xs font-bold shadow flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 text-[#D4AF37]" />
                  <span>Create New Project Record</span>
                </button>
              </div>
            </div>
          )}

          {activeSubTab === 'leads' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-serif font-bold text-lg text-[#1E3A2F]">Customer Inquiries & AI Summaries</h4>
                <p className="text-xs text-gray-500">Inquiries captured via the website estimate form and Mateo AI project concierge.</p>
              </div>

              <div className="overflow-x-auto border border-gray-200 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#1E3A2F] text-white uppercase text-[10px] tracking-wider">
                      <th className="p-3">ID / Source</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Project Type & Location</th>
                      <th className="p-3">Budget</th>
                      <th className="p-3">Qualification</th>
                      <th className="p-3">Booking Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {leads.map((lead) => (
                      <tr key={lead.leadId} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3 font-mono">
                          <span className="font-bold text-[#1E3A2F]">{lead.leadId}</span>
                          <span className="block text-[10px] text-gray-400">{lead.source}</span>
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-gray-900 block">{lead.customerName}</span>
                          <span className="text-[11px] text-gray-500">{lead.email}</span>
                          <span className="text-[11px] text-gray-500 block">{lead.phone}</span>
                        </td>
                        <td className="p-3">
                          <span className="font-medium text-[#1E3A2F] block">{lead.projectType}</span>
                          <span className="text-[11px] text-gray-500">{lead.projectCity} ({lead.projectZip})</span>
                          <p className="text-[11px] text-gray-600 mt-1 italic max-w-xs truncate">{lead.projectDescription}</p>
                        </td>
                        <td className="p-3 font-semibold text-gray-800">
                          {lead.budgetRange}
                        </td>
                        <td className="p-3">
                          <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full text-[10px]">
                            {lead.qualificationStatus}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="font-semibold text-gray-700">{lead.bookingStatus}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSubTab === 'jobs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-lg text-[#1E3A2F]">Landscaping Projects & Status Tracking</h4>
                  <p className="text-xs text-gray-500">Track design, hardscaping, and construction projects across the Bay Area.</p>
                </div>
                <button
                  onClick={() => setShowNewJobModal(true)}
                  className="cursor-pointer bg-[#1E3A2F] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4 text-[#D4AF37]" />
                  <span>New Project</span>
                </button>
              </div>

              <div className="overflow-x-auto border border-gray-200 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#1E3A2F] text-white uppercase text-[10px] tracking-wider">
                      <th className="p-3">Project ID / Lead</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Service & Scope</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Quoted Value</th>
                      <th className="p-3">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {jobs.map((job) => (
                      <tr key={job.jobId} className="hover:bg-gray-50">
                        <td className="p-3 font-mono">
                          <span className="font-bold text-[#1E3A2F]">{job.jobId}</span>
                          <span className="block text-[10px] text-gray-400">Lead: {job.leadId}</span>
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-gray-900 block">{job.customerName}</span>
                          <span className="text-[11px] text-gray-500">{job.customerEmail}</span>
                        </td>
                        <td className="p-3">
                          <span className="font-medium text-[#1E3A2F] block">{job.serviceType}</span>
                          <p className="text-[11px] text-gray-600 mt-0.5 line-clamp-1">{job.jobDescription}</p>
                        </td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            job.jobStatus === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {job.jobStatus}
                          </span>
                        </td>
                        <td className="p-3 font-mono font-bold text-gray-900">
                          ${(job.quotedAmountCents / 100).toLocaleString()}
                        </td>
                        <td className="p-3">
                          <select
                            value={job.jobStatus}
                            onChange={(e) => handleUpdateJobStatus(job.jobId, e.target.value)}
                            className="bg-white border border-gray-300 rounded-lg px-2 py-1 text-[11px]"
                          >
                            <option value="Proposal">Proposal</option>
                            <option value="Accepted">Accepted</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Canceled">Canceled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSubTab === 'calendar' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F9F8F6] p-6 rounded-2xl border border-gray-200">
                <div>
                  <h4 className="font-serif font-bold text-lg text-[#1E3A2F]">Google Calendar API & Consultation Scheduling</h4>
                  <p className="text-xs text-gray-500 mt-1">Authenticate with Google to sync consultation appointments directly to Aravat's calendar.</p>
                </div>

                {user ? (
                  <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
                    <div className="text-right">
                      <span className="block text-xs font-bold text-gray-900">{user.displayName || user.email}</span>
                      <span className="text-[10px] text-emerald-600 font-medium">Connected to Google Calendar</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="cursor-pointer bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 p-2 rounded-lg transition-colors"
                      title="Sign out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleLogin}
                    disabled={isLoggingIn}
                    className="cursor-pointer bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs py-3 px-6 rounded-xl border border-gray-300 shadow-md flex items-center gap-3 transition-all"
                  >
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    </svg>
                    <span>{isLoggingIn ? 'Connecting...' : 'Sign in with Google'}</span>
                  </button>
                )}
              </div>

              {calendarError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{calendarError}</span>
                </div>
              )}

              {bookingSuccessMsg && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{bookingSuccessMsg}</span>
                </div>
              )}

              {user ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-5 bg-[#F9F8F6] p-6 rounded-2xl border border-gray-200 space-y-4">
                    <h5 className="font-serif font-bold text-base text-[#1E3A2F]">Schedule Consultation to Calendar</h5>
                    <p className="text-xs text-gray-500">Select an active lead and schedule an onsite consultation.</p>

                    <form onSubmit={handleScheduleEvent} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Select Lead</label>
                        <select
                          value={selectedLeadId}
                          onChange={(e) => setSelectedLeadId(e.target.value)}
                          className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#1E3A2F]"
                        >
                          {leads.map(l => (
                            <option key={l.leadId} value={l.leadId}>
                              {l.customerName} - {l.projectType} ({l.projectCity})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Consultation Date & Time</label>
                        <input
                          type="datetime-local"
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#1E3A2F]"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#1E3A2F] hover:bg-[#2C4A3E] text-white py-3 rounded-xl font-bold text-xs shadow flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Event to Google Calendar</span>
                      </button>
                    </form>
                  </div>

                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center justify-between">
                      <h5 className="font-serif font-bold text-base text-[#1E3A2F]">Your Primary Google Calendar Events</h5>
                      <button
                        onClick={() => accessToken && loadCalendar(accessToken)}
                        className="cursor-pointer text-xs text-[#1E3A2F] hover:text-[#D4AF37] flex items-center gap-1 font-semibold"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${loadingCalendar ? 'animate-spin' : ''}`} />
                        <span>Refresh</span>
                      </button>
                    </div>

                    {loadingCalendar ? (
                      <div className="text-center py-12 text-xs text-gray-500">Loading calendar events...</div>
                    ) : calendarEvents.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-200 text-xs text-gray-500">
                        No upcoming calendar events found.
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                        {calendarEvents.map((evt) => {
                          const startDate = evt.start.dateTime ? new Date(evt.start.dateTime).toLocaleString() : evt.start.date;
                          return (
                            <div key={evt.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between gap-4">
                              <div>
                                <h6 className="font-bold text-xs text-[#1E3A2F]">{evt.summary}</h6>
                                <p className="text-[11px] text-gray-500 mt-0.5">{startDate}</p>
                              </div>
                              {evt.htmlLink && (
                                <a
                                  href={evt.htmlLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-gray-400 hover:text-[#1E3A2F] shrink-0"
                                  title="View in Google Calendar"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 bg-[#F9F8F6] rounded-2xl border border-gray-200 space-y-4">
                  <Calendar className="w-12 h-12 text-[#D4AF37] mx-auto opacity-80" />
                  <div className="space-y-1">
                    <h5 className="font-serif font-bold text-lg text-[#1E3A2F]">Google Calendar Authentication Required</h5>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto">
                      Click the "Sign in with Google" button above to grant calendar access.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSubTab === 'events' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-serif font-bold text-lg text-[#1E3A2F]">Activity Audit Trail</h4>
                <p className="text-xs text-gray-500">Real-time event lifecycle tracking for customer inquiries, lead qualification, and project updates.</p>
              </div>

              <div className="overflow-x-auto border border-gray-200 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#1E3A2F] text-white uppercase text-[10px] tracking-wider">
                      <th className="p-3">Event ID</th>
                      <th className="p-3">Event Type</th>
                      <th className="p-3">Lead ID</th>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {eventLogs.map((evt: any) => (
                      <tr key={evt.eventId} className="hover:bg-gray-50">
                        <td className="p-3 font-mono text-gray-600">{evt.eventId}</td>
                        <td className="p-3">
                          <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full text-[10px]">
                            {evt.eventType}
                          </span>
                        </td>
                        <td className="p-3 font-mono font-bold text-[#1E3A2F]">{evt.leadId}</td>
                        <td className="p-3 text-gray-500">{new Date(evt.timestamp).toLocaleString()}</td>
                        <td className="p-3 font-mono text-[11px] text-gray-600 max-w-xs truncate">
                          {JSON.stringify(evt.details)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSubTab === 'config' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-serif font-bold text-lg text-[#1E3A2F]">Aravat Business Configuration</h4>
                <p className="text-xs text-gray-500">Business identity, service areas, and contact information.</p>
              </div>

              <pre className="bg-[#1E3A2F] text-[#D4AF37] p-6 rounded-2xl font-mono text-xs overflow-x-auto shadow-inner">
                {JSON.stringify(config, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* New Project Modal */}
      {showNewJobModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="font-serif font-bold text-xl text-[#1E3A2F]">Create New Landscaping Project</h3>
            <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 uppercase mb-1">Select Customer Inquiry</label>
                <select
                  value={newJobLeadId}
                  onChange={(e) => setNewJobLeadId(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5"
                >
                  {leads.map(l => (
                    <option key={l.leadId} value={l.leadId}>
                      {l.customerName} - {l.projectType} ({l.projectCity})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-gray-700 uppercase mb-1">Service Type</label>
                <select
                  value={newJobService}
                  onChange={(e) => setNewJobService(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5"
                >
                  {config.services.map(s => (
                    <option key={s.id} value={s.title}>{s.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-gray-700 uppercase mb-1">Quoted Value (Cents)</label>
                <input
                  type="number"
                  value={newJobQuotedCents}
                  onChange={(e) => setNewJobQuotedCents(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5"
                  placeholder="7500000 (= $75,000.00)"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 uppercase mb-1">Project Scope & Notes</label>
                <textarea
                  rows={3}
                  value={newJobDesc}
                  onChange={(e) => setNewJobDesc(e.target.value)}
                  placeholder="Project specifications..."
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewJobModal(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#1E3A2F] text-white px-6 py-2 rounded-xl font-bold"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
