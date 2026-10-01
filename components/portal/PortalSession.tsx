'use client';

import { createContext, useContext } from 'react';
import type { PortalNavItem } from '@/lib/access/navigation';
import type { Permission } from '@/lib/access/permissions';
import type { RelationshipStatus, RelationshipType } from '@/lib/access/types';

/**
 * Display-only snapshot of the server-resolved principal, used to render the
 * shell (name, navigation, which header links to show). It is never a
 * source of authorization: every route and action is enforced server-side,
 * so editing this in the browser only changes what is drawn.
 */
export interface PortalSessionView {
  name: string;
  email: string;
  relationships: { type: RelationshipType; accountName: string; status: RelationshipStatus }[];
  permissions: Permission[];
  navigation: PortalNavItem[];
}

const PortalSessionContext = createContext<PortalSessionView | null>(null);

export function PortalSessionProvider({ value, children }: { value: PortalSessionView; children: React.ReactNode }) {
  return <PortalSessionContext.Provider value={value}>{children}</PortalSessionContext.Provider>;
}

export function usePortalSession() {
  const session = useContext(PortalSessionContext);
  if (!session) throw new Error('usePortalSession must be used inside the authenticated Portal.');
  return {
    ...session,
    /** For rendering decisions only — the server enforces the same permission independently. */
    can: (permission: Permission) => session.permissions.includes(permission),
  };
}
