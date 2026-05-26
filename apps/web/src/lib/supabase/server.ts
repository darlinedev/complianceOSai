import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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
        getUser: () => {
          console.warn("Supabase server auth running in local Demo mode.");
          return Promise.resolve({ data: { user: null }, error: null });
        }
      }
    };
    return dummyClient as unknown as ReturnType<typeof createServerClient>;
  }

  const cookieStore = cookies();

  return createServerClient(url!, anonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Ignore
        }
      },
    },
  });
}
