'use client';

import { useEffect, useState } from 'react';
import {
  Plus,
  Rocket,
  Settings2,
  Globe,
  BarChart3,
  Target,
  Calendar,
  User,
  Mail,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { Card, Button, StatusBadge, PriorityBadge } from '@/components/ui/Card';
import { EmptyState, Input, Select, Textarea, Alert } from '@/components/ui/Form';
import { formatDate, formatRelativeTime, generateId } from '@/lib/utils';
import type { DataSource } from '@/lib/portal-data/source';
import type { ServiceRequest } from '@/lib/types';

const STORAGE_KEY = 'nairobix-client-support-tickets';

const requestTypes: { id: NonNullable<ServiceRequest['type']>; title: string; description: string; icon: React.ReactNode }[] = [
  { id: 'growth-initiative', title: 'Growth Initiative', description: 'Explore a new growth opportunity', icon: <Rocket size={18} /> },
  { id: 'system-request', title: 'System Request', description: 'Request a change or implementation', icon: <Settings2 size={18} /> },
  { id: 'website-request', title: 'Website Request', description: 'Request a website or landing-page update', icon: <Globe size={18} /> },
  { id: 'reporting-question', title: 'Reporting Question', description: 'Ask about performance data', icon: <BarChart3 size={18} /> },
  { id: 'strategy-session', title: 'Strategy Session', description: 'Request time with the NairobiX team', icon: <Target size={18} /> },
];

// Demo only: locally submitted tickets are kept in this browser.
function loadDemoTickets(seed: ServiceRequest[]): ServiceRequest[] {
  if (typeof window === 'undefined') return seed;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed;
    const saved: ServiceRequest[] = JSON.parse(raw);
    const savedIds = new Set(saved.map((t) => t.id));
    return [...saved, ...seed.filter((t) => !savedIds.has(t.id))];
  } catch {
    return seed;
  }
}

export function ClientSupportView({
  source,
  initialRequests,
  supportEmail,
}: {
  source: DataSource;
  /** The Account's CRM Cases. */
  initialRequests: ServiceRequest[];
  supportEmail: string;
}) {
  // The Portal reads Cases from the CRM but cannot create them yet: in production
  // a new request is sent to NairobiX support by email instead.
  const demo = source === 'demo';
  const [tickets, setTickets] = useState<ServiceRequest[]>(initialRequests);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [justSubmitted, setJustSubmitted] = useState(false);

  const [form, setForm] = useState({
    title: '',
    type: 'system-request' as NonNullable<ServiceRequest['type']>,
    description: '',
    priority: 'medium' as NonNullable<ServiceRequest['priority']>,
  });
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  useEffect(() => {
    if (demo) setTickets(loadDemoTickets(initialRequests));
  }, [demo, initialRequests]);

  function persist(next: ServiceRequest[]) {
    setTickets(next);
    try {
      const seedIds = new Set(initialRequests.map((t) => t.id));
      const submittedOnly = next.filter((t) => !seedIds.has(t.id));
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(submittedOnly));
    } catch {
      // localStorage unavailable — the session still works, it just won't persist across reloads.
    }
  }

  function openTypeForm(type: NonNullable<ServiceRequest['type']>) {
    setForm((f) => ({ ...f, type }));
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors: typeof errors = {};
    if (!form.title.trim()) nextErrors.title = 'Give your request a short title.';
    if (!form.description.trim()) nextErrors.description = 'Tell us a bit more about what you need.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (!demo) {
      const typeLabel = requestTypes.find((t) => t.id === form.type)?.title ?? form.type;
      const subject = `Portal request: ${form.title.trim()}`;
      const body = `Type: ${typeLabel}\nPriority: ${form.priority}\n\n${form.description.trim()}`;
      window.location.href = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setForm({ title: '', type: 'system-request', description: '', priority: 'medium' });
      setShowForm(false);
      setJustSubmitted(true);
      setTimeout(() => setJustSubmitted(false), 8000);
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    const newTicket: ServiceRequest = {
      id: `req-${generateId()}`,
      title: form.title.trim(),
      type: form.type,
      description: form.description.trim(),
      status: 'submitted',
      createdDate: today,
      priority: form.priority,
      timeline: [
        { id: `t-${generateId()}`, title: 'Request submitted', description: 'Ticket created', timestamp: today, type: 'status-change' },
      ],
    };

    persist([newTicket, ...tickets]);
    setForm({ title: '', type: 'system-request', description: '', priority: 'medium' });
    setShowForm(false);
    setJustSubmitted(true);
    setExpandedId(newTicket.id);
    setTimeout(() => setJustSubmitted(false), 5000);
  }

  const unresolved = tickets.filter((t) => t.status !== 'resolved');

  return (
    <PortalLayout
      pageTitle="Support"
      pageSubtitle="Submit requests and track them from submission to resolution"
      headerActions={
        <Button variant="primary" icon={<Plus size={16} />} onClick={() => setShowForm((v) => !v)}>
          New Request
        </Button>
      }
    >
      {justSubmitted && (
        <div className="mb-6">
          {demo ? (
            <Alert type="success" title="Request submitted" description="NairobiX support will assign this shortly. Track progress below." />
          ) : (
            <Alert
              type="success"
              title="Your email is ready to send"
              description={`Your request opened in your email app, addressed to ${supportEmail}. Send it to reach NairobiX support; it will appear below once logged.`}
            />
          )}
        </div>
      )}

      {showForm && (
        <Card className="mb-8 p-6">
          <h3 className="mb-4 text-lg font-semibold text-fg">New Support Request</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-fg">Title</label>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Update homepage hero section"
              />
              {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-fg">Type</label>
                <Select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as NonNullable<ServiceRequest['type']> }))}
                  options={requestTypes.map((t) => ({ value: t.id, label: t.title }))}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-fg">Priority</label>
                <Select
                  value={form.priority}
                  onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as NonNullable<ServiceRequest['priority']> }))}
                  options={[
                    { value: 'low', label: 'Low' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'high', label: 'High' },
                    { value: 'urgent', label: 'Urgent' },
                  ]}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-fg">Description</label>
              <Textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Tell us what you need help with..."
              />
              {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description}</p>}
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" variant="primary">
                Submit Request
              </Button>
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {!showForm && (
        <div className="mb-12">
          <h3 className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-fg-tertiary">
            What would you like to request?
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            {requestTypes.map((type) => (
              <button key={type.id} onClick={() => openTypeForm(type.id)} className="text-left">
                <Card hover className="h-full p-4">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.05] text-fg-tertiary">
                    {type.icon}
                  </div>
                  <h4 className="mb-1 font-semibold text-fg">{type.title}</h4>
                  <p className="text-xs text-fg-tertiary">{type.description}</p>
                </Card>
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-fg-tertiary">
          Your Requests {unresolved.length > 0 && <span className="text-fg-tertiary">&middot; {unresolved.length} open</span>}
        </h3>

        <div className="space-y-4">
          {tickets.map((request) => {
            const isOpen = expandedId === request.id;
            return (
              <Card key={request.id} className="p-6">
                <button
                  onClick={() => setExpandedId(isOpen ? null : request.id)}
                  className="flex w-full items-start justify-between gap-4 text-left"
                >
                  <div className="flex-1">
                    <h4 className="mb-1 text-lg font-semibold text-fg">{request.title}</h4>
                    <p className="mb-3 text-sm text-fg-secondary">{request.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-fg-tertiary">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} /> {formatDate(request.createdDate)}
                      </span>
                      {request.assignedTo && (
                        <span className="flex items-center gap-1.5">
                          <User size={13} /> {request.assignedTo}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-shrink-0 flex-col items-end gap-2">
                    <StatusBadge status={request.status} />
                    {request.priority && <PriorityBadge priority={request.priority} />}
                    {isOpen ? <ChevronUp size={16} className="text-fg-tertiary" /> : <ChevronDown size={16} className="text-fg-tertiary" />}
                  </div>
                </button>

                {isOpen && request.timeline.length > 0 && (
                  <div className="mt-5 border-t border-line pt-5">
                    <p className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-fg-tertiary">Activity</p>
                    <ol className="space-y-4 border-l border-line pl-4">
                      {request.timeline.map((event) => (
                        <li key={event.id} className="relative">
                          <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-primary" />
                          <p className="text-sm font-medium text-fg">{event.title}</p>
                          <p className="text-sm text-fg-secondary">{event.description}</p>
                          <p className="mt-0.5 text-xs text-fg-tertiary">
                            {formatRelativeTime(event.timestamp)}
                            {event.performedBy ? ` · ${event.performedBy}` : ''}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {tickets.length === 0 && (
          <EmptyState
            icon={<Mail />}
            title="No requests yet"
            description="Submit your first service request to get started."
            action={{ label: 'Submit a Request', onClick: () => setShowForm(true) }}
          />
        )}
      </div>
    </PortalLayout>
  );
}
