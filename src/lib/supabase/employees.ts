import { initSupabaseClient } from './client';
import { EmployeeRawRecord } from '@/types/hr';

export interface SupabaseFetchResult {
  data: EmployeeRawRecord[] | null;
  error: string | null;
  count: number;
  isRlsBlocked?: boolean;
}

export async function fetchSupabaseEmployees(): Promise<SupabaseFetchResult> {
  const supabase = initSupabaseClient();

  if (!supabase) {
    return {
      data: null,
      error: 'Supabase environment variables missing. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment or .env.local file.',
      count: 0,
    };
  }

  try {
    const { data, error, count } = await supabase
      .from('employees')
      .select('*', { count: 'exact' });

    if (error) {
      console.error('Supabase query error:', error);
      return {
        data: null,
        error: `Database query failed: ${error.message || 'Unknown database error'}`,
        count: 0,
      };
    }

    const fetchedData = (data as EmployeeRawRecord[]) || [];
    const recordCount = count !== null ? count : fetchedData.length;

    // Check if 0 records returned due to Supabase Row Level Security (RLS) policies
    const isRlsBlocked = recordCount === 0;

    return {
      data: fetchedData,
      error: null,
      count: recordCount,
      isRlsBlocked,
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Network error connecting to Supabase.';
    return {
      data: null,
      error: errorMessage,
      count: 0,
    };
  }
}
