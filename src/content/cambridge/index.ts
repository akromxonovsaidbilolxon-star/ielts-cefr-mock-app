/**
 * Cambridge IELTS — shared helpers only.
 *
 * IMPORTANT: no book text may be imported here.
 *
 * This module is what the pages import, so anything it pulls in is compiled
 * into the JavaScript bundle the browser downloads — a public file. The
 * transcribed tests live in `registry.ts`, which only build-time scripts may
 * import; the pages read them from Supabase at run time instead.
 *
 * The tests are stored in `public.cambridge_tests` and fetched by
 * `src/lib/cambridgeContent.ts`, where Row Level Security limits them to
 * signed-in accounts. To seed or refresh that table:
 *
 *   npm run export:cambridge     # writes supabase/generated/cambridge-content.sql
 *
 * To prove no book text has crept back into the bundle:
 *
 *   npm run build && npm run check:bundle
 */

export * from './types';
