# Loke-Cards / Loke-Graph Architektur (PWA Shell Setup)

## Formål

At samle Loke-projektets to underapps – **/cards** (narrativ editor) og **/graph** (visuel scene-/nodeoversigt) – under én fælles, hurtig og testbar **PWA front shell**, der styrer lazy loading, offline-lagring, og databinding via en WASM-drevet data-worker.

---

## Overblik

**Hovedprincip:** Adskil præsentation (UI) fra data (DB + sync).

| Lag | Navn                   | Ansvar                                                  |
| --- | ---------------------- | ------------------------------------------------------- |
| 1   | **/front (PWA shell)** | Routing, tema, app-switcher, lazy loading af mikro-apps |
| 2   | **/apps/cards**        | UI til redigering af kort, scener og kapitler           |
| 3   | **/apps/graph**        | UI til visuel node-/forbindelsesgraf                    |
| 4   | **/workers/data**      | Web/SharedWorker med SQLite (WASM) og offline sync      |
| 5   | **/server/bff**        | Backend-for-frontend: enkel API til synkronisering      |

---

## Mål

* Hurtigere opstartstid via lazy-loading
* Offline-funktionalitet med lokal SQLite i browseren
* Klare modulgrænser (AI-venligt kodegrundlag)
* Stabil datahåndtering via worker-RPC i stedet for direkte DB-kald
* Mulighed for at udvikle og teste /cards og /graph uafhængigt

---

## Komponentbeskrivelse

### **/front (SvelteKit PWA shell)**

* Loader som første del af applikationen (instant startup)
* Indeholder:

  * App-switcher (f.eks. mellem Cards og Graph)
  * Auth/login-flow
  * Lazy-loading via `import('@apps/cards')` og `import('@apps/graph')`
  * Service Worker for cache og offline funktion
  * Tema og layout (Tailwind CSS)

**Ansvar:** kun at vise, rute og loade moduler – ingen data.

---

### **/apps/cards**

* Selvstændigt Svelte-bibliotek (bygges som ESM-bundle)
* Har kun UI-komponenter og kalder data via RPC til worker
* Kommunikerer med data-worker:

  ```ts
  const cards = await data.cards.list();
  await data.cards.save(dto);
  ```

**Indeholder:**

* Formularer, redaktørfelter, kapitel-/sceneoversigt
* UI state (ikke persistent state)

---

### **/apps/graph**

* Separat UI-mikroapp til nodevisning
* Renderer grafer (f.eks. via d3, Cytoscape, eller Svelte-draw)
* Kalder data via RPC (samme worker som /cards)
* Reagerer på dataændringer via BroadcastChannel events

---

### **/workers/data** (SharedWorker med WASM-SQLite)

* Central datalagring i browseren
* Indeholder SQLite (WASM + OPFS filesystem)
* Giver et RPC API (via Comlink) til UI-applikationer

**Eksempel:**

```ts
export const api = {
  cards: { get, list, save },
  graph: { runQuery, upsertEdge },
  sync: { pull, push }
};
Comlink.expose(api);
```

**Funktioner:**

* Lokal SQLite database (`loke.db` i OPFS)
* Periodisk sync med /server/bff
* Konflikthåndtering og offline kø

---

### **/server/bff (Backend for Frontend)**

* Simpelt API-lag mellem worker og den eksterne database (Turso/libSQL/etc.)
* Udfører CRUD og synkronisering af ændringer
* Kan hostes som Cloudflare Worker eller Go/FastAPI microservice

---

## Kommunikation og flow

```plaintext
[UI /cards or /graph]
     ↓ RPC (Comlink)
[Data Worker + SQLite (WASM)]
     ↓ Fetch / Sync
[Server BFF → ekstern DB]
```

* UI → Data Worker: `postMessage` (via Comlink)
* Data Worker → DB (lokal SQLite)
* Data Worker → BFF (HTTP sync, push/pull)

---

## Teknologier

* **SvelteKit + Tailwind** – UI og shell
* **Vite lib mode** – bundling af mikro-apps
* **Comlink** – RPC mellem UI og worker
* **wa-sqlite / sql.js / libSQL WASM** – lokal database
* **OPFS** – persistent filsystem i browseren
* **Service Worker (Workbox)** – caching og offline
* **Zod + TypeScript** – kontrakter og validering

---

## Offline- og sync-model

1. Alle ændringer gemmes straks lokalt i SQLite
2. Worker logger ændringer i `op_log`
3. Når der er forbindelse, pushes `op_log` til BFF
4. BFF returnerer eventuelle ændringer fra andre klienter
5. Worker løser konflikter (last-write-wins eller CRDT)

---

## Filstruktur (Monorepo med pnpm)

```
/apps
  /front       (SvelteKit PWA shell)
  /cards       (UI mikroapp)
  /graph       (UI mikroapp)
/workers
  /data        (SharedWorker med WASM SQLite)
/packages
  /schemas     (Zod typer)
  /rpc         (Comlink wrappers)
/server
  /bff         (API / sync server)
/e2e
  /playwright  (integrationstests)
```

---

## Testramme (TDD)

| Lag     | Testtype    | Framework              |
| ------- | ----------- | ---------------------- |
| schemas | Unit        | Vitest                 |
| worker  | Integration | Vitest + sqlite mock   |
| front   | E2E UI      | Playwright             |
| sync    | Contract    | Supertest / Playwright |

---

## Fordele

✅ Hurtig startup (shell loader alt andet on demand)
✅ Offline- og synkroniseringsunderstøttelse
✅ Stabilitet via data-worker som sandhedskilde
✅ Klare API-kontrakter (nemt for AI at bygge videre)
✅ Mulighed for parallel udvikling af /cards og /graph

---

## Konklusion

Dette setup giver **én samlet, robust PWA** med **separeret data- og UI-lag**, som kan skaleres, testes og udvikles uafhængigt. /front styrer oplevelsen, mens /workers/data sikrer data-konsistens, offline-funktion og synkronisering. Det bliver dermed fundamentet for et Loke-økosystem, hvor flere mikro-apps kan kobles på samme platform uden at dele kode ustruktureret.
