# Audit Note — AILanguageLearningCompanion

Source audit: `_AUDIT/reports/batch_05.md` § 5

## Original audit recommendations

### Missing AI endpoints
- `/ai/tutor-response` (interactive 1-on-1 conversation) — exists today as `/api/tutor/ai-chat`
- `/ai/grammar-correction`
- `/ai/pronunciation-feedback`
- `/ai/personalized-lesson-plan`
- `/ai/idiom-explanation`

### Missing non-AI features
- Speech-to-text integration
- Community forum / peer practice
- Streak tracking & gamification
- Certification exam prep (TOEFL, IELTS)
- Teacher dashboard

### Custom feature suggestions
- Agentic conversation partner
- Voice-based lesson delivery
- Cultural immersion storytelling
- Real-time speech-to-text evaluation
- Peer review agent
- Vertical vocabulary packs

## Implemented in this pass
Created `server/routes/ai.js` and mounted at `/api/ai` in `server/index.js`. Adds three endpoints under the formal `/ai/*` namespace called out by the audit:

1. **POST `/api/ai/grammar-correction`** — corrects writing exercises with structured error annotation.
2. **POST `/api/ai/personalized-lesson-plan`** — adaptive lesson plan from level, goals, weak areas, available minutes.
3. **POST `/api/ai/idiom-explanation`** — cultural context, register, examples, related idioms.

All three reuse the existing `services/openrouter.js` `callOpenRouter` and `aiRateLimiter` middleware. JSON-only output is parsed via a small local `parseJson` helper. Syntax checked with `node -c`.

Note: `/api/tutor/ai-chat` already covers `/ai/tutor-response`; the audit's "0 AI endpoints" reflects no `/ai/*` namespace, which is now established.

## Backlog (priority order)

### Mechanical
- `/ai/pronunciation-feedback` (text-only feedback is fine; audio analysis needs ASR)
- Inventory of existing `*/ai-*` routes under a unified `/api/ai/*` alias for discoverability.

### Needs creds / external SDK
- Speech-to-text (Whisper, Google STT)
- Pronunciation scoring (audio analysis)

### Needs product decision
- Streak tracking schema and gamification scoring
- Teacher dashboard (multi-tenant data model)
- Forum/peer practice (moderation + matching policy)
- Cert prep packs (curated content licensing)

## Apply pass 3 (frontend)
LEFT-AS-IS. Frontend (React CRA, axios `client/src/services/api.js` with Bearer interceptor on `localStorage.token`) already covers every AI route. Per-feature `ai-*` endpoints render through the generic `pages/FeaturePage.js` driven by config in `App.js`; the 3 pass-2 `/api/ai/*` endpoints (grammar-correction, personalized-lesson-plan, idiom-explanation) are wired in `pages/AIToolsPage.js` mounted at `/ai-tools`. No FE work needed. Log: `_AUDIT/apply3_logs/ab3_84.md`.

## Apply pass 4 (mechanical backlog)
LEFT-AS-IS. The flagged mechanical item `/ai/pronunciation-feedback` is already implemented in `server/routes/ai.js` (line 69) using existing `callOpenRouter` + `aiRateLimiter` (503-on-no-key handled by the shared helper) and is wired into `client/src/pages/AIToolsPage.js` (lines 32, 35). The routes-inventory backlog item is also live at `/api/ai/routes-inventory`. All other backlog (audio pronunciation scoring, STT, gamification, teacher dashboard, peer forum, cert prep) is NEEDS-CREDS or NEEDS-PRODUCT-DECISION. Log: `_AUDIT/apply4_logs/ab3_84.md`.
