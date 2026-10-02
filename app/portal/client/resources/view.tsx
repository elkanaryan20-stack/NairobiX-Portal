'use client';

import { useState } from 'react';
import { BookOpen, ExternalLink, FileSignature, FileText, Target, Ticket, Zap } from 'lucide-react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { Card, Badge, Button, StatusBadge } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Form';
import { EmptyState, SectionError } from '@/components/portal/States';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { ClientProposalView, ClientSignatureRequest, Loaded } from '@/lib/portal-data/client';
import type { Benefit, Document } from '@/lib/types';

type DocumentRow = Document & { signingStatus?: string; completedDate?: string; deadline?: string };

export interface ProposalLink {
  id: string;
  label: string;
  dealName: string;
  url: string;
}

/** Zoho Sign document statuses → client-facing wording. */
function signingLabel(status?: string): { key: string; label: string } | undefined {
  if (!status) return undefined;
  const s = status.toLowerCase().replace(/[\s_-]/g, '');
  if (s === 'completed' || s === 'signed') return { key: 'completed', label: 'Signed' };
  if (s === 'inprogress' || s === 'sent' || s === 'delivered') return { key: 'in-progress', label: 'Awaiting signatures' };
  if (s === 'declined') return { key: 'rejected', label: 'Declined' };
  if (s === 'expired') return { key: 'expired', label: 'Expired' };
  if (s === 'recalled') return { key: 'archived', label: 'Recalled' };
  return { key: s, label: status };
}

function StatusChip({ status }: { status?: string }) {
  const mapped = signingLabel(status);
  if (!mapped) return null;
  const variant = mapped.key === 'completed' ? 'success' : mapped.key === 'in-progress' ? 'info' : mapped.key === 'rejected' ? 'danger' : 'neutral';
  return <Badge variant={variant}>{mapped.label}</Badge>;
}

export function ClientResourcesView({
  documents,
  signatureRequests,
  proposals,
  proposalLinks,
  benefits,
}: {
  /** Zoho Sign documents for the Account. */
  documents: Loaded<DocumentRow[]>;
  /** Signature requests addressed to the signed-in person. */
  signatureRequests: Loaded<ClientSignatureRequest[]>;
  /** Quotes sent to the Account (drafts excluded). */
  proposals: Loaded<ClientProposalView[]>;
  /** https links recorded on the authorizing Deal. */
  proposalLinks: ProposalLink[];
  benefits: Benefit[];
}) {
  const awaiting = signatureRequests.ok ? signatureRequests.data.filter((s) => s.status === 'awaiting') : [];
  const proposalCount = proposalLinks.length + (proposals.ok ? proposals.data.length : 0);
  // Open on the tab that has something in it.
  const noDocuments = documents.ok && documents.data.length === 0 && awaiting.length === 0;
  const [tab, setTab] = useState(noDocuments && proposalCount > 0 ? 'proposals' : 'documents');

  const playbooks = benefits.filter((b) => b.category === 'playbook');
  const discounts = benefits.filter((b) => b.category === 'discount');
  const strategy = benefits.filter((b) => b.category === 'strategy');
  const earlyAccess = benefits.filter((b) => b.category === 'early-access');

  return (
    <PortalLayout pageTitle="Resources" pageSubtitle="Your agreements, proposals and documents from NairobiX">
      <Tabs
        tabs={[
          { label: documents.ok ? `Documents (${documents.data.length})` : 'Documents', value: 'documents' },
          { label: `Proposals (${proposalCount})`, value: 'proposals' },
          ...(benefits.length > 0 ? [{ label: 'Benefits', value: 'benefits' }] : []),
        ]}
        activeTab={tab}
        onTabChange={setTab}
      />

      {tab === 'documents' && (
        <div className="space-y-4">
          {awaiting.length > 0 && (
            <div className="rounded-card border border-primary/25 bg-primary/[0.06] p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-fg">
                <FileSignature size={16} className="text-primary" />
                {awaiting.length === 1 ? 'A document is waiting for your signature' : `${awaiting.length} documents are waiting for your signature`}
              </p>
              <ul className="mt-2 space-y-1 text-sm text-fg-secondary">
                {awaiting.map((request) => (
                  <li key={request.id}>
                    {request.documentName}
                    {request.sentDate ? <span className="text-fg-tertiary"> · sent {formatDate(request.sentDate)}</span> : null}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-fg-tertiary">Open the Zoho Sign email sent to you to review and sign.</p>
            </div>
          )}

          {!documents.ok && <SectionError what="your documents" compact={false} />}
          {documents.ok && documents.data.length === 0 && (
            <EmptyState
              icon={<FileText />}
              title="No documents yet"
              description="Agreements and documents NairobiX sends you through Zoho Sign will appear here with their signing status."
            />
          )}
          {documents.ok && documents.data.length > 0 && (
            <div className="divide-y divide-line overflow-hidden rounded-card border border-line bg-surface">
              {documents.data.map((doc) => (
                <div key={doc.id} className="flex items-start justify-between gap-4 px-4 py-3.5">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-line bg-white/[0.03] text-fg-tertiary">
                      <FileText size={15} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-fg">{doc.name}</p>
                      <p className="mt-0.5 text-xs text-fg-tertiary">
                        {[
                          doc.uploadDate ? `Sent ${formatDate(doc.uploadDate)}` : undefined,
                          doc.completedDate ? `Completed ${formatDate(doc.completedDate)}` : undefined,
                          !doc.completedDate && doc.deadline ? `Due ${formatDate(doc.deadline)}` : undefined,
                        ]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                    </div>
                  </div>
                  <StatusChip status={doc.signingStatus} />
                </div>
              ))}
            </div>
          )}
          {documents.ok && documents.data.length > 0 && (
            <p className="text-xs text-fg-tertiary">Signed copies are delivered to you by email from Zoho Sign.</p>
          )}
        </div>
      )}

      {tab === 'proposals' && (
        <div className="space-y-4">
          {proposalLinks.length > 0 && (
            <div className="divide-y divide-line overflow-hidden rounded-card border border-line bg-surface">
              {proposalLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-white/[0.02]"
                >
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
                    <Target size={15} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-fg">{link.label}</span>
                    <span className="block truncate text-xs text-fg-tertiary">{link.dealName}</span>
                  </span>
                  <span className="flex items-center gap-1 text-xs font-medium text-primary">
                    Open <ExternalLink size={13} />
                  </span>
                </a>
              ))}
            </div>
          )}

          {!proposals.ok && <SectionError what="your proposals" />}
          {proposals.ok && proposals.data.length > 0 && (
            <div className="space-y-3">
              {proposals.data.map((proposal) => (
                <Card key={proposal.id} className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-fg">{proposal.name}</p>
                      <p className="mt-0.5 text-xs text-fg-tertiary">
                        {[
                          proposal.number,
                          proposal.quoteDate ? formatDate(proposal.quoteDate) : undefined,
                          proposal.validTill ? `Valid until ${formatDate(proposal.validTill)}` : undefined,
                        ]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                    </div>
                    {proposal.stage && <StatusBadge status={proposal.stage.toLowerCase().replace(/\s+/g, '-')} />}
                  </div>
                  {proposal.summary && <p className="mt-3 text-sm text-fg-secondary">{proposal.summary}</p>}
                  {proposal.amount > 0 && (
                    <p className="mt-3 text-sm font-medium text-fg">{formatCurrency(proposal.amount, proposal.currency)}</p>
                  )}
                </Card>
              ))}
            </div>
          )}

          {proposalLinks.length === 0 && proposals.ok && proposals.data.length === 0 && (
            <EmptyState
              icon={<Target />}
              title="No proposals yet"
              description="Growth proposals and quotes NairobiX prepares for you will appear here."
            />
          )}
        </div>
      )}

      {tab === 'benefits' && benefits.length > 0 && (
        <div>
          {playbooks.length > 0 && (
            <div className="mb-12">
              <h3 className="mb-5 flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-fg-tertiary">
                <BookOpen size={15} /> Exclusive Playbooks
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {playbooks.map((benefit) => (
                  <Card key={benefit.id} className="p-6">
                    <h4 className="mb-2 text-lg font-semibold text-fg">{benefit.name}</h4>
                    <p className="text-fg-secondary">{benefit.description}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {strategy.length > 0 && (
            <div className="mb-12">
              <h3 className="mb-5 flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-fg-tertiary">
                <Target size={15} /> Strategy Benefits
              </h3>
              <div className="space-y-4">
                {strategy.map((benefit) => (
                  <Card key={benefit.id} className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="mb-2 text-lg font-semibold text-fg">{benefit.name}</h4>
                        <p className="text-fg-secondary">{benefit.description}</p>
                      </div>
                      <Button variant="primary" size="sm" className="flex-shrink-0" onClick={() => (window.location.href = '/portal/client/support')}>
                        Schedule
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {discounts.length > 0 && (
            <div className="mb-12">
              <h3 className="mb-5 flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-fg-tertiary">
                <Ticket size={15} /> Exclusive Discounts
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {discounts.map((benefit) => (
                  <Card key={benefit.id} className="border-emerald-500/20 bg-emerald-500/[0.06] p-6">
                    <h4 className="mb-1 text-lg font-semibold text-fg">{benefit.name}</h4>
                    <p className="mb-3 text-sm text-fg-secondary">{benefit.description}</p>
                    {benefit.value && <Badge variant="success">{benefit.value}</Badge>}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {earlyAccess.length > 0 && (
            <div>
              <h3 className="mb-5 flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-fg-tertiary">
                <Zap size={15} /> Early Access
              </h3>
              <Card className="p-6">
                {earlyAccess.map((benefit) => (
                  <div key={benefit.id}>
                    <h4 className="mb-2 text-lg font-semibold text-fg">{benefit.name}</h4>
                    <p className="text-fg-secondary">{benefit.description}</p>
                  </div>
                ))}
              </Card>
            </div>
          )}
        </div>
      )}
    </PortalLayout>
  );
}
