# TN DIPR Communications Platform
## Final Feature List & Complete UI Specification

**Scope:** Internal bilingual (Tamil / English) e-governance platform with three core modules — (1) Auto News Card Generation + Moderation + Multi-platform Publishing, (2) News Media Social Watch, (3) Print Media Watch — plus the shared platform layer (auth, RBAC, dashboard, admin, notifications).

---

# PART A — FINAL FEATURE LIST

## Module 1 — Auto News Card Generation & Publishing

**1.1 Multi-level content input**
- Submission portal for **District PROs** (38 districts) and **Department/PSU PROs**.
- Input types: headline, body text, key facts/bullet points, source reference (press release / G.O. number), event date, location, attached images/logos.
- Language toggle: enter in Tamil, English, or both; mark "primary language."
- Draft auto-save; resume incomplete submissions.
- Bulk/quick submission for routine updates; rich submission for campaigns.

**1.2 AI content refinement & tonality moderation**
- LLM rewrites raw input into polished card copy in the **selected tonality** (Formal / Announcement / Achievement / Welfare-scheme / Condolence / Alert).
- **Bilingual generation**: auto-translate Tamil↔English with both versions side-by-side.
- Tone/quality flags: highlights political bias, factual gaps vs. source, sensitive wording, honorific/title errors.
- Multiple AI variants per card (e.g., 3 caption options) for the creator to pick.
- "Grounding" indicator showing which sentences trace to the source document.

**1.3 News card design generation**
- Auto-layout into branded DIPR templates (multiple template families: scheme launch, statistics, quote card, event, alert).
- Auto-applies DIPR logo, color palette, fonts, CM/Minister photo where relevant.
- Per-platform sizing: Facebook (1200×630), Instagram square (1080×1080) + story (1080×1920), X (1600×900), WhatsApp (1080×1080), YouTube thumbnail (1280×720).
- Inline card editor: edit text, swap image, reposition elements, change template.
- Bilingual card variants (Tamil card + English card) generated together.

**1.4 Multi-level approval workflow**
- Configurable chain: **District PRO → Department PRO/Head → DIPR HQ Approver → (optional) Joint Director sign-off**.
- Approval actions: Approve / Approve-with-edits / Return for revision / Reject (with mandatory comment).
- Side-by-side "original vs AI-refined" diff view for approvers.
- SLA timers per approval stage; auto-escalation on delay.
- Version history of every edit with author + timestamp.

**1.5 Multi-platform publishing**
- Target platforms: **Facebook, Instagram, X, YouTube (community/thumbnail), WhatsApp Groups/Channels**.
- Per-platform caption versions (different length/tone per platform).
- **Auto hashtag + mention engine**: suggests platform-appropriate hashtags (#TNDIPR, scheme tags) and mentions (@CMOTamilnadu) by department/scheme; editable.
- Publish now / Schedule / Add to campaign calendar.
- WhatsApp distribution to selected Groups/Channels with formatted card + caption.

**1.6 Post management & recall**
- Live post tracker (published / scheduled / failed, per platform).
- **Recall/kill-switch**: delete or update an already-published post across platforms from one action.
- Re-publish / edit-and-repost.
- Per-post performance pull-back (reach, likes, shares, comments) where the platform API allows.

---

## Module 2 — News Media Social Watch

**2.1 Source management**
- Curated list of news channels' social handles (Sun News, Polimer, Thanthi TV, Kalaignar, News18 Tamil, etc.) across Facebook, X, Instagram, YouTube.
- Add/remove/group sources; tag by reach/priority.

**2.2 Government-related content detection**
- Auto-filter for government-related posts via keyword + entity recognition (ministers, departments, schemes, districts).
- Topic/department auto-tagging.

**2.3 Sentiment scoring**
- Per-item sentiment: Positive / Neutral / Negative + confidence score.
- Handles Tamil + Tanglish; low-confidence items flagged for human review.
- Sentiment trend over time per department/scheme/minister.

**2.4 Consolidation & routing**
- Auto-consolidated feed grouped by department.
- **Crisis/negative-spike alerts** (sudden volume + negative sentiment) → real-time push to relevant department head + DIPR desk.
- Daily/weekly digest auto-generated and routed to department heads.

**2.5 Analytics**
- Volume, share-of-voice, sentiment breakdown, top channels, trending topics, peak times.

---

## Module 3 — Print Media Watch

**3.1 Edition-wise ingestion**
- E-paper ingestion for major dailies/periodicals (Daily Thanthi, Dinakaran, Dinamalar, Dinamani, The Hindu, Times of India, Murasoli, etc.).
- Track by **edition/region** (Chennai, Madurai, Coimbatore…) and **page number**.

**3.2 OCR & article extraction**
- Tamil + English OCR; full-page segmentation into individual articles (headline / body / photo).
- Government-related article detection + department tagging.

**3.3 Sentiment & prominence scoring**
- Sentiment per article (Positive / Neutral / Negative).
- **Prominence score** from page placement (front vs inside), size/column-inches, headline tone, photo presence.

**3.4 Clipping & digest**
- Auto-clipping (cropped article image + OCR text + metadata).
- Daily digest using government taxonomy: **Clarification / Action / Information / Political / Editorial / Article**.
- Route digest + urgent clippings to relevant department heads.

**3.5 Archive & search**
- Full-text searchable clipping archive by date, paper, edition, department, scheme, sentiment.

---

## Cross-Module / Platform Features

- **RBAC** mapped to DIPR hierarchy (District PRO, Dept PRO, Dept Head, DIPR HQ Approver, Joint Director, Admin).
- **Unified bilingual UI** (Tamil/English toggle for the entire interface).
- **Notifications**: in-app, email, optional WhatsApp — for approvals, alerts, digests.
- **Audit log** of every action (immutable).
- **Global search** across cards, posts, clippings, mentions.
- **Admin console**: users, roles, templates, sources, hashtag/mention dictionaries, AI tonality rules.
- **Calendar**: unified content + campaign calendar.

---

# PART B — INFORMATION ARCHITECTURE / NAVIGATION

**Primary left sidebar (collapsible):**

```
┌─────────────────────────┐
│  [DIPR LOGO]   TA | EN   │
├─────────────────────────┤
│ 🏠 Dashboard            │
│ ✍️  Create News Card     │
│ ✅ Approvals      (•3)  │
│ 📤 Published / Scheduled│
│ 📺 Social Watch    (•7) │
│ 📰 Print Watch          │
│ 📅 Calendar             │
│ 🔔 Alerts & Digests     │
│ 🔍 Search               │
│ ─────────────────────── │
│ ⚙️  Admin  (admin only) │
│ 👤 Profile / Logout     │
└─────────────────────────┘
```

**Top bar (all screens):** global search box · language toggle (தமிழ் / English) · notification bell with count · user avatar + role badge · current district/department context.

**Menu visibility by role:** Create + Approvals stages, Admin, and Social/Print Watch routing are shown/hidden per RBAC (see Part C).

---

# PART C — ROLE & PERMISSION MATRIX

| Capability | District PRO | Dept PRO | Dept Head | HQ Approver | Joint Director | Admin |
|---|---|---|---|---|---|---|
| Submit content | ✅ | ✅ | ✅ | – | – | ✅ |
| Use AI refine/design | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Approve (stage 1/2) | – | ✅ | ✅ | – | – | ✅ |
| Final approve | – | – | – | ✅ | ✅ | ✅ |
| Publish / schedule | – | – | – | ✅ | ✅ | ✅ |
| Recall posts | – | – | ✅ | ✅ | ✅ | ✅ |
| View Social Watch | own dist. | own dept | own dept | all | all | all |
| Receive digests/alerts | own dist. | own dept | own dept | all | all | all |
| View Print Watch | own dist. | own dept | own dept | all | all | all |
| Manage users/roles | – | – | – | – | – | ✅ |
| Manage templates/sources/AI rules | – | – | – | partial | partial | ✅ |
| View audit log | own | own | dept | all | all | all |

---

# PART D — SCREEN-BY-SCREEN UI SPECIFICATION

### D.1 Login / Authentication
- DIPR-branded split screen: left = emblem + "தகவல் மற்றும் மக்கள் தொடர்பு துறை / DIPR Communications Platform"; right = login card.
- Fields: Employee ID / official email, password, OTP (2FA). "Forgot password," language toggle.
- Role + district/department resolved on login → lands on role-appropriate Dashboard.

---

### D.2 Dashboard (Home)
Role-aware landing screen.

```
┌──────────────────────────────────────────────────────────┐
│  Good morning, Ravi  •  Madurai District PRO     [TA|EN]   │
├──────────────┬──────────────┬──────────────┬─────────────┤
│ Cards Pending│ Published     │ Neg. Mentions │ Print Items │
│   ▢ 4        │ Today  12     │ Today   3 ⚠️  │ Today  18   │
├──────────────┴──────────────┴──────────────┴─────────────┤
│  My Tasks                          Sentiment (7 days)      │
│  • Card "Free Bus Scheme" → revise   [▁▂▅▇▆▃▄ line chart] │
│  • Approve: 3 items                                        │
├───────────────────────────────────────────────────────────┤
│  Live Alerts feed        │   Today's Print Digest preview  │
│  ⚠️ Negative spike: ...   │   📰 Clarification (2)          │
│  ℹ️ Scheme trending: ...  │   📰 Action (5) ...             │
└───────────────────────────────────────────────────────────┘
```

- Top KPI cards (clickable to deep screens).
- "My Tasks" queue, live alerts strip, sentiment sparkline, print digest preview.
- Quick action button: **+ Create News Card**.

---

### D.3 Create News Card (Module 1) — multi-step wizard

**Step 1 — Input**
```
┌── Step 1 Input ──── 2 Refine ── 3 Design ── 4 Review ── 5 Publish ──┐
│ Title (TA) [______]   Title (EN) [______]   Primary: (•)TA ( )EN    │
│ Body [__________________________]                                    │
│ Key facts (bullets) [+ add]                                          │
│ Source ref: G.O./Press release no. [______]   Date [__]  Place [__] │
│ Tonality: ( )Formal (•)Announcement ( )Achievement ( )Welfare ...    │
│ Attach: [⬆ images / logo]                                            │
│                                   [Save draft]   [Refine with AI →]  │
└──────────────────────────────────────────────────────────────────────┘
```

**Step 2 — AI Refine & Moderation (the moderation screen)**
- **Three-column view:** Original input | AI-refined Tamil | AI-refined English.
- Sentence-level **grounding highlights** (green = traceable to source, amber = unverified).
- **Moderation flag panel:** tone issues, possible bias, factual gaps, honorific errors — each with "accept fix / ignore."
- Variant selector: 3 caption options per language.
- Edit inline; "Regenerate" per field.

**Step 3 — Design**
- Left: template gallery (filter by type). Center: live card canvas with platform-size tabs (FB / IG / IG-Story / X / WhatsApp / YouTube). Right: element editor (text, font size, image swap, logo, photo, color).
- Bilingual: generates TA and EN card; toggle preview.

**Step 4 — Review & Submit for Approval**
- Full preview of all platform cards + captions.
- Select approval chain (auto-filled from role hierarchy, editable by HQ).
- "Submit for approval" → enters Approvals queue.

**Step 5 — Publish setup** (visible to publishers)
- Platform toggles + per-platform caption box.
- **Hashtag/mention chips** (auto-suggested, add/remove).
- WhatsApp: pick Groups/Channels from list.
- Schedule: Now / Date-time / Add to calendar.

---

### D.4 Approvals Queue (Module 1)
```
┌── Approvals ───────────────────────── Filter: [Pending ▾] ──┐
│  Card                Dept       Stage     Age    Action      │
│ ─────────────────────────────────────────────────────────── │
│ Free Bus Scheme      Transport  HQ rev.   2h     [Open]      │
│ Hospital opening     Health     Dept→HQ   20m    [Open]      │
│ Farmer subsidy       Agri       Stage 1   1d ⚠️  [Open]      │
└───────────────────────────────────────────────────────────────┘
```
- **Review drawer:** original vs AI-refined diff, all platform card previews, moderation flags, version history.
- Actions: Approve · Approve-with-edits (inline editor) · Return (comment required) · Reject (comment required).
- SLA timer chip; escalation indicator.

---

### D.5 Published / Scheduled
- Tabs: **Published · Scheduled · Failed · Drafts**.
- List row: thumbnail, platforms (icon chips with status dot), publish time, engagement mini-stats, **[Recall]** / [Edit] / [Repost].
- Recall modal: choose platforms, "Delete" or "Replace with updated card," confirmation with reason (logged).

---

### D.6 Social Watch (Module 2)
```
┌── News Media Social Watch ─────── Dept: [All ▾] Range:[7d ▾] ─┐
│  Sentiment:  😊 62%   😐 25%   ☹️ 13%      Volume: 1,240 ▲     │
│  [Sentiment trend line chart]   [Share-of-voice by channel]   │
├────────────────────────────────────────────────────────────────┤
│  Mentions feed                                  [⚠ Alerts (7)] │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ ☹️ 0.82  Polimer News · X · 2h                            │ │
│  │ "..." (govt-related) Dept: Transport  [Route ▾] [View]   │ │
│  ├──────────────────────────────────────────────────────────┤ │
│  │ 😊 0.91  Sun News · FB · 3h  Dept: Health  ...           │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```
- Left filters: platform, channel, department, sentiment, confidence.
- Each item: sentiment badge + score, source, snippet, auto-tagged department, **Route to dept head** action, original-link, "needs review" flag for low-confidence Tanglish.
- **Alerts panel:** negative-spike cards with "Acknowledge / Escalate."
- Tabs: Live feed · Trends · Channels · Digests.

---

### D.7 Print Watch (Module 3)
```
┌── Print Media Watch ──── Paper:[All ▾] Edition:[Chennai ▾] Date:[Today]┐
│  Today: 18 govt items   Front-page: 4   Negative: 2 ⚠️                 │
├──────────────────────────────┬─────────────────────────────────────────┤
│  Clippings list              │   Clipping viewer                        │
│  ┌─ Daily Thanthi p1 ──────┐ │  [ cropped newspaper article image ]     │
│  │ "மெட்ரோ விரிவாக்கம்..."  │ │  ────────────────────────────────────    │
│  │ Prominence ●●●●○  😊      │ │  OCR text (TA) + translation (EN)        │
│  ├─ The Hindu p3 ──────────┤ │  Dept: Transport   Sentiment: 😊 Pos     │
│  │ "Metro expansion..."     │ │  Prominence: Front, 4 col, photo ✓       │
│  └──────────────────────────┘ │  Taxonomy: [Action ▾]  [Route] [Archive] │
└──────────────────────────────┴─────────────────────────────────────────┘
```
- Left: clipping list filtered by paper/edition/page/department/sentiment.
- Right: clipping viewer = cropped image + OCR text + EN translation + metadata + prominence breakdown + taxonomy classifier + Route/Archive.
- Tabs: Clippings · Daily Digest · Archive (full-text search).

---

### D.8 Alerts & Digests
- **Alerts tab:** chronological cards (crisis/negative spikes, trending schemes), severity color, acknowledge/escalate, who it was routed to.
- **Digests tab:** auto-generated daily/weekly digests (print + social), grouped by taxonomy and department, with "Send to dept heads" and export (PDF) button.

---

### D.9 Calendar
- Month/week view of scheduled cards + campaigns, color-coded by department; click a slot to open the card; drag to reschedule (publisher roles).

---

### D.10 Admin Console
- **Users & Roles:** add/edit users, assign role + district/department, approval-chain config.
- **Templates:** upload/manage card templates per type and platform sizes.
- **Sources:** manage Social Watch handles and Print Watch papers/editions.
- **Dictionaries:** hashtag groups, mention map (minister/dept handles), scheme keyword lists.
- **AI Rules:** tonality definitions, banned terms, honorific rules, grounding strictness.
- **Audit Log:** filterable immutable log of all actions.

---

# PART E — SHARED UI COMPONENTS & DESIGN SYSTEM

- **Language toggle (தமிழ் / English):** global, persists per user; full UI localization, Tamil-safe fonts (e.g., Noto Sans Tamil), proper line-height for Tamil glyphs.
- **Sentiment badges:** 😊 green / 😐 grey / ☹️ red + numeric confidence; low-confidence shows a "review" dot.
- **Status chips:** Draft / Pending / Approved / Scheduled / Published / Failed / Recalled (consistent colors).
- **Platform icons** with per-post status dots (queued/posted/failed).
- **Prominence meter:** 5-dot scale.
- **Diff view** component (original vs AI) reused in Create + Approvals.
- **Routing dropdown** (to department head) reused in Social + Print Watch.
- **Notification bell** with grouped in-app notifications; toast for real-time alerts.
- Accessibility: WCAG-AA contrast, keyboard nav, bilingual alt text, captions.

---

# PART F — KEY USER FLOWS

**F.1 Card lifecycle:** PRO submits → AI refines + moderates → PRO picks variant & designs → submit → Dept approval → HQ final approval → publisher sets platforms/hashtags/schedule → publish → track → (recall if needed).

**F.2 Negative news alert:** Social Watch detects negative spike → alert generated → routed to department head + DIPR desk → head acknowledges/escalates → (optional) triggers a Module 1 clarification card.

**F.3 Print digest:** overnight ingestion → OCR + segmentation + sentiment/prominence → taxonomy classification → morning digest auto-built → routed to department heads → urgent clippings pushed individually.