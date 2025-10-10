export function uid(prefix = ''): string {
  return prefix + Math.random().toString(36).slice(2, 9);
}

export const EXPENSE_COLORS: Record<string, string> = {
  Rent: '#ef4444',
  Supplies: '#eab308',
  Utilities: '#3b82f6',
  Other: '#8b5cf6',
};