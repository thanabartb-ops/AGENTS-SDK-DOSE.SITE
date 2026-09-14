# Workspace Control Surface — Design Spec

## Intent

Redesign the AGENTS-SDK-DOSE presentation layer into an AI operating workspace / control surface while preserving the visual language the user explicitly likes. The design may explore broadly inside that language; it is not constrained by the older README’s conservative presentation rules.

## Product Direction

The page should feel like an authored AI workspace, not a generic SaaS landing page, docs portal, admin dashboard, or topology viewer. The interface should present a calm primary surface first and reveal complexity progressively.

## Visual Language

- Carbon black / near-black base with muted olive as the main signal color.
- Premium low-glare contrast, fine grain / sanded-matte surface feeling, subtle 2.5D depth.
- Controlled chrome/platinum highlights only where they help hierarchy.
- Large typography with tight editorial rhythm; avoid repetitive card grids.
- Motion should communicate state, focus, panel transitions, and depth rather than decorate.
- Preserve smoothness and visual restraint across 393 px mobile, wider mobile/tablet, and desktop.

## Level 1 — Home / Workspace

The default page is a clean operating surface with:

1. Compact brand/header and command/search entry.
2. A large central AI canvas led by a prompt / command composer.
3. Current workspace context and recent activity blocks.
4. A slim system rail showing available areas such as repository, docs, SDK, runtime/control-plane inspection entry points.
5. Quick actions that open real interface states instead of navigating through marketing sections.

No full architecture graph appears by default.

## Level 2 — Progressive Inspection

Detailed system information opens from selected workspace items. A right-side inspector or layered panel can reveal:

- evidence/status detail,
- authority/ownership context,
- deployment/runtime context,
- connected resource references,
- deeper topology only when explicitly requested by the user.

The interaction model should feel like inspecting a live system, not browsing a static dashboard.

## Content Policy for This Redesign

The redesign is allowed to use authored demo/interface states to communicate intended behavior and atmosphere, because the user explicitly removed the earlier restriction for this design branch. Any such state must be visually presented as product UI/demo context rather than an externally verified production claim.

## Interaction Model

- Command/search opens from the primary composer or keyboard shortcut.
- Workspace items can be focused; focus updates the inspector.
- Panels use short easing, blur/depth transitions, and shared geometry where practical.
- Reduced-motion mode disables nonessential movement.
- Keyboard focus remains visible and navigation remains reachable at high zoom.

## Responsive Behavior

### ~393 px
- Single-column command-first layout.
- Header collapses to brand + essential controls.
- System rail becomes a compact bottom/inline control strip.
- Inspector becomes a full-width sheet.

### Tablet
- Central canvas remains primary; secondary rail/panels become side-by-side when space allows.

### Desktop
- Center canvas dominates.
- Left/upper navigation stays compact.
- System rail and inspector may coexist without compressing the main command surface.

## Implementation Constraints

- Keep the existing static HTML/CSS/JavaScript stack for this iteration.
- Do not add a framework or dependency unless the current implementation cannot reasonably support the interaction.
- Preserve existing docs/guides/API content access while replacing the Home experience.
- Keep theme/font-size/reduced-motion preferences working.
- Keep semantic HTML and keyboard usability.

## Success Criteria

The result succeeds when:

1. the first screen reads as an AI operating workspace, not a landing page;
2. the Carbon Black × Muted Olive identity remains recognizable;
3. the layout feels smooth and premium on 393 px and desktop;
4. deeper system complexity is progressively revealed;
5. the experience has authored motion/depth without visual noise;
6. docs and existing content remain reachable;
7. no new framework is required for the redesign.
