# Portbeskrivelse: Vue Flow → LiteGraph.js

**Mål:** Erstatte Vue Flow med LiteGraph.js i Loke‑graph, uden at ændre Loke‑engine’s begreber (chapters, scenes, choices, conditions). Bevar PWA‑krav, AI‑venlig runtime og stabil UI‑adfærd i Svelte + TypeScript + Tailwind ("Zoe" skabelonen).

---

## 1) Terminologi & begrebs‑kort
**Vue Flow → LiteGraph.js**
- *Node component* → **Node class** (prototype‑baseret registrering af noder)
- *Edges* → **Links** (fra output‑slot til input‑slot)
- *Handles* (source/target) → **Slots/Widgets** (typed ports, widgets til UI)
- *Viewport/zoom/pan* → **Canvas intern navigation** (LGraphCanvas)
- *Events (onConnect, onEdgeUpdate)* → **Graph/Canvas events** (linkAdded, nodeSelected, etc.)
- *Reactiveness (framework)* → **Intern scene‑graph** (imperativt API styret af Svelte store/action)
- *Mini‑map* → **Valgfri overlay** (tegnes selv eller plugin)

**Loke‑domain → LiteGraph mapping**
- Chapter → **Subgraph eller tag‑gruppe** (scope)
- Scene → **Node** (scene metadata + IO‑slots)
- Choice/Transition → **Link** (evt. konditionerede links)
- Variables/Flags → **Global graph properties** (graph.extra) + **State node**
- Entry/Exit → **Special nodes** (Start/End)

---

## 2) Arkitektur: fra rammeværks‑render til canvas‑motor
- **Før (Vue Flow):** UI‐elementer pr. node er rammeværkskomponenter; re‑renders styres af reaktivitet. Risiko for “thrash” ved mange ændringer.
- **Efter (LiteGraph):** Canvas driver tegningen. Svelte håndterer kun “chrome” (toolbar, sidepanel, dialogs). Node‑UI lever i kanvas via widgets + brugerdefinerede draw() hooks.
- **Konsekvens:** Mindre binding til UI‑lifecycle; stabil ved AI‑genereret node‑mutation i runtime.

---

## 3) Data‑model & persistens
- **Graph JSON** bliver “kilde‑sandheden” (AI‑venligt).
- **Serialization:** LiteGraph export/import JSON (nodes, links, positions, properties).
- **Lagring:** libSQL/SQLite (web‑worker), PouchDB fallback, eller filsystem API i PWA.
- **Schema‑nøglefelter:** id, type, pos, inputs/outputs (name, type), properties (sceneId, text, tags), chapterId.
- **Chapters:** Som subgraphs (LiteGraph har noder med interne grafer) eller som filter på canvas med group‑rects.

---

## 4) Interaktion & UX‑adfærd
- **Pan/zoom:** Native med trackpad/mus. Zoom‑limits defineres (0.25–2.0).
- **Selection:** Single/multi med marquee; Svelte‑sidepanel viser detaljer for valgt node/link.
- **Connect:** Drag fra output→input; valider type‑kompatibilitet før oprettelse.
- **Edit:** Dobbeltklik på node åbner “Scene‑editor” i panel/dialog.
- **Context menu:** Højreklik åbner Loke‑nodekatalog (Scene, Choice, Condition, Variable...).
- **Keyboard:** Del (slet), Cmd/Ctrl+C/V (copy/paste), Cmd/Ctrl+Z/Y (undo/redo), G (group), F (focus node), 1–9 (quick‑add).
- **Mini‑map:** Let overlay canvas i hjørnet; spejler world‑bounds.

---

## 5) Svelte + TypeScript integration ("Zoe")
- **Canvas host:** Ét `<div>` i Svelte modtager LGraphCanvas (imperativ init i onMount).
- **State:** Writable stores for `graphJSON`, `selection`, `mode`, `dirty`.
- **Binding:** Canvas events (nodeSelected, linkAdded, graphChanged) → opdater Svelte stores; undgå dobbelt‑kilder.
- **Actions:** Svelte *actions* til mouse‑bindings og resize observer af canvas.
- **Typing:** Node property‑interfaces (SceneNodeProps, ChoiceNodeProps). Port‑types: string | number | bool | flow.
- **Undo/Redo:** Central command‑bus; mutationer registreres (for AI‑scripts også).

---

## 6) Tailwind stil & layout
- **Canvas:** Fuld‑screen grid‑bg (Tailwind utility classes); UI‑chrome i top/side.
- **Panels:** Draggable/resizable med CSS + minimal JS; dark/light tema (Tailwind variants).
- **Node‑looks:** Let custom tegning i draw() + Tema‑tokens (farver for node‑typer, status, validering).
- **Focus states:** Synlig highlight ved selection, fejl i røde badges på ports.

---

## 7) Node‑typer (første bølge)
- **Start/End**: flow‑anker i kapitel/scene.
- **Scene**: properties: sceneId, title, textRef, tags.
- **Choice**: label, targetSceneId (valgfri), conditions[].
- **Condition**: expr (simple DSL), outputs: true/false.
- **Variable**: get/set, key, type, default.
- **Router**: n‑vej routing baseret på switch‑udtryk.
- **Subgraph**: repræsenterer Chapter (lokal scene‑samling).

---

## 8) Events & automations
- **Graph lifecycle:** beforeChange/afterChange → sæt `dirty=true` og autosave throttled.
- **Validation:** onLinkAdded tjek port‑type + cyc‑detektion (optionelt) + domæne‑regler (f.eks. Scene må kun have 1 Start link ind).
- **AI‑hooks:** “ApplyPatch(patchJSON)” kommandoer; alle mutationer går via command‑bus for determinisme.

---

## 9) PWA & offline
- **Cache:** Service Worker cacher core‑assets + seneste grafer.
- **Sync:** Når online: push/pull mod libSQL/Turso; konflikter løses pr. node (seneste timestamp vinder eller CRDT senere).

---

## 10) Teststrategi (Playwright)
- **Røgtests:** Kan appen åbne graf, zoome, tilføje node, forbinde link, gemme, indlæse.
- **Selektorer:** Data‑attributes på toolbar/panel (ikke canvas shapes). Canvas asserts via DOM events + JSON diffs.
- **AI‑flows:** Scriptede patches indlæses og valideres mod forventet graphJSON.

---

## 11) Ydeevne & stabilitet
- **Batching:** Saml mutationer (debounce 16–33ms) før redraw/serialisering.
- **Virtual bounds:** Begræns world‑størrelse; auto‑layout kører i worker (dagre/elk optionelt).
- **Memory:** Frigør billeder/fonts fra nodes; observer `dispose()` ved node‑sletning.

---

## 12) Migreringsplan (trin for trin)
1. **Læse/Skive‑lag:** Definér fælles Graph JSON (så Vue Flow & LiteGraph kan læse samme model under overgang).
2. **Canvas MVP:** Init LiteGraph canvas i Svelte; indlæs eksisterende JSON read‑only.
3. **Interaktion:** Enable selection, pan/zoom, node flyt.
4. **Links:** Aktiver connect/disconnect + validering.
5. **Properties panel:** To‑vejs bind til node.properties (via command‑bus).
6. **Node palette:** Context menu + toolbar for at oprette Loke‑noder.
7. **Persistens:** Autosave + versionering (snapshot per 30s / onBlur / explicit Save).
8. **Tests:** Playwright røgtests + JSON diff‑goldenfiles.
9. **Feature parity:** Mini‑map, groups, copy/paste, undo/redo.
10. **Decommission:** Fjern Vue Flow; lås migreringsbranch; opdatér docs.

---

## 13) Risici & afbødning
- **Canvas‑centrisk tegning:** Mindre DOM‑kontrol → løs med sidepaneler i Svelte.
- **Tilpasset node‑UI:** Kræver draw‑hooks; start simpelt (tekst/ikoner), iterér.
- **Kompabilitet:** Sikr type‑system for ports (flow vs data).
- **Autosave‑storm:** Throttle + command‑bus.

---

## 14) Acceptkriterier (MVP)
- Åbn stor graf (>1k noder) uden UI‑freeze.
- Tilføj/flyt/slet nodes & links stabilt i 10 min interaktion.
- Autosave fungerer offline/online; ingen datatab ved refresh.
- Playwright suite: ≥ 10 kerne‑scenarier grønne.

---

## 15) Roadmap (efter MVP)
- Auto‑layout i worker (dagre/elk).
- CRDT sync for kollaboration.
- Scriptbar “graph macros” til AI‑agenter.
- Eksport til Loke‑engine kompakt JSON (deploy‑format).

---

**Konklusion:** LiteGraph.js passer bedre til Loke‑graph’s AI‑drevne, PWA‑venlige arkitektur. Porten fokuserer på et fælles Graph‑JSON, en canvas‑first UI, og et command‑bus lag der gør mutationer deterministiske og testbare.

