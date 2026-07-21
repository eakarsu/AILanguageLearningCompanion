# Governed language learning operations

## Supported local boundary

The production-shaped path is `/api/governed-language-learning`. Work items cover versioned learner/guardian consent, progressive CEFR goals, licensed and safety-reviewed curriculum, accessible lessons, evidenced practice feedback, speech-service versions, spaced review, learner controls, and versioned accuracy/safety/accessibility/latency/outcome evaluation.

Draft, submission, independent approval, retirement, and receipt-backed erasure are durable and tenant-scoped.

## Privacy, minors, and instructional control

JWT and tenant configuration fail closed. Teacher, curriculum reviewer, guardian, or admin approval is required for consequential integration; self-approval is denied. Minor records require guardian consent and prohibit direct messaging in the validated workflow. Learners must be able to opt out and correct feedback. Full exports/events are limited to creator, approver, or admin. This workflow does not issue accredited certification or replace a teacher.

Idempotency keys bind to canonical request hashes. Credentials are rejected from input/provenance/outbox payloads.

## Lifecycle

- `./start.sh check` validates config without external access.
- `./start.sh start` requires dependencies to be present and performs no install/schema/seed/port-kill operation.
- `ALLOW_SCHEMA_MIGRATION=true DATABASE_URL=... ./start.sh migrate` is the only schema path.
- Demo seeds are destructive, explicit, forbidden in production, and require a caller-supplied password.

Gap endpoints remain unmounted. Generated prototypes can be enabled only explicitly outside production.

## External systems and failure

Content, dictionary, speech, LMS/classroom, identity, and instructor-portal integrations are allow-listed outbox records only. No credential, contract, model, speech service, or worker is bundled. Connected execution requires consent-aware deletion propagation, provider cursors, safe classroom tenants, rights validation, bounded retry, and delivery receipts. Failed work dead-letters after five attempts; certification, speech accuracy, and real learner outcomes remain blocked pending authoritative evaluation and instructor oversight.

## Verification

Run `node --test server/governance/tests/*.test.js`, exhaustive syntax checks for changed JavaScript, and `bash -n start.sh`. CI covers domain, consent/minor safety, authorization, migration, canonical idempotency, provider failure, and lifecycle checks without launching services or calling providers.

