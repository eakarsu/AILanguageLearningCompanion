# Completeness Review: AILanguageLearningCompanion

- **Review date:** 2026-07-18
- **Assessment basis:** Static source and configuration inspection only. Dependencies were not installed, and no build, database migration, external integration, or runtime workflow was executed.

## Classification

**Functional but incomplete**

## Verdict

The repository contains a coherent language learning implementation with 71 source files and 35 route modules, so it is more than a wireframe. It remains incomplete for real deployment because authoritative integrations, validated domain behavior, and operational hardening are not demonstrated by the inspected source.

## Why it is not complete

- 27 files are explicitly named as gap/gap-feature implementations; route/page count therefore overstates completed product capability.
- The route/page inventory includes `aitools page`, `daily lesson`, `dashboard`, `feature page`; these surfaces show breadth but not durable execution against authoritative systems.
- 33 files reference model-provider or chat-completion behavior; generic LLM calls are not a substitute for deterministic domain execution, grounding, or evaluation.
- 26 files contain mock, sample, placeholder, or random-data signals, leaving important outcomes disconnected from authoritative systems.
- No recognizable application test files were found in the inspected tree.
- No CI workflow was found to continuously verify builds, tests, migrations, or security checks.
- No environment example/template was found, so required configuration and secret boundaries are undocumented.

## Needed features

- 1. Implement a workflow to manage proficiency goals, curricula, practice sessions, speech/text feedback, spaced review, and learner progress.
- 2. Connect curated content/dictionaries, speech services, classroom/LMS, identity, and optional instructor portals; replace seed/demo records with durable synchronized data and explicit failure handling.
- 3. Validate level alignment, feedback accuracy, pronunciation scoring, content safety, accessibility, latency, and learning outcomes.
- 4. Protect learner/minor data, track content rights, expose AI uncertainty, and give teachers/learners control.
- 5. Add contract, integration, authorization, migration, and end-to-end tests in CI, plus a documented non-destructive deployment/run path.

## Risks or launch blockers

- Credential/secret fallback or demo-password patterns occur in 3 files and must be removed or made development-only.
- The root launcher can terminate unrelated processes occupying configured ports.
- The root launcher seeds, creates, migrates, or otherwise mutates database state during startup.
- The root launcher installs dependencies at run time, reducing reproducibility and expanding supply-chain risk.
- Ungrounded or malformed model output can become a domain action unless schemas, evidence, evaluations, and approval gates are added.

## Evidence inspected

- `client/package.json` — declared scripts, runtime dependencies, and application boundaries.
- `package.json` — declared scripts, runtime dependencies, and application boundaries.
- `client/src/index.js` — service composition, middleware, and registered routes.
- `server/index.js` — service composition, middleware, and registered routes.
- `server/models/index.js` — service composition, middleware, and registered routes.
- `server/routes/ai.js` — implemented API surface and domain/AI request handling.

## Recommended next action

Use aitools page and daily lesson as the boundary for one production language learning workflow, connect its authoritative systems, and define measurable acceptance tests; defer additional screens until it passes end to end.

## Implementation progress

**Local status:** The locally actionable governed language-learning foundation is implemented. It does not claim accredited outcomes, production speech accuracy, connected LMS/classroom data, content-rights clearance, or instructor/guardian acceptance.

- **Needed feature 1 — implemented locally:** `server/governance/domain.js`, router, and migration persist consented learner goals, progressive CEFR curricula, practice attempts, evidenced text/speech feedback, spaced review, learner controls, progress metrics, approvals, retirement, export, and erasure.
- **Needed feature 2 — bounded, externally blocked:** content, dictionary, speech, LMS/classroom, identity, and instructor-portal work is approval-gated through an idempotent outbox with checkpoints, retry, dead letters, and receipts. Real synchronization requires credentials, contracts, rights, consent mappings, and safe tenants.
- **Needed feature 3 — implemented locally; production outcomes blocked:** deterministic fixtures validate CEFR progression, curriculum rights/version/safety/accessibility, feedback evidence and confidence, pronunciation service version, spaced review, accuracy, safety, latency, accessibility, and outcome metrics.
- **Needed feature 4 — implemented locally:** active learner/guardian consent, minor messaging restriction, tenant/RBAC isolation, independent teacher/curriculum/guardian approval, scoped export, correction/opt-out controls, immutable audit, retention/erasure path, uncertainty, and credential rejection are enforced locally.
- **Needed feature 5 — implemented locally:** domain, contract, authorization, migration, integration, failure, and lifecycle tests; CI; blank tracked environment template; operations docs; explicit migration; gated seed; and non-destructive launcher are present.
- **Risk closure:** default gap mounts and hard-coded demo credentials were removed; generated prototypes are non-production opt-ins; external speech/model actions remain queued and fail closed.
