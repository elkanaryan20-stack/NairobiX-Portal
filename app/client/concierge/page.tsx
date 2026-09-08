'use client';

import { ClientLayout } from '@/components/layout/ClientLayout';
import { Card, Button } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Form';
import { useState } from 'react';
import {
  HelpCircle,
  HeartHandshake,
  Target,
  FolderKanban,
  Settings2,
  MessageSquare,
  ArrowLeft,
  Zap,
  Users,
  Phone,
  Compass,
} from 'lucide-react';

const conciergeOptions = [
  {
    id: 'question',
    title: 'Ask a Question',
    description: 'Get immediate answers to your questions',
    icon: <HelpCircle size={20} />,
  },
  {
    id: 'assistance',
    title: 'Request Assistance',
    description: 'Request help with a specific task or project',
    icon: <HeartHandshake size={20} />,
  },
  {
    id: 'strategy',
    title: 'Request Strategy Session',
    description: 'Schedule time with the NairobiX team',
    icon: <Target size={20} />,
  },
  {
    id: 'project',
    title: 'Ask About Project',
    description: 'Get an update on your active projects',
    icon: <FolderKanban size={20} />,
  },
  {
    id: 'service',
    title: 'Request Service',
    description: 'Submit a new service request',
    icon: <Settings2 size={20} />,
  },
  {
    id: 'feedback',
    title: 'Share Feedback',
    description: 'Help us improve your partnership experience',
    icon: <MessageSquare size={20} />,
  },
];

export default function ClientConcierge() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle submission
    setMessage('');
    setSelectedType(null);
  };

  return (
    <ClientLayout
      pageTitle="NairobiX Concierge"
      pageSubtitle="Premium support and personalized assistance"
    >
      {/* Introduction */}
      <Card className="mb-8 border-primary-200 bg-primary-50/50 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700">
            <Compass size={19} />
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold text-neutral-900">
              Welcome to NairobiX Concierge
            </h3>
            <p className="text-neutral-700">
              Your dedicated support team is here to assist with any questions, requests, or
              guidance you need. We&apos;re committed to ensuring your success.
            </p>
          </div>
        </div>
      </Card>

      {selectedType ? (
        // Form View
        <Card className="mb-8 p-6">
          <button
            onClick={() => setSelectedType(null)}
            className="mb-4 flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft size={14} /> Back to options
          </button>

          <h3 className="mb-4 text-xl font-semibold text-neutral-900">
            {conciergeOptions.find((o) => o.id === selectedType)?.title}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Your Message
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us how we can help..."
                rows={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Preferred Contact Method
              </label>
              <select className="input">
                <option>Email</option>
                <option>Phone</option>
                <option>Virtual Meeting</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Priority
              </label>
              <select className="input">
                <option>Standard</option>
                <option>High</option>
                <option>Urgent</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="primary" onClick={handleSubmit}>
                Submit Request
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setSelectedType(null);
                  setMessage('');
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        // Options Grid
        <>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            How can we assist you today?
          </h3>

          <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {conciergeOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedType(option.id)}
                className="text-left"
              >
                <Card hover className="h-full p-6">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
                    {option.icon}
                  </div>
                  <h4 className="mb-1 font-semibold text-neutral-900">{option.title}</h4>
                  <p className="text-sm text-neutral-600">{option.description}</p>
                </Card>
              </button>
            ))}
          </div>

          {/* Response Time & Team Info */}
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: <Zap size={20} />, title: 'Fast Response', desc: 'Most requests answered within 2 hours' },
              { icon: <Users size={20} />, title: 'Expert Team', desc: 'Specialized support across all service areas' },
              { icon: <Phone size={20} />, title: 'Always Available', desc: 'Reach us during business hours or submit 24/7' },
            ].map((item) => (
              <Card key={item.title} className="p-6 text-center">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
                  {item.icon}
                </div>
                <h4 className="mb-1 font-semibold text-neutral-900">{item.title}</h4>
                <p className="text-sm text-neutral-600">{item.desc}</p>
              </Card>
            ))}
          </div>
        </>
      )}
    </ClientLayout>
  );
}
