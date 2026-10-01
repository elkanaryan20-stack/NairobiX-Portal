import { isDemoMode } from '@/lib/crm/mode';

/** `crm` in production; `demo` only in local development (see lib/crm/mode.ts). */
export type DataSource = 'demo' | 'crm';

export function dataSource(): DataSource {
  return isDemoMode() ? 'demo' : 'crm';
}
