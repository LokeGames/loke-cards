# Loke-Graph Cast System

## A. Cast-første arkitektur (Primær løsning)

**Formål:** Gør det muligt at vise og styre Loke-graph på et stort TV via Chromecast eller "Chromecast built-in" TV’er. Denne model giver fuld kontrol, høj performance og kan senere udvides til Android TV med Cast Connect.

### Komponenter

1. **Sender (PWA):**

   * Loke-graph PWA inkluderer **Google Cast Web Sender SDK**.
   * En Cast-knap vises, når der registreres Cast-understøttelse.
   * Brugeren kan vælge et tilgængeligt TV og starte en Cast-session.
   * PWA’en sender enten:

     * JSON-data om grafen, eller
     * en signerede URL med en “TV-view” af grafen.

2. **Receiver (TV-app):**

   * En **Cast Application Framework (CAF) Receiver** app kører på Chromecast eller TV’et.
   * Den loader en letvægts “TV-layout” af Loke-graph (kun visning, ingen fuld redigering).
   * Modtager realtidsdata via Cast-beskeder.
   * Renderer grafen i et fullscreen canvas/WebGL-view, optimeret til TV.

3. **Synkronisering:**

   * Sender og receiver kommunikerer via JSON-beskeder.
   * Eksempel: `{ type: 'update', nodes: [...], edges: [...] }`.
   * Data kan også hentes direkte fra en delt backend ved brug af session-ID’er.

4. **Udvidelser:**

   * **Cast Connect:** Muliggør, at Android TV-brugere åbner direkte i en Loke-graph TV-app.
   * **WebSocket bridge:** Kan supplere Cast-beskeder for hurtigere UI-opdateringer.

### Fordele

* Fuld visuel oplevelse på TV’et.
* Real-time opdateringer af graphens tilstand.
* PWA’en bevarer kontrollen (zoom, pan, fokus osv.).
* Skalerbar til multi-display og multi-user scenarier.

### Krav

* HTTPS hosting.
* `cast_sender.js` SDK importeret i PWA.
* Registreret Cast Receiver ID i Google Cast Developer Console.

---

## B. Fallbacks (Sekundær løsning)

**Formål:** Sikre at Loke-graph stadig kan vises på et TV, hvis Chromecast ikke er tilgængelig.

### 1. Presentation API

* Browseren åbner en **sekundær browserkontekst** (ekstern skærm via HDMI/Miracast/AirPlay).
* PWA’en sender en URL til denne kontekst med et “TV-view” af grafen.
* Grafen vises uden aktiv session, men opdateres periodisk eller via WebSocket.

### 2. OS-spejling

* Brugeren kan benytte OS’ens egen funktion til skærmdeling:

  * AirPlay (Apple)
  * Chromecast skærmspejling (Android/Chrome)
  * HDMI-udgang (desktop/laptop)
* Grafen vises i realtime, men uden dedikeret interaktionslag.

### 3. Remote Playback API (kun video)

* Hvis Loke-graph genererer video eller animationer, kan disse afspilles via Remote Playback API.
* Ikke egnet til interaktive grafer, men kan bruges til demo/visualiseringsoptagelser.

### Fordele

* Kræver ingen ekstra setup eller SDK.
* Virker på næsten alle platforme.
* Brugeren kan stadig se resultaterne på storskærm.

### Ulemper

* Ingen direkte data-synkronisering mellem enheder.
* Begrænset til “visning”, ikke styring.

---

## Anbefalet strategi

1. **Implementér Cast-først (A) som hovedløsning.**
   Det giver bedst UX, kontrol og performance.

2. **Tilføj Fallback (B) for bred kompatibilitet.**
   Hvis Cast ikke findes, tilbyd:

   * Presentation API (hvis browser understøtter det)
   * Ellers en “Vis på TV”-vejledning for AirPlay/Chromecast spejling.

3. **Langsigtet:**

   * Udbyg Cast Receiver til Cast Connect.
   * Tilføj en dedikeret “TV Dashboard Mode” i Loke-graph (auto fullscreen, minimal UI).
