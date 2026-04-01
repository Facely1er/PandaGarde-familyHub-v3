// No-op stub — Supabase disabled in no-backend mode.
// All data stays locally on the user's device (localStorage).
// No data is sent to any remote database.

export const supabase = null;

export const isSupabaseAvailable = () => false;

export const safeSupabaseQuery = async <T>(
  _queryFn: (client: any) => Promise<{ data: T | null; error: any }>
): Promise<{ data: T | null; error: string | null }> => {
  return { data: null, error: 'Supabase is not configured (no-backend mode)' };
};

export const safeSupabaseMutation = async <T>(
  _mutationFn: (client: any) => Promise<{ data: T | null; error: any }>
): Promise<{ data: T | null; error: string | null }> => {
  return { data: null, error: 'Supabase is not configured (no-backend mode)' };
};

export const DB_SCHEMA_PREFIX = 'pandagarde_';
