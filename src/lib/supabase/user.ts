import { getSupabaseConfig } from "./config";
import { createClient } from "./server";

export async function getCurrentUser() {
  if (!getSupabaseConfig()) return null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();

    if (error || !data?.claims) return null;

    const metadata = data.claims.user_metadata;
    const metadataName = typeof metadata?.full_name === "string"
      ? metadata.full_name
      : typeof metadata?.name === "string"
        ? metadata.name
        : null;

    return {
      id: data.claims.sub,
      email: data.claims.email ?? null,
      name: metadataName?.trim() || data.claims.email?.split("@")[0] || null,
    };
  } catch {
    return null;
  }
}
