# Loke-Cards CodeMirror Editor Design

## Formål

Loke-Cards skal bruge en let, PWA-venlig editor til tekst- og kodebaseret indhold. Formålet er at kunne skrive og redigere **kort (cards)**, der kan indeholde:

* **Ren tekst** (scenebeskrivelser, dialoger, metadata)
* **Kodeblokke** (C, C++, Markdown, evt. Loke-script)

Dette sker i et samlet editorfelt, hvor CodeMirror bruges til at give **syntaksfremhævelse, inputstruktur og farvekodet output**.

---

## Arkitektur

### 1. Editor Component

Et `LokeCardEditor.svelte`-komponent bygges på **CodeMirror 6** med Svelte wrapperen `@replit/codemirror-svelte`.

**Hovedfunktioner:**

* Lazy-loading af editor (hurtig PWA load)
* Dynamic mode (tekst eller kode)
* Tailwind-baseret tema
* Markdown + C/C++ syntax
* Auto-save event via Svelte store

---

### 2. Datamodel for Cards

Hvert card har en struktur som:

```json
{
  "id": "card_001",
  "type": "scene",        // eller "code"
  "lang": "markdown",      // eller "cpp", "c"
  "title": "Scene 1 - The Forge",
  "content": "# Welcome to the forge\n\nYou see sparks...",
  "tags": ["intro", "dialog"]
}
```

Denne model bruges direkte i Svelte-komponenten som `bind:value`.

---

### 3. CodeMirror Setup

**Imports:**

```ts
import CodeMirror from "@replit/codemirror-svelte";
import { markdown } from "@codemirror/lang-markdown";
import { cpp } from "@codemirror/lang-cpp";
import { EditorView } from "@codemirror/view";
```

**Extensions:**

```ts
const extensions = {
  markdown: [markdown()],
  cpp: [cpp()],
  c: [cpp()],
};

const lokeTheme = EditorView.theme({
  "&": { backgroundColor: "transparent", color: "theme(colors.gray.200)" },
  ".cm-content": { fontFamily: "monospace", fontSize: "0.875rem" },
  "&.cm-focused": { outline: "none" }
});
```

---

### 4. UI Struktur i Svelte

```svelte
<script lang="ts">
  import CodeMirror from "@replit/codemirror-svelte";
  import { markdown, cpp } from "@codemirror/lang-markdown";

  export let card;

  const extensions = card.lang === "cpp" ? [cpp()] : [markdown()];
</script>

<div class="rounded-xl border border-gray-700 bg-gray-900 p-2">
  <h2 class="text-gray-300 font-bold mb-2">{card.title}</h2>
  <CodeMirror bind:value={card.content} {extensions} class="min-h-[300px]" />
</div>
```

---

### 5. Funktionelle Mål

* **Teksttilstand:** Markdown syntaks til kapitel/scene tekst, let formattering.
* **Kode-tilstand:** C/C++ syntax highlight til script/logic.
* **Auto skift:** editor skifter syntax baseret på card.lang.
* **Tailwind integration:** alt tema og spacing kommer fra Tailwind klasser.
* **Event hooks:**

  * `on:change` -> gem til IndexedDB / SQLite
  * `on:blur` -> trig test eller Loke-engine preview

---

### 6. Fremtidige Udvidelser

* Sprogsupport: JSON, Lua, LokeScript
* Split-view: tekst til venstre, kode til højre
* AI assistent: automatisk syntaksforklaring og highlight af funktioner
* Live preview af Markdown som kortlayout

---

## Konklusion

CodeMirror giver en **robust, let og fleksibel editor** der kan integreres direkte i Svelte + Tailwind. Den tillader at Loke-cards arbejder med **tekst og kode i samme system**, med farvekodning og enkel udvidelse til flere sprog og tilstande.
