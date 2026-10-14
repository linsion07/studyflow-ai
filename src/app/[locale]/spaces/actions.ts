"use server";

import { hasLocale } from "next-intl";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/user";
import type { CreateStudySpaceState } from "@/types/study-space";

export async function createStudySpace(
  _previous: CreateStudySpaceState,
  formData: FormData,
): Promise<CreateStudySpaceState> {
  const localeValue = formData.get("locale");
  const locale = typeof localeValue === "string" && hasLocale(routing.locales, localeValue)
    ? localeValue
    : routing.defaultLocale;
  const nameValue = formData.get("name");
  const name = typeof nameValue === "string" ? nameValue.trim() : "";

  if (!name || name.length > 80) return { error: "invalidName" };

  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login`);

  const supabase = await createClient();
  const { error } = await supabase.from("study_spaces").insert({
    user_id: user.id,
    name,
  });

  if (error) return { error: "createFailed" };

  revalidatePath(`/${locale}/spaces`);
  return { success: true };
}
