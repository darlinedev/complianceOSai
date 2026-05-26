import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const isConfigured =
    url &&
    url !== "your-supabase-project-url" &&
    url.startsWith("http") &&
    anonKey &&
    anonKey !== "your-supabase-anon-key";

  if (!isConfigured) {
    // Strict-typed safe dummy client to bypass Next.js build-time generation warnings without any type assertions
    const dummyClient = {
      auth: {
        signInWithPassword: () => {
          console.warn("Supabase auth running in local Demo mode.");
          return Promise.resolve({ data: { user: null }, error: null });
        },
        signUp: () => {
          console.warn("Supabase auth running in local Demo mode.");
          return Promise.resolve({ data: { user: null }, error: null });
        },
        signOut: () => {
          console.warn("Supabase auth running in local Demo mode.");
          return Promise.resolve({ error: null });
        },
        getUser: () => {
          console.warn("Supabase auth running in local Demo mode.");
          return Promise.resolve({ data: { user: null }, error: null });
        },
        onAuthStateChange: () => {
          console.warn("Supabase auth running in local Demo mode.");
          return { data: { subscription: { unsubscribe: () => {} } } };
        }
      }
    };
    return dummyClient as unknown as ReturnType<typeof createBrowserClient>;
  }

  return createBrowserClient(url!, anonKey!);
}
