# Workspace Control Surface Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current Home presentation with a premium AI operating workspace / control surface while preserving existing docs routes, accessibility controls, and the approved Carbon Black × Muted Olive design language.

**Architecture:** Keep the existing static HTML/CSS/JavaScript application and reuse its route/render model. Replace only the Home experience and extend shared interaction primitives so the page can support a command-first canvas, system rail, progressive inspector, and responsive mobile sheet without introducing a framework.

**Tech Stack:** HTML5, CSS custom properties/Grid/Flexbox, vanilla JavaScript, existing localStorage settings and client-side route renderer.

**Spec:** `docs/superpowers/specs/2026-09-15-workspace-control-surface-design.md`

## Global Constraints

- Keep the existing static HTML/CSS/JavaScript stack for this iteration.
- Preserve access to existing docs, guides, API, SDK, and examples routes.
- Preserve theme, font-size, reduced-motion, keyboard focus, and mobile navigation behavior.
- Primary visual language: Carbon Black / near-black + muted olive, premium low-glare contrast, subtle 2.5D depth.
- Default Home must not show the full architecture topology.
- Mobile target includes approximately 393 px width.
- Do not add a framework or dependency for this redesign.

---

### Task 1: Reshape the Home semantic shell

**Files:**
- Modify: `index.html`
- Modify: `assets/app.js`

**Interfaces:**
- Consumes: existing `pageContent`, route mapping, search/settings controls.
- Produces: `renderHomePage()` markup with `.workspace-shell`, `#workspaceComposer`, `[data-workspace-action]`, `[data-system-item]`, `#workspaceInspector`, and `#inspectorClose` hooks.

- [ ] **Step 1: Add a lightweight DOM smoke assertion script in `assets/workspace-smoke.js`**

```js
export function validateWorkspaceMarkup(html) {
  const required = ['workspace-shell', 'workspaceComposer', 'workspaceInspector'];
  return required.every(token => html.includes(token));
}
```

- [ ] **Step 2: Verify the current Home renderer fails the new contract**

Run a local Node snippet importing the helper and passing the existing Home markup.
Expected: `false` because the workspace hooks do not exist yet.

- [ ] **Step 3: Replace the Home renderer with the workspace-first composition**

Implement a compact header-preserving Home containing:
- command-first hero/canvas,
- current-context strip,
- recent workspace/activity module,
- system rail,
- progressive inspector markup hidden by default,
- explicit product/demo-state labeling for authored interface state.

Do not change non-Home renderers.

- [ ] **Step 4: Run the smoke assertion again**

Expected: `true`.

- [ ] **Step 5: Commit**

```bash
git add index.html assets/app.js assets/workspace-smoke.js
git commit -m "feat: reshape home into workspace control surface"
```

### Task 2: Build the visual token and layout system

**Files:**
- Modify: `assets/styles.css`

**Interfaces:**
- Consumes: Task 1 class/id hooks.
- Produces: responsive styles for `.workspace-shell`, `.command-stage`, `.system-rail`, `.workspace-inspector`, `.context-strip`, `.activity-stack`, plus focus/reduced-motion states.

- [ ] **Step 1: Add workspace tokens near `:root`**

Define explicit surface, olive signal, platinum highlight, panel blur, elevation, radius, and motion-duration variables while retaining existing theme variables.

- [ ] **Step 2: Implement desktop workspace composition**

Use CSS Grid so the command stage dominates and system rail/inspector remain secondary. Avoid repeated equal-size marketing cards.

- [ ] **Step 3: Implement 393 px mobile composition**

At narrow widths, stack the command canvas first, convert the rail to a compact control strip, and present the inspector as a full-width bottom/overlay sheet.

- [ ] **Step 4: Implement tablet and zoom-safe states**

Ensure controls wrap instead of overlapping and content remains reachable at 200% zoom.

- [ ] **Step 5: Add motion and reduced-motion behavior**

Use short opacity/transform/blur transitions for focus and inspector changes; disable nonessential transitions when `prefers-reduced-motion` or the app setting requests reduced motion.

- [ ] **Step 6: Commit**

```bash
git add assets/styles.css
git commit -m "feat: add premium workspace visual system"
```

### Task 3: Add progressive workspace interactions

**Files:**
- Modify: `assets/app.js`

**Interfaces:**
- Consumes: `[data-system-item]`, `[data-workspace-action]`, `#workspaceInspector`, `#inspectorClose`, `#workspaceComposer`.
- Produces: `openWorkspaceInspector(id)`, `closeWorkspaceInspector()`, `activateWorkspaceAction(action)`, and keyboard-safe focus transitions.

- [ ] **Step 1: Add a pure inspector content map**

Create an object keyed by `repository`, `docs`, `sdk`, `runtime`, and `control-plane`; each value contains title, eyebrow, summary, and compact detail rows used only by the Home UI.

- [ ] **Step 2: Implement inspector open/close behavior**

Opening must update content, remove `hidden`, set the active item, and move focus to the inspector heading/close control. Closing must restore focus to the originating system item.

- [ ] **Step 3: Implement quick actions**

Wire actions for opening docs/search and focusing the composer. Do not create fake network calls.

- [ ] **Step 4: Extend Escape handling**

Escape closes the inspector before falling through to other dismissible surfaces.

- [ ] **Step 5: Commit**

```bash
git add assets/app.js
git commit -m "feat: add progressive workspace inspector interactions"
```

### Task 4: Verification and regression pass

**Files:**
- Modify if needed: `index.html`
- Modify if needed: `assets/styles.css`
- Modify if needed: `assets/app.js`
- Modify: `README.md` only to document the new experimental branch/preview if useful; do not turn README into a new policy document.

**Interfaces:**
- Consumes: complete Tasks 1–3.
- Produces: verified static preview with existing routes/settings intact.

- [ ] **Step 1: Run JavaScript syntax checks**

Run:
```bash
node --check assets/app.js
node --check assets/workspace-smoke.js
```
Expected: both exit 0.

- [ ] **Step 2: Run local static server**

Run:
```bash
python3 -m http.server 8080
```
Verify `/`, `/docs`, `/guides`, `/api`, `/sdk`, and `/examples` render through the existing client router.

- [ ] **Step 3: Verify interaction regression checklist**

Confirm:
- Cmd/Ctrl+K search still opens and closes.
- theme/dim/system controls still persist.
- text scaling still persists.
- reduced-motion setting still persists.
- mobile nav still opens/closes.
- workspace inspector opens/closes and restores focus.

- [ ] **Step 4: Verify responsive breakpoints**

Check approximately 393 px, 768 px, 1024 px, and desktop widths; ensure no destructive overlap.

- [ ] **Step 5: Commit verification fixes**

```bash
git add index.html assets/styles.css assets/app.js README.md
git commit -m "test: verify workspace control surface behavior"
```

### Task 5: Review branch before proposing merge

**Files:**
- Review: all changed files on `feat/workspace-control-surface`

**Interfaces:**
- Consumes: completed redesign branch.
- Produces: a reviewable branch/PR; no merge until visual result is approved.

- [ ] **Step 1: Compare branch against `main`**

Confirm only intended presentation-layer and documentation files changed.

- [ ] **Step 2: Check for accidental generic landing sections**

The Home first screen must read as a workspace/control surface, with no return to repeated Features/Testimonials/Pricing/Stats composition.

- [ ] **Step 3: Check authored style continuity**

Confirm Carbon Black × Muted Olive, matte depth, typography rhythm, and motion match the approved direction.

- [ ] **Step 4: Open a review PR**

Use a PR title such as:
```text
feat: introduce workspace control surface
```
Keep it unmerged until the user reviews the rendered result.
