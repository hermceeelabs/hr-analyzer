import { initSupabaseClient } from './client';
import { EmployeeRawRecord } from '@/types/hr';

export interface SupabaseFetchResult {
  data: EmployeeRawRecord[] | null;
  error: string | null;
  count: number;
  isRlsBlocked?: boolean;
}

const PAGE_SIZE = 1000; // Supabase PostgREST default page ceiling

export async function fetchSupabaseEmployees(): Promise<SupabaseFetchResult> {
  const supabase = initSupabaseClient();

  if (!supabase) {
    return {
      data: null,
      error:
        'Supabase environment variables missing. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.',
      count: 0,
    };
  }

  try {
    // ── Step 1: get the exact total row count ──────────────────────────────
    const { count: totalCount, error: countError } = await supabase
      .from('employees')
      .select('*', { count: 'exact', head: true }); // HEAD request — no rows transferred

    if (countError) {
      console.error('Supabase count error:', countError);
      return {
        data: null,
        error: `Database query failed: ${countError.message || 'Unknown error'}`,
        count: 0,
      };
    }

    const total = totalCount ?? 0;

    if (total === 0) {
      // Connected but 0 rows — likely RLS blocking anonymous reads
      return { data: [], error: null, count: 0, isRlsBlocked: true };
    }

    // ── Step 2: paginate through ALL rows ─────────────────────────────────
    const allRows: EmployeeRawRecord[] = [];
    let from = 0;

    while (from < total) {
      const { data: page, error: pageError } = await supabase
        .from('employees')
        .select('*')
        .range(from, from + PAGE_SIZE - 1);

      if (pageError) {
        console.error('Supabase page error:', pageError);
        return {
          data: null,
          error: `Paginated fetch failed at offset ${from}: ${pageError.message}`,
          count: 0,
        };
      }

      if (!page || page.length === 0) break;

      allRows.push(...(page as EmployeeRawRecord[]));
      from += PAGE_SIZE;
    }

    console.log(`✅ Supabase: fetched ${allRows.length} / ${total} employee records`);

    return {
      data: allRows,
      error: null,
      count: allRows.length,
      isRlsBlocked: false,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Network error connecting to Supabase.';
    return { data: null, error: msg, count: 0 };
  }
}
