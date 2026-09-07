'use client';

import { ClientLayout } from '@/components/layout/ClientLayout';
import { Card, Button } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Form';
import { useState } from 'react';

const conciergeOptions = [
  {
    id: 'question',
    title: 'Ask a Question',
    description: 'Get immediate answers to your questions',
    icon: '❓',
  },
  {
    id: 'assistance',
    title: 'Request Assistance',
    description: 'Request help with a specific task or project',
    icon: '🤝',
  },
  {
    id: 'strategy',
    title: 'Request Strategy Session',
    description: 'Schedule time with the NairobiX team',
    icon: '🎯',
  },
  {
    id: 'project',
    title: 'Ask About Project',
    description: 'Get an update on your active projects',
    icon: '📋',
  },
  {
    id: 'service',
    title: 'Request Service',
    description: 'Submit a new service request',
    icon: '⚙️',
  },
  {
    id: 'feedback',
    title: 'Share Feedback',
    description: 'Help us improve your partnership experience',
    icon: '💬',
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
      <Card className="mb-8 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 p-6">
        <h3 className="text-lg font-bold text-neutral-900 mb-2">
          Welcome to NairobiX Concierge
        </h3>
        <p className="text-neutral-700">
          Your dedicated support team is here to assist with any questions, requests, or guidance you need. We&apos;re committed to ensuring your success.
        </p>
      </Card>

      {selectedType ? (
        // Form View
        <Card className="p-6 mb-8">
          <button
            onClick={() => setSelectedType(null)}
            className="text-primary font-medium text-sm mb-4 hover:underline"
          >
            ← Back to options
          </button>

          <h3 className="text-xl font-bold text-neutral-900 mb-4">
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
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">
            How can we assist you today?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {conciergeOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedType(option.id)}
                className="text-left"
              >
                <Card hover className="p-6 h-full">
                  <p className="text-4xl mb-3">{option.icon}</p>
                  <h4 className="font-bold text-neutral-900 mb-1">
                    {option.title}
                  </h4>
                  <p className="text-sm text-neutral-600">
                    {option.description}
                  </p>
                </Card>
              </button>
            ))}
          </div>

          {/* Response Time & Team Info */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <p className="text-3xl mb-2">⚡</p>
              <h4 className="font-bold text-neutral-900 mb-1">
                Fast Response
              </h4>
              <p className="text-sm text-neutral-600">
                Most requests answered within 2 hours
              </p>
            </Card>

            <Card className="p-6 text-center">
              <p className="text-3xl mb-2">👥</p>
              <h4 className="font-bold text-neutral-900 mb-1">
                Expert Team
              </h4>
              <p className="text-sm text-neutral-600">
                Specialized support across all service areas
              </p>
            </Card>

            <Card className="p-6 text-center">
              <p className="text-3xl mb-2">📞</p>
              <h4 className="font-bold text-neutral-900 mb-1">
                Always Available
              </h4>
              <p className="text-sm text-neutral-600">
                Reach us during business hours or submit 24/7
              </p>
            </Card>
          </div>
        </>
      )}
    </ClientLayout>
  );
}
