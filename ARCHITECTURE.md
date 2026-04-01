# Architecture / project organization

## High-level shape
- **Feature code** lives under `src/features/<feature-name>/`.
- **Legacy/compat** entrypoints may still exist under `src/components/` and `src/stores/` during refactors, but should be thin wrappers.

## Drug forecast feature
Location: `src/features/drug-forecast/`

- **Form**: `src/features/drug-forecast/form/`
  - `DrugForecastForm.vue`: composes small field components
  - `components/`: `ProgramDataFields`, `ProtocolSelect`, `DrugCostList`, `CurrencyField`, `TooltipHelp`
- **Dashboard**: `src/features/drug-forecast/components/`
  - `ForecastDashboard.vue`: composes `ForecastSummary` + `ForecastTable`
  - `ForecastControls.vue`: share/copy/print controls
- **Store**: `src/features/drug-forecast/stores/`
  - `useDrugForecastStore.js`: Pinia store, composed from modules
  - `modules/`: `inputs`, `protocols`, `forecastPipeline`, `costs`
- **Pure utils**: `src/features/drug-forecast/utils/`
  - `format.js`: formatting helpers
  - `forecastMath.js`: (currently) re-exports legacy helper functions

## Conventions
- Prefer **small components** over multi-hundred line SFCs.
- Put **domain-specific** UI in the feature folder; only add to `src/shared/` once reused across multiple features.
- Keep **pure math/aggregation** as pure functions in `utils/` (no Vue reactivity).

