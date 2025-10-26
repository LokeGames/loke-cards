# Front Module API

Helpers and contracts for feature modules that plug into the `apps/front` shell.

## Concepts

- `FrontModuleDefinition` describes a feature module (id, label, icon, loader, etc).
- `defineFrontModule` validates and freezes a module definition so it can be shared safely.
- `FrontModuleRegistry` is a lightweight helper for collecting definitions in the shell.
- `resolveModuleView` lazily loads the view component exported by a module definition.

## Theme Expectations

Modules rendered inside the shell should reuse tokens from `@loke/ui` (Tailwind theme, spacing scale, typography) and avoid overriding global colors. Stick to `bg-surface-*`, `text-*`, and `border-*` classes that already exist in `apps/front/src/app.css`.

You can import shared primitives from `@loke/ui` to compose internal navigation while staying on-brand.
