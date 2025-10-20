# TODO: Sammensmeltning af Loke-Cards og Loke-Graph

**Hovedmål:** At skabe én samlet, offline-first PWA, der kombinerer `cards`-editoren og `graph`-visualiseringen. `cards` skal være den primære, hurtigt-loadende del af applikationen, mens `graph` skal lazy-loades ved behov for at optimere den indledende brugeroplevelse.

---

### Udgangspunkt

Planen tager udgangspunkt i følgende status:
- **Loke-Cards:** En fungerende applikation til redigering af scener.
- **Offline Database:** Applikationen er klar til at blive koblet på en offline-database, der kører i browseren via WASM (WebAssembly).
- **Loke-Graph:** En separat, fungerende applikation til visualisering af narrativ struktur.

---

### Fase 1: Implementering af Offline Database (WASM SQLite)

*Mål: At gøre `loke-cards` i stand til at læse og skrive direkte til en lokal SQLite-databasefil i browseren.* 

- [ ] **Integrer WASM SQLite:** Vælg og installer et bibliotek som `sql.js`.
- [ ] **Abstraher datalaget:** Implementer et `Repository Pattern`, der adskiller datalogik fra UI. 
- [ ] **Opret `SQLiteRepository`:** Skriv en ny repository-implementation, der kører SQL-forespørgsler på WASM-databasen.
- [ ] **Håndter databasefil:** Implementer UI til at lade brugeren åbne en lokal `.sqlite`-fil.
- [ ] **Opdater `loke-cards`:** Refaktorer applikationen til at bruge det nye `SQLiteRepository` til alle dataoperationer.

### Fase 2: Database-synkronisering med Backend

*Mål: At give brugeren mulighed for at synkronisere sin lokale offline-database med en server-backend.* 

- [ ] **Definer synkroniseringsstrategi:** Beslut en metode for synkronisering (f.eks. simpel upload/download af hele `.sqlite`-filen).
- [ ] **Implementer API Endpoints:** Opbyg de nødvendige backend-endpoints (f.eks. `POST /api/db/upload`, `GET /api/db/download`).
- [ ] **Implementer UI:** Tilføj knapper i brugerfladen til at starte en synkronisering (f.eks. "Synkroniser", "Push", "Pull").

Offline‑first politik (gælder cards + graph)
- [ ] UI læser altid lokalt (WASM/LocalForage) først; server bruges kun som baggrundsrefresh
- [ ] Import fra server → lokal: engangsseed og manuel handling i Settings
- [ ] Push lokal → server: bevidst udgående sync (LWW på `updatedAt`), aldrig auto‑overskriv lokalt
- [ ] Heartbeat/status: vis backend status, men påvirk ikke lokal visning

### Fase 3: Sammensmeltning af Applikationerne (Cards + Graph)

*Mål: At integrere `graph`-appen som et lazy-loaded modul i den primære `loke-cards` PWA.* 

- [ ] **Foren build-processen:** Fjern den separate build-konfiguration for `graph`. Den primære `vite.config.js` skal håndtere hele applikationen.
- [ ] **Integrer Routing med Lazy Loading:**
    - Flyt `graph`-rutene (`/graph`, `/graph/chapter/:id`) ind i `loke-cards`'s router.
    - Brug dynamisk import (`() => import(...)`) til at sikre, at `graph`-komponenterne kun indlæses, når brugeren navigerer til dem.
- [ ] **Integrer UI:**
    - Tilføj navigationslinks til "Graph" i `loke-cards`'s primære sidebar/header.
    - Sørg for, at `graph`-komponenterne rendres korrekt inden i `loke-cards`'s app-skal.
- [ ] **Del dataadgang:** Sikr, at både `cards`- og `graph`-delene bruger den samme, delte instans af `SQLiteRepository`.

### Fase 4: Projekt‑lag (Projects → Chapters → Scenes)

*Mål: Én aktivt valgt `project` ad gangen i UI; alle operationer er scoper til det valgte projekt.*

- [ ] Datamodel: tilføj `projectId` på `chapters` og `scenes`; migrér eksisterende data til `projectId: 'default'`
- [ ] Stores: `projectStore` med `currentProject`, liste + CRUD, persist valgt projekt (localStorage)
- [ ] UI: `ProjectPicker` (header/sidebar) + Settings‑side til projektstyring
- [ ] Scoping: filtrér lister, editorer, graph visninger og persistens efter `projectId`
- [ ] Import/Export/Sync: medtag `projects` og respekter valgt projekt
- [ ] Graph alignment: indfør `projectId` i graph store og routes; del kontekst med cards

### Fase 4: PWA-optimering og Færdiggørelse

*Mål: At finpudse den samlede applikation for en gnidningsfri PWA-oplevelse.* 

- [ ] **Verificer Service Worker:** Kontroller, at service workeren cacher alle applikationens dele korrekt, inklusiv de lazy-loadede `graph`-moduler.
- [ ] **Implementer "Åbn i nyt vindue":** Tilføj funktionalitet til `graph`-visningen, så den kan åbnes i et separat browservindue for en side-om-side-oplevelse.
- [ ] **Synkroniser mellem vinduer:** Implementer `BroadcastChannel` API'et for at sikre, at ændringer lavet i ét vindue (f.eks. i `cards`-editoren) afspejles i realtid i det andet vindue (`graph`-visningen).
