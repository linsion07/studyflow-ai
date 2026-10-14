# Private analysis service contract

The analysis engine is maintained and deployed separately from this public repository. The Next.js server calls it with a shared bearer token. The browser never receives that token or the model provider key.

Set `STUDYFLOW_CORE_API_URL` and `STUDYFLOW_CORE_API_TOKEN` in the web server environment. The private engine must use the same token and configure its own model provider key. Keep the engine reachable only from the web server where possible.

## Endpoints

- `GET /ready`: requires `Authorization: Bearer <token>`. Return `200` when model generation is configured, or `503` when it is not.
- `POST /analyze`: requires the same token and `multipart/form-data` with a `file` field containing a PDF. Return `200` with structured JSON after a successful model response. Return `415` for a non-PDF, `422` for an unreadable PDF, `503` for missing model configuration, or `502` when model generation fails. Never return a rule-based fallback as a successful AI result.

The web app accepts searchable, unencrypted PDFs up to 6 MB. The private engine should also enforce limits; the current MVP contract supports up to 40 pages and 80,000 extracted characters.

The successful JSON response must include:

```json
{
  "generation_mode": "ai",
  "title": "Document title",
  "summary": "A concise summary grounded in the PDF",
  "chapters": [{ "title": "Chapter", "level": 1, "summary": "Chapter summary" }],
  "key_points": [{ "topic": "Topic", "detail": "Grounded explanation" }],
  "formulas": [{ "name": "Formula name", "formula": "expression" }],
  "exam_focus": [{ "topic": "Topic", "reason": "Why it matters" }],
  "flashcards": [{ "question": "Question", "answer": "Answer" }]
}
```

Arrays may be empty when the document does not support that section. The UI only displays a result as AI notes when `generation_mode` is `ai` and all required fields have the expected types. The API route stores the response in the private `documents` table after the engine succeeds.
