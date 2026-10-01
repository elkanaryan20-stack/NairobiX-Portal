/**
 * Opportunity Network Participant data: Contact → Participant record(s) →
 * records explicitly linked to that Contact.
 *
 * Reads are keyed by the principal's server-resolved Participant
 * Relationship. Referral attribution, opportunity attribution, commissions,
 * rewards and engagement assignments have no authoritative CRM relationship
 * yet, so they are empty in production (not-yet-available states).
 */

import { criteriaValue, getRecord, searchRecords } from '@/lib/crm/zoho/client';
import { isDemoMode } from '@/lib/crm/mode';
import {
  mockAssessmentQuestions,
  mockConsultationSessions,
  mockDeliverables,
  mockOnboardingApplication,
  mockPartnerAssessment,
  mockPartnerBenefits,
  mockPartnerCommissions,
  mockPartnerDocuments,
  mockPartnerNotifications,
  mockPartnerProfile,
  mockPartnerProjectAssignments,
  mockPartnerReferrals,
  mockPartnerRewards,
  mockPartnerTaskAssignments,
} from '@/lib/mock-data';
import type { PortalPrincipal, Relationship } from '@/lib/access/types';
import type { Benefit, Document, Notification } from '@/lib/types';
import { cachedCrmRead } from './cache';
import { demoParticipantInsights, demoParticipantUpdates, type ParticipantInsight, type ParticipantUpdate } from './demo-content';
import { day, multiPicklist, picklist, signDocumentToView, text } from './zoho-mappers';

export interface ParticipantProfileView {
  name: string;
  email: string;
  contactId?: string;
  /** NairobiX Participant ID(s), e.g. from Participant_ID. */
  participantNumbers: string[];
  participationTypes: string[];
  participantStatus: string;
  portalAccessStatus: string;
  joined?: string;
  /** Demo-only business details. */
  businessName?: string;
  industry?: string;
}

function participantRelationship(principal: PortalPrincipal): Relationship {
  const relationship = principal.relationships.find((r) => r.type === 'participant');
  if (!relationship) throw new Error('Participant data requested without an authorized Participant Relationship.');
  return relationship;
}

export async function getParticipantProfile(principal: PortalPrincipal): Promise<ParticipantProfileView> {
  const relationship = participantRelationship(principal);

  if (isDemoMode()) {
    return {
      name: principal.name,
      email: principal.email,
      contactId: principal.contactId,
      participantNumbers: [],
      participationTypes: relationship.participationTypes ?? [mockPartnerProfile.partnerType],
      participantStatus: relationship.status === 'active' ? 'Active' : 'Onboarding',
      portalAccessStatus: 'Active',
      joined: mockPartnerProfile.joinDate,
      businessName: relationship.accountName,
      industry: mockPartnerProfile.industry,
    };
  }

  const ids = relationship.participantIds ?? [];
  const records = await cachedCrmRead(['participant', principal.contactId ?? '', 'records', ...ids], async () =>
    (await Promise.all(ids.map((id) => getRecord('participants', id)))).filter((r) => r !== null)
  );

  return {
    name: principal.name,
    email: principal.email,
    contactId: principal.contactId,
    participantNumbers: records.map((r) => text(String(r.Participant_ID ?? '')) ?? '').filter(Boolean),
    participationTypes: relationship.participationTypes ?? [...new Set(records.flatMap((r) => multiPicklist(r.Participation_Type)))],
    participantStatus: picklist(records[0]?.Participant_Status) ?? 'Active',
    portalAccessStatus: picklist(records[0]?.Portal_Access_Status) ?? 'Active',
    joined: records.map((r) => day(r.Created_Time)).filter(Boolean).sort()[0],
  };
}

/** Signature documents linked to the Participant's Contact. */
export async function getParticipantDocuments(principal: PortalPrincipal): Promise<Document[]> {
  participantRelationship(principal);
  if (isDemoMode()) return mockPartnerDocuments;
  const contactId = principal.contactId;
  if (!contactId) return [];
  return cachedCrmRead(['participant', contactId, 'documents'], async () =>
    (await searchRecords('signDocuments', `(zohosign__Contact:equals:${criteriaValue(contactId)})`)).map(signDocumentToView)
  );
}

export interface ParticipantUnsourcedData {
  notifications: Notification[];
  benefits: Benefit[];
  updates: ParticipantUpdate[];
  insights: ParticipantInsight[];
  /** Demo-only editorial content for the Resources page. */
  demoContent: boolean;
}

export function getParticipantUnsourced(principal: PortalPrincipal): ParticipantUnsourcedData {
  participantRelationship(principal);
  if (!isDemoMode()) return { notifications: [], benefits: [], updates: [], insights: [], demoContent: false };
  return {
    notifications: mockPartnerNotifications,
    benefits: mockPartnerBenefits,
    updates: demoParticipantUpdates,
    insights: demoParticipantInsights,
    demoContent: true,
  };
}

/**
 * Data for the capability-gated modules (Referrals, Opportunities, Work,
 * Earnings, Onboarding). Only the demo directory grants these modules; with
 * no CRM source they are null in production.
 */
export function getParticipantDemoModules(principal: PortalPrincipal) {
  participantRelationship(principal);
  if (!isDemoMode()) return null;
  return {
    profile: mockPartnerProfile,
    referrals: mockPartnerReferrals,
    commissions: mockPartnerCommissions,
    rewards: mockPartnerRewards,
    projectAssignments: mockPartnerProjectAssignments,
    taskAssignments: mockPartnerTaskAssignments,
    consultations: mockConsultationSessions,
    deliverables: mockDeliverables,
    onboardingApplication: mockOnboardingApplication,
    assessment: mockPartnerAssessment,
    assessmentQuestions: mockAssessmentQuestions,
  };
}

export type ParticipantDemoModules = NonNullable<ReturnType<typeof getParticipantDemoModules>>;
