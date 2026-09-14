# AGENTS-SDK-DOSE.SITE

Production baseline for the AGENSDKDOS / AGENTS SDK DOSE presentation layer.

This repository is **not a generic landing-page template**. Any implementation must preserve the intended product identity, visual craft, and working scope instead of replacing them with conventional SaaS sections or placeholder content.

## Source of truth

- `main` is the approved baseline.
- Experimental redesigns belong on separate feature branches.
- Do not overwrite, redesign, rebrand, or restructure `main` unless the change is explicitly approved.
- Do not merge an experimental branch wholesale just because its structure appears cleaner. Bring back only approved parts.

## Real resources only

When the interface includes a `Resources`, `Tools`, `Workflow`, `Capabilities`, `Runtime`, `Status`, or similar section, the content must represent **real resources that exist in this repository or in an explicitly connected system**.

A resource is considered real only when at least one of these is true:

- it maps to an actual file, asset, component, document, route, endpoint, tool, or integration;
- it can be opened, executed, inspected, or verified;
- its state comes from a real source rather than decorative copy;
- its purpose and destination are clear enough for a user to act on it.

Do **not** invent resource cards merely to make the page look complete. Do not present planned or unavailable functionality as if it already works. If something is future work, label it clearly as planned, unavailable, or not connected.

## No fabricated product claims

Do not invent metrics or operational states such as:

- `99.9% success rate`
- `42 ms`
- `Runtime healthy`
- `Quality gate passed`
- production readiness, uptime, benchmark, security, or performance claims

unless those values are backed by an actual source that can be verified.

Decorative metrics are not acceptable substitutes for real system evidence.

## Design must be authored, not templated

Avoid default SaaS/AI-template composition such as automatically adding generic blocks for Features, Capabilities, Workflow, Testimonials, Pricing, Resources, or Stats simply because they are common web patterns.

Every section must have a reason to exist in this product.

The visual result must show deliberate design work through:

- a coherent token system for color, spacing, radius, type, borders, elevation, and motion;
- purposeful hierarchy rather than repeated generic cards;
- controlled Carbon Black × Muted Olive styling where it belongs to the approved direction;
- real 2.5D/depth treatment where appropriate, not random glow effects;
- consistent component behavior and interaction states;
- mobile-first composition without degrading desktop presentation.

## Icons: no emoji UI

Do not use emoji characters as the primary icon system or as decorative substitutes for designed interface assets.

Avoid UI such as `🚀`, `✨`, `⚡`, `✅`, `🔥`, or similar symbols placed into cards, buttons, navigation, feature blocks, or status areas merely for decoration.

Use one of the following instead:

- authored SVG icons;
- an existing project icon set;
- simple CSS/typographic symbols when they are intentionally part of the design language;
- accessible text labels when an icon is unnecessary.

Emoji may appear only when the product content explicitly requires emoji as content, not as a shortcut for visual design.

## Responsive scaling must be real

Do not call a page `responsive` simply because it has one media query.

Responsive work must consider the actual interface across relevant widths, including at minimum:

- narrow mobile around 393 px;
- wider mobile / landscape states;
- tablet-sized layouts;
- desktop layouts.

Use real scaling systems such as `rem`, `clamp()`, grid/flex constraints, readable line lengths, and spacing rules. Typography, cards, controls, navigation, and depth effects must remain usable rather than only shrinking proportionally.

At 200% browser zoom, important content and controls should remain reachable without destructive overlap.

## Accessibility is part of the design

Maintain:

- semantic HTML;
- visible keyboard focus states;
- meaningful labels for controls;
- adequate contrast;
- reduced-motion handling;
- usable text scaling;
- non-color-only interaction states.

Accessibility must not be represented only by a badge or a sentence saying the interface is accessible.

## Keep implementation honest

A refactor for maintainability is welcome when it preserves approved behavior and visual intent. Splitting HTML, CSS, JavaScript, assets, or components can be useful, but file count alone is not quality.

Do not justify a redesign by saying it is easier to maintain. Maintainability and product intent are separate requirements; both must be satisfied.

Prefer the smallest structure that makes the current implementation clear and maintainable. Do not create extra folders, components, manifests, build systems, frameworks, dependencies, or abstractions without a real need.

## Credit and run discipline

Agent work must be bounded by a concrete deliverable. Do not keep a run active merely to explore possibilities, generate generic alternatives, or continuously rewrite working code.

Before spending additional execution/agent credit, identify the exact artifact or verification expected from the run. If progress stalls or the work is only speculative, stop instead of continuing an open-ended loop.

Do not use expensive agent runs to produce placeholder sections, generic copy, cosmetic churn, or speculative refactors that were not requested.

## Change rule

Before proposing a merge into `main`, verify that the change:

1. solves the requested task;
2. uses real resources and evidence;
3. does not invent product claims;
4. does not replace the brand with a generic template;
5. preserves or improves responsive behavior and accessibility;
6. does not introduce emoji-based UI decoration;
7. does not add unrelated architecture or dependencies;
8. is worth the execution cost it consumed.

If any item is not satisfied, keep the work on its experimental branch and do not treat it as production-ready.
