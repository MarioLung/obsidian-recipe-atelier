"use strict";
/* Recipe Atelier – recipe management for baking, cooking and pastry */
const obsidian = require("obsidian");
const { Plugin, ItemView, Modal, Notice, PluginSettingTab, Setting, TFile, normalizePath, setIcon, Platform, moment, TFolder, arrayBufferToBase64, base64ToArrayBuffer } = obsidian;

const VIEW_DASH = "recipe-atelier-dashboard";
const VIEW_EDIT = "recipe-atelier-editor";
const FENCE = "```";
const BLOCK_LANG = "recipe-manager";

/* ------------------------------------------------------------------ */
/* Sprache (Deutsch / English)                                         */
/* ------------------------------------------------------------------ */
let LANG = "en";
const EN = {
 "Rezepte": "Recipes",
 "Rezepte/Rohstoffe": "Recipes/Ingredients",
 "Rezepte/Bilder": "Recipes/Images",
 "Backen": "Baking",
 "Kochen": "Cooking",
 "Konditorei": "Pastry",
 "Stk.": "pcs.",
 "EL": "tbsp",
 "TL": "tsp",
 "Msp.": "dash",
 "Prise": "pinch",
 "Becher": "cup",
 "Pkg.": "pkg.",
 "Bund": "bunch",
 "Zehe": "clove",
 "Teigtemperatur": "Dough temperature",
 "Teigruhe": "Dough rest",
 "Stockgare": "Bulk proof",
 "Stückgare": "Final proof",
 "Backtemperatur": "Baking temperature",
 "Unterhitze": "Bottom heat",
 "Oberhitze": "Top heat",
 "Backzeit": "Baking time",
 "Programm": "Program",
 "Ausrollen": "Rolling out",
 "Knetzeit": "Kneading time",
 "Reifezeit": "Maturing time",
 "Kerntemperatur": "Core temperature",
 "Form / Blech": "Mold / tray",
 "Haltbarkeit": "Shelf life",
 "Teig": "Dough",
 "Neues Rezept": "New recipe",
 "Mehl": "Flour",
 "Wasser": "Water",
 "Salz": "Salt",
 "Hefe": "Yeast",
 "Masse": "Batter",
 "Zutaten": "Ingredients",
 "Dashboard öffnen": "Open dashboard",
 "Neuer Rohstoff": "New ingredient",
 "Rezepte exportieren …": "Export recipes…",
 "Rezepte importieren …": "Import recipes…",
 "Variante des aktuellen Rezepts erstellen": "Create variant of the current recipe",
 "Aktuelles Rezept im Editor öffnen": "Open current recipe in the editor",
 "Rezeptdaten ungültig: ": "Invalid recipe data: ",
 "Im Rezept-Editor öffnen": "Open in recipe editor",
 "Variante erstellen …": "Create variant…",
 "Rezept exportieren …": "Export recipe…",
 "Sonstige": "Other",
 " (Variante)": " (variant)",
 " (Import)": " (import)",
 "Name fehlt": "Name is missing",
 "Rohstoff existiert bereits": "Ingredient already exists",
 "Bild konnte nicht gespeichert werden: ": "Could not save image: ",
 "Variante von ": "Variant of ",
 "Bearbeiten": "Edit",
 "Gesamtgewicht": "Total weight",
 "Stück à ": "pcs @ ",
 "ca. ": "approx. ",
 "Gebäckgewicht (−": "Baked weight (−",
 "Portionen": "Portions",
 "Blech": "Tray",
 "Materialkosten": "Material cost",
 "pro Stück": "per piece",
 "pro Portion": "per portion",
 "pro Blech": "per tray",
 "Umrechnen:": "Scale:",
 "Stück": "Pieces",
 "× Faktor": "× factor",
 " g pro Stück": " g per piece",
 "Summe": "Total",
 " – Alternative wählen": " – choose alternative",
 "Gesamt (eingerechnete Teile)": "Total (counted parts)",
 "Zubereitung": "Method",
 "Notizen": "Notes",
 "Rohstoffe": "Ingredients",
 "Rezepte suchen …": "Search recipes…",
 "Alle": "All",
 "Keine Rezepte gefunden. Lege mit „Neues Rezept“ dein erstes Rezept an.": "No recipes found. Create your first recipe with “New recipe”.",
 " Teile": " parts",
 "Variante": "Variant",
 " Stk.": " pcs.",
 " Port.": " portions",
 " Blech": " tray",
 "Variante erstellen": "Create variant",
 "Duplizieren": "Duplicate",
 " Kopie": " copy",
 "Löschen": "Delete",
 "Rezept löschen?": "Delete recipe?",
 "“ wird in den Papierkorb verschoben.": "” will be moved to the trash.",
 "Rohstoffe suchen …": "Search ingredients…",
 "Noch keine Rohstoffe. Lege Mehl, Hefe, Butter … mit Preis und Lieferant an.": "No ingredients yet. Add flour, yeast, butter … with price and supplier.",
 "Rohstoff": "Ingredient",
 "Kategorie": "Category",
 "Lieferant": "Supplier",
 "Verpackung": "Packaging",
 "Packungsgewicht": "Package size",
 "Preis": "Price",
 "Preis / kg · Stk.": "Price / kg · pc.",
 " / kg": " / kg",
 " / Stk.": " / pc.",
 "Rohstoff löschen?": "Delete ingredient?",
 "Abbrechen": "Cancel",
 "Ja": "Yes",
 "„": "“",
 "Erstellt eine vollständige Kopie von „": "Creates a complete copy of “",
 "“ (Teile, Zutaten, Schritte, Fotos). Danach kannst du die Variante im Editor ändern; sie bleibt mit dem Original verknüpft.": "” (parts, ingredients, steps, photos). You can then edit the variant in the editor; it stays linked to the original.",
 "Name der Variante": "Variant name",
 "Danach im Editor öffnen": "Open in editor afterwards",
 "Variante anlegen": "Create variant",
 "Variante „": "Variant “",
 "“ angelegt": "” created",
 "Fehler: ": "Error: ",
 "Rezepte exportieren": "Export recipes",
 "Rezepte filtern …": "Filter recipes…",
 "Keine": "None",
 " von ": " of ",
 " Rezepten ausgewählt": " recipes selected",
 "Verwendete Rohstoffe mitnehmen": "Include used ingredients",
 "Preise, Lieferanten, Verpackung der in den Rezepten genutzten Rohstoffe.": "Prices, suppliers and packaging of the ingredients used in the recipes.",
 "Alle Rohstoffe mitnehmen": "Include all ingredients",
 "Bilder mitnehmen": "Include images",
 "Endergebnis- und Schrittfotos (werden in die Datei eingebettet).": "Photos of the result and of the steps (embedded in the file).",
 "Dateiname": "File name",
 "Bitte mindestens ein Rezept auswählen.": "Please select at least one recipe.",
 "Export läuft …": "Exporting…",
 "Gespeichert: ": "Saved: ",
 "Download nicht möglich – bitte „Im Vault speichern“ nutzen.": "Download not possible – please use “Save to vault”.",
 "Export heruntergeladen: ": "Export downloaded: ",
 " Rezepte, ": " recipes, ",
 " Rohstoffe, ": " ingredients, ",
 " Bilder exportiert": " images exported",
 "Export fehlgeschlagen: ": "Export failed: ",
 "Im Vault speichern": "Save to vault",
 "Als Datei herunterladen": "Download as file",
 "Rezepte importieren": "Import recipes",
 "Wähle eine Export-Datei (.rmbundle.json) von deinem Rechner oder aus dem Vault.": "Choose an export file (.rmbundle.json) from your device or from the vault.",
 "Export-Dateien im Vault": "Export files in the vault",
 " Bilder in der Datei.": " images in the file.",
 "Rohstoffe importieren": "Import ingredients",
 "Vorhandene Rohstoffe bleiben unverändert (außer bei „überschreiben“).": "Existing ingredients stay unchanged (except with “overwrite”).",
 "Bilder importieren": "Import images",
 "Wenn ein Rezept schon existiert": "If a recipe already exists",
 "Als Kopie anlegen": "Create as copy",
 "Überspringen": "Skip",
 "Überschreiben": "Overwrite",
 "Andere Datei": "Other file",
 "Importieren": "Import",
 "Keine Rezepte ausgewählt.": "No recipes selected.",
 "Import: ": "Import: ",
 " Bilder neu; ": " new images; ",
 " überschrieben, ": " overwritten, ",
 " übersprungen": " skipped",
 "Import fehlgeschlagen: ": "Import failed: ",
 "Keine Recipe-Atelier-Exportdatei": "Not a Recipe Atelier export file",
 "Datei nicht lesbar: ": "File not readable: ",
 "Titel": "Title",
 "z. B. Roggenbrot": "e.g. rye bread",
 "Anlegen": "Create",
 "Rohstoff bearbeiten": "Edit ingredient",
 "z. B. Weizenmehl W700": "e.g. bread flour",
 "Mehl, Milchprodukte, Gewürze …": "Flour, dairy, spices…",
 "Name des Lieferanten": "Supplier name",
 "Lieferanten-Homepage": "Supplier website",
 "Verpackungseinheit": "Packaging unit",
 "Sack, Karton, Eimer, Packung …": "Bag, box, bucket, pack…",
 "Verpackungsgewicht / -inhalt": "Package weight / content",
 "Preis pro Verpackung": "Price per package",
 "in ": "in ",
 "Artikelnummer": "Article number",
 "Allergene": "Allergens",
 "z. B. Gluten, Milch, Ei": "e.g. gluten, milk, egg",
 "Notiz": "Note",
 "Speichern": "Save",
 "Rezept": "Recipe",
 "Rezept bearbeiten": "Edit recipe",
 "Ungespeichert …": "Unsaved…",
 "Gespeichert ✓": "Saved ✓",
 "Speichern fehlgeschlagen: ": "Saving failed: ",
 "Ansicht": "View",
 "Exportieren": "Export",
 "Variante von: ": "Variant of: ",
 "Rezepttitel": "Recipe title",
 "Tags (Komma getrennt)": "Tags (comma separated)",
 "brot, sauerteig …": "bread, sourdough…",
 "Endergebnis (Foto)": "Result (photo)",
 "Beschreibung / Info": "Description / info",
 "Kurzbeschreibung, Herkunft, Hinweise …": "Short description, origin, notes…",
 "Zutaten & Teile": "Ingredients & parts",
 "Ein Rezept kann aus mehreren Teilen bestehen (z. B. Teig, Ziehfett, Füllung). Im Prozent-Modus wird die Menge aus dem Anteil berechnet; ändert man eine Menge, werden alle anderen proportional umgerechnet. Im Mengen-Modus gibst du Mengen ein und die Anteile werden berechnet.": "A recipe can consist of several parts (e.g. dough, laminating fat, filling). In percent mode the amount is calculated from the percentage; if you change an amount, all others are rescaled proportionally. In amount mode you enter amounts and the percentages are calculated.",
 "Teil hinzufügen (z. B. Füllung)": "Add part (e.g. filling)",
 "Teil ": "Part ",
 "Ausbeute & Stückberechnung": "Yield & piece calculation",
 "Backen / Herstellung – Parameter": "Baking / production parameters",
 "Herstellungsschritte": "Method steps",
 "Zusatzinfos / Notizen": "Additional info / notes",
 "Tipps, Varianten, Lagerung, Allergene …": "Tips, variants, storage, allergens…",
 "Keine Kosten berechenbar": "No cost available",
 "Lege Rohstoffe mit Preis an – Zutaten mit gleichem Namen werden automatisch zugeordnet.": "Add ingredients with a price – recipe ingredients with the same name are matched automatically.",
 "Materialkosten: ": "Material cost: ",
 " pro Stück": " per piece",
 " pro Portion": " per portion",
 " pro kg Gesamtgewicht": " per kg total weight",
 "Entfernen": "Remove",
 "Foto wählen oder hierher ziehen": "Choose a photo or drop it here",
 "Name des Teils": "Part name",
 "Prozent-Modus (Anteil → Menge)": "Percent mode (share → amount)",
 "Mengen-Modus (Menge → Anteil)": "Amount mode (amount → share)",
 "Nach oben": "Move up",
 "Nach unten": "Move down",
 "Teil löschen": "Delete part",
 "Teil löschen?": "Delete part?",
 "“ mit allen Zutaten entfernen?": "” with all ingredients?",
 "Bezug (= 100 %)": "Reference (= 100 %)",
 "Eine Zutat (z. B. Mehl)": "One ingredient (e.g. flour)",
 "Eigene Bezugsmenge": "Own reference amount",
 "Summe eines anderen Teils": "Total of another part",
 "Gesamtgewicht dieses Teils": "Total weight of this part",
 "Eine Zutat": "One ingredient",
 "Teil": "Part",
 "Bezugsmenge ": "Reference amount ",
 "Summenzeile (Bezeichnung)": "Total row (label)",
 "z. B. Mischteig, Fülle": "e.g. mixed dough, filling",
 "Alternative zu (Gruppe)": "Alternative to (group)",
 "z. B. Füllung": "e.g. Filling",
 "Menge pro Stück (g)": "Amount per piece (g)",
 "z. B. 20": "e.g. 20",
 "In Gesamtgewicht einrechnen": "Count towards total weight",
 "Anteil in Ansicht zeigen": "Show share in view",
 "Basis": "Base",
 "Zutat": "Ingredient",
 "Menge": "Amount",
 "Einheit": "Unit",
 "Anteil %": "Share %",
 "Kosten": "Cost",
 "z. B. 5 Stück": "e.g. 5 pieces",
 "Verknüpfung lösen": "Remove link",
 "Mit Summe eines anderen Teils verknüpfen (z. B. Poolish)": "Link to the total of another part (e.g. poolish)",
 "Es gibt keinen anderen Teil zum Verknüpfen.": "There is no other part to link to.",
 "Zutat entfernen": "Remove ingredient",
 "Bezeichnung des Gesamtgewichts": "Label of the total weight",
 "z. B. Blätterteig, Rezeptgewicht": "e.g. puff pastry, recipe weight",
 "Gesamtgewicht (": "Total weight (",
 ") – änderbar, skaliert alle Mengen": ") – editable, scales all amounts",
 "Ausgabe": "Output",
 "Stück (z. B. Brot, Gebäck)": "Pieces (e.g. bread, pastries)",
 "Portionen (z. B. Kochen)": "Portions (e.g. cooking)",
 "Blech (z. B. 60 x 40 cm)": "Tray (e.g. 60 x 40 cm)",
 "keine Angabe": "not specified",
 "Stückgewicht / Pressgewicht (g)": "Piece weight (g)",
 "Stückzahl – änderbar, skaliert alle Mengen": "Number of pieces – editable, scales all amounts",
 "Backverlust (%) – optional": "Baking loss (%) – optional",
 " Stück": " pieces",
 "Gebäckgewicht je Stück ≈ ": "Baked weight per piece ≈ ",
 "Blechgröße": "Tray size",
 "Anzahl Bleche – änderbar, rechnet alle Mengen neu": "Number of trays – editable, recalculates all amounts",
 "Alle Mengen mit Faktor multiplizieren": "Multiply all amounts by a factor",
 "Anwenden": "Apply",
 "Faktor > 0 eingeben": "Enter a factor > 0",
 "Skaliert auch die Portionenzahl (z. B. 2 Portionen → ×3 = 6 Portionen).": "Also scales the number of portions (e.g. 2 portions → ×3 = 6 portions).",
 "Bezeichnung": "Label",
 "Wert (z. B. 230 °C, 35 Min.)": "Value (e.g. 230 °C, 35 min)",
 "Parameter": "Parameter",
 "Standard-Backparameter einfügen": "Insert standard baking parameters",
 "Arbeitsschritt beschreiben …": "Describe the step…",
 "Schritt löschen": "Delete step",
 "Schritt hinzufügen": "Add step",
 "Rezeptordner": "Recipe folder",
 "Hier werden neue Rezepte angelegt.": "New recipes are created here.",
 "Rohstoffordner": "Ingredient folder",
 "Rohstoffe werden als Notizen mit Eigenschaften gespeichert.": "Ingredients are stored as notes with properties.",
 "Bilderordner": "Image folder",
 "Fotos von Endergebnis und Arbeitsschritten.": "Photos of the result and of the steps.",
 "Mengenanzeige (Prozent-Modus)": "Weight display (percent mode)",
 "Einheit für Mengen in Bäckerrezepten.": "Unit used for amounts in baker's recipes.",
 "Kilogramm (0,470 kg)": "Kilograms (0.470 kg)",
 "Gramm (470 g)": "Grams (470 g)",
 "Währungssymbol": "Currency symbol",
 "Kosten anzeigen": "Show costs",
 "Materialkosten aus den Rohstoffpreisen berechnen.": "Calculate material costs from ingredient prices.",
 "Rezepte nach Kategorie sortieren": "Sort recipes by category",
 "Verschiebt alle vorhandenen Rezepte in Unterordner ihrer Kategorie.": "Moves all existing recipes into sub-folders of their category.",
 "Jetzt sortieren": "Sort now",
 " Rezept(e) verschoben": " recipe(s) moved",
 "Kategorien": "Categories",
 "Komma getrennt. Jede Kategorie bekommt einen Unterordner im Rezeptordner.": "Comma separated. Each category gets a sub-folder in the recipe folder.",
 "Sprache": "Language",
 "Sprache der Oberfläche. „Automatisch“ folgt der Sprache von Obsidian.": "Language of the interface. “Automatic” follows the language of Obsidian.",
 "Automatisch (wie Obsidian)": "Automatic (same as Obsidian)",
 "1 Rezept": "1 recipe",
 " Rezepte": " recipes",
 "Verwendet in 1 Rezept": "Used in 1 recipe",
 "Verwendet in ": "Used in ",
 " Rezepten": " recipes",
 "Verwendet": "Used",
 "Nach Verwendung sortieren": "Sort by usage",
 "Nicht verwendet": "Not used",
 "Verwendung: ": "Usage: ",
 "Keine Rezepte verwenden diesen Rohstoff.": "No recipe uses this ingredient.",
 "Gesamt in allen Rezepten: ": "Total across all recipes: ",
 "Rezepte mit diesem Rohstoff": "Recipes using this ingredient"
};
/** Schlüssel sind die deutschen Texte; bei Englisch wird übersetzt. */
const tx = (k) => (LANG === "de" ? k : EN[k] !== undefined ? EN[k] : k);
function setLang(pref) {
  if (pref === "de" || pref === "en") { LANG = pref; return; }
  let l = "en";
  try { l = String(moment.locale() || "en").toLowerCase(); } catch (e) { /* ignorieren */ }
  LANG = l.indexOf("de") === 0 ? "de" : "en";
}
const numLocale = () => (LANG === "de" ? "de-DE" : "en-US");

function defaultSettings() {
  return {
    language: "auto",
    recipeFolder: tx("Rezepte"),
    ingredientFolder: tx("Rezepte/Rohstoffe"),
    imageFolder: tx("Rezepte/Bilder"),
    weightUnit: "kg",
    currency: "€",
    categories: [tx("Backen"), tx("Kochen"), tx("Konditorei")],
    showCost: true,
  };
}
const unitChoices = () => ["g", "kg", "ml", "l", tx("Stk."), tx("EL"), tx("TL"), tx("Msp."), tx("Prise"), tx("Becher"), tx("Pkg."), tx("Bund"), tx("Zehe")];
const packUnits = () => ["g", "kg", "ml", "l", tx("Stk.")];
const paramSuggestions = () => [
  tx("Teigtemperatur"), tx("Teigruhe"), tx("Stockgare"), tx("Stückgare"), tx("Backtemperatur"), tx("Unterhitze"), tx("Oberhitze"),
  tx("Backzeit"), tx("Programm"), tx("Ausrollen"), tx("Knetzeit"), tx("Reifezeit"), tx("Kerntemperatur"), tx("Form / Blech"), tx("Haltbarkeit"),
];
/** Kategorie-Art unabhängig von der Sprache */
function catKind(c) {
  c = String(c || "").toLowerCase();
  if (["backen", "baking", "bakery", "bread"].includes(c)) return "bake";
  if (["kochen", "cooking", "kitchen"].includes(c)) return "cook";
  if (["konditorei", "pastry", "confectionery"].includes(c)) return "pastry";
  return "";
}

/* ------------------------------------------------------------------ */
/* Hilfsfunktionen                                                     */
/* ------------------------------------------------------------------ */
const uid = () => Math.random().toString(36).slice(2, 9);

function parseNum(s) {
  if (typeof s === "number") return isFinite(s) ? s : 0;
  s = String(s == null ? "" : s).trim().replace(/\s/g, "");
  const lc = s.lastIndexOf(","), ld = s.lastIndexOf(".");
  if (lc >= 0 && ld >= 0) s = lc > ld ? s.replace(/\./g, "").replace(",", ".") : s.replace(/,/g, "");
  else if (lc >= 0) s = s.replace(",", ".");
  const n = parseFloat(s);
  return isFinite(n) ? n : 0;
}
function fmt(n, max) {
  if (n == null || !isFinite(n)) return "";
  if (max == null) max = 2;
  const f = Math.pow(10, max);
  return (Math.round(n * f) / f).toLocaleString(numLocale(), { maximumFractionDigits: max, useGrouping: false });
}
function fmtFix(n, d) {
  if (n == null || !isFinite(n)) return "";
  return n.toLocaleString(numLocale(), { minimumFractionDigits: d, maximumFractionDigits: d, useGrouping: false });
}
function slug(s) {
  return String(s || "bild").toLowerCase().replace(/[^a-z0-9äöüß]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "bild";
}
function safeName(s) {
  return String(s || "").replace(/[\\/:*?"<>|#^\[\]]/g, " ").replace(/\s+/g, " ").trim();
}

function downloadText(name, text) {
  try {
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = activeDocument.createElement("a");
    a.href = url; a.download = name;
    activeDocument.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
    return true;
  } catch (e) { return false; }
}

/** Einheiten: Faktor nach Gramm (Masse/Volumen als Gewicht gerechnet) */
function unitInfo(u) {
  const k = String(u || "g").toLowerCase().replace(/\./g, "").trim();
  if (k === "g") return { f: 1, kind: "mass" };
  if (k === "kg") return { f: 1000, kind: "mass" };
  if (k === "ml") return { f: 1, kind: "mass" };
  if (k === "l") return { f: 1000, kind: "mass" };
  if (k === "stk" || k === "pcs" || k === "piece" || k === "pieces") return { f: null, kind: "count" };
  return { f: null, kind: "other" };
}
function toGrams(amount, unit) {
  const i = unitInfo(unit);
  return i.f == null ? null : (amount || 0) * i.f;
}

/* ------------------------------------------------------------------ */
/* Datenmodell                                                         */
/* ------------------------------------------------------------------ */
function newIng(extra) {
  return Object.assign({ id: uid(), name: "", amount: 0, unit: "g", percent: 0, base: false, note: "" }, extra || {});
}
function newPart(name, mode) {
  const p = {
    id: uid(), name: name || tx("Teig"), mode: mode || "percent",
    baseRef: "free", basePartId: "", baseAmount: 1000, totalLabel: "", inTotal: true, showPercent: false, perPiece: 0, altGroup: "",
    ingredients: [],
  };
  return p;
}
function newRecipe(title, category) {
  const r = {
    v: 1, title: title || tx("Neues Rezept"), category: category || tx("Backen"), description: "", tags: [],
    yield: { mode: catKind(category) === "cook" ? "portions" : "pieces", pieceWeight: 0, portions: catKind(category) === "cook" ? 4 : 0, bakeLoss: 0 },
    totalLabel: "", parts: [], params: [], steps: [], photo: "", notes: "",
  };
  if (catKind(category) === "bake") {
    const p = newPart(tx("Teig"), "percent");
    p.baseRef = "ingredient";
    p.ingredients.push(newIng({ name: tx("Mehl"), percent: 100, base: true }));
    p.ingredients.push(newIng({ name: tx("Wasser"), percent: 60 }));
    p.ingredients.push(newIng({ name: tx("Salz"), percent: 2 }));
    p.ingredients.push(newIng({ name: tx("Hefe"), percent: 2 }));
    r.parts.push(p);
  } else {
    const p = newPart(catKind(category) === "pastry" ? tx("Masse") : tx("Zutaten"), "amount");
    p.baseRef = "total";
    p.ingredients.push(newIng({ name: "", amount: 0, unit: "g" }));
    r.parts.push(p);
  }
  return r;
}
function normalizeRecipe(d) {
  const base = newRecipe(d && d.title, d && d.category);
  const r = Object.assign({}, base, d || {});
  r.yield = Object.assign({ mode: "none", pieceWeight: 0, portions: 0, bakeLoss: 0 }, (d && d.yield) || {});
  r.parts = ((d && d.parts) || []).map((p) => {
    const np = Object.assign(newPart(p.name, p.mode), p);
    np.id = np.id || uid();
    np.ingredients = (p.ingredients || []).map((i) => Object.assign(newIng(), i, { id: i.id || uid() }));
    return np;
  });
  r.params = (d && d.params) || [];
  r.steps = (d && d.steps) || [];
  r.tags = (d && d.tags) || [];
  return r;
}

/* ------------------------------------------------------------------ */
/* Berechnung                                                          */
/* ------------------------------------------------------------------ */
function calcRecipe(r) {
  const res = { parts: {}, total: 0 };
  const visiting = {};
  function calcPart(p) {
    if (res.parts[p.id]) return res.parts[p.id];
    if (visiting[p.id]) return { base: 0, rows: [], total: 0 };
    visiting[p.id] = true;
    const pct = p.mode === "percent";
    let base = 0;
    if (p.baseRef === "part") {
      const q = r.parts.find((x) => x.id === p.basePartId && x.id !== p.id);
      base = q ? calcPart(q).total : 0;
    } else if (p.baseRef === "ingredient" && !pct) {
      const b = p.ingredients.find((i) => i.base);
      base = b ? toGrams(b.amount, b.unit) || 0 : 0;
    } else {
      base = p.baseAmount || 0;
    }
    const rows = p.ingredients.map((i) => {
      const q0 = i.refPart && i.refPart !== p.id ? r.parts.find((x) => x.id === i.refPart) : null;
      if (q0) {
        const g = calcPart(q0).total;
        if (pct) return { ing: i, unit: "g", amount: g, grams: g, percent: base > 0 ? (g / base) * 100 : 0, cost: null, linked: true };
        return { ing: i, unit: i.unit, amount: g / (unitInfo(i.unit).f || 1), grams: g, percent: null, cost: null, linked: true };
      }
      let percent = i.percent || 0;
      if (pct && p.baseRef === "ingredient" && i.base) percent = 100;
      if (pct) {
        const g = (base * percent) / 100;
        return { ing: i, unit: "g", amount: g, grams: g, percent, cost: null };
      }
      return { ing: i, unit: i.unit, amount: i.amount || 0, grams: toGrams(i.amount, i.unit), percent: null, cost: null };
    });
    let total = rows.reduce((s, x) => s + (x.grams || 0), 0);
    if (!pct) {
      const ref = p.baseRef === "total" || !base ? total : base;
      rows.forEach((x) => { x.percent = x.grams != null && ref > 0 ? (x.grams / ref) * 100 : null; });
      base = ref;
    }
    /* Menge pro Stück: Teil (nicht im Gesamtgewicht) wird aus der Stückzahl berechnet */
    if (!p.inTotal && p.perPiece > 0 && r.yield && r.yield.pieceWeight > 0) {
      let t = 0;
      r.parts.forEach((q) => { if (q.inTotal && q.id !== p.id) t += calcPart(q).total; });
      const target = p.perPiece * (t / r.yield.pieceWeight);
      if (total > 0 && target > 0) {
        const f = target / total;
        rows.forEach((x) => { x.amount *= f; if (x.grams != null) x.grams *= f; });
        total = target;
        base *= f;
      }
    }
    visiting[p.id] = false;
    return (res.parts[p.id] = { base, rows, total, pct });
  }
  r.parts.forEach(calcPart);
  r.parts.forEach((p) => { if (p.inTotal) res.total += res.parts[p.id].total; });
  const y = r.yield || {};
  res.pieces = y.pieceWeight > 0 ? res.total / y.pieceWeight : null;
  res.bakedPiece = y.pieceWeight > 0 && y.bakeLoss > 0 ? y.pieceWeight * (1 - y.bakeLoss / 100) : null;
  return res;
}

function scaleRecipe(r, f) {
  if (!(f > 0) || !isFinite(f)) return;
  r.parts.forEach((p) => {
    if (p.mode === "percent") {
      if (p.baseRef !== "part") p.baseAmount = (p.baseAmount || 0) * f;
    } else {
      p.ingredients.forEach((i) => { i.amount = (i.amount || 0) * f; });
      if (p.baseRef === "free") p.baseAmount = (p.baseAmount || 0) * f;
    }
  });
  if (r.yield && r.yield.portions) r.yield.portions = r.yield.portions * f;
}

function setTotalWeight(r, targetG) {
  const t = calcRecipe(r).total;
  if (t > 0 && targetG > 0) scaleRecipe(r, targetG / t);
}
function setPieces(r, pieces) {
  const pw = r.yield.pieceWeight;
  if (pw > 0 && pieces > 0) setTotalWeight(r, pieces * pw);
}

/** Menge einer Zutat ändern (Wert in Gramm bei Prozent-Modus, sonst in der Einheit der Zeile) */
function setIngAmount(r, p, ing, value) {
  if (ing.refPart) return;
  if (p.mode === "percent") {
    const base = calcRecipe(r).parts[p.id].base;
    if (p.baseRef === "part" || !(ing.percent > 0) && p.baseRef !== "ingredient") {
      ing.percent = base > 0 ? (value / base) * 100 : 0;
    } else if (p.baseRef === "ingredient" && ing.base) {
      p.baseAmount = value;
    } else if (ing.percent > 0) {
      p.baseAmount = (value * 100) / ing.percent;
    } else {
      ing.percent = base > 0 ? (value / base) * 100 : 0;
    }
  } else {
    ing.amount = value;
  }
}
/** Prozent einer Zutat ändern */
function setIngPercent(r, p, ing, value) {
  if (ing.refPart) return;
  if (p.mode === "percent") {
    ing.percent = value;
  } else {
    const pc = calcRecipe(r).parts[p.id];
    const g = (pc.base * value) / 100;
    const i = unitInfo(ing.unit);
    if (i.f && pc.base > 0) ing.amount = g / i.f;
  }
}
function convertPartMode(r, p, mode, unit) {
  unit = unit || "g";
  const uf = unitInfo(unit).f || 1;
  if (p.mode === mode) return;
  const pc = calcRecipe(r).parts[p.id];
  if (mode === "amount") {
    pc.rows.forEach((x) => { x.ing.amount = (x.grams || 0) / uf; x.ing.unit = unit; });
    if (p.baseRef === "ingredient" && !p.ingredients.some((i) => i.base) && p.ingredients[0]) p.ingredients[0].base = true;
    p.baseAmount = pc.base;
  } else {
    p.baseAmount = pc.base || p.baseAmount;
    if (p.baseRef === "total") { p.baseRef = "free"; p.baseAmount = pc.total; }
    pc.rows.forEach((x) => { x.ing.percent = x.percent == null ? 0 : x.percent; });
    if (p.baseRef === "ingredient") {
      const b = p.ingredients.find((i) => i.base);
      if (b) { p.baseAmount = toGrams(b.amount, b.unit) || p.baseAmount; b.percent = 100; }
      else p.baseRef = "free";
    }
  }
  p.mode = mode;
}

/* Kosten */
function lineCost(row, idx) {
  const name = (row.ing.name || "").trim().toLowerCase();
  const info = name && idx.get(name);
  if (!info) return null;
  const k = unitInfo(row.unit).kind;
  if (info.kind === "mass" && row.grams != null) return row.grams * info.perUnit;
  if (info.kind === "count" && k === "count") return row.amount * info.perUnit;
  return null;
}
/** Bei Alternativen-Gruppen zählt nur die gewählte (sonst die erste) Alternative */
function altSkipIds(r, sel) {
  const skip = {}, groups = {};
  r.parts.forEach((p) => { if (p.altGroup) (groups[p.altGroup] = groups[p.altGroup] || []).push(p); });
  Object.keys(groups).forEach((g) => {
    const l = groups[g];
    if (l.length < 2) return;
    const chosen = sel && l.some((x) => x.id === sel[g]) ? sel[g] : l[0].id;
    l.forEach((x) => { if (x.id !== chosen) skip[x.id] = true; });
  });
  return skip;
}
function recipeCost(r, calc, idx, skip) {
  let total = 0, any = false;
  skip = skip || altSkipIds(r, {});
  r.parts.forEach((p) => {
    if (skip[p.id]) return;
    calc.parts[p.id].rows.forEach((row) => {
      row.cost = lineCost(row, idx);
      if (row.cost != null) { total += row.cost; any = true; }
    });
  });
  return any ? total : null;
}

/* ------------------------------------------------------------------ */
/* Datei-Format                                                        */
/* ------------------------------------------------------------------ */
function extractData(text) {
  const re = new RegExp(FENCE + BLOCK_LANG + "\\n([\\s\\S]*?)\\n" + FENCE);
  const m = re.exec(text);
  if (!m) return null;
  try { return normalizeRecipe(JSON.parse(m[1])); } catch (e) { return null; }
}
function injectBlock(text, data) {
  const block = FENCE + BLOCK_LANG + "\n" + JSON.stringify(data, null, 1) + "\n" + FENCE;
  const re = new RegExp(FENCE + BLOCK_LANG + "\\n[\\s\\S]*?\\n" + FENCE);
  if (re.test(text)) return text.replace(re, () => block);
  return text.replace(/\s*$/, "") + "\n\n" + block + "\n";
}

/* ------------------------------------------------------------------ */
/* Plugin                                                              */
/* ------------------------------------------------------------------ */
class RecipeManagerPlugin extends Plugin {
  async onload() {
    const saved = await this.loadData();
    setLang(saved && saved.language);
    this.settings = Object.assign({}, defaultSettings(), saved || {});
    if (!saved) await this.saveSettings();

    this.registerView(VIEW_DASH, (leaf) => new DashboardView(leaf, this));
    this.registerView(VIEW_EDIT, (leaf) => new RecipeEditorView(leaf, this));

    this.addRibbonIcon("chef-hat", "Recipe Atelier", () => this.openDashboard());

    this.addCommand({ id: "open-dashboard", name: tx("Dashboard öffnen"), callback: () => this.openDashboard() });
    this.addCommand({ id: "new-recipe", name: tx("Neues Rezept"), callback: () => new NewRecipeModal(this.app, this).open() });
    this.addCommand({ id: "new-ingredient", name: tx("Neuer Rohstoff"), callback: () => new IngredientModal(this.app, this, null).open() });
    this.addCommand({ id: "export-recipes", name: tx("Rezepte exportieren …"), callback: () => new ExportModal(this.app, this, []).open() });
    this.addCommand({ id: "import-recipes", name: tx("Rezepte importieren …"), callback: () => new ImportModal(this.app, this).open() });
    this.addCommand({
      id: "create-variant", name: tx("Variante des aktuellen Rezepts erstellen"),
      checkCallback: (checking) => {
        const f = this.app.workspace.getActiveFile();
        if (!f || !this.isRecipeFile(f)) return false;
        if (!checking) new VariantModal(this.app, this, f).open();
        return true;
      },
    });
    this.addCommand({
      id: "edit-current", name: tx("Aktuelles Rezept im Editor öffnen"),
      checkCallback: (checking) => {
        const f = this.app.workspace.getActiveFile();
        if (!f || !this.isRecipeFile(f)) return false;
        if (!checking) this.openEditor(f);
        return true;
      },
    });

    this.registerMarkdownCodeBlockProcessor(BLOCK_LANG, (src, el, ctx) => {
      let data;
      try { data = normalizeRecipe(JSON.parse(src)); } catch (e) { el.createEl("pre", { text: tx("Rezeptdaten ungültig: ") + e.message }); return; }
      renderRecipeCard(el, data, this, ctx.sourcePath);
    });

    this.registerEvent(this.app.workspace.on("file-menu", (menu, file) => {
      if (file instanceof TFile && this.isRecipeFile(file)) {
        menu.addItem((i) => i.setTitle(tx("Im Rezept-Editor öffnen")).setIcon("chef-hat").onClick(() => this.openEditor(file)));
        menu.addItem((i) => i.setTitle(tx("Variante erstellen …")).setIcon("git-branch").onClick(() => new VariantModal(this.app, this, file).open()));
        menu.addItem((i) => i.setTitle(tx("Rezept exportieren …")).setIcon("upload").onClick(() => new ExportModal(this.app, this, [file]).open()));
      }
    }));
    const refresh = () => this.app.workspace.getLeavesOfType(VIEW_DASH).forEach((l) => l.view.scheduleRefresh && l.view.scheduleRefresh());
    this.registerEvent(this.app.metadataCache.on("changed", refresh));
    this.registerEvent(this.app.vault.on("delete", refresh));
    this.registerEvent(this.app.vault.on("rename", refresh));

    this.addSettingTab(new RMSettingTab(this.app, this));
  }

  onunload() {}
  async saveSettings() { await this.saveData(this.settings); }

  /* --- Navigation --- */
  async openDashboard() {
    const ex = this.app.workspace.getLeavesOfType(VIEW_DASH)[0];
    if (ex) { this.app.workspace.revealLeaf(ex); return; }
    const leaf = this.app.workspace.getLeaf("tab");
    await leaf.setViewState({ type: VIEW_DASH, active: true });
    this.app.workspace.revealLeaf(leaf);
  }
  async openEditor(file) {
    const leaf = this.app.workspace.getLeaf("tab");
    await leaf.setViewState({ type: VIEW_EDIT, active: true, state: { file: file.path } });
    this.app.workspace.revealLeaf(leaf);
  }
  async openNote(file) {
    const leaf = this.app.workspace.getLeaf("tab");
    await leaf.openFile(file);
  }

  /* --- Dateien --- */
  async ensureFolder(path) {
    path = normalizePath(path);
    const parts = path.split("/");
    let cur = "";
    for (const p of parts) {
      cur = cur ? cur + "/" + p : p;
      if (!this.app.vault.getAbstractFileByPath(cur)) {
        try { await this.app.vault.createFolder(cur); } catch (e) { /* existiert */ }
      }
    }
  }
  fm(file) {
    const c = this.app.metadataCache.getFileCache(file);
    return (c && c.frontmatter) || {};
  }
  isRecipeFile(f) { return f.extension === "md" && this.fm(f)["rm-type"] === "recipe"; }
  isIngredientFile(f) { return f.extension === "md" && this.fm(f)["rm-type"] === "ingredient"; }
  /** Notizen nur in den konfigurierten Ordnern (Rezepte + Rohstoffe) durchsuchen – nicht den ganzen Vault */
  filesIn(folderPaths, ext) {
    const out = [], seen = new Set();
    const walk = (folder) => {
      for (const ch of folder.children) {
        if (ch instanceof TFolder) walk(ch);
        else if (ch instanceof TFile && ch.extension === ext && !seen.has(ch.path)) { seen.add(ch.path); out.push(ch); }
      }
    };
    for (const p of folderPaths) {
      const folder = p ? this.app.vault.getFolderByPath(normalizePath(p)) : null;
      if (folder) walk(folder);
    }
    return out;
  }
  noteFiles() { return this.filesIn([this.settings.recipeFolder, this.settings.ingredientFolder], "md"); }
  recipeFiles() { return this.noteFiles().filter((f) => this.isRecipeFile(f)); }

  async loadRecipe(file) {
    const text = await this.app.vault.read(file);
    return extractData(text) || newRecipe(file.basename, tx("Backen"));
  }
  async saveRecipe(file, data) {
    await this.app.vault.process(file, (t) => injectBlock(t, data));
    await this.app.fileManager.processFrontMatter(file, (fm) => {
      fm["rm-type"] = "recipe";
      fm["category"] = data.category; delete fm["kategorie"];
      if (data.tags && data.tags.length) fm["tags"] = data.tags; else delete fm["tags"];
    });
  }
  categoryFolder(category) {
    return normalizePath(this.settings.recipeFolder + "/" + (safeName(category) || tx("Sonstige")));
  }
  /** Rezeptdatei in den Ordner seiner Kategorie verschieben */
  async moveToCategoryFolder(file, category) {
    const dir = this.categoryFolder(category);
    if (file.parent && file.parent.path === dir) return;
    await this.ensureFolder(dir);
    let path = normalizePath(dir + "/" + file.name);
    let n = 2;
    while (this.app.vault.getAbstractFileByPath(path)) path = normalizePath(dir + "/" + file.basename + " " + n++ + ".md");
    await this.app.fileManager.renameFile(file, path);
  }
  async moveAllToCategoryFolders() {
    let n = 0;
    for (const f of this.recipeFiles()) {
      const data = await this.loadRecipe(f);
      const before = f.path;
      await this.moveToCategoryFolder(f, data.category);
      if (f.path !== before) n++;
    }
    return n;
  }
  async createRecipe(title, category) {
    title = safeName(title) || tx("Neues Rezept");
    const dir = this.categoryFolder(category);
    await this.ensureFolder(dir);
    let path = normalizePath(dir + "/" + title + ".md");
    let n = 2;
    while (this.app.vault.getAbstractFileByPath(path)) path = normalizePath(dir + "/" + title + " " + n++ + ".md");
    const data = newRecipe(title, category);
    const content = "---\nrm-type: recipe\ncategory: " + category + "\n---\n\n" + FENCE + BLOCK_LANG + "\n" + JSON.stringify(data, null, 1) + "\n" + FENCE + "\n";
    return await this.app.vault.create(path, content);
  }

  /* --- Variante --- */
  async createVariant(file, title) {
    const orig = await this.app.vault.read(file);
    const data = extractData(orig) || (await this.loadRecipe(file));
    const copy = JSON.parse(JSON.stringify(data));
    copy.title = safeName(title) || file.basename + tx(" (Variante)");
    copy.variantOf = { title: file.basename, path: file.path };
    const nf = await this.createRecipe(copy.title, copy.category);
    await this.app.vault.modify(nf, orig);
    copy.title = nf.basename;
    await this.saveRecipe(nf, copy);
    return nf;
  }

  /* --- Export / Import --- */
  async buildBundle(files, opts) {
    const bundle = { format: "recipe-manager-bundle", version: 1, created: new Date().toISOString(), recipes: [], ingredients: [], images: [] };
    const imgs = new Set(), names = new Set();
    for (const f of files) {
      const text = await this.app.vault.read(f);
      const data = extractData(text) || newRecipe(f.basename, tx("Backen"));
      bundle.recipes.push({ name: f.basename, category: data.category, content: text });
      if (data.photo) imgs.add(data.photo);
      (data.steps || []).forEach((st) => st.photo && imgs.add(st.photo));
      data.parts.forEach((p) => p.ingredients.forEach((i) => { if (i.name && !i.refPart) names.add(i.name.trim().toLowerCase()); }));
    }
    if (opts.ingredients || opts.allIngredients) {
      for (const ing of this.ingredients()) {
        if (opts.allIngredients || names.has(ing.name.toLowerCase())) {
          bundle.ingredients.push({ name: ing.name, content: await this.app.vault.read(ing.file) });
        }
      }
    }
    if (opts.images) {
      for (const p of imgs) {
        const f = this.app.vault.getAbstractFileByPath(p);
        if (f instanceof TFile) bundle.images.push({ path: p, data: arrayBufferToBase64(await this.app.vault.readBinary(f)) });
      }
    }
    return bundle;
  }

  async importBundle(bundle, opts) {
    const res = { recipes: 0, ingredients: 0, images: 0, skipped: 0, overwritten: 0 };
    const exists = (p) => this.app.vault.getAbstractFileByPath(p);
    const free = (dir, base) => {
      let p = normalizePath(dir + "/" + base + ".md"), n = 2;
      while (exists(p)) p = normalizePath(dir + "/" + base + " " + n++ + ".md");
      return p;
    };
    if (opts.images) {
      for (const im of bundle.images || []) {
        const p = normalizePath(im.path);
        if (exists(p)) continue;
        await this.ensureFolder(p.split("/").slice(0, -1).join("/") || "/");
        await this.app.vault.createBinary(p, base64ToArrayBuffer(im.data));
        res.images++;
      }
    }
    if (opts.ingredients) {
      for (const ing of bundle.ingredients || []) {
        const dir = this.settings.ingredientFolder;
        await this.ensureFolder(dir);
        const p = normalizePath(dir + "/" + safeName(ing.name) + ".md");
        const ex = exists(p);
        if (ex instanceof TFile) {
          if (opts.mode === "overwrite") { await this.app.vault.modify(ex, ing.content); res.overwritten++; } else res.skipped++;
        } else { await this.app.vault.create(p, ing.content); res.ingredients++; }
      }
    }
    for (const i of opts.recipes) {
      const r = bundle.recipes[i];
      if (!r) continue;
      const dir = this.categoryFolder(r.category);
      await this.ensureFolder(dir);
      let p = normalizePath(dir + "/" + safeName(r.name) + ".md");
      let content = r.content;
      const ex = exists(p);
      if (ex instanceof TFile) {
        if (opts.mode === "overwrite") { await this.app.vault.modify(ex, content); res.overwritten++; continue; }
        if (opts.mode === "skip") { res.skipped++; continue; }
        p = free(dir, safeName(r.name) + tx(" (Import)"));
        const d = extractData(content);
        if (d) { d.title = p.split("/").pop().replace(/\.md$/, ""); content = injectBlock(content, d); }
      }
      await this.app.vault.create(p, content);
      res.recipes++;
    }
    return res;
  }

  /* --- Rohstoffe --- */
  ingredients() {
    const list = [];
    for (const f of this.noteFiles()) {
      if (!this.isIngredientFile(f)) continue;
      const m = this.fm(f);
      const g = (...ks) => { for (const k of ks) if (m[k] !== undefined && m[k] !== null && m[k] !== "") return m[k]; return ""; };
      list.push({
        file: f, name: f.basename, kategorie: g("category", "kategorie"), lieferant: g("supplier", "lieferant"),
        url: g("supplier-url", "lieferant-url"), verpackung: g("packaging", "verpackung"),
        gewicht: parseNum(g("package-size", "packungsgewicht")), einheit: g("package-unit", "packungseinheit") || "kg",
        preis: parseNum(g("price", "preis")), artikel: g("article-number", "artikelnr"), allergene: g("allergens", "allergene"), notiz: g("notes", "notiz"),
      });
    }
    return list.sort((a, b) => a.name.localeCompare(b.name, LANG));
  }
  /** Preis pro Gramm (Masse) bzw. pro Stück */
  pricePerBase(ing) {
    if (!(ing.gewicht > 0) || !(ing.preis > 0)) return null;
    const u = unitInfo(ing.einheit);
    if (u.kind === "mass") return { kind: "mass", perUnit: ing.preis / (ing.gewicht * u.f) };
    if (u.kind === "count") return { kind: "count", perUnit: ing.preis / ing.gewicht };
    return null;
  }
  costIndex() {
    const m = new Map();
    this.ingredients().forEach((i) => { const p = this.pricePerBase(i); if (p) m.set(i.name.trim().toLowerCase(), p); });
    return m;
  }
  /** Rohstoff-Verwendung: Name (klein) → Map(Rezeptpfad → {file, title, category, parts, grams, amounts}) */
  async usageIndex() {
    const idx = new Map();
    for (const f of this.recipeFiles()) {
      let data = null;
      try { data = extractData(await this.app.vault.cachedRead(f)); } catch (e) { data = null; }
      if (!data) continue;
      const calc = calcRecipe(data);
      data.parts.forEach((p) => {
        const pc = calc.parts[p.id];
        if (!pc) return;
        pc.rows.forEach((row) => {
          const n = String(row.ing.name || "").trim().toLowerCase();
          if (!n || row.ing.refPart) return;
          let e = idx.get(n);
          if (!e) { e = new Map(); idx.set(n, e); }
          let u = e.get(f.path);
          if (!u) { u = { file: f, title: data.title || f.basename, category: data.category, parts: [], grams: 0, amounts: [] }; e.set(f.path, u); }
          u.parts.push(p.name);
          if (row.grams != null) u.grams += row.grams;
          else if (row.amount) u.amounts.push(fmt(row.amount, 3) + " " + row.unit);
        });
      });
    }
    return idx;
  }

  async saveIngredient(existing, v) {
    const name = safeName(v.name);
    if (!name) throw new Error(tx("Name fehlt"));
    let file = existing && existing.file;
    if (file) {
      if (file.basename !== name) {
        const np = normalizePath(file.parent.path + "/" + name + ".md");
        if (this.app.vault.getAbstractFileByPath(np)) throw new Error(tx("Rohstoff existiert bereits"));
        await this.app.fileManager.renameFile(file, np);
      }
    } else {
      await this.ensureFolder(this.settings.ingredientFolder);
      const path = normalizePath(this.settings.ingredientFolder + "/" + name + ".md");
      if (this.app.vault.getAbstractFileByPath(path)) throw new Error(tx("Rohstoff existiert bereits"));
      file = await this.app.vault.create(path, "---\nrm-type: ingredient\n---\n");
    }
    await this.app.fileManager.processFrontMatter(file, (fm) => {
      fm["rm-type"] = "ingredient";
      const set = (k, val) => { if (val === "" || val == null || val === 0) delete fm[k]; else fm[k] = val; };
      ["kategorie", "lieferant", "lieferant-url", "verpackung", "packungsgewicht", "packungseinheit", "preis", "artikelnr", "allergene", "notiz"].forEach((k) => delete fm[k]);
      set("category", v.kategorie); set("supplier", v.lieferant); set("supplier-url", v.url);
      set("packaging", v.verpackung); set("package-size", v.gewicht); set("package-unit", v.einheit);
      set("price", v.preis); set("article-number", v.artikel); set("allergens", v.allergene); set("notes", v.notiz);
    });
    return file;
  }

  /* --- Bilder --- */
  imgSrc(path) {
    if (!path) return "";
    const f = this.app.vault.getAbstractFileByPath(path);
    return f instanceof TFile ? this.app.vault.getResourcePath(f) : "";
  }
  pickImage(title) {
    return new Promise((resolve) => {
      const inp = activeDocument.createElement("input");
      inp.type = "file"; inp.accept = "image/*";
      inp.onchange = async () => {
        const f = inp.files && inp.files[0];
        if (!f) return resolve(null);
        resolve(await this.storeImage(f, title));
      };
      inp.click();
    });
  }
  async storeImage(file, title) {
    try {
      const ext = (file.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "") || "png";
      await this.ensureFolder(this.settings.imageFolder);
      const path = normalizePath(this.settings.imageFolder + "/" + slug(title) + "-" + Date.now().toString(36) + "." + ext);
      await this.app.vault.createBinary(path, await file.arrayBuffer());
      return path;
    } catch (e) {
      new Notice(tx("Bild konnte nicht gespeichert werden: ") + e.message);
      return null;
    }
  }

  weightText(g) {
    if (g == null) return "";
    return this.settings.weightUnit === "g" ? fmt(g, 1) + " g" : fmtFix(g / 1000, 3) + " kg";
  }
  weightInput(g) {
    return this.settings.weightUnit === "g" ? fmt(g, 1) : fmtFix(g / 1000, 3);
  }
  weightFactor() { return this.settings.weightUnit === "g" ? 1 : 1000; }
  money(v) { return v == null ? "" : fmtFix(v, 2) + " " + this.settings.currency; }
}

/* ------------------------------------------------------------------ */
/* Rezeptkarte (Lesemodus, Code-Block)                                 */
/* ------------------------------------------------------------------ */
function renderRecipeCard(container, data, plugin, sourcePath) {
  const root = container.createDiv("rm-card");
  let factor = 1;
  const altSel = {};

  const draw = () => {
    root.empty();
    const r = JSON.parse(JSON.stringify(data));
    scaleRecipe(r, factor);
    const calc = calcRecipe(r);
    const idx = plugin.settings.showCost ? plugin.costIndex() : new Map();
    const cost = plugin.settings.showCost ? recipeCost(r, calc, idx, altSkipIds(r, altSel)) : null;
    const hasCost = cost != null;

    const head = root.createDiv("rm-card-head");
    const titleBox = head.createDiv("rm-card-titlebox");
    const noteName = String(sourcePath || "").split("/").pop().replace(/\.md$/, "");
    if (r.title !== noteName) titleBox.createEl("div", { cls: "rm-card-title", text: r.title });
    const meta = titleBox.createDiv("rm-chips");
    if (r.category) meta.createSpan({ cls: "rm-chip rm-chip-accent", text: r.category });
    (r.tags || []).forEach((t) => meta.createSpan({ cls: "rm-chip", text: "#" + t }));
    if (r.variantOf) {
      const vc = meta.createSpan({ cls: "rm-chip rm-chip-btn", text: tx("Variante von ") + r.variantOf.title });
      vc.onclick = () => {
        const f = plugin.app.vault.getAbstractFileByPath(r.variantOf.path) || plugin.recipeFiles().find((x) => x.basename === r.variantOf.title);
        if (f instanceof TFile) plugin.openNote(f);
      };
    }
    const btn = head.createEl("button", { cls: "rm-btn", text: tx("Bearbeiten") });
    setIcon(btn.createSpan({ cls: "rm-btn-icon" }), "pencil");
    btn.prepend(btn.querySelector(".rm-btn-icon"));
    btn.onclick = () => {
      const f = plugin.app.vault.getAbstractFileByPath(sourcePath);
      if (f instanceof TFile) plugin.openEditor(f);
    };

    if (r.photo && plugin.imgSrc(r.photo)) {
      const img = root.createEl("img", { cls: "rm-hero" });
      img.src = plugin.imgSrc(r.photo);
    }
    if (r.description) root.createDiv({ cls: "rm-desc", text: r.description });

    /* Kennzahlen + Skalierung */
    const stats = root.createDiv("rm-stats");
    const stat = (label, value) => {
      const s = stats.createDiv("rm-stat");
      s.createDiv({ cls: "rm-stat-value", text: value });
      s.createDiv({ cls: "rm-stat-label", text: label });
    };
    if (calc.total > 0) stat(r.totalLabel || tx("Gesamtgewicht"), plugin.weightText(calc.total));
    if (r.yield.mode === "pieces" && calc.pieces != null) {
      stat(tx("Stück à ") + fmt(r.yield.pieceWeight, 1) + " g", tx("ca. ") + fmt(calc.pieces, 1));
      if (calc.bakedPiece) stat(tx("Gebäckgewicht (−") + fmt(r.yield.bakeLoss, 1) + " %)", fmt(calc.bakedPiece, 1) + " g");
    }
    if (r.yield.mode === "portions" && r.yield.portions) stat(tx("Portionen"), fmt(r.yield.portions, 1));
    if (r.yield.mode === "trays" && r.yield.portions) stat(tx("Blech") + (r.yield.traySize ? " " + r.yield.traySize : ""), fmt(r.yield.portions, 2));
    if (hasCost) {
      stat(tx("Materialkosten"), plugin.money(cost));
      if (r.yield.mode === "pieces" && calc.pieces) stat(tx("pro Stück"), plugin.money(cost / calc.pieces));
      if (r.yield.mode === "portions" && r.yield.portions) stat(tx("pro Portion"), plugin.money(cost / r.yield.portions));
      if (r.yield.mode === "trays" && r.yield.portions) stat(tx("pro Blech"), plugin.money(cost / r.yield.portions));
    }

    const scaler = root.createDiv("rm-scaler");
    scaler.createSpan({ text: tx("Umrechnen:") });
    const baseOut = data.yield.mode === "pieces" && data.yield.pieceWeight > 0
      ? { label: tx("Stück"), base: calcRecipe(data).pieces }
      : data.yield.mode === "portions" && data.yield.portions ? { label: tx("Portionen"), base: data.yield.portions }
      : data.yield.mode === "trays" && data.yield.portions ? { label: tx("Blech"), base: data.yield.portions } : null;
    if (baseOut && baseOut.base > 0) {
      const inp = scaler.createEl("input", { cls: "rm-input rm-input-sm", type: "text" });
      inp.value = fmt(baseOut.base * factor, 2);
      scaler.createSpan({ text: baseOut.label });
      inp.onchange = () => { const v = parseNum(inp.value); if (v > 0) { factor = v / baseOut.base; draw(); } };
    }
    const fin = scaler.createEl("input", { cls: "rm-input rm-input-sm", type: "text" });
    fin.value = fmt(factor, 3);
    scaler.createSpan({ text: tx("× Faktor") });
    fin.onchange = () => { const v = parseNum(fin.value); if (v > 0) { factor = v; draw(); } };
    [0.5, 1, 2, 3].forEach((f) => {
      const b = scaler.createEl("button", { cls: "rm-btn rm-btn-sm", text: f === 0.5 ? "½" : f + "×" });
      b.onclick = () => { factor = f; draw(); };
    });

    /* Teile */
    const showCostCol = hasCost;
    const drawPart = (p, host) => {
      const pc = calc.parts[p.id];
      const box = host.createDiv("rm-part-view");
      box.createEl("h3", { text: p.name + (p.perPiece > 0 && !p.inTotal && r.yield.pieceWeight > 0 ? " – " + fmt(p.perPiece, 1) + tx(" g pro Stück") : "") });
      const t = box.createEl("table", { cls: "rm-table" });
      const showPct = p.mode === "percent" || p.showPercent;
      const tb = t.createEl("tbody");
      pc.rows.forEach((row) => {
        const tr = tb.createEl("tr");
        const amountTxt = p.mode === "percent" ? plugin.weightText(row.grams) : fmt(row.amount, 3) + " " + row.unit;
        if (p.mode === "percent") {
          tr.createEl("td", { text: row.ing.name });
          tr.createEl("td", { cls: "rm-muted", text: row.ing.note || "" });
          tr.createEl("td", { cls: "rm-num", text: amountTxt });
        } else {
          tr.createEl("td", { cls: "rm-num", text: amountTxt });
          tr.createEl("td", { text: row.ing.name + (row.ing.note ? " – " + row.ing.note : "") });
        }
        if (showPct) tr.createEl("td", { cls: "rm-num rm-muted", text: row.percent != null ? fmt(row.percent, 1) + " %" : "" });
        if (showCostCol) tr.createEl("td", { cls: "rm-num rm-muted", text: row.cost != null ? plugin.money(row.cost) : "" });
      });
      if (pc.total > 0 && (p.mode === "percent" || p.totalLabel)) {
        const tr = tb.createEl("tr", { cls: "rm-total" });
        if (p.mode === "percent") {
          tr.createEl("td", { text: p.totalLabel || tx("Summe") });
          tr.createEl("td");
          tr.createEl("td", { cls: "rm-num", text: plugin.weightText(pc.total) });
        } else {
          tr.createEl("td", { cls: "rm-num", text: plugin.weightText(pc.total) });
          tr.createEl("td", { text: p.totalLabel });
        }
        if (showPct) tr.createEl("td");
        if (showCostCol) tr.createEl("td");
      }
    };
    const doneGroups = {};
    r.parts.forEach((p) => {
      if (!p.altGroup) return drawPart(p, root);
      if (doneGroups[p.altGroup]) return;
      doneGroups[p.altGroup] = true;
      const grp = r.parts.filter((x) => x.altGroup === p.altGroup);
      if (grp.length < 2) return drawPart(p, root);
      const sel = grp.some((x) => x.id === altSel[p.altGroup]) ? altSel[p.altGroup] : grp[0].id;
      const gb = root.createDiv("rm-alt");
      gb.createDiv({ cls: "rm-alt-title", text: p.altGroup + tx(" – Alternative wählen") });
      const tabs = gb.createDiv("rm-tabs");
      grp.forEach((x) => {
        const b = tabs.createEl("button", { cls: "rm-tab" + (x.id === sel ? " is-active" : ""), text: x.name });
        b.onclick = () => { altSel[p.altGroup] = x.id; draw(); };
      });
      drawPart(grp.find((x) => x.id === sel), gb);
    });
    if (r.parts.length > 1 && calc.total > 0) {
      const g = root.createDiv("rm-grand");
      g.createSpan({ text: r.totalLabel || tx("Gesamt (eingerechnete Teile)") });
      g.createSpan({ cls: "rm-num", text: plugin.weightText(calc.total) });
    }

    /* Parameter */
    const params = (r.params || []).filter((x) => x.label || x.value);
    if (params.length) {
      const pb = root.createDiv("rm-params");
      params.forEach((x) => {
        const c = pb.createDiv("rm-param");
        c.createDiv({ cls: "rm-param-label", text: x.label });
        c.createDiv({ cls: "rm-param-value", text: x.value });
      });
    }

    /* Schritte */
    const steps = (r.steps || []).filter((s) => s.text || s.photo);
    if (steps.length) {
      root.createEl("h3", { text: tx("Zubereitung") });
      const ol = root.createDiv("rm-steps");
      steps.forEach((s, i) => {
        const row = ol.createDiv("rm-step");
        row.createDiv({ cls: "rm-step-n", text: String(i + 1) });
        const body = row.createDiv("rm-step-body");
        body.createDiv({ cls: "rm-step-text", text: s.text });
        if (s.photo && plugin.imgSrc(s.photo)) body.createEl("img", { cls: "rm-step-img" }).src = plugin.imgSrc(s.photo);
      });
    }
    if (r.notes) {
      root.createEl("h3", { text: tx("Notizen") });
      root.createDiv({ cls: "rm-notes", text: r.notes });
    }
  };
  draw();
}

/* ------------------------------------------------------------------ */
/* Dashboard                                                           */
/* ------------------------------------------------------------------ */
class DashboardView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.tab = "recipes";
    this.search = "";
    this.cat = "";
    this.timer = null;
  }
  getViewType() { return VIEW_DASH; }
  getDisplayText() { return "Recipe Atelier"; }
  getIcon() { return "chef-hat"; }
  async onOpen() { this.contentEl.addClass("rm-dash"); await this.render(); }
  scheduleRefresh() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => { if (!this.contentEl.contains(activeDocument.activeElement) || activeDocument.activeElement.tagName !== "INPUT") this.render(); }, 500);
  }

  async render() {
    const el = this.contentEl;
    el.empty();
    const top = el.createDiv("rm-dash-top");
    top.createEl("h1", { text: "Recipe Atelier" });
    const tabs = top.createDiv("rm-tabs");
    [["recipes", tx("Rezepte"), "book-open"], ["ingredients", tx("Rohstoffe"), "package"]].forEach(([k, label, icon]) => {
      const b = tabs.createEl("button", { cls: "rm-tab" + (this.tab === k ? " is-active" : "") });
      setIcon(b.createSpan(), icon);
      b.createSpan({ text: label });
      b.onclick = () => { this.tab = k; this.search = ""; this.render(); };
    });
    if (this.tab === "recipes") await this.renderRecipes(el);
    else this.renderIngredients(el);
  }

  toolbar(el, placeholder, addLabel, onAdd) {
    const bar = el.createDiv("rm-toolbar");
    const s = bar.createEl("input", { cls: "rm-input rm-search", type: "search", placeholder });
    s.value = this.search;
    s.oninput = () => { this.search = s.value; this.renderBody(); };
    const add = bar.createEl("button", { cls: "rm-btn rm-btn-primary" });
    setIcon(add.createSpan(), "plus");
    add.createSpan({ text: addLabel });
    add.onclick = onAdd;
    return bar;
  }

  async renderRecipes(el) {
    const bar = this.toolbar(el, tx("Rezepte suchen …"), tx("Neues Rezept"), () => new NewRecipeModal(this.app, this.plugin).open());
    const tb = (icon, label, fn) => {
      const b = bar.createEl("button", { cls: "rm-btn" });
      setIcon(b.createSpan(), icon);
      b.createSpan({ text: label });
      b.onclick = fn;
    };
    tb("download", "Import", () => new ImportModal(this.app, this.plugin).open());
    tb("upload", "Export", () => new ExportModal(this.app, this.plugin, []).open());
    const chips = el.createDiv("rm-chips rm-filter");
    ["", ...this.plugin.settings.categories].forEach((c) => {
      const b = chips.createEl("button", { cls: "rm-chip rm-chip-btn" + (this.cat === c ? " is-active" : ""), text: c || tx("Alle") });
      b.onclick = () => { this.cat = c; this.render(); };
    });
    this.body = el.createDiv();
    this.recipeData = [];
    for (const f of this.plugin.recipeFiles()) {
      try { this.recipeData.push({ file: f, data: await this.plugin.loadRecipe(f) }); } catch (e) { /* ignorieren */ }
    }
    this.recipeData.sort((a, b) => a.file.basename.localeCompare(b.file.basename, LANG));
    this.renderBody();
  }

  renderBody() {
    if (!this.body) return;
    this.body.empty();
    if (this.tab === "ingredients") return this.renderIngredientRows();
    const q = this.search.toLowerCase();
    const idx = this.plugin.settings.showCost ? this.plugin.costIndex() : new Map();
    const items = this.recipeData.filter(({ file, data }) =>
      (!this.cat || data.category === this.cat) &&
      (!q || (file.basename + " " + (data.variantOf ? data.variantOf.title : "") + " " + (data.tags || []).join(" ") + " " + data.parts.map((p) => p.ingredients.map((i) => i.name).join(" ")).join(" ")).toLowerCase().includes(q)));
    if (!items.length) {
      this.body.createDiv({ cls: "rm-empty", text: tx("Keine Rezepte gefunden. Lege mit „Neues Rezept“ dein erstes Rezept an.") });
      return;
    }
    const grid = this.body.createDiv("rm-grid");
    items.forEach(({ file, data }) => {
      const calc = calcRecipe(data);
      const cost = recipeCost(data, calc, idx);
      const c = grid.createDiv("rm-tile");
      const img = c.createDiv("rm-tile-img");
      const src = this.plugin.imgSrc(data.photo);
      if (src) img.createEl("img").src = src; else setIcon(img, "chef-hat");
      const b = c.createDiv("rm-tile-body");
      b.createDiv({ cls: "rm-tile-title", text: data.title || file.basename });
      const m = b.createDiv("rm-chips");
      m.createSpan({ cls: "rm-chip rm-chip-accent", text: data.category });
      if (data.parts.length > 1) m.createSpan({ cls: "rm-chip", text: data.parts.length + tx(" Teile") });
      if (data.variantOf) m.createSpan({ cls: "rm-chip", text: tx("Variante") });
      const info = [];
      if (calc.total > 0) info.push(this.plugin.weightText(calc.total));
      if (calc.pieces) info.push(tx("ca. ") + fmt(calc.pieces, 1) + tx(" Stk."));
      if (data.yield.mode === "portions" && data.yield.portions) info.push(fmt(data.yield.portions, 1) + tx(" Port."));
      if (data.yield.mode === "trays" && data.yield.portions) info.push(fmt(data.yield.portions, 2) + tx(" Blech") + (data.yield.traySize ? " " + data.yield.traySize : ""));
      if (cost != null) info.push(this.plugin.money(cost));
      b.createDiv({ cls: "rm-muted rm-tile-info", text: info.join(" · ") });
      const act = c.createDiv("rm-tile-actions");
      const mk = (icon, title, fn) => {
        const x = act.createEl("button", { cls: "rm-icon-btn", attr: { "aria-label": title } });
        setIcon(x, icon);
        x.onclick = (e) => { e.stopPropagation(); fn(); };
      };
      mk("pencil", tx("Bearbeiten"), () => this.plugin.openEditor(file));
      mk("git-branch", tx("Variante erstellen"), () => new VariantModal(this.app, this.plugin, file).open());
      mk("copy", tx("Duplizieren"), async () => {
        const nf = await this.plugin.createRecipe((data.title || file.basename) + tx(" Kopie"), data.category);
        const copy = JSON.parse(JSON.stringify(data));
        copy.title = nf.basename;
        await this.plugin.saveRecipe(nf, copy);
      });
      mk("trash-2", tx("Löschen"), () => new ConfirmModal(this.app, tx("Rezept löschen?"), tx("„") + file.basename + tx("“ wird in den Papierkorb verschoben."), async () => {
        await this.app.fileManager.trashFile(file);
      }).open());
      c.onclick = () => this.plugin.openNote(file);
    });
  }

  renderIngredients(el) {
    this.toolbar(el, tx("Rohstoffe suchen …"), tx("Neuer Rohstoff"), () => new IngredientModal(this.app, this.plugin, null).open());
    this.body = el.createDiv();
    this.usage = null;
    this.ingSort = this.ingSort || "name";
    this.renderIngredientRows();
    this.plugin.usageIndex().then((idx) => {
      this.usage = idx;
      if (this.tab === "ingredients" && this.body && this.body.isConnected) this.renderIngredientRows();
    });
  }

  usageFor(name) {
    const e = this.usage && this.usage.get(String(name).trim().toLowerCase());
    return e ? Array.from(e.values()) : [];
  }

  renderIngredientRows() {
    this.body.empty();
    const q = this.search.toLowerCase();
    const list = this.plugin.ingredients().filter((i) => !q || (i.name + " " + i.kategorie + " " + i.lieferant).toLowerCase().includes(q));
    if (this.usage && this.ingSort !== "name") {
      const cnt = (i) => this.usageFor(i.name).length;
      list.sort((a, b) => (this.ingSort === "usage-desc" ? cnt(b) - cnt(a) : cnt(a) - cnt(b)) || a.name.localeCompare(b.name, LANG));
    }
    if (!list.length) {
      this.body.createDiv({ cls: "rm-empty", text: tx("Noch keine Rohstoffe. Lege Mehl, Hefe, Butter … mit Preis und Lieferant an.") });
      return;
    }
    const t = this.body.createEl("table", { cls: "rm-table rm-table-wide" });
    const hr = t.createEl("thead").createEl("tr");
    [tx("Rohstoff"), tx("Kategorie"), tx("Lieferant"), tx("Verpackung"), tx("Packungsgewicht"), tx("Preis"), tx("Preis / kg · Stk."), "usage", ""].forEach((h) => {
      if (h !== "usage") { hr.createEl("th", { text: h }); return; }
      const arrow = this.ingSort === "usage-desc" ? " ↓" : this.ingSort === "usage-asc" ? " ↑" : "";
      const th = hr.createEl("th", { cls: "rm-num rm-sortable", text: tx("Verwendet") + arrow, attr: { title: tx("Nach Verwendung sortieren") } });
      th.onclick = () => {
        this.ingSort = this.ingSort === "name" ? "usage-desc" : this.ingSort === "usage-desc" ? "usage-asc" : "name";
        this.renderIngredientRows();
      };
    });
    const tb = t.createEl("tbody");
    list.forEach((i) => {
      const tr = tb.createEl("tr");
      tr.createEl("td", { cls: "rm-strong", text: i.name });
      tr.createEl("td", { text: i.kategorie });
      const lt = tr.createEl("td");
      if (i.url) {
        const a = lt.createEl("a", { text: i.lieferant || i.url, href: i.url });
        a.setAttr("target", "_blank"); a.setAttr("rel", "noopener");
      } else lt.setText(i.lieferant);
      tr.createEl("td", { text: i.verpackung });
      tr.createEl("td", { cls: "rm-num", text: i.gewicht ? fmt(i.gewicht, 3) + " " + i.einheit : "" });
      tr.createEl("td", { cls: "rm-num", text: i.preis ? this.plugin.money(i.preis) : "" });
      const pb = this.plugin.pricePerBase(i);
      let per = "";
      if (pb) per = pb.kind === "mass" ? this.plugin.money(pb.perUnit * 1000) + tx(" / kg") : this.plugin.money(pb.perUnit) + tx(" / Stk.");
      tr.createEl("td", { cls: "rm-num rm-muted", text: per });
      const ut = tr.createEl("td", { cls: "rm-num" });
      if (!this.usage) ut.setText("…");
      else {
        const uses = this.usageFor(i.name);
        if (!uses.length) { ut.createSpan({ cls: "rm-muted", text: "–", attr: { title: tx("Nicht verwendet") } }); tr.addClass("rm-unused"); }
        else {
          const ub = ut.createEl("button", { cls: "rm-chip rm-chip-btn", text: recipeCount(uses.length) });
          ub.onclick = () => new UsageModal(this.app, this.plugin, i.name, uses).open();
        }
      }
      const act = tr.createEl("td", { cls: "rm-row-actions" });
      const mk = (icon, title, fn) => {
        const x = act.createEl("button", { cls: "rm-icon-btn", attr: { "aria-label": title } });
        setIcon(x, icon);
        x.onclick = fn;
      };
      mk("pencil", tx("Bearbeiten"), () => new IngredientModal(this.app, this.plugin, i).open());
      mk("trash-2", tx("Löschen"), () => new ConfirmModal(this.app, tx("Rohstoff löschen?"), tx("„") + i.name + tx("“ wird in den Papierkorb verschoben."), async () => {
        await this.app.fileManager.trashFile(i.file);
      }).open());
    });
  }
}

/* ------------------------------------------------------------------ */
/* Modals                                                              */
/* ------------------------------------------------------------------ */
class ConfirmModal extends Modal {
  constructor(app, title, text, onOk) { super(app); this.t = title; this.x = text; this.ok = onOk; }
  onOpen() {
    this.titleEl.setText(this.t);
    this.contentEl.createEl("p", { text: this.x });
    const row = this.contentEl.createDiv("rm-modal-actions");
    row.createEl("button", { text: tx("Abbrechen") }).onclick = () => this.close();
    const b = row.createEl("button", { cls: "mod-warning", text: tx("Ja") });
    b.onclick = async () => { await this.ok(); this.close(); };
  }
}

class VariantModal extends Modal {
  constructor(app, plugin, file) { super(app); this.plugin = plugin; this.file = file; }
  onOpen() {
    this.titleEl.setText(tx("Variante erstellen"));
    this.contentEl.createEl("p", { cls: "rm-muted", text: tx("Erstellt eine vollständige Kopie von „") + this.file.basename + tx("“ (Teile, Zutaten, Schritte, Fotos). Danach kannst du die Variante im Editor ändern; sie bleibt mit dem Original verknüpft.") });
    let title = this.file.basename + tx(" (Variante)"), open = true;
    new Setting(this.contentEl).setName(tx("Name der Variante")).addText((t) => { t.setValue(title); t.inputEl.addClass("rm-w100"); t.onChange((v) => (title = v)); setTimeout(() => { t.inputEl.focus(); t.inputEl.select(); }, 50); });
    new Setting(this.contentEl).setName(tx("Danach im Editor öffnen")).addToggle((t) => t.setValue(open).onChange((v) => (open = v)));
    new Setting(this.contentEl).addButton((b) => b.setButtonText(tx("Variante anlegen")).setCta().onClick(async () => {
      try {
        const nf = await this.plugin.createVariant(this.file, title);
        this.close();
        new Notice(tx("Variante „") + nf.basename + tx("“ angelegt"));
        if (open) this.plugin.openEditor(nf);
      } catch (e) { new Notice(tx("Fehler: ") + e.message); }
    }));
  }
}

class ExportModal extends Modal {
  constructor(app, plugin, preselected) { super(app); this.plugin = plugin; this.pre = new Set((preselected || []).map((f) => f.path)); }
  onOpen() {
    this.modalEl.addClass("rm-modal-wide");
    this.titleEl.setText(tx("Rezepte exportieren"));
    const files = this.plugin.recipeFiles().sort((a, b) => a.path.localeCompare(b.path, LANG));
    this.sel = new Set(this.pre);
    const c = this.contentEl;
    const bar = c.createDiv("rm-export-bar");
    const search = bar.createEl("input", { cls: "rm-input", type: "search", placeholder: tx("Rezepte filtern …") });
    const all = bar.createEl("button", { text: tx("Alle") });
    const none = bar.createEl("button", { text: tx("Keine") });
    const list = c.createDiv("rm-export-list");
    const count = c.createDiv({ cls: "rm-muted rm-export-count" });
    const cats = {};
    files.forEach((f) => { const cat = f.parent ? f.parent.name : ""; (cats[cat] = cats[cat] || []).push(f); });
    const boxes = [];
    const upd = () => count.setText(this.sel.size + tx(" von ") + files.length + tx(" Rezepten ausgewählt"));
    Object.keys(cats).sort().forEach((cat) => {
      const grp = list.createDiv("rm-export-group");
      const head = grp.createEl("label", { cls: "rm-export-cat" });
      const gcb = head.createEl("input", { type: "checkbox" });
      head.createSpan({ text: cat + " (" + cats[cat].length + ")" });
      const rows = [];
      cats[cat].forEach((f) => {
        const row = grp.createEl("label", { cls: "rm-export-row" });
        const cb = row.createEl("input", { type: "checkbox" });
        cb.checked = this.sel.has(f.path);
        row.createSpan({ text: f.basename });
        cb.onchange = () => { cb.checked ? this.sel.add(f.path) : this.sel.delete(f.path); upd(); };
        rows.push({ cb, row, f });
        boxes.push({ cb, row, f });
      });
      gcb.onchange = () => { rows.forEach((r) => { if (!r.row.hasClass("rm-hidden")) { r.cb.checked = gcb.checked; gcb.checked ? this.sel.add(r.f.path) : this.sel.delete(r.f.path); } }); upd(); };
    });
    search.oninput = () => { const q = search.value.toLowerCase(); boxes.forEach((b) => b.row.toggleClass("rm-hidden", !!q && !b.f.basename.toLowerCase().includes(q))); };
    all.onclick = () => { boxes.forEach((b) => { if (!b.row.hasClass("rm-hidden")) { b.cb.checked = true; this.sel.add(b.f.path); } }); upd(); };
    none.onclick = () => { boxes.forEach((b) => { b.cb.checked = false; }); this.sel.clear(); upd(); };
    upd();
    const opts = { ingredients: true, allIngredients: false, images: true };
    let name = "recipe-export-" + new Date().toISOString().slice(0, 10);
    new Setting(c).setName(tx("Verwendete Rohstoffe mitnehmen")).setDesc(tx("Preise, Lieferanten, Verpackung der in den Rezepten genutzten Rohstoffe.")).addToggle((t) => t.setValue(true).onChange((v) => (opts.ingredients = v)));
    new Setting(c).setName(tx("Alle Rohstoffe mitnehmen")).addToggle((t) => t.setValue(false).onChange((v) => (opts.allIngredients = v)));
    new Setting(c).setName(tx("Bilder mitnehmen")).setDesc(tx("Endergebnis- und Schrittfotos (werden in die Datei eingebettet).")).addToggle((t) => t.setValue(true).onChange((v) => (opts.images = v)));
    new Setting(c).setName(tx("Dateiname")).addText((t) => { t.setValue(name); t.onChange((v) => (name = v)); });
    const run = async (mode) => {
      const chosen = files.filter((f) => this.sel.has(f.path));
      if (!chosen.length) return new Notice(tx("Bitte mindestens ein Rezept auswählen."));
      const n = new Notice(tx("Export läuft …"), 0);
      try {
        const bundle = await this.plugin.buildBundle(chosen, opts);
        const json = JSON.stringify(bundle);
        const fname = safeName(name || "recipe-export") + ".rmbundle.json";
        if (mode === "vault") {
          const dir = normalizePath(this.plugin.settings.recipeFolder + "/Export");
          await this.plugin.ensureFolder(dir);
          let p = normalizePath(dir + "/" + fname);
          if (this.app.vault.getAbstractFileByPath(p)) p = normalizePath(dir + "/" + Date.now().toString(36) + "-" + fname);
          await this.app.vault.create(p, json);
          new Notice(tx("Gespeichert: ") + p);
        } else if (!downloadText(fname, json)) {
          new Notice(tx("Download nicht möglich – bitte „Im Vault speichern“ nutzen."));
        } else new Notice(tx("Export heruntergeladen: ") + fname);
        new Notice(bundle.recipes.length + tx(" Rezepte, ") + bundle.ingredients.length + tx(" Rohstoffe, ") + bundle.images.length + tx(" Bilder exportiert"));
        this.close();
      } catch (e) { new Notice(tx("Export fehlgeschlagen: ") + e.message); }
      n.hide();
    };
    const row = c.createDiv("rm-modal-actions");
    const mobile = Platform.isMobile;
    row.createEl("button", { cls: mobile ? "mod-cta" : "", text: tx("Im Vault speichern") }).onclick = () => run("vault");
    const dl = row.createEl("button", { cls: mobile ? "" : "mod-cta", text: tx("Als Datei herunterladen") });
    dl.onclick = () => run("download");
  }
}

class ImportModal extends Modal {
  constructor(app, plugin) { super(app); this.plugin = plugin; this.bundle = null; }
  onOpen() {
    this.modalEl.addClass("rm-modal-wide");
    this.titleEl.setText(tx("Rezepte importieren"));
    this.draw();
  }
  draw() {
    const c = this.contentEl;
    c.empty();
    if (!this.bundle) {
      c.createEl("p", { cls: "rm-muted", text: tx("Wähle eine Export-Datei (.rmbundle.json) von deinem Rechner oder aus dem Vault.") });
      const inp = c.createEl("input", { type: "file", attr: { accept: ".json,application/json" } });
      inp.onchange = async () => {
        const f = inp.files && inp.files[0];
        if (!f) return;
        this.load(await f.text());
      };
      const vaultFiles = this.plugin.filesIn([normalizePath(this.plugin.settings.recipeFolder + "/Export")], "json").filter((f) => f.name.endsWith(".rmbundle.json"));
      if (vaultFiles.length) {
        c.createEl("h4", { text: tx("Export-Dateien im Vault") });
        vaultFiles.forEach((f) => {
          const b = c.createEl("button", { cls: "rm-btn", text: f.path });
          b.addClass("rm-block-btn");
          b.onclick = async () => this.load(await this.app.vault.read(f));
        });
      }
      return;
    }
    const b = this.bundle;
    c.createEl("p", { text: b.recipes.length + tx(" Rezepte, ") + (b.ingredients || []).length + tx(" Rohstoffe, ") + (b.images || []).length + tx(" Bilder in der Datei.") });
    const bar = c.createDiv("rm-export-bar");
    const all = bar.createEl("button", { text: tx("Alle") });
    const none = bar.createEl("button", { text: tx("Keine") });
    const list = c.createDiv("rm-export-list");
    this.sel = new Set(b.recipes.map((_, i) => i));
    const cbs = [];
    b.recipes.forEach((r, i) => {
      const row = list.createEl("label", { cls: "rm-export-row" });
      const cb = row.createEl("input", { type: "checkbox" });
      cb.checked = true;
      row.createSpan({ text: r.name + "  ·  " + r.category });
      const exists = this.app.vault.getAbstractFileByPath(normalizePath(this.plugin.categoryFolder(r.category) + "/" + safeName(r.name) + ".md"));
      if (exists) row.createSpan({ cls: "rm-chip", text: "existiert" });
      cb.onchange = () => (cb.checked ? this.sel.add(i) : this.sel.delete(i));
      cbs.push(cb);
    });
    all.onclick = () => cbs.forEach((cb, i) => { cb.checked = true; this.sel.add(i); });
    none.onclick = () => cbs.forEach((cb) => { cb.checked = false; this.sel.clear(); });
    const o = { ingredients: (b.ingredients || []).length > 0, images: (b.images || []).length > 0, mode: "copy" };
    new Setting(c).setName(tx("Rohstoffe importieren")).setDesc(tx("Vorhandene Rohstoffe bleiben unverändert (außer bei „überschreiben“).")).addToggle((t) => t.setValue(o.ingredients).onChange((v) => (o.ingredients = v)));
    new Setting(c).setName(tx("Bilder importieren")).addToggle((t) => t.setValue(o.images).onChange((v) => (o.images = v)));
    new Setting(c).setName(tx("Wenn ein Rezept schon existiert")).addDropdown((d) => d.addOption("copy", tx("Als Kopie anlegen")).addOption("skip", tx("Überspringen")).addOption("overwrite", tx("Überschreiben")).setValue("copy").onChange((v) => (o.mode = v)));
    const row = c.createDiv("rm-modal-actions");
    row.createEl("button", { text: tx("Andere Datei") }).onclick = () => { this.bundle = null; this.draw(); };
    row.createEl("button", { cls: "mod-cta", text: tx("Importieren") }).onclick = async () => {
      if (!this.sel.size) return new Notice(tx("Keine Rezepte ausgewählt."));
      try {
        const res = await this.plugin.importBundle(b, { ...o, recipes: Array.from(this.sel) });
        new Notice(tx("Import: ") + res.recipes + tx(" Rezepte, ") + res.ingredients + tx(" Rohstoffe, ") + res.images + tx(" Bilder neu; ") + res.overwritten + tx(" überschrieben, ") + res.skipped + tx(" übersprungen"));
        this.close();
      } catch (e) { new Notice(tx("Import fehlgeschlagen: ") + e.message); }
    };
  }
  load(text) {
    try {
      const j = JSON.parse(text);
      if (j.format !== "recipe-manager-bundle" || !Array.isArray(j.recipes)) throw new Error(tx("Keine Recipe-Atelier-Exportdatei"));
      this.bundle = j;
      this.draw();
    } catch (e) { new Notice(tx("Datei nicht lesbar: ") + e.message); }
  }
}

class NewRecipeModal extends Modal {
  constructor(app, plugin) { super(app); this.plugin = plugin; }
  onOpen() {
    this.titleEl.setText(tx("Neues Rezept"));
    let title = "", cat = this.plugin.settings.categories[0] || tx("Backen");
    new Setting(this.contentEl).setName(tx("Titel")).addText((t) => { t.setPlaceholder(tx("z. B. Roggenbrot")); t.onChange((v) => (title = v)); setTimeout(() => t.inputEl.focus(), 50); });
    new Setting(this.contentEl).setName(tx("Kategorie")).addDropdown((d) => {
      this.plugin.settings.categories.forEach((c) => d.addOption(c, c));
      d.setValue(cat); d.onChange((v) => (cat = v));
    });
    const go = async () => {
      const f = await this.plugin.createRecipe(title || tx("Neues Rezept"), cat);
      this.close();
      this.plugin.openEditor(f);
    };
    new Setting(this.contentEl).addButton((b) => b.setButtonText(tx("Anlegen")).setCta().onClick(go));
  }
}

function recipeCount(n) { return n === 1 ? tx("1 Rezept") : n + tx(" Rezepte"); }
function usedIn(n) { return n === 1 ? tx("Verwendet in 1 Rezept") : tx("Verwendet in ") + n + tx(" Rezepten"); }
function usageAmount(plugin, u) {
  const parts = [];
  if (u.grams > 0) parts.push(plugin.weightText(u.grams));
  u.amounts.forEach((a) => parts.push(a));
  return parts.join(" + ");
}
function renderUsageList(el, plugin, uses, onNavigate) {
  const list = el.createDiv("rm-usage-list");
  uses.slice().sort((a, b) => a.title.localeCompare(b.title, LANG)).forEach((u) => {
    const row = list.createDiv("rm-usage-row");
    const a = row.createEl("a", { cls: "rm-usage-title", text: u.title, href: "#" });
    a.onclick = (ev) => { ev.preventDefault(); if (onNavigate) onNavigate(); plugin.openNote(u.file); };
    if (u.category) row.createSpan({ cls: "rm-chip", text: u.category });
    row.createSpan({ cls: "rm-muted rm-usage-part", text: Array.from(new Set(u.parts)).join(", ") });
    row.createSpan({ cls: "rm-num rm-usage-amount", text: usageAmount(plugin, u) });
    const ed = row.createEl("button", { cls: "rm-icon-btn", attr: { "aria-label": tx("Bearbeiten") } });
    setIcon(ed, "pencil");
    ed.onclick = () => { if (onNavigate) onNavigate(); plugin.openEditor(u.file); };
  });
}

class UsageModal extends Modal {
  constructor(app, plugin, name, uses) { super(app); this.plugin = plugin; this.name = name; this.uses = uses; }
  onOpen() {
    this.modalEl.addClass("rm-modal-wide");
    this.titleEl.setText(tx("Verwendung: ") + this.name);
    const c = this.contentEl;
    if (!this.uses.length) { c.createEl("p", { cls: "rm-muted", text: tx("Keine Rezepte verwenden diesen Rohstoff.") }); return; }
    const total = this.uses.reduce((s, u) => s + u.grams, 0);
    c.createEl("p", { text: usedIn(this.uses.length) + (total > 0 ? " · " + tx("Gesamt in allen Rezepten: ") + this.plugin.weightText(total) : "") });
    renderUsageList(c, this.plugin, this.uses, () => this.close());
  }
}

class IngredientModal extends Modal {
  constructor(app, plugin, existing) { super(app); this.plugin = plugin; this.ex = existing; }
  onOpen() {
    const e = this.ex;
    this.titleEl.setText(e ? tx("Rohstoff bearbeiten") : tx("Neuer Rohstoff"));
    const v = {
      name: e ? e.name : "", kategorie: e ? e.kategorie : "", lieferant: e ? e.lieferant : "", url: e ? e.url : "",
      verpackung: e ? e.verpackung : "", gewicht: e ? e.gewicht : 0, einheit: e ? e.einheit : "kg",
      preis: e ? e.preis : 0, artikel: e ? e.artikel : "", allergene: e ? e.allergene : "", notiz: e ? e.notiz : "",
    };
    const c = this.contentEl;
    const txt = (name, key, ph, desc) => new Setting(c).setName(name).setDesc(desc || "").addText((t) => { t.setPlaceholder(ph || "").setValue(String(v[key] || "")); t.onChange((x) => (v[key] = x)); });
    txt("Name", "name", tx("z. B. Weizenmehl W700"));
    txt(tx("Kategorie"), "kategorie", tx("Mehl, Milchprodukte, Gewürze …"));
    txt(tx("Lieferant"), "lieferant", tx("Name des Lieferanten"));
    txt(tx("Lieferanten-Homepage"), "url", "https://…");
    txt(tx("Verpackungseinheit"), "verpackung", tx("Sack, Karton, Eimer, Packung …"));
    new Setting(c).setName(tx("Verpackungsgewicht / -inhalt")).addText((t) => { t.setPlaceholder("25").setValue(v.gewicht ? String(v.gewicht).replace(".", ",") : ""); t.inputEl.addClass("rm-w90"); t.onChange((x) => (v.gewicht = parseNum(x))); })
      .addDropdown((d) => { packUnits().forEach((u) => d.addOption(u, u)); d.setValue(v.einheit); d.onChange((x) => (v.einheit = x)); });
    new Setting(c).setName(tx("Preis pro Verpackung")).setDesc(tx("in ") + this.plugin.settings.currency).addText((t) => { t.setPlaceholder("0,00").setValue(v.preis ? String(v.preis).replace(".", ",") : ""); t.inputEl.addClass("rm-w90"); t.onChange((x) => (v.preis = parseNum(x))); });
    txt(tx("Artikelnummer"), "artikel");
    txt(tx("Allergene"), "allergene", tx("z. B. Gluten, Milch, Ei"));
    txt(tx("Notiz"), "notiz");
    if (e) {
      const box = c.createDiv("rm-usage-box");
      box.createDiv({ cls: "rm-label", text: tx("Rezepte mit diesem Rohstoff") });
      const holder = box.createDiv({ cls: "rm-muted", text: "…" });
      this.plugin.usageIndex().then((idx) => {
        const entry = idx.get(String(e.name).trim().toLowerCase());
        const uses = entry ? Array.from(entry.values()) : [];
        holder.empty();
        if (!uses.length) { holder.setText(tx("Nicht verwendet")); return; }
        holder.removeClass("rm-muted");
        holder.createDiv({ cls: "rm-strong", text: usedIn(uses.length) });
        renderUsageList(holder, this.plugin, uses, () => this.close());
      });
    }
    new Setting(c).addButton((b) => b.setButtonText(tx("Speichern")).setCta().onClick(async () => {
      try { await this.plugin.saveIngredient(this.ex, v); this.close(); } catch (err) { new Notice(err.message); }
    }));
  }
}

/* ------------------------------------------------------------------ */
/* Editor                                                              */
/* ------------------------------------------------------------------ */
class RecipeEditorView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.file = null;
    this.data = null;
    this.saveTimer = null;
    this.updaters = [];
    this.listId = "rm-ings-" + uid();
  }
  getViewType() { return VIEW_EDIT; }
  getDisplayText() { return this.data ? (this.data.title || tx("Rezept")) : tx("Rezept bearbeiten"); }
  getIcon() { return "chef-hat"; }
  getState() { return { file: this.file ? this.file.path : null }; }
  async setState(state, result) {
    if (state && state.file) {
      const f = this.app.vault.getAbstractFileByPath(state.file);
      if (f instanceof TFile) await this.load(f);
    }
    await super.setState(state, result);
  }
  async onClose() { await this.flush(); }

  async load(file) {
    this.file = file;
    this.data = await this.plugin.loadRecipe(file);
    this.ingList = this.plugin.ingredients();
    this.render();
  }

  /* --- Speichern --- */
  changed() { this.refresh(); this.scheduleSave(); }
  scheduleSave() {
    if (this.status) this.status.setText(tx("Ungespeichert …"));
    clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => this.flush(), 700);
  }
  async flush() {
    if (!this.saveTimer || !this.file) return;
    clearTimeout(this.saveTimer);
    this.saveTimer = null;
    try {
      await this.plugin.saveRecipe(this.file, this.data);
      if (this.status) this.status.setText(tx("Gespeichert ✓"));
      this.leaf.updateHeader && this.leaf.updateHeader();
    } catch (e) { new Notice(tx("Speichern fehlgeschlagen: ") + e.message); }
  }

  refresh() {
    this.calc = calcRecipe(this.data);
    this.cost = recipeCost(this.data, this.calc, this.costIdx);
    this.updaters.forEach((fn) => fn(this.calc));
  }
  setVal(input, v) { if (activeDocument.activeElement !== input) input.value = v; }

  /* --- UI --- */
  render() {
    const el = this.contentEl;
    const scroll = el.scrollTop;
    el.empty();
    el.addClass("rm-editor");
    this.updaters = [];
    this.costIdx = this.plugin.settings.showCost ? this.plugin.costIndex() : new Map();
    const d = this.data;

    const dl = el.createEl("datalist", { attr: { id: this.listId } });
    this.ingList.forEach((i) => dl.createEl("option", { value: i.name }));

    /* Kopf */
    const bar = el.createDiv("rm-ed-bar");
    const back = bar.createEl("button", { cls: "rm-btn" });
    setIcon(back.createSpan(), "book-open");
    back.createSpan({ text: tx("Ansicht") });
    back.onclick = async () => { await this.flush(); this.plugin.openNote(this.file); };
    const vbtn = bar.createEl("button", { cls: "rm-btn" });
    setIcon(vbtn.createSpan(), "git-branch");
    vbtn.createSpan({ text: tx("Variante erstellen") });
    vbtn.onclick = async () => { await this.flush(); new VariantModal(this.app, this.plugin, this.file).open(); };
    const ebtn = bar.createEl("button", { cls: "rm-btn" });
    setIcon(ebtn.createSpan(), "upload");
    ebtn.createSpan({ text: tx("Exportieren") });
    ebtn.onclick = async () => { await this.flush(); new ExportModal(this.app, this.plugin, [this.file]).open(); };
    this.status = bar.createSpan({ cls: "rm-muted rm-status", text: tx("Gespeichert ✓") });

    if (d.variantOf) el.createDiv({ cls: "rm-hint", text: tx("Variante von: ") + d.variantOf.title });
    const title = el.createEl("input", { cls: "rm-title-input", type: "text", placeholder: tx("Rezepttitel") });
    title.value = d.title;
    title.oninput = () => { d.title = title.value; this.scheduleSave(); };
    title.onchange = async () => {
      await this.flush();
      const nn = safeName(d.title);
      if (nn && nn !== this.file.basename) {
        const np = normalizePath(this.file.parent.path + "/" + nn + ".md");
        if (!this.app.vault.getAbstractFileByPath(np)) await this.app.fileManager.renameFile(this.file, np);
      }
    };

    const row = el.createDiv("rm-row");
    const catF = this.field(row, tx("Kategorie"));
    const cat = catF.createEl("select", { cls: "dropdown" });
    const cats = this.plugin.settings.categories.slice();
    if (d.category && !cats.includes(d.category)) cats.push(d.category);
    cats.forEach((c) => cat.createEl("option", { value: c, text: c }));
    cat.value = d.category;
    cat.onchange = async () => {
      d.category = cat.value;
      this.scheduleSave();
      await this.flush();
      await this.plugin.moveToCategoryFolder(this.file, d.category);
    };
    const tagF = this.field(row, tx("Tags (Komma getrennt)"));
    const tags = tagF.createEl("input", { cls: "rm-input", type: "text", placeholder: tx("brot, sauerteig …") });
    tags.value = (d.tags || []).join(", ");
    tags.oninput = () => { d.tags = tags.value.split(",").map((s) => s.trim().replace(/\s+/g, "-").replace(/^#/, "")).filter(Boolean); this.scheduleSave(); };

    /* Endfoto + Beschreibung */
    const top = el.createDiv("rm-top");
    const photoBox = top.createDiv("rm-photo-col");
    photoBox.createDiv({ cls: "rm-label", text: tx("Endergebnis (Foto)") });
    this.photoField(photoBox, () => d.photo, (p) => { d.photo = p; this.scheduleSave(); }, d.title);
    const descBox = top.createDiv("rm-desc-col");
    descBox.createDiv({ cls: "rm-label", text: tx("Beschreibung / Info") });
    const desc = descBox.createEl("textarea", { cls: "rm-textarea", attr: { rows: "5", placeholder: tx("Kurzbeschreibung, Herkunft, Hinweise …") } });
    desc.value = d.description || "";
    desc.oninput = () => { d.description = desc.value; this.scheduleSave(); };

    /* Teile */
    el.createEl("h2", { text: tx("Zutaten & Teile") });
    el.createDiv({ cls: "rm-hint", text: tx("Ein Rezept kann aus mehreren Teilen bestehen (z. B. Teig, Ziehfett, Füllung). Im Prozent-Modus wird die Menge aus dem Anteil berechnet; ändert man eine Menge, werden alle anderen proportional umgerechnet. Im Mengen-Modus gibst du Mengen ein und die Anteile werden berechnet.") });
    const gdl = el.createEl("datalist", { attr: { id: "rm-alt-" + this.listId } });
    Array.from(new Set(d.parts.map((x) => x.altGroup).filter(Boolean))).forEach((g) => gdl.createEl("option", { value: g }));
    const partsBox = el.createDiv("rm-parts");
    d.parts.forEach((p, i) => this.renderPart(partsBox, p, i));
    const addPart = el.createEl("button", { cls: "rm-btn" });
    setIcon(addPart.createSpan(), "plus");
    addPart.createSpan({ text: tx("Teil hinzufügen (z. B. Füllung)") });
    addPart.onclick = () => {
      const np = newPart(tx("Teil ") + (d.parts.length + 1), "amount");
      np.baseRef = "total";
      np.ingredients.push(newIng());
      d.parts.push(np);
      this.scheduleSave(); this.render();
    };

    /* Ausbeute */
    el.createEl("h2", { text: tx("Ausbeute & Stückberechnung") });
    this.renderYield(el);

    /* Parameter */
    el.createEl("h2", { text: tx("Backen / Herstellung – Parameter") });
    this.renderParams(el);

    /* Schritte */
    el.createEl("h2", { text: tx("Herstellungsschritte") });
    this.renderSteps(el);

    /* Notizen */
    el.createEl("h2", { text: tx("Zusatzinfos / Notizen") });
    const notes = el.createEl("textarea", { cls: "rm-textarea", attr: { rows: "4", placeholder: tx("Tipps, Varianten, Lagerung, Allergene …") } });
    notes.value = d.notes || "";
    notes.oninput = () => { d.notes = notes.value; this.scheduleSave(); };

    /* Kosten */
    if (this.plugin.settings.showCost) {
      const cb = el.createDiv("rm-costbox");
      const l = cb.createDiv();
      this.costTxt = l.createDiv({ cls: "rm-cost-main" });
      this.costSub = l.createDiv({ cls: "rm-muted" });
      this.updaters.push(() => {
        if (this.cost == null) { this.costTxt.setText(tx("Keine Kosten berechenbar")); this.costSub.setText(tx("Lege Rohstoffe mit Preis an – Zutaten mit gleichem Namen werden automatisch zugeordnet.")); return; }
        this.costTxt.setText(tx("Materialkosten: ") + this.plugin.money(this.cost));
        const c = this.calc, y = d.yield, parts = [];
        if (c.pieces) parts.push(this.plugin.money(this.cost / c.pieces) + tx(" pro Stück"));
        if (y.mode === "portions" && y.portions) parts.push(this.plugin.money(this.cost / y.portions) + tx(" pro Portion"));
        if (c.total > 0) parts.push(this.plugin.money((this.cost / c.total) * 1000) + tx(" pro kg Gesamtgewicht"));
        this.costSub.setText(parts.join(" · "));
      });
    }

    this.refresh();
    el.scrollTop = scroll;
  }

  field(parent, label) {
    const f = parent.createDiv("rm-field");
    f.createDiv({ cls: "rm-label", text: label });
    return f;
  }

  photoField(parent, get, set, title) {
    const box = parent.createDiv("rm-photo");
    const draw = () => {
      box.empty();
      const src = this.plugin.imgSrc(get());
      if (src) {
        box.createEl("img").src = src;
        const rm = box.createEl("button", { cls: "rm-photo-rm rm-icon-btn", attr: { "aria-label": tx("Entfernen") } });
        setIcon(rm, "x");
        rm.onclick = (e) => { e.stopPropagation(); set(""); draw(); };
      } else {
        setIcon(box.createDiv("rm-photo-icon"), "image-plus");
        box.createDiv({ cls: "rm-muted", text: tx("Foto wählen oder hierher ziehen") });
      }
    };
    const apply = async (file) => { const p = file && (await this.plugin.storeImage(file, title)); if (p) { set(p); draw(); } };
    box.onclick = async () => { const p = await this.plugin.pickImage(title); if (p) { set(p); draw(); } };
    box.ondragover = (e) => { e.preventDefault(); box.addClass("is-over"); };
    box.ondragleave = () => box.removeClass("is-over");
    box.ondrop = (e) => {
      e.preventDefault(); box.removeClass("is-over");
      const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (f && f.type.startsWith("image/")) apply(f);
    };
    draw();
  }

  renderPart(parent, p, idx) {
    const d = this.data;
    const pct = p.mode === "percent";
    const card = parent.createDiv("rm-part");

    /* Kopfzeile */
    const head = card.createDiv("rm-part-head");
    const name = head.createEl("input", { cls: "rm-part-name", type: "text", placeholder: tx("Name des Teils") });
    name.value = p.name;
    name.oninput = () => { p.name = name.value; this.scheduleSave(); };
    const mode = head.createEl("select", { cls: "dropdown" });
    mode.createEl("option", { value: "percent", text: tx("Prozent-Modus (Anteil → Menge)") });
    mode.createEl("option", { value: "amount", text: tx("Mengen-Modus (Menge → Anteil)") });
    mode.value = p.mode;
    mode.onchange = () => { convertPartMode(d, p, mode.value, this.plugin.settings.weightUnit); this.scheduleSave(); this.render(); };
    const acts = head.createDiv("rm-part-actions");
    const mk = (icon, label, fn, dis) => {
      const b = acts.createEl("button", { cls: "rm-icon-btn", attr: { "aria-label": label } });
      setIcon(b, icon);
      if (dis) b.disabled = true;
      b.onclick = fn;
    };
    mk("arrow-up", tx("Nach oben"), () => { d.parts.splice(idx, 1); d.parts.splice(idx - 1, 0, p); this.scheduleSave(); this.render(); }, idx === 0);
    mk("arrow-down", tx("Nach unten"), () => { d.parts.splice(idx, 1); d.parts.splice(idx + 1, 0, p); this.scheduleSave(); this.render(); }, idx === d.parts.length - 1);
    mk("trash-2", tx("Teil löschen"), () => new ConfirmModal(this.app, tx("Teil löschen?"), tx("„") + p.name + tx("“ mit allen Zutaten entfernen?"), () => {
      d.parts.splice(idx, 1);
      d.parts.forEach((x) => { if (x.basePartId === p.id) { x.baseRef = "free"; x.basePartId = ""; } });
      this.scheduleSave(); this.render();
    }).open(), d.parts.length === 1);

    /* Bezug */
    const cfg = card.createDiv("rm-part-cfg");
    const bf = this.field(cfg, tx("Bezug (= 100 %)"));
    const bsel = bf.createEl("select", { cls: "dropdown" });
    const refs = pct
      ? [["ingredient", tx("Eine Zutat (z. B. Mehl)")], ["free", tx("Eigene Bezugsmenge")], ["part", tx("Summe eines anderen Teils")]]
      : [["total", tx("Gesamtgewicht dieses Teils")], ["ingredient", tx("Eine Zutat")], ["free", tx("Eigene Bezugsmenge")], ["part", tx("Summe eines anderen Teils")]];
    refs.forEach(([v, t]) => bsel.createEl("option", { value: v, text: t }));
    if (!refs.some(([v]) => v === p.baseRef)) p.baseRef = refs[0][0];
    bsel.value = p.baseRef;
    bsel.onchange = () => {
      p.baseRef = bsel.value;
      if (p.baseRef === "ingredient" && !p.ingredients.some((i) => i.base) && p.ingredients[0]) { p.ingredients[0].base = true; if (pct) p.ingredients[0].percent = 100; }
      if (p.baseRef === "part" && !p.basePartId) { const o = d.parts.find((x) => x.id !== p.id); p.basePartId = o ? o.id : ""; }
      this.scheduleSave(); this.render();
    };
    if (p.baseRef === "part") {
      const pf = this.field(cfg, tx("Teil"));
      const ps = pf.createEl("select", { cls: "dropdown" });
      d.parts.filter((x) => x.id !== p.id).forEach((x) => ps.createEl("option", { value: x.id, text: x.name }));
      ps.value = p.basePartId;
      ps.onchange = () => { p.basePartId = ps.value; this.changed(); };
    }
    if (p.baseRef === "free") {
      const ff = this.field(cfg, tx("Bezugsmenge ") + (pct ? "(" + (this.plugin.settings.weightUnit) + ")" : "(g)"));
      const fi = ff.createEl("input", { cls: "rm-input rm-input-sm", type: "text", attr: { inputmode: "decimal" } });
      const fac = pct ? this.plugin.weightFactor() : 1;
      fi.oninput = () => { p.baseAmount = parseNum(fi.value) * fac; this.changed(); };
      fi.onchange = () => { fi.value = fmt(p.baseAmount / fac, 3); };
      this.updaters.push(() => this.setVal(fi, fmt(p.baseAmount / fac, 3)));
    }
    const tf = this.field(cfg, tx("Summenzeile (Bezeichnung)"));
    const tl = tf.createEl("input", { cls: "rm-input", type: "text", placeholder: tx("z. B. Mischteig, Fülle") });
    tl.value = p.totalLabel || "";
    tl.oninput = () => { p.totalLabel = tl.value; this.scheduleSave(); };
    const af = this.field(cfg, tx("Alternative zu (Gruppe)"));
    const ai = af.createEl("input", { cls: "rm-input", type: "text", placeholder: tx("z. B. Füllung"), attr: { list: "rm-alt-" + this.listId } });
    ai.value = p.altGroup || "";
    ai.oninput = () => { p.altGroup = ai.value.trim(); this.scheduleSave(); };
    ai.onchange = () => this.render();
    if (!p.inTotal && d.yield.mode === "pieces") {
      const pf2 = this.field(cfg, tx("Menge pro Stück (g)"));
      const pp = pf2.createEl("input", { cls: "rm-input rm-input-sm", type: "text", attr: { inputmode: "decimal", placeholder: tx("z. B. 20") } });
      pp.value = p.perPiece ? fmt(p.perPiece, 2) : "";
      pp.oninput = () => { p.perPiece = parseNum(pp.value); this.changed(); };
      pp.onchange = () => this.render();
    }
    const of = cfg.createDiv("rm-checks");
    const c1 = of.createEl("label", { cls: "rm-check" });
    const cb1 = c1.createEl("input", { type: "checkbox" });
    cb1.checked = p.inTotal;
    c1.createSpan({ text: tx("In Gesamtgewicht einrechnen") });
    cb1.onchange = () => { p.inTotal = cb1.checked; this.scheduleSave(); this.render(); };
    if (!pct) {
      const c2 = of.createEl("label", { cls: "rm-check" });
      const cb2 = c2.createEl("input", { type: "checkbox" });
      cb2.checked = !!p.showPercent;
      c2.createSpan({ text: tx("Anteil in Ansicht zeigen") });
      cb2.onchange = () => { p.showPercent = cb2.checked; this.scheduleSave(); };
    }

    /* Tabelle */
    const wrap = card.createDiv("rm-table-wrap");
    const t = wrap.createEl("table", { cls: "rm-table rm-edit-table" });
    const hr = t.createEl("thead").createEl("tr");
    const heads = [];
    if (p.baseRef === "ingredient") heads.push(tx("Basis"));
    heads.push(tx("Zutat"), tx("Notiz"), tx("Menge") + (pct ? " (" + this.plugin.settings.weightUnit + ")" : ""));
    if (!pct) heads.push(tx("Einheit"));
    heads.push(tx("Anteil %"));
    if (this.plugin.settings.showCost) heads.push(tx("Kosten"));
    heads.push("", "");
    heads.forEach((h) => hr.createEl("th", { text: h }));
    const tb = t.createEl("tbody");

    p.ingredients.forEach((ing, i) => {
      const tr = tb.createEl("tr");
      if (p.baseRef === "ingredient") {
        const td = tr.createEl("td", { cls: "rm-center" });
        const rd = td.createEl("input", { type: "radio", attr: { name: "base-" + p.id } });
        rd.checked = !!ing.base;
        rd.onchange = () => {
          p.ingredients.forEach((x) => (x.base = false));
          ing.base = true;
          if (pct) ing.percent = 100;
          this.changed();
        };
      }
      const nameTd = tr.createEl("td");
      if (ing.refPart) {
        const ps = nameTd.createEl("select", { cls: "dropdown rm-input" });
        d.parts.filter((x) => x.id !== p.id).forEach((x) => ps.createEl("option", { value: x.id, text: "⛓ " + x.name }));
        ps.value = ing.refPart;
        ps.onchange = () => { ing.refPart = ps.value; const o = d.parts.find((x) => x.id === ps.value); if (o) ing.name = o.name; this.changed(); };
      } else {
        const nameIn = nameTd.createEl("input", { cls: "rm-input", type: "text", placeholder: tx("Zutat"), attr: { list: this.listId } });
        nameIn.value = ing.name;
        nameIn.oninput = () => { ing.name = nameIn.value; this.changed(); };
      }
      const locked = !!ing.refPart || (p.perPiece > 0 && !p.inTotal && d.yield.mode === "pieces" && d.yield.pieceWeight > 0);
      const noteIn = tr.createEl("td").createEl("input", { cls: "rm-input", type: "text", placeholder: tx("z. B. 5 Stück") });
      noteIn.value = ing.note || "";
      noteIn.oninput = () => { ing.note = noteIn.value; this.scheduleSave(); };

      const fac = pct ? this.plugin.weightFactor() : 1;
      const amtIn = tr.createEl("td").createEl("input", { cls: "rm-input rm-num-input", type: "text", attr: { inputmode: "decimal" } });
      amtIn.oninput = () => {
        const v = parseNum(amtIn.value);
        setIngAmount(d, p, ing, pct ? v * fac : v);
        this.changed();
      };
      amtIn.readOnly = locked;
      if (locked) amtIn.addClass("rm-locked");
      amtIn.onchange = () => { amtIn.value = ""; this.refresh(); };

      let unitSel = null;
      if (!pct) {
        unitSel = tr.createEl("td").createEl("select", { cls: "dropdown rm-unit" });
        const us = unitChoices();
        if (ing.unit && !us.includes(ing.unit)) us.push(ing.unit);
        us.forEach((u) => unitSel.createEl("option", { value: u, text: u }));
        unitSel.value = ing.unit || "g";
        unitSel.onchange = () => { ing.unit = unitSel.value; this.changed(); };
      }

      const pctIn = tr.createEl("td").createEl("input", { cls: "rm-input rm-num-input", type: "text", attr: { inputmode: "decimal" } });
      pctIn.oninput = () => { setIngPercent(d, p, ing, parseNum(pctIn.value)); this.changed(); };
      pctIn.readOnly = !!ing.refPart;
      pctIn.onchange = () => { pctIn.value = ""; this.refresh(); };

      let costTd = null;
      if (this.plugin.settings.showCost) costTd = tr.createEl("td", { cls: "rm-num rm-muted" });

      const lk = tr.createEl("td").createEl("button", { cls: "rm-icon-btn", attr: { "aria-label": ing.refPart ? tx("Verknüpfung lösen") : tx("Mit Summe eines anderen Teils verknüpfen (z. B. Poolish)") } });
      setIcon(lk, ing.refPart ? "unlink" : "link");
      lk.onclick = () => {
        if (ing.refPart) ing.refPart = "";
        else {
          const o = d.parts.find((x) => x.id !== p.id);
          if (!o) return new Notice(tx("Es gibt keinen anderen Teil zum Verknüpfen."));
          ing.refPart = o.id; ing.name = o.name;
        }
        this.scheduleSave(); this.render();
      };
      const del = tr.createEl("td").createEl("button", { cls: "rm-icon-btn", attr: { "aria-label": tx("Zutat entfernen") } });
      setIcon(del, "x");
      del.onclick = () => { p.ingredients.splice(i, 1); this.scheduleSave(); this.render(); };

      this.updaters.push((c) => {
        const row = c.parts[p.id] && c.parts[p.id].rows[i];
        if (!row) return;
        this.setVal(amtIn, pct ? this.plugin.weightInput(row.grams) : fmt(row.amount, 3));
        this.setVal(pctIn, row.percent == null ? "" : fmt(row.percent, 2));
        if (costTd) costTd.setText(row.cost != null ? this.plugin.money(row.cost) : "");
      });
    });

    /* Fuß */
    const addRow = card.createDiv("rm-part-foot");
    const addBtn = addRow.createEl("button", { cls: "rm-btn rm-btn-sm" });
    setIcon(addBtn.createSpan(), "plus");
    addBtn.createSpan({ text: tx("Zutat") });
    addBtn.onclick = () => { p.ingredients.push(newIng({ unit: pct ? "g" : "g" })); this.scheduleSave(); this.render(); };
    const tot = addRow.createDiv("rm-part-total");
    const totLabel = tot.createSpan({ cls: "rm-muted" });
    const totVal = tot.createSpan({ cls: "rm-strong" });
    this.updaters.push((c) => {
      const pc = c.parts[p.id];
      totLabel.setText((p.totalLabel || tx("Summe")) + ":");
      totVal.setText(this.plugin.weightText(pc.total));
    });
  }

  renderYield(el) {
    const d = this.data, y = d.yield;
    const box = el.createDiv("rm-yield");

    const r1 = box.createDiv("rm-row");
    const lf = this.field(r1, tx("Bezeichnung des Gesamtgewichts"));
    const lbl = lf.createEl("input", { cls: "rm-input", type: "text", placeholder: tx("z. B. Blätterteig, Rezeptgewicht") });
    lbl.value = d.totalLabel || "";
    lbl.oninput = () => { d.totalLabel = lbl.value; this.scheduleSave(); };

    const tf = this.field(r1, tx("Gesamtgewicht (") + this.plugin.settings.weightUnit + tx(") – änderbar, skaliert alle Mengen"));
    const tin = tf.createEl("input", { cls: "rm-input", type: "text", attr: { inputmode: "decimal" } });
    tin.oninput = () => { setTotalWeight(d, parseNum(tin.value) * this.plugin.weightFactor()); this.changed(); };
    tin.onchange = () => { tin.value = ""; this.refresh(); };
    this.updaters.push((c) => this.setVal(tin, this.plugin.weightInput(c.total)));

    const mf = this.field(r1, tx("Ausgabe"));
    const ms = mf.createEl("select", { cls: "dropdown" });
    [["pieces", tx("Stück (z. B. Brot, Gebäck)")], ["portions", tx("Portionen (z. B. Kochen)")], ["trays", tx("Blech (z. B. 60 x 40 cm)")], ["none", tx("keine Angabe")]].forEach(([v, t]) => ms.createEl("option", { value: v, text: t }));
    ms.value = y.mode;
    ms.onchange = () => { y.mode = ms.value; this.scheduleSave(); this.render(); };

    if (y.mode === "pieces") {
      const r2 = box.createDiv("rm-row");
      const pw = this.field(r2, tx("Stückgewicht / Pressgewicht (g)"));
      const pwi = pw.createEl("input", { cls: "rm-input", type: "text", attr: { inputmode: "decimal" } });
      pwi.value = y.pieceWeight ? fmt(y.pieceWeight, 1) : "";
      pwi.oninput = () => { y.pieceWeight = parseNum(pwi.value); this.changed(); };
      const pc = this.field(r2, tx("Stückzahl – änderbar, skaliert alle Mengen"));
      const pci = pc.createEl("input", { cls: "rm-input", type: "text", attr: { inputmode: "decimal" } });
      pci.oninput = () => { setPieces(d, parseNum(pci.value)); this.changed(); };
      pci.onchange = () => { pci.value = ""; this.refresh(); };
      this.updaters.push((c) => this.setVal(pci, c.pieces != null ? fmt(c.pieces, 2) : ""));
      const bl = this.field(r2, tx("Backverlust (%) – optional"));
      const bli = bl.createEl("input", { cls: "rm-input", type: "text", attr: { inputmode: "decimal", placeholder: "10–25 %" } });
      bli.value = y.bakeLoss ? fmt(y.bakeLoss, 1) : "";
      bli.oninput = () => { y.bakeLoss = parseNum(bli.value); this.changed(); };
      const info = box.createDiv({ cls: "rm-hint" });
      this.updaters.push((c) => {
        const parts = [];
        if (c.pieces != null) parts.push("≈ " + fmt(c.pieces, 1) + tx(" Stück"));
        if (c.bakedPiece) parts.push(tx("Gebäckgewicht je Stück ≈ ") + fmt(c.bakedPiece, 1) + " g");
        info.setText(parts.join(" · "));
      });
    } else if (y.mode === "portions") {
      const r2 = box.createDiv("rm-row");
      const pf = this.field(r2, tx("Portionen"));
      const pi = pf.createEl("input", { cls: "rm-input", type: "text", attr: { inputmode: "decimal" } });
      pi.value = y.portions ? fmt(y.portions, 2) : "";
      pi.oninput = () => { y.portions = parseNum(pi.value); this.changed(); };
      pi.onchange = () => { pi.value = fmt(y.portions, 2); };
    }

    if (y.mode === "trays") {
      const r2 = box.createDiv("rm-row");
      const tf2 = this.field(r2, tx("Blechgröße"));
      const ti = tf2.createEl("input", { cls: "rm-input", type: "text", placeholder: "60 x 40 cm" });
      ti.value = y.traySize || "";
      ti.oninput = () => { y.traySize = ti.value; this.scheduleSave(); };
      const nf = this.field(r2, tx("Anzahl Bleche – änderbar, rechnet alle Mengen neu"));
      const ni = nf.createEl("input", { cls: "rm-input", type: "text", attr: { inputmode: "decimal" } });
      ni.value = y.portions ? fmt(y.portions, 2) : "1";
      ni.oninput = () => {
        const v = parseNum(ni.value);
        if (!(v > 0)) return;
        if (y.portions > 0) scaleRecipe(d, v / y.portions); else y.portions = v;
        y.portions = v;
        this.changed();
      };
      ni.onchange = () => { ni.value = fmt(y.portions, 2); };
    }

    const r3 = box.createDiv("rm-row rm-scale-row");
    const sf = this.field(r3, tx("Alle Mengen mit Faktor multiplizieren"));
    const sin = sf.createEl("input", { cls: "rm-input rm-input-sm", type: "text", value: "2" });
    const sb = r3.createEl("button", { cls: "rm-btn" });
    sb.setText(tx("Anwenden"));
    sb.onclick = () => {
      const f = parseNum(sin.value);
      if (!(f > 0)) return new Notice(tx("Faktor > 0 eingeben"));
      scaleRecipe(d, f);
      this.scheduleSave(); this.render();
    };
    if (y.mode === "portions" || y.mode === "trays") {
      r3.createDiv({ cls: "rm-hint", text: tx("Skaliert auch die Portionenzahl (z. B. 2 Portionen → ×3 = 6 Portionen).") });
    }
  }

  renderParams(el) {
    const d = this.data;
    const dl = el.createEl("datalist", { attr: { id: "rm-params-" + this.listId } });
    paramSuggestions().forEach((s) => dl.createEl("option", { value: s }));
    const box = el.createDiv("rm-params-edit");
    d.params.forEach((x, i) => {
      const r = box.createDiv("rm-param-row");
      const l = r.createEl("input", { cls: "rm-input", type: "text", placeholder: tx("Bezeichnung"), attr: { list: "rm-params-" + this.listId } });
      l.value = x.label || ""; l.oninput = () => { x.label = l.value; this.scheduleSave(); };
      const v = r.createEl("input", { cls: "rm-input", type: "text", placeholder: tx("Wert (z. B. 230 °C, 35 Min.)") });
      v.value = x.value || ""; v.oninput = () => { x.value = v.value; this.scheduleSave(); };
      const b = r.createEl("button", { cls: "rm-icon-btn", attr: { "aria-label": tx("Entfernen") } });
      setIcon(b, "x");
      b.onclick = () => { d.params.splice(i, 1); this.scheduleSave(); this.render(); };
    });
    const add = el.createEl("button", { cls: "rm-btn rm-btn-sm" });
    setIcon(add.createSpan(), "plus");
    add.createSpan({ text: tx("Parameter") });
    add.onclick = () => { d.params.push({ label: "", value: "" }); this.scheduleSave(); this.render(); };
    if (!d.params.length && catKind(d.category) === "bake") {
      const q = el.createEl("button", { cls: "rm-btn rm-btn-sm" });
      q.setText(tx("Standard-Backparameter einfügen"));
      q.onclick = () => {
        [tx("Teigtemperatur"), tx("Teigruhe"), tx("Backtemperatur"), tx("Backzeit")].forEach((s) => d.params.push({ label: s, value: "" }));
        this.scheduleSave(); this.render();
      };
    }
  }

  renderSteps(el) {
    const d = this.data;
    const box = el.createDiv("rm-steps-edit");
    d.steps.forEach((s, i) => {
      const row = box.createDiv("rm-step-edit");
      row.createDiv({ cls: "rm-step-n", text: String(i + 1) });
      const body = row.createDiv("rm-step-body");
      const ta = body.createEl("textarea", { cls: "rm-textarea", attr: { rows: "3", placeholder: tx("Arbeitsschritt beschreiben …") } });
      ta.value = s.text || "";
      ta.oninput = () => { s.text = ta.value; this.scheduleSave(); };
      this.photoField(body, () => s.photo, (p) => { s.photo = p; this.scheduleSave(); }, d.title + "-schritt-" + (i + 1));
      const acts = row.createDiv("rm-part-actions");
      const mk = (icon, label, fn, dis) => {
        const b = acts.createEl("button", { cls: "rm-icon-btn", attr: { "aria-label": label } });
        setIcon(b, icon); if (dis) b.disabled = true; b.onclick = fn;
      };
      mk("arrow-up", tx("Nach oben"), () => { d.steps.splice(i, 1); d.steps.splice(i - 1, 0, s); this.scheduleSave(); this.render(); }, i === 0);
      mk("arrow-down", tx("Nach unten"), () => { d.steps.splice(i, 1); d.steps.splice(i + 1, 0, s); this.scheduleSave(); this.render(); }, i === d.steps.length - 1);
      mk("trash-2", tx("Schritt löschen"), () => { d.steps.splice(i, 1); this.scheduleSave(); this.render(); });
    });
    const add = el.createEl("button", { cls: "rm-btn" });
    setIcon(add.createSpan(), "plus");
    add.createSpan({ text: tx("Schritt hinzufügen") });
    add.onclick = () => { d.steps.push({ text: "", photo: "" }); this.scheduleSave(); this.render(); };
  }
}

/* ------------------------------------------------------------------ */
/* Einstellungen                                                       */
/* ------------------------------------------------------------------ */
class RMSettingTab extends PluginSettingTab {
  constructor(app, plugin) { super(app, plugin); this.plugin = plugin; }
  display() {
    const c = this.containerEl;
    c.empty();
    const s = this.plugin.settings;
    new Setting(c).setName(tx("Sprache")).setDesc(tx("Sprache der Oberfläche. „Automatisch“ folgt der Sprache von Obsidian."))
      .addDropdown((d) => d.addOption("auto", tx("Automatisch (wie Obsidian)")).addOption("de", "Deutsch").addOption("en", "English").setValue(s.language || "auto")
        .onChange(async (v) => { s.language = v; setLang(v); await this.plugin.saveSettings(); this.display(); }));
    const text = (name, desc, key) => new Setting(c).setName(name).setDesc(desc).addText((t) => t.setValue(s[key]).onChange(async (v) => { s[key] = v.trim(); await this.plugin.saveSettings(); }));
    text(tx("Rezeptordner"), tx("Hier werden neue Rezepte angelegt."), "recipeFolder");
    text(tx("Rohstoffordner"), tx("Rohstoffe werden als Notizen mit Eigenschaften gespeichert."), "ingredientFolder");
    text(tx("Bilderordner"), tx("Fotos von Endergebnis und Arbeitsschritten."), "imageFolder");
    new Setting(c).setName(tx("Mengenanzeige (Prozent-Modus)")).setDesc(tx("Einheit für Mengen in Bäckerrezepten."))
      .addDropdown((d) => d.addOption("kg", tx("Kilogramm (0,470 kg)")).addOption("g", tx("Gramm (470 g)")).setValue(s.weightUnit).onChange(async (v) => { s.weightUnit = v; await this.plugin.saveSettings(); }));
    text(tx("Währungssymbol"), "", "currency");
    new Setting(c).setName(tx("Kosten anzeigen")).setDesc(tx("Materialkosten aus den Rohstoffpreisen berechnen."))
      .addToggle((t) => t.setValue(s.showCost).onChange(async (v) => { s.showCost = v; await this.plugin.saveSettings(); }));
    new Setting(c).setName(tx("Rezepte nach Kategorie sortieren")).setDesc(tx("Verschiebt alle vorhandenen Rezepte in Unterordner ihrer Kategorie."))
      .addButton((b) => b.setButtonText(tx("Jetzt sortieren")).onClick(async () => { const n = await this.plugin.moveAllToCategoryFolders(); new Notice(n + tx(" Rezept(e) verschoben")); }));
    new Setting(c).setName(tx("Kategorien")).setDesc(tx("Komma getrennt. Jede Kategorie bekommt einen Unterordner im Rezeptordner."))
      .addText((t) => t.setValue(s.categories.join(", ")).onChange(async (v) => {
        const l = v.split(",").map((x) => x.trim()).filter(Boolean);
        if (l.length) { s.categories = l; await this.plugin.saveSettings(); }
      }));
  }
}

module.exports = RecipeManagerPlugin;
