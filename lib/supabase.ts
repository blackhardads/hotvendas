import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL ?? '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

let _supabaseAdmin: any = null;

if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  _supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
} else {
  // Chainable stub used when env vars are not set (build time / local without DB).
  // Every terminal method (order, limit, insert, upsert, update, delete) resolves
  // to { data: [], error: null } so callers don't crash.
  const EMPTY = { data: [] as any[], error: null };
  const EMPTY_ONE = { data: null, error: null };

  function makeChainable(): any {
    const obj: any = {};
    // Filters / modifiers — return same chainable object
    const passthrough = ['eq', 'neq', 'gt', 'lt', 'gte', 'lte', 'in', 'is', 'not',
                         'select', 'filter', 'match', 'contains', 'containedBy',
                         'overlaps', 'textSearch', 'or', 'and', 'onConflict'];
    passthrough.forEach((m) => { obj[m] = (..._args: any[]) => obj; });

    // Terminal methods that resolve the chain
    obj.order  = async (..._args: any[]) => EMPTY;
    obj.limit  = async (..._args: any[]) => EMPTY;
    obj.single = async ()               => EMPTY_ONE;

    // Allow awaiting the chain directly (e.g. `await supabase.from().select()`)
    obj.then = (resolve: any, reject: any) => Promise.resolve(EMPTY).then(resolve, reject);

    return obj;
  }

  _supabaseAdmin = {
    from: (_table: string) => {
      const chain = makeChainable();
      chain.insert = async (_row: any) => EMPTY_ONE;
      chain.upsert = async (_row: any, _opts?: any) => EMPTY_ONE;
      // update/delete need to remain chainable so `.eq()` works after them
      chain.update = (_row: any) => makeChainable();
      chain.delete = ()          => makeChainable();
      return chain;
    },
    auth: {
      getUser: async (_token?: string) => ({ data: { user: null }, error: new Error('No Supabase URL') }),
    },
    storage: {
      from: (_bucket: string) => ({
        upload: async (_path: string, _file: unknown, _opts?: unknown) => ({ data: null, error: new Error('No Supabase URL') }),
        getPublicUrl: (_path: string) => ({ data: { publicUrl: '' } }),
      }),
    },
  };
}

export const supabaseAdmin = _supabaseAdmin;
