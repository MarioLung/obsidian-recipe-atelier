# Changelog

## 1.2.0
- Fixed ingredient numbers: every ingredient gets a permanent number (`ingredient-id`). Recipes are linked to it, so renaming an ingredient updates all recipes; export/import maps ingredients by number (collisions get a new number).
- Costs update automatically in the recipe view, editor and dashboard when an ingredient changes (price, package, name …).
- New ingredient field "weight per piece" to convert pieces to grams (e.g. eggs); a ⚠ marks prices that cannot be converted.
- New package unit m³ (e.g. water), small prices are shown with more decimals.
- Packaging unit is now a combobox with common values (sorted A–Z) and free input.
- Cost column in the recipe view has the same width in all tables.
- Settings: button to link recipes to ingredient numbers.

## 1.1.0
- Ingredient → recipes: the ingredient list shows in how many recipes each ingredient is used (sortable column). Click the count to see the recipes with amounts and jump to the recipe or its editor.
- The ingredient dialog lists the recipes that use the ingredient.
- Fixed some remaining untranslated texts.

## 1.0.3
- Added CONTRIBUTING.md (contribution guide). No functional changes.

## 1.0.2
- The plugin no longer enumerates the whole vault: recipes and ingredients are looked up only in the configured recipe and ingredient folders.

## 1.0.1
- Stylesheet: removed `!important` (higher selector specificity instead).
- Release assets now carry GitHub build provenance attestations.

## 1.0.0
- First public release.
- Recipes with several parts, baker's percentages and amount mode, piece/portion/tray scaling.
- Ingredient management with prices, packaging and supplier links, cost calculation.
- Photos for the finished product and every step, alternatives, variants.
- Export and import (recipes, ingredients, images) as a single bundle file.
- Works on desktop and mobile.
