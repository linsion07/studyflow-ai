export type StudySpace = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  created_at: string;
};

export type CreateStudySpaceState = {
  error?: "invalidName" | "createFailed";
  success?: boolean;
};
