import { classifyRequestError } from './connectErrors';

export type IntentFailure =
  | { kind: 'error'; message: string }
  | { kind: 'outcome-unknown'; message: string; data: Record<string, unknown> | null };

function failureData(err: unknown): Record<string, unknown> | null {
  if (typeof err !== 'object' || err === null) return null;
  const data = (err as { data?: unknown }).data;
  if (typeof data !== 'object' || data === null || Array.isArray(data)) return null;
  return data as Record<string, unknown>;
}

function failureMessage(err: unknown): string {
  return err instanceof Error && err.message ? err.message : 'Failed';
}

export function toIntentFailure(err: unknown): IntentFailure {
  if (classifyRequestError(err) === 'outcome-unknown') {
    return { kind: 'outcome-unknown', message: failureMessage(err), data: failureData(err) };
  }
  return { kind: 'error', message: failureMessage(err) };
}
