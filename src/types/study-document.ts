export type StudyDocumentSummary = {
  id: string;
  filename: string;
  status: "processing" | "completed" | "failed";
  created_at: string;
  verified_ai?: boolean;
};

export type StudyDocument = StudyDocumentSummary & {
  user_id: string;
  space_id: string;
  analysis: unknown;
  error_message: string | null;
};

export type StudyNotes = {
  generation_mode: "ai";
  title: string;
  summary: string;
  chapters: { title: string; level: number; summary: string }[];
  key_points: { topic: string; detail: string }[];
  formulas: { name: string; formula: string }[];
  exam_focus: { topic: string; reason: string }[];
  flashcards: { question: string; answer: string }[];
};

export function isStudyNotes(value: unknown): value is StudyNotes {
  if (!value || typeof value !== "object") return false;
  const notes = value as Record<string, unknown>;
  if (notes.generation_mode !== "ai") return false;
  if (typeof notes.title !== "string" || typeof notes.summary !== "string") return false;
  const fields = ["chapters", "key_points", "formulas", "exam_focus", "flashcards"];
  if (!fields.every((field) => Array.isArray(notes[field]))) return false;
  return (
    (notes.chapters as unknown[]).every((item) => isRecordWithStrings(item, ["title", "summary"]) && typeof (item as Record<string, unknown>).level === "number") &&
    (notes.key_points as unknown[]).every((item) => isRecordWithStrings(item, ["topic", "detail"])) &&
    (notes.formulas as unknown[]).every((item) => isRecordWithStrings(item, ["name", "formula"])) &&
    (notes.exam_focus as unknown[]).every((item) => isRecordWithStrings(item, ["topic", "reason"])) &&
    (notes.flashcards as unknown[]).every((item) => isRecordWithStrings(item, ["question", "answer"]))
  );
}

function isRecordWithStrings(value: unknown, keys: string[]): boolean {
  return Boolean(
    value && typeof value === "object" &&
    keys.every((key) => typeof (value as Record<string, unknown>)[key] === "string"),
  );
}
