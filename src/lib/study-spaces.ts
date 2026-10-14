import { createClient } from "@/lib/supabase/server";
import type { StudySpace } from "@/types/study-space";

export async function getStudySpaces(userId: string): Promise<StudySpace[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("study_spaces")
    .select("id, user_id, name, description, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error("Unable to load study spaces.", { cause: error });
  return data ?? [];
}

export async function getStudySpace(userId: string, spaceId: string): Promise<StudySpace | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("study_spaces")
    .select("id, user_id, name, description, created_at")
    .eq("id", spaceId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw new Error("Unable to load study space.", { cause: error });
  return data;
}
