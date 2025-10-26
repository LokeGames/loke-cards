# Mindstorm System – Narrative Ideation Workspace

## Formål
- Skabe et dedikeret rum til idéudvikling, forventningsstyring og plotnoter.
- Muliggøre registrering af noter med status og relationer, så fortællingen kan opbygges drypvis.
- Understøtte sporing af hvilke scener/kapitler en note påvirker, og hvordan noter hænger sammen tidsligt eller logisk.

## Datamodel

### Mindstorm Note
| Felt        | Type   | Beskrivelse |
|-------------|--------|-------------|
| `id`        | string | Globalt unikt note-id (human readable men stabil). |
| `data`      | JSON   | Selve notens indhold (se struktur nedenfor). |
| `relate`    | JSON   | Liste over relationer til kapitler/scener (1‑1 eller 1‑flere). |
| `relation`  | JSON   | Angiver forgængere/efterfølgere for at modellere plotforløb. |
| `createdAt` | number | Unix timestamp. |
| `updatedAt` | number | Unix timestamp; opdateres ved ændringer i `data`/`relate`/`relation`. |

#### `data` struktur (eksempel)
```json
{
  "title": "Klimaks i kapitel 3",
  "summary": "Ide om hvordan antagonisten afsløres gennem mindgames.",
  "status": "draft", // draft | in_progress | approved | shelved
  "tags": ["plot", "antagonist", "mindgames"],
  "author": "writer-id",
  "expectations": [
    "Bygge suspense gennem tidligere hints",
    "Skal kunne ændres hvis chapter_03 omskrives"
  ],
  "notes": "Fungerer som en tidlig brainstorm; skal senere omskrives til scene backlog."
}
```

#### `relate` struktur
```json
{
  "chapters": ["chapter_02", "chapter_03"],
  "scenes": ["scene-interrogation", "scene-reveal"]
}
```
- Kan være tomme lister hvis noten endnu ikke er placeret.
- Understøtter at samme note knyttes til flere kapitler/scener.

#### `relation` struktur
```json
{
  "precededBy": ["mindstorm-setup-antagonist"],
  "followedBy": ["mindstorm-aftermath"],
  "parent": "mindstorm-main-quest",
  "children": ["mindstorm-sidequest-a"]
}
```
- Bruges til at tegne narrative kæder eller flowdiagrammer.
- Sikrer at kapitler og scener kan se hvilke noter der leder op til en given idé.
- Parent/child understøtter nested hierarkier (fx quests → subquests eller handlingsspor → delscener).

### Metadata katalog
For at understøtte brugerdefinerede statusser, labels og typer oprettes et separat katalog:

| Tabel                | Felter                                                                                 | Formål |
|----------------------|----------------------------------------------------------------------------------------|--------|
| `mindstorm_meta`     | `id`, `category` (`status` \| `label` \| `type`), `name`, `slug`, `color`, `icon`, `description`, `sortOrder`, `createdAt`, `updatedAt` | Global konfiguration pr. projekt.                  |
| `mindstorm_note_meta`| `noteId`, `metaId`                                                                     | Tildeler flere labels/typer til en note.           |

- Ikonfeltet gemmer Lucide-navn eller lokal komponentreference.
- Farver bruger Tailwind tokens (fx `emerald-500`) så UI kan matche front-temaet.
- Status er “single select” (en note har én status), labels og typer kan være “multi select”.

### Relationstabeller

| Tabel                  | Felter                                                                                                          | Beskrivelse |
|------------------------|-----------------------------------------------------------------------------------------------------------------|-------------|
| `mindstorm_relate`     | `id`, `noteId` (FK `mindstorm_notes.id`), `targetType` (`chapter` \| `scene`), `targetId`, `createdAt`             | Knytter noter til kapitler/scener (understøtter 1‑flere). |
| `mindstorm_relations`  | `id`, `noteId` (FK), `relationType` (`precededBy` \| `followedBy` \| `parent` \| `child`), `relatedNoteId`, `order`, `createdAt` | Modellerer narrative kæder, hierarkier og rækkefølge. |

- `targetId` matcher kapitlers/sceners primære id’er (fx `chapter_03`, `scene-reveal`).
- `relatedNoteId` er en reference til en anden note; enforce referentiel integritet.
- `order` bruges til sekventering (fx i tasks eller plot beats).
- Kombinér `noteId` + `relationType` + `relatedNoteId` som unik constraint for at undgå duplikerede links.

## Arbejdsgange
- **Opret note**: Tilføj grundidé, forventninger og status. Knut til relevante kapitler/scener via `relate`.
- **Opdater status**: Skift status når noten afklares, fusioneres, eller opgives.
- **Relationskort**: Brug `relation` til at visualisere idéforløb (fx i grafvisning eller TOC værktøjer).
- **Scene/Kapitel visning**: Kapitler og scener slår op i Mindstorm via deres id reference og får en liste over tilknyttede noter (inkl. status).
- **Revision**: Når en note omsættes til konkret indhold, behold Mindstorm noten som historik eller arkivér via `status: shelved`.

## Databaseplacering
- Mindstorm-tabeller lagres i projektets eksisterende SQLite-database (fx `server/projects/adventure-game/data/adventure-game.db`).
- Opret separat Mindstorm-schema (fx tabellerne `mindstorm_notes`, `mindstorm_relate`, `mindstorm_relations`) så idékladder lever side om side med scener/kapitler, men kan query’es isoleret.
- Hver projektdatabase skal kunne eksporteres/importeres uden at miste Mindstorm-data.
- Indeksér `mindstorm_notes.updatedAt`, `mindstorm_note_meta.metaId` og foreign keys i `mindstorm_relate` for at holde store narrativer hurtige (filtrering/sortering).
- Brug pagination (`limit`/`offset`) og evt. materialiserede views til store projekter; cache filtrerede resultater i memory når Mindstorm UI er åbent.

## Samspil med øvrige systemer
- **TOC Graph**: `relation` data kan genbruges til at vise tidlige kladdeforløb før scener er skrevet.
- **Chapter/Scene editors**: UI kan vise “Mindstorm-noter” i sidepanel for hurtig reference.
- **Project sync**: Mindstorm data synces sammen med resten af projektets SQLite-database; brug schema-navne eller tabelforefix for at holde kladder adskilt fra publicerede scener.
- **Cards integration**: Kapitel- og scene-editorerne skal over WIP versionerne fra Mindstorm: se detaljer nedenfor om visning og tildeling.

## UI & App-struktur
- Placér Mindstorm-klienten i `apps/mindstorm` (SvelteKit) med eget routing-lag, men del Tailwind-konfiguration og fælles UI-komponenter fra `@loke/ui`.
- Del layout med `@apps/front` (fx header/navigation) via shared layouts eller komponenter under `apps/front/src/lib`.
- Primært view: “Mindstorm Board” hvor noter kan filtreres, sorteres og vises som liste eller kanban (status-kolonner).
- Listens sortering skal være fleksibel: sortér på `status`, `type`, `chapter`, `scene`, senest opdateret, prioritet m.m. Muliggør kombinerede sorteringer og custom visninger.
- UI skal tilbyde oprettelse/administration af meta-opsætning: definér Status, Label, Type (inkl. ikon + farve) så projekter selv kan konfigurere deres arbejdsgange.
- Note-editoren skal understøtte hurtig tildeling af kapitel/scener via søgbar dropdown eller tag-selector (flere relationer ad gangen).
- Sekundært detailpanel til at redigere note (`data`, `relate`, `relation`) med inline visning af knyttede scener/kapitler.
- Indbyg søgelinje + tagfilter for hurtigt at finde noter knyttet til bestemte narrative elementer.
- Sørg for at alle netværkskald går gennem `@loke/shared/database` (eller dedikeret Mindstorm API wrapper), så systemet forbliver ensartet med Cards/Front.
- Overvej “Gemte visninger” (`Saved Filters`) så store teams kan definere egne dashboards (fx “Kapitel 3 – kladde”, “Typer: karakterark”).
- Metadata-administration udspringer af et “Settings” view hvor brugere med rettighed kan oprette/omdøbe/inaktivere statusser, labels og typer (inkl. ikon/farvevalg).
- Auditlog (minimum `updatedAt` + `updatedBy`) for noter hjælper teams med at se seneste ændringer; udvid evt. til revisionshistorik senere.
- Saved views og metadata-opsætning bør understøtte eksport/import (JSON) for at dele opsætning mellem projekter.
- Kommentartråde: hvert Mindstorm note kan have en diskussionstråd (mini feed) hvor teamet kan kommentere, @mention kolleger og markere beslutninger. Gemmes i `mindstorm_comments` (felter: `id`, `noteId`, `author`, `body`, `createdAt`, `updatedAt`, `parentCommentId` for trådstruktur). Cards view viser de seneste kommentarer sammen med noten.
- Templates: projekter kan definere note-templates (fx “Karakterprofil”, “Worldbuilding”, “Plot Beat”) med predefinerede felter/tekster. Lagres i `mindstorm_templates` (felter: `id`, `name`, `slug`, `description`, `defaultData`, `defaultMeta`, `icon`, `color`). Ved oprettelse kan man vælge template; `defaultData` merges ind i notens `data`-struktur. Templates versioneres med `updatedAt` + `version` så ændringer kan spores.
- Modulært design: komponenter bygges som selvstændige moduler (fx `MindstormList`, `NoteMetaPanel`, `RelationInspector`) med klare props/events og isolerede stores. Layouts bruger wrapper-komponenter så ændringer i ét modul ikke påvirker resten; defensive guards og lazy loading skal forhindre at delvise fejl crasher hele viewet. CSS/tema deles via tokens, men individuelle moduler kan overrides uden at bryde andre.

### Cards Editor Integration
- **Scene editor** (`apps/cards`): Øverst i editoren vises “Tilknnyttede Mindstorm-noter” som badges eller paneler. Listen hentes via `mindstorm_relate` på `sceneId`, sorteret efter status og seneste opdatering. Brugere kan åbne note-detaljer i et sidepanel (read-only) for hurtig reference.
- **Chapter editor**: Tilsvarende topsektion viser noter knyttet til kapitlet. Derudover kan forfatteren tildele noter til scener direkte fra kapitel-viewet:
  - UI viser en liste over noter relateret til kapitlet, men endnu ikke knyttet til en specifik scene.
  - For hver note kan man vælge en target-scene (eksisterende eller “opret ny scene”). Når scenen oprettes, opdateres `mindstorm_relate` automatisk med den nye `sceneId`.
  - Noter uden tildeling forbliver i “Kapitel backlog”-listen, så de drysser ned, når relevante scener etableres.
- Scene- og kapitel-editorer bør vise status/labels/typer med deres ikon/farve for hurtig scanning og linke til Mindstorm view for fuld redigering.
- Ved ændring i Cards UI trigges en mindre data-sync (fx via shared database service) så Mindstorm og Cards holdes i realtime-paritet.
- Task/subtask-visualisering: noter med `parent` relation vises som foldbare grupper, så en kapitelredaktør kan se handling → underhandling → scene pipeline. Kan også bruges til quest → delquest → task progression.

### Linear Udviklingspipeline
1. **Mindstorm ideation**: Forfattere indsamler idéer, quests, plotelementer og tasks som noter. Statusser bruges til at vise modenhed (fx `idea`, `outline`, `ready`).
2. **Kapitelplan**: Noter knyttes til kapitler; kapitel-editoren viser backloggen og lader redaktører etablere parent/child-structure (handling → underhandling) samt rækkefølge via `order`.
3. **Scene-tildeling**: Når scener oprettes i Cards, mindstorm-noterne drysser ned i scene-editoren. Redaktion kan omsætte noten til konkret indhold, mens task/subtask-strukturen viser resterende arbejde.
4. **Færdiggørelse**: Når en scene er skrevet færdig, opdateres note-status (fx `approved` eller `shipped`) så pipeline tydeliggør hvor langt projektet er. Parent/child propagationen gør det muligt at se hvornår en quest eller plottråd er fuldt realiseret.
5. **Iterativ tilpasning**: Da Mindstorm og Cards deler database, kan ændringer i scener føre noterne tilbage i `in_progress` eller `needs_revision`, hvilket holder processen lineær men fleksibel.

## Fremtidige udvidelser
- Versionering pr. note (track historik for ændringer).
- Export/import til GitHub Issues eller andre værktøjer.
