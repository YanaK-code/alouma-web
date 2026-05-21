Alouma iOS → Web Migration Audit (Read-Only)

This audit maps the current Alouma iOS codebase to a Next.js + TypeScript + Supabase web app while keeping iOS unchanged and reusing product logic—not reinventing it.



1. Current App Architecture

Entry and dependency injection

struct AloumaApp: App {
    @StateObject private var appState: AppState
    @StateObject private var resumeStore: ResumeStore
    @StateObject private var saveManager: SaveManager
    // ... ProductivityMetricsStore, PersonalizationMemoryStore, ResumeScanStore,
    // MatchRequestQueueStore, TailoringFocusHintCoordinator
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(appState)
                .environmentObject(resumeStore)
                // ...
        }
    }
}

There is no RootView. ContentView is the sole root router.

Launch → dashboard flow

flowchart TD
    A[AloumaApp] --> B[ContentView]
    B --> O{hasSeenIntro?}
    O -->|no| I[IntroSequenceView overlay]
    O -->|yes| G{rootStage}
    G -->|!isLoggedIn| Auth[AuthView]
    G -->|!hasCompletedOnboarding| Onb[OnboardingContainerView]
    G -->|!subscription gate| Sub[SubscriptionView / PaywallView]
    G -->|else| Dash[DashboardView]
    Onb -->|onFinish| AppState[setRecommendedSections + markOnboardingComplete]
    Sub -->|trial or skip| Active[markSubscriptionActive / dismissPaywall]

Gate logic (ContentView.RootStage):

    private var rootStage: RootStage {
        if !appState.isLoggedIn { return .auth }
        if !appState.hasCompletedOnboarding { return .onboarding }
        if !appState.hasActiveSubscription && !appState.hasDismissedPaywall { return .subscription }
        return .dashboard
    }

On appear: resumeStore.loadDraftIfNeeded, personalizationMemoryStore.bind(to:), resumeScanStore.refreshScanState.

Routing / gating state (AppState)

UserDefaults key

Property

Gate / role

isLoggedIn

isLoggedIn

Auth

hasCompletedOnboarding

hasCompletedOnboarding

Onboarding

hasActiveSubscription

hasActiveSubscription

Paywall bypass

hasDismissedPaywall

hasDismissedPaywall

Paywall skip

hasSeenIntro

hasSeenIntro

Intro overlay only

foxy.accentColorHex

accentColorHex

CV accent

foxy.recommendedSectionIds

recommendedSectionIds

Builder hints

foxy.strategyInput

strategyInput

Section order seed

foxy.targetIndustryId

targetIndustryId

Industry for new drafts

foxy.themeMode

themeMode

App theme

Docs: docs/architecture/navigation-state.md, docs/architecture/overview.md.

Dashboard navigation

DashboardView owns NavigationStack(path: $navigationPath).

Enum

File

Destinations

DashboardRoute

HomeMenuView.swift

.createCV → CVSectionsHubView; .matchToJob → MatchToJobFlowView; .savedCVsList; .profile; .settings; .help

CVSection

GuidedFlowContainerView.swift

Section editors; .ready → PreviewView

LandingRoute

DashboardView.swift

.preview → PreviewView

Menu: sheet HomeMenuView → appends to navigationPath.

Core state containers

Store

File

Responsibility

AppState

AppState.swift

Funnel flags, theme, accent, strategy seed, target industry

ResumeStore

ResumeStore.swift

Single active Resume, saved CVs, mutations, tailoring forks, persistence

SaveManager

SaveManager.swift

Debounced autosave → persistDraft() + version snapshots

CacheService

CacheService.swift

File cache + 3-version history

ResumeScanStore

ResumeScanStore.swift

Scan snapshot on resume, UI routing for issues

PersonalizationMemoryStore

PersonalizationMemoryStore.swift

Onboarding → UserPreferenceProfile, behavioral learning

MatchRequestQueueStore

MatchRequestQueueStore.swift

Offline match retry queue

ProductivityMetricsStore

ProductivityMetricsStore.swift

Activity metrics (local)

TailoringFocusHintCoordinator

TailoringFocusHintCoordinator.swift

Section tailoring hints UI

Invariant (do not break on web): one active draft = ResumeStore.resume → same HTML path for preview and export (00-foxy-core.mdc, ADR docs/adr/0001-cv-rendering-approach.md).

2. Data Model Map

Canonical resume schema (Resume)

File: Alouma/Models/Resume.swift — primary JSON schema for resume_json.

Top-level persisted fields include:

meta (ResumeMeta: id, createdAt, updatedAt, version)

industryId, tailoring: sourceResumeID, tailoredRoleHint, tailoredCompanyHint

Content: basics, summary, experience, education, skills, programsAndTools, languages, certifications, projects, courses, licenses, awards, volunteerExperience, interests, links

Strategy: sectionOrder, hasAppliedInitialStrategy, hasCustomSectionOrder, recommendedSectionsRaw, sectionReasoningByRaw

Job: attachedJobContext (AttachedJobContext); legacy decode-only jobPostingText, parsedJobPosting

Scan: latestScanSnapshot, latestScanContentFingerprint, dismissedScanIssueRecords

Template: template (ResumeTemplate: novo_classic, structured, expressive), accent hex fields, isATSMode

Nested Codable types: Basics, Location, Experience, Education, Skill/SkillLevel, ProgramTool, Language, Certification, Project, Link, Course, CVLicense, Award, VolunteerExperience, Interest, AttachedJobContext, AttachedJobSourceType.

HTML DTO (CVDraft) — not persisted

File: Alouma/Models/CVDraft.swift — flat view model for rendering only.

extension Resume {
    func toCVDraft() -> CVDraft {

Web: compute CVDraft at render time from resume_json; do not store separately unless caching HTML inputs.

Onboarding profile (in-memory on iOS)

File: OnboardingContainerView.swift — struct UserProfile (not Codable):

careerStage, goal, sectors, selectedRoleBySector, cvChallenge, applicationProcessConcern, activelyApplying, atsConcern

Persisted derivative: CVStrategyInput + AppState.recommendedSectionIds + PersonalizationMemoryStore → UserPreferenceProfile.explicitContextMemory.

Target onboarding_json shape (proposed):

// Mirror UserProfile + normalized IDs used by engines
{
  careerStage: string;
  goal: string;
  sectors: string[];
  selectedRoleBySector: Record<string, string>;
  cvChallenge: string;
  applicationProcessConcern: string;
  activelyApplying: string;
  atsConcern: string;
  completedAt: string; // ISO
}

Saved CVs

Type

File

Storage

SavedCV

SavedCV.swift

Metadata list foxy.savedCVs

Full resume per id

ResumeStore private SavedDraftContentItem

foxy.savedCVs.content

Job matching models

File: Alouma/Models/MatchToJob/MatchToJobModels.swift

Codable API contract types: MatchToJobRequest, MatchResumeContextPayload, MatchTargetJobPayload, MatchReport, MatchSuggestion, MatchSuggestionTarget, etc.

Factory: MatchToJobRequest.from(resume:targetJob:).

Contract doc: docs/contracts/ai-match-job.md (POST /functions/v1/ai-match-job).

Scan / tailoring models

File: Alouma/Services/ResumeScan/ResumeScanModels.swift

Persisted on resume: ResumeScanSnapshot, ResumeScanIssue, DismissedScanIssueRecord, BuilderSectionState.

Runtime-only: ResumeScanContext, ResumeImportanceProfile, ScanResumeRule.

Section identity

File: GuidedFlowContainerView.swift — enum CVSection: String, Codable — shared across resume, match, scan, strategy.

Shared JSON schemas to extract first

iOS source

Web package

Resume + nested types

packages/resume-schema (Zod + TS)

CVStrategyInput

packages/onboarding

MatchToJobRequest / MatchReport

packages/match-schema

ResumeScanSnapshot

packages/scan-schema

UserPreferenceProfile

packages/personalization-schema

SectorOptions.all

packages/constants/sectors.ts

3. CV Rendering Pipeline

Single HTML producer

    static func generate(draft: CVDraft, accentColorHex: String = CVColorDefaults.essentialAccentHex) -> String

Flow: Resume → toCVDraft() → ResumeTemplateRegistry.resolvedDescriptor(for:) → generateNovoClassicThrowing | generateStructuredThrowing (expressive falls back to novo).

No external .html/.css files — all markup/CSS/JS are string literals in ResumeHTMLBuilder.swift (~large file). Docs note cv_web/ in rules but directory does not exist in repo.

Preview

Piece

File

Screen

Features/Preview/PreviewView.swift

Web host

Core/WebView.swift (WKWebView, loadHTMLString, baseURL: Bundle.main.bundleURL)

Bridge

cvBridgeJS in HTML + native CVBridge.onNativeEvent for accent/theme

Preview vs export accent strategy (parity = content/layout equivalent, not byte-identical):

Preview may use placeholder accent in HTML + bridge updates (previewPlaceholderAccentHex).

Export uses full accent in generated HTML.

PDF export

Piece

File

Exporter

DocumentEngine/PDFExporter.swift

Geometry

DocumentEngine/CVPageGeometry.swift (595×842 pt, CSS px via 96/72)

Primary path: headless WKWebView → wait for pagination JS → collectPageFrames (#pages .page) → per-page createPDF → composeA4PDF.

Fallback: viewPrintFormatter() + A4PrintPageRenderer.

Output: Documents/AloumaCV.pdf (docs sometimes say Foxy_CV.pdf — drift).

Pagination contract (must preserve)

DOM: #pages → .page → .page-content → section.cv-block[data-block=…]

sharedPaginationCSS + sharedPaginationJS (packPage() overflow moves)

@page { size: A4; margin: 0 }

cvBlock(dataBlock:inner:) wrapper

Docs: docs/cv/engine-contract.md, docs/cv/layout-do-not-touch.md, docs/adr/0001-cv-rendering-approach.md.

Web translation

Concern

Approach

Preview

React component mounting same HTML in <iframe srcDoc={html}> or shadow DOM; optional postMessage bridge mirroring CVBridge

PDF

Server-side headless Chromium (Playwright/Puppeteer) rendering identical HTML + print CSS; or client window.print() only for MVP—not parity with iOS

Source of truth

Port ResumeHTMLBuilder + sharedPaginationCSS/JS to TypeScript verbatim (mechanical port, not redesign)

Geometry

Port CVPageGeometry constants; use same viewport width for PDF job

Highest-risk area: pagination JS + multi-page PDF composition — browser print engines differ from WKWebView.createPDF.

4. Onboarding Logic

Step sequence (11 steps)

enum OnboardingStep: Int, CaseIterable {
    case careerStage, goal, revelation1, sector, cvChallenge, revelation2,
         atsConcern, revelationATS, applicationConcern, activelyApplying, revelationFinal
}

Documented flow: careerStage → goal → revelation1 → sector → cvChallenge → revelation2 → atsConcern → revelationATS → applicationConcern → activelyApplying → revelationFinal.

Where options are defined

Career stage / goal / challenges / concerns: private let arrays in OnboardingContainerView.swift (e.g. careerStageOptions ~line 502, goalOptions ~560, cvChallengeOptions ~980).

Sectors: SectorOptions.all in Models/SectorOptions.swift (18 sectors).

Revelation copy

File: OnboardingRevelationEngine.swift — buildRevelationContent(kind:profile:) with deterministic subtitle functions (firstRevelationSubtitle, secondRevelationSubtitle, atsRevelationSubtitle, finalRevelationSubtitle) driven by UserProfile + OnboardingVisualStateEngine.normalizedSituationID.

UI: OnboardingRevelationView.swift, visual reactions via OnboardingVisualStateEngine.swift.

Deterministic rules from onboarding answers

Engine

Input

Output

AppState.setRecommendedSections(from:)

UserProfile

recommendedSectionIds, CVStrategyInput, targetIndustryId

AppState.recommendedSectionIds(from:)

stage + sectors

ordered section id strings

CVStrategyEngine.compute(input:)

CVStrategyInput

CVStrategyOutput (section order, recommended set, reasons)

PersonalizationMemoryStore.captureOnboardingProfile

UserProfile

UserPreferenceProfile.explicitContextMemory

ResumeStore.applyInitialStrategyIfNeeded

strategyInput

writes sectionOrder, recommendedSectionsRaw, sectionReasoningByRaw on first hub entry

Port to shared TypeScript (high priority)

CVStrategyEngine — full compute + templates (Alouma/Services/CVStrategyEngine.swift)

AppState.recommendedSectionIds(from:) + setRecommendedSections mapping

OnboardingRevelationEngine subtitle builders

OnboardingVisualStateEngine normalization helpers

SectorOptions constants

Onboarding option id/label tables (extract from OnboardingContainerView.swift)

Web UI vs shared logic

Shared: engines above + validation (nextDisabled rules in container)

Rewrite: SwiftUI step UI → React stepper/wizard; revelation animations → CSS (skip SpriteKit-style flourishes initially)

5. Dashboard and Builder UX

Dashboard (DashboardView.swift)

Sections: header, progress ring (core/optional/draft metrics via ResumeCompletionEvaluator + ResumeBuilderProgressResolver), stats, next-step CTA, quick actions (Create CV, Match, etc.).

Uses: store.hasDraft, appState.targetIndustryId, industry picker sheets, BuilderFeedbackCenter (defined in same file area), ProductivityMetricsStore.

Web pages: /dashboard (home), sub-routes for menu items.

CV sections hub (CVSectionsHubView.swift)

Grid of sections from store.normalizedSectionOrder (excludes .ready from grid; preview via bottom dock)

Completion from ResumeCompletionEvaluator.snapshot(resume:renderedSections:)

applyInitialStrategyIfNeeded on appear

Reorder sheet: ReorderSectionsView.swift

Restore versions: RestoreVersionsSheet.swift

Scan/tailoring overlays via ResumeScanStore, TailoringFocusHintCoordinator

Web: /cv hub page + /cv/[section] dynamic route.

Guided flow / editors (GuidedFlowContainerView.swift)

CVSectionEditorView switches on CVSection:

.basics → Step1BasicsView

.summary → Step2SummaryView

Other sections → dedicated views or inline composers in same file

Dedicated section views:

Section

File

Languages

LanguagesSectionView.swift

Interests

InterestsSectionView.swift

Awards

AwardsSectionView.swift

Projects

ProjectsSectionView.swift

Courses

CoursesSectionView.swift

Licenses

LicensesSectionView.swift

Volunteer

VolunteerSectionView.swift

Experience/education/skills/programs likely live inside GuidedFlowContainerView.swift (large file).

Section completion rules

File: ResumeSectionCompletionEvaluator.swift (ResumeCompletionEvaluator)

Core checks (ResumeCoreCompletionCheck): basics, summary, workProof (experience), skillsTools (≥5 skills), education, optionalStrength (languages/licenses/courses/awards/volunteer/interests — any one).

Optional progress sections: licenses, projects, languages, courses, awards, volunteer, interests.

.ready (preview) unlocks when all core checks complete.

Web: port evaluator verbatim; use for hub badges and dashboard ring.

Optional vs core

Core: enforced for preview unlock and scan importance

Optional: progress ring only; scan downgrades optional-section issues to mild (ResumeScanEngine)

Components vs pages

Web page

Components

(app)/dashboard/page.tsx

ProgressRing, IndustryPicker, QuickActions

(app)/cv/page.tsx

SectionGrid, SectionTile, BottomDock

(app)/cv/[section]/page.tsx

SectionEditor per type

(app)/cv/preview/page.tsx

CVPreviewFrame, ExportPDFButton

(app)/match/page.tsx

JobInput, MatchReport, SuggestionReview

Reuse: AloumaTextField, InlineSectionComposer, AloumaInlineAssistComponents patterns → React form primitives (rewrite styling, keep field semantics).

6. Job Matching / AI / Scan Logic

Match to Job flow

Stage

File

UI

MatchToJobFlowView.swift — .input → .generating → .report → .review

VM

MatchToJobViewModel.swift

Service

EdgeFunctionMatchToJobService.swift → POST .../functions/v1/ai-match-job

Config

MatchToJobService.swift — EdgeFunctionEnvironmentConfig.resolve() from env SUPABASE_URL or foxy.supabase.baseURL

Auth

NoopMatchEdgeAuthProvider (stub)

Apply edits

MatchSuggestionApplier.swift

Tailoring

ResumeStore.beginMatchTailoredDraftIfNeeded, createTailoredDraftFromCurrent, discard/restore

Queue

MatchRequestQueueStore — foxy.matchToJobQueue.v1

Edge vs frontend:

Layer

Where

Supabase Edge Function

AI match report generation (ai-match-job)

Frontend/TS port

MatchToJobRequest.from(resume:), MatchSuggestionApplier, UI review flow, queue persistence

Later edge

Skills/tools remote suggestions (RemoteSkillsToolsSuggesting protocol — not fully wired)

Resume scan engine (deterministic, local)

File

Role

ResumeScanEngine.swift

scan(resume:context:) → ResumeScanSnapshot, version 2.0.0

ResumeImportanceProfileResolver.swift

Section importance from resume + job context

ResumeScanContentInspector.swift

Content signals

ResumeScanDismissalFilter.swift

Suppressed issues

ResumeSectionStateResolver.swift

Hub tile states

ResumeBuilderProgressResolver.swift

Dashboard progress snapshot

ResumeScanStore.swift

Orchestration, persist snapshot on Resume

Port entirely to TS for web offline-first parity; no AI required.

AI placeholders

Feature

File

Status

Inline assist

FoxyAIAssistPlaceholder.swift

Placeholder UI

AI preview sheet

FoxyAIPreviewSheet.swift

UI shell

Remote skills suggest

RemoteSkillsToolsSuggesting.swift

Protocol; local pipeline works

Local extract

LocalCVSkillsToolsExtractor.swift, SkillsToolsSuggestionPipeline.swift

Deterministic

Job parsing

Core/JobParsing/JobPostingParser.swift — builds AttachedJobContext from pasted text/URL; legacy ParsedJobPosting migration on decode.

Web: port parser to TS (frontend); optional edge enhancement later.

7. Persistence and Backend Readiness

iOS local storage today

Key / path

Content

foxy.currentDraft

JSON Resume (fallback)

Application Support/Foxy/CVDraft_{profileId}.json

Cached Resume

CVDraftVersions_{profileId}.json

Max 3 CachedVersion

foxy.savedCVs + foxy.savedCVs.content

Saved list + full resumes

foxy.strategyInput, foxy.targetIndustryId, etc.

App preferences

foxy.personalizationMemory.v1

UserPreferenceProfile

foxy.matchToJobQueue.v1

QueuedMatchRequest[]

foxy.productivityMetrics.v1

Metrics

Funnel flags

AppState keys

What stays local on iOS

Per product direction: iOS remains local-first; do not require sync for iOS MVP. Web becomes cloud source of truth for cross-device.

Supabase table mapping (proposed)

Table

Column

Maps from

profiles

id (auth.users)

—

profiles

onboarding_json

UserProfile + completion metadata

profiles

settings_json

theme, accent, targetIndustryId, subscription flags

profiles

strategy_input

CVStrategyInput

resumes

id, user_id

Resume.meta.id

resumes

resume_json

full Resume document

resumes

is_active

single active draft per user

resumes

industry_id, updated_at

denormalized for queries

saved_resumes

metadata + resume_json

SavedCV + content

resume_versions

snapshot JSON

CachedVersion (optional; or store in Storage)

match_queue

row per QueuedMatchRequest

optional

resume_json: encode Resume as stored on iOS (UUID strings, ISO dates, sectionOrder as raw strings).

onboarding_json: UserProfile fields + completedAt.

Sync blockers

No server auth on iOS yet — AuthView stub; NoopMatchEdgeAuthProvider.

Dual persistence on iOS — CacheService + UserDefaults; web should use Supabase only (+ optional localStorage draft buffer).

Schema versioning — Resume.meta.version, UserPreferenceProfile.schemaVersion; need migration policy.

Tailored draft forks — sourceResumeID lineage must sync as separate rows or embedded flags.

Scan snapshot on resume — large; acceptable in resume_json but watch row size.

PII — CV content sensitive; RLS policies required (08-privacy-data-minimization.mdc).

Subscription — stub flags; RevenueCat not integrated (docs/README.md).

8. Recommended Web Architecture

alouma-web/
├── apps/web/                          # Next.js 15 App Router
│   ├── app/
│   │   ├── (marketing)/               # optional landing
│   │   ├── (auth)/login/
│   │   ├── (funnel)/
│   │   │   ├── onboarding/[step]/     # wizard
│   │   │   └── subscribe/
│   │   └── (app)/
│   │       ├── layout.tsx             # auth guard + providers
│   │       ├── dashboard/
│   │       ├── cv/
│   │       │   ├── page.tsx           # hub
│   │       │   ├── [section]/page.tsx
│   │       │   └── preview/page.tsx
│   │       ├── match/page.tsx
│   │       ├── saved/page.tsx
│   │       ├── settings/page.tsx
│   │       └── profile/page.tsx
│   ├── components/                    # UI only
│   ├── lib/
│   │   ├── supabase/                  # client + server helpers
│   │   └── stores/                    # Zustand or React Query
│   └── middleware.ts                  # funnel gating
├── packages/
│   ├── resume-schema/                 # Zod ← Resume.swift
│   ├── resume-logic/                  # toCVDraft, applyInitialStrategy, MatchSuggestionApplier
│   ├── onboarding-logic/              # CVStrategyEngine, revelations, options
│   ├── scan-engine/                   # ResumeScanEngine port
│   ├── cv-html/                       # ResumeHTMLBuilder port (critical)
│   └── match-client/                  # Edge function client types
├── supabase/
│   ├── migrations/
│   └── functions/ai-match-job/        # existing contract
└── services/pdf-export/               # optional Playwright worker

Providers (mirror iOS env objects):

AppSettingsProvider ← AppState

ResumeProvider ← ResumeStore + Supabase realtime/subscribe

ScanProvider ← ResumeScanStore

PersonalizationProvider ← PersonalizationMemoryStore

Auth: Supabase Auth replaces stub markLoggedIn(); middleware enforces same funnel order as ContentView.

CV preview: packages/cv-html + iframe; debounced autosave to resumes.resume_json.

PDF: API route /api/export-pdf running headless browser on export HTML (full accent, same generate()).

AI: Keep EdgeFunctionMatchToJobService contract; web createClient with session JWT.

9. File-by-File Translation Map

Legend: Port = mechanical TS port; Rewrite = new UI; Ignore = iOS-only; Later = phase 2+

App shell

iOS file

Responsibility

Web equivalent

Action

AloumaApp.swift

DI root

app/layout.tsx providers

Rewrite

ContentView.swift

Funnel router

middleware.ts + (app)/layout.tsx

Port logic

AppState.swift

Flags + strategy seed

lib/settings-store.ts + profiles.settings_json

Port + DB

AuthView.swift

Stub login

app/(auth)/login Supabase

Rewrite

IntroSequenceView.swift + Intro/*

Brand intro overlay

Optional /welcome or skip

Later / Ignore

SubscriptionView.swift, PaywallView.swift

Paywall

/subscribe + Stripe/RC

Rewrite

SettingsView.swift, AppearancePickerView.swift

Settings

/settings

Rewrite

ProfileView.swift

Profile

/profile

Rewrite

HelpView.swift

Placeholder help

/help

Later

Dashboard

iOS file

Web

Action

DashboardView.swift

dashboard/page.tsx + components

Rewrite UI, port progress logic

HomeMenuView.swift

AppNav / sidebar

Rewrite

SavedCVsListView.swift

saved/page.tsx

Rewrite

Onboarding

iOS file

Web

Action

OnboardingContainerView.swift

onboarding/[step]/page.tsx

Rewrite UI; extract options to shared

OnboardingRevelationEngine.swift

packages/onboarding-logic/revelations.ts

Port

OnboardingRevelationView.swift

RevelationStep.tsx

Rewrite

OnboardingVisualStateEngine.swift

visual-state.ts

Port

OnboardingDocumentFieldView.swift

field component

Rewrite

Models

iOS file

Web

Action

Models/Resume.swift

packages/resume-schema

Port (Zod)

Models/CVDraft.swift

to-cv-draft.ts

Port

Models/SavedCV.swift

DB types

Port

Models/SectorOptions.swift

sectors.ts

Port

Models/AccentColor.swift

cv-colors.ts

Port

Models/UserPreferenceProfile.swift

personalization-schema

Port

Models/MatchToJob/*

match-schema

Port

Models/PreferenceEvent.swift

analytics events

Later

Stores

iOS file

Web

Action

Stores/ResumeStore.swift

resume-store.ts + Supabase CRUD

Port logic, rewrite persistence

Stores/SaveManager.swift

debounced save hook

Port pattern

Stores/ResumeScanStore.swift

scan-store.ts

Port

Stores/PersonalizationMemoryStore.swift

personalization-store.ts

Port (later sync)

Stores/MatchRequestQueueStore.swift

match-queue.ts or DB table

Port

Stores/ProductivityMetricsStore.swift

optional analytics

Later

Stores/TailoringFocusHintCoordinator.swift

UI coordinator

Rewrite

Document engine (critical)

iOS file

Web

Action

DocumentEngine/ResumeHTMLBuilder.swift

packages/cv-html/builder.ts

Port verbatim

DocumentEngine/ResumeTemplateRegistry.swift

template-registry.ts

Port

DocumentEngine/CVTemplateRenderer.swift

types

Port

DocumentEngine/CVPageGeometry.swift

page-geometry.ts

Port

DocumentEngine/PDFExporter.swift

api/export-pdf Playwright

Rewrite (same HTML input)

Core/WebView.swift

CVPreviewFrame.tsx

Rewrite

Features/Preview/PreviewView.swift

cv/preview/page.tsx

Rewrite

Features/Preview/ScanCelebration*.swift

—

Ignore / Later

Editor

iOS file

Web

Action

CVSectionsHubView.swift

cv/page.tsx

Rewrite

GuidedFlowContainerView.swift

cv/[section]/page.tsx + editors

Rewrite UI; port routing enum

ReorderSectionsView.swift

ReorderSectionsModal.tsx

Rewrite

RestoreVersionsSheet.swift

versions UI

Later

*SectionView.swift

section form components

Rewrite each

FoxyAIAssistPlaceholder.swift

AI affordance

Later

InlineSectionComposer.swift, Alouma*Components.swift

form kit

Rewrite

Services / engines

iOS file

Web

Action

CVStrategyEngine.swift

onboarding-logic/strategy.ts

Port

ResumeSectionCompletionEvaluator.swift

resume-logic/completion.ts

Port

ResumeScanEngine.swift + scan/*

scan-engine/*

Port

CacheService.swift

Supabase versions / omit on web

Later

JobPostingParser.swift

job-parser.ts

Port

EdgeFunctionMatchToJobService.swift

match-client.ts

Port

MatchSuggestionApplier.swift

apply-suggestion.ts

Port

SkillsToolsSuggestion*.swift

suggest pipeline

Port local parts; edge later

Match UI

iOS file

Web

Action

MatchToJobFlowView.swift

match/page.tsx

Rewrite

MatchToJobViewModel.swift

hook useMatchToJob

Port

MatchReportView.swift, MatchSuggestionsReviewView.swift

components

Rewrite

Theme (iOS-native)

iOS file

Web

Action

Core/Theme/*, FoxyMotion, NeumorphicStyles

Tailwind / CSS tokens

Rewrite (adapt for desktop)

ShareSheet.swift

Web Share API

Rewrite

Docs (reference, not ported)

Doc

Use

docs/cv/engine-contract.md

Web CV contract

docs/contracts/ai-match-job.md

Edge function

docs/architecture/*

Navigation parity

docs/adr/0001-cv-rendering-approach.md

ADR for single HTML path

10. Risks and Warnings

Do not port directly

SwiftUI views — reimplement in React; keep bindings semantics (ResumeStore.update(mutate:)).

WKWebView / UIViewRepresentable / SpriteKit celebration — web equivalents differ.

UserDefaults + CacheService dual write — replace with Supabase + optional localStorage buffer only on web.

Intro sequence — marketing overlay; not required for web MVP.

Permissive subscription stub — do not copy “skip = subscribed” to production web without Stripe/RC.

Rules referencing cv_web/ bundle — outdated; templates live in Swift/TS port target.

Too SwiftUI-specific

NavigationStack / NavigationPath, sheet/toolbar patterns

@EnvironmentObject, @ScaledMetric, accessibilityReduceMotion transitions (FoxyMotion)

BuilderFeedbackCenter, tailoring hint overlays tied to UIKit geometry

Long-press → preview gesture on dashboard

Must remain visually identical

Exported PDF and in-app CV preview layout (A4, section order, pagination breaks, template CSS)

Section order after strategy application

HTML escaping behavior (esc, escSummary)

Can adapt for desktop

Dashboard grid density, hub 2-column → 3–4 column

Bottom dock → side panel on wide screens

Touch targets / haptics / native toolbar

Theme: web can default light; dark mode parity optional early

Biggest PDF parity risks

packPage() JS — must run before PDF capture; timing/race bugs common in headless Chrome.

Per-page PDF composition — iOS uses WKWebView.createPDF per #pages .page frame; browsers may paginate differently.

Fonts — iOS system fonts vs web font stack; embed fonts if drift appears.

Accent bridge vs full HTML — web preview should mirror iOS: stable HTML + CSS variable updates OR always regenerate (document choice; export always full accent).

Structured template dual accents — separate code path in generateStructuredThrowing.

Doc drift — verify against code (PDFExporter primary path, AloumaCV.pdf filename).

iOS should stay untouched

No refactor to extract shared Swift package unless explicitly planned

Web ports live in monorepo packages/* with tests comparing JSON/HTML golden files against iOS fixtures

Suggested migration phases

resume-schema + toCVDraft + completion evaluator — validate JSON round-trip with iOS-exported fixtures

cv-html port — golden HTML comparison for sample resumes

Onboarding + strategy engines — shared TS tests

Supabase auth + resumes.resume_json CRUD

Builder UI (hub + sections)

Preview + PDF export service

Scan engine port

Match-to-job edge integration

Sync strategy (optional iOS migration ADR)

