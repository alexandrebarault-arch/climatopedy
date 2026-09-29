# Editorial Comprehension Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make visitor-facing scientific content understandable to non-specialists and add a repeatable local audit for editorial rules.

**Architecture:** Keep existing React content in place. Add a versioned JSON term registry and a deterministic TypeScript audit command that scans visitor-facing source text and emits file/line diagnostics; use tests for rules with objective outcomes and mark subjective checks as warnings. Perform the initial copy review across public-facing source strings, then document how to maintain the rules. Do not edit GitHub workflows or attach the audit to a command run by GitHub Actions.

**Tech Stack:** TypeScript, Node.js, `tsx`, Node test runner, JSON.

**Spec:** `docs/superpowers/specs/2026-09-28-editorial-comprehension-design.md`

## Global Constraints

- Write for a curious reader without scientific training.
- Present researchers and organizations with a brief identity and relevance at first useful mention.
- Explain acronyms, notation, abstract concepts, numbers, time periods, and scales in accessible language.
- Preserve scientific nuance while distinguishing study findings from site conclusions.
- Keep automated checks deterministic; subjective comprehension is reviewed by a person.
- Do not add a GitHub Actions workflow/job or make the new audit part of an existing command invoked by GitHub Actions.
- Keep the current content architecture; no broad content migration or AI-generated definitions.

## Review Focus

- **Duplicate mentions in one component:** an explanation near one mention must not silently bless unrelated copy; test the audit's chosen context behavior.
- **Common scientific forms and inflections:** accents, punctuation, `et al.`, and singular/plural forms must match intentionally; test registry matching.
- **Source-code noise:** developer comments, imports, and non-visitor code must not create false content findings; test source extraction scope.
- **Intentional exceptions:** an exception must be local, named, and visible in diagnostics; test malformed and valid exceptions.
- **Incomplete scan:** an unreadable visitor-facing source directory must fail visibly rather than yield a false clean audit; syntax errors remain covered by the existing TypeScript check.

---

### Task 1: Define the editorial register and audit behavior

**Files:**
- Create: `docs/editorial/terms.json`
- Create: `scripts/auditEditorialComprehension.ts`
- Create: `tests/editorialComprehension.test.ts`

**Interfaces:**
- Registry entries define `id`, `term` (regular expression), `category`, `severity` (`error` or `warning`), `readerExplanation`, and optional `explanationPattern`; local exceptions live beside the affected copy as reasoned source comments.
- Audit exports `auditEditorialComprehension(rootDir: string): EditorialDiagnostic[]` for tests and CLI use.
- Diagnostics contain `file`, `line`, `termId`, `severity`, and `message`.

- [x] **Step 1: Add tests for registry validation, explained and unexplained mentions, warning/error exit behavior, excluded source text, and local exceptions.**
- [x] **Step 2: Run `node --import tsx --test tests/editorialComprehension.test.ts`; confirm expected failures.** RED: missing audit module; GREEN: 10/10 focused tests pass.
- [x] **Step 3: Implement the registry loader, scoped source scan, diagnostics, and CLI exit behavior.** Uses documented lexical extraction, masks comments/imports, and scans JSX copy blocks, text attributes, and known visitor-copy data fields.
- [x] **Step 4: Run the focused test; confirm it passes and that CLI output includes file and line.** 10/10 tests pass; CLI output includes `Faq.tsx:1 [smil] warning`.

### Task 2: Add the maintainable rule set and local command

**Files:**
- Modify: `docs/editorial/terms.json`
- Modify: `package.json`
- Modify: `tests/verificationHarness.test.ts`
- Modify: `tests/editorialComprehension.test.ts`

**Interfaces:**
- `npm run audit:editorial` runs the scanner against the repository's visitor-facing source.
- The audit is intentionally a standalone local command. Do not add it to `verify`, `build`, or `.github/workflows/*` because those are invoked by GitHub Actions.

- [x] **Step 1: Add tests requiring the standalone script and asserting the specified severity/exception semantics.**
- [x] **Step 2: Run the focused tests and confirm failure.** RED: standalone command absent and visible `<span>` labels were out of scan scope.
- [x] **Step 3: Populate initial rules for the identified names and terms: Smil, Erisman, `et al.`, azote réactif/de synthèse, ammoniac de synthèse, déplétion fossile, estimation agrégée, contrefactuel.** Separate objective hard errors from heuristic warnings; explain each term in plain French. Added FaIR after the wider copy review identified it as a common unexplained label.
- [x] **Step 4: Add `audit:editorial` to `package.json`; update the verification harness test to assert it exists and is not wired into `verify` / `build`.**
- [x] **Step 5: Run focused tests and `npm run audit:editorial`; inspect each diagnostic.** 16/16 focused tests pass. Baseline scan found 53 issues across 13 components: 4 hard-error classes and 5 warning classes; Task 3 will revise these.

### Task 3: Review and revise visitor-facing copy

**Files:**
- Modify only visitor-facing content files identified by the audit, including as applicable: `src/components/InteractiveFaqSection.tsx`, `src/components/TechTooltip.tsx`, `src/components/ScientificSourcesView.tsx`, and other source components found in the scan.
- Modify: `docs/editorial/terms.json` when a recurring rule or explanation needs clarification.

**Interfaces:** Existing components retain their current public APIs and layout; changes are to displayed text and local exceptions only.

- [x] **Step 1: Run the audit and record the full set of findings in the plan checklist or audit output.** Baseline diagnostics captured under the plan workspace; the first pass found 53, citation fields surfaced 2 more Erisman mentions, and adding the FaIR rule surfaced 19 acronym/context findings.
- [x] **Step 2: Revise copy so the first useful mention identifies Smil and Erisman, defines technical wording in plain language, and states what the estimates do and do not measure.** Updated the FAQ, source entries, tooltip, comparison citation, and causal diagram.
- [x] **Step 3: Replace or explain jargon such as « effet ciseau de la déplétion fossile », « estimation agrégée » and « contrefactuel »; preserve the scientific caveat in direct language.** Replaced with direct wording and preserved the limits on population estimates and gas supply claims.
- [x] **Step 4: Review remaining findings across all visitor-facing source surfaces; fix them or add a narrow documented exception with a reason.** Expanded all displayed « et al. » abbreviations into « et les autres auteurs », clarified FaIR labels throughout the interface, and corrected the WorldMap tooltip; no exceptions needed.
- [x] **Step 5: Run `npm run audit:editorial`; confirm no unexplained hard errors remain and inspect every warning.** `Editorial audit: no findings.`

### Task 4: Document maintenance and complete verification

**Files:**
- Create: `docs/editorial/README.md`
- Modify: `docs/site-architecture.md` only if needed to point to the editorial command/guide.
- Modify: this plan to check off completed steps and record rulings.

- [x] **Step 1: Document rule fields, how to add a term, how to justify an exception, and the limits of automated comprehension checks.** Added `docs/editorial/README.md` and linked it from the architecture guide.
- [x] **Step 2: Run `npm test`, `npm run lint`, `npm run build`, and `npm run audit:editorial`; inspect exit codes and all output.** `npm test`: 60/63 (three unrelated existing climate/habitability failures); `npm run lint`: blocked by an existing type error in `scripts/generateHouseholdWaterAccessData.ts:53`; `npm run build`: pass after retrying one transient report-write error; editorial audit: no findings.
- [x] **Step 3: Inspect the final diff and confirm `.github/workflows/*` is unchanged and no generated unrelated reports are staged.** Workflows have no diff; generated reports were restored; `git diff --check` is clean. Final self-review added coverage for inline emphasis; all 20 focused audit/harness tests pass.
- [x] **Step 4: Commit the finished work on `codex/editorial-comprehension`, then push that branch to the configured remote.** The finished commit was pushed to `origin/codex/editorial-comprehension`; no pull request or GitHub job was created.

## Tracking

- Branch: `codex/editorial-comprehension`
- GitHub Actions workflow/job changes: none.
- Implementation rulings: record deviations below as `Ruling: <decision> — <reason> — <cost if wrong>`.
- Task 1 ruling: use documented lexical extraction instead of the TypeScript compiler API; the installed TypeScript 7 root package exposes version metadata only and its parser tooling is marked unstable. The existing TypeScript check remains responsible for syntax errors; if wrong, unusual TSX constructs may be missed.
- Task 1 ruling: keep exceptions as adjacent source comments rather than global registry entries — this makes suppressions local and auditable — the registry stays small and every suppression is visible where the text appears — if wrong, the inline comments may be less discoverable than a central exception list.
- Task 1 suite note: `npm test` reports 54/57 passing. Existing unrelated failures: `climatePanelData.test.ts` (“map defaults to modeled habitability constraints…”), and two cases in `habitabilityStatus.test.ts`. The tested source files have no changes in this branch; these are outside editorial scope.
- Final review note: regression coverage confirms researcher identification with inline strong emphasis; scanner behavior passes without implementation changes.
- Completion notes: finished commit pushed to `origin/codex/editorial-comprehension`; working tree clean after final push.
