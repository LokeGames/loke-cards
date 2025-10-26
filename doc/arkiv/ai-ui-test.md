Klart — her er en konkret, no-bullshit udvidelse af hvad et **“agentic browser”** setup er, hvordan det virker, og hvordan du selv ruller det til at lade en AI **betjene** dit web-UI som en bruger.

# Hvad er en agentic browser?

En **agentic browser** er en LLM-drevet test/automation-agent, der:

1. kører en rigtig browser (Chromium/WebKit/Firefox),
2. læser **DOM + tilgængelighedstræ + netværkslog** og evt. **skærmbilleder/tekst**,
3. beslutter næste handling (klik, scroll, tast, vent, navigér) via “tool-calls”,
4. **evaluerer om målet er nået** (assertions), og
5. rapporterer trin for trin “som en bruger”.

Tænk Playwright/Selenium, men hvor *LLM’en selv* vælger selectors og handlinger dynamisk.

---

# Arkitektur i praksis

```
[Opgave/Mål] → [Agent (LLM)]
    ↑             ↓   ↘
[Eval rules]   [Browser Controller] → [Headless/Headful Browser]
    ↑             ↓
[Testlog + Rapport + Skærmbilleder]
```

* **Agent (LLM):** GPT-5/Claude-Code/DeepSeek m.fl. (vision valgfrit).
* **Browser Controller:** typisk **Playwright** (stabil, hurtig) eller **Puppeteer**.
* **Observations:** DOM-udsnit, ARIA-rolle-kort, netværksresponser, screenshots.
* **Actions:** `click(selector)`, `fill(selector,text)`, `press(key)`, `selectOption`, `waitFor*`, osv.
* **Evaluator:** assertions (f.eks. “Tekst ‘Velkommen’ synlig inden 2s”).

---

# Værktøjer at overveje (kort overblik)

| Lag               | Værktøj                               | Hvorfor                                                       |
| ----------------- | ------------------------------------- | ------------------------------------------------------------- |
| Browser           | **Playwright**                        | Bedste multi-browser API, god locator-strategi, tracing/video |
| Agent wrapper     | **browser-use**, **AgentQL**          | Giver LLM et deklarativt sprog for “find knap kaldet X”       |
| LLM               | **GPT-5 / Claude-Code**               | stærk planlægning + kodeskabelon + læse logs                  |
| Vision (valgfrit) | GPT-Vision                            | Til “klik på knappen i nederste højre hjørne” når DOM er svær |
| Orkestrering      | **LangChain / OpenAI function calls** | Tool-calling for `goto/click/fill/assert/screenshot`          |
| Rapport           | **Playwright Trace Viewer**           | Replay af hele test som video + DOM state                     |

---

# Minimal “agentic” loop (Playwright + tool-calls)

Idéen: LLM’en får *kun* lov til at kalde sikre “tools”. Den ser et udsnit af siden (rolle/tekst/attrs) og foreslår næste handling.

```ts
// agent-tools.ts
import { Page, expect } from '@playwright/test';

export function makeTools(page: Page) {
  return {
    async goto(url: string) {
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      return await serializeView(page);
    },
    async click(by: { role?: string; name?: string; css?: string }) {
      const loc = locator(page, by);
      await loc.click();
      return await serializeView(page);
    },
    async fill(by: { role?: string; name?: string; css?: string }, text: string) {
      const loc = locator(page, by);
      await loc.fill(text);
      return await serializeView(page);
    },
    async assertVisible(text: string) {
      await expect(page.getByText(text)).toBeVisible();
      return { ok: true };
    },
    async screenshot(label: string) {
      const path = `./artifacts/${Date.now()}-${label}.png`;
      await page.screenshot({ path, fullPage: true });
      return { path };
    }
  };
}

function locator(page: Page, by: any) {
  if (by.role && by.name) return page.getByRole(by.role as any, { name: by.name });
  if (by.css) return page.locator(by.css);
  throw new Error('No selector');
}

async function serializeView(page: Page) {
  // Giv LLM “øjne”: ARIA-roller + navngivne elementer (trimmet)
  const roles = await page.evaluate(() => {
    const out: any[] = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
    while (walker.nextNode()) {
      const el = walker.currentNode as HTMLElement;
      const role = el.getAttribute('role');
      const name = (el as any).ariaLabel || el.getAttribute('aria-label') || el.textContent?.trim();
      if (role && name && name.length < 120) out.push({ role, name: name.slice(0,120) });
    }
    return out.slice(0, 300);
  });
  const url = page.url();
  const title = await page.title();
  return { url, title, roles };
}
```

Agent-prompt (kort):

```
Mål: "Log ind og bekræft at dashboardet viser 'Velkommen, Lars'".
Du kan kun bruge tools: goto, click, fill, assertVisible, screenshot.
Strategi:
1) Gå til URL.
2) Find felter via role/name.
3) Udfyld email/password.
4) Klik "Login".
5) Vent og assert 'Velkommen, Lars'.
Efter hver observation, foreslå næste tool-call som JSON.
```

Kørsel (pseudo):

```ts
// run-agent.ts
import { chromium } from 'playwright';
import { makeTools } from './agent-tools';
import { callLLM } from './llm'; // din LLM-klient

const goal = "Log ind på http://localhost:5173 og assert 'Velkommen, Lars'";

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  const tools = makeTools(page);

  let obs = await tools.goto('http://localhost:5173');
  for (let step = 0; step < 20; step++) {
    const plan = await callLLM({ goal, observation: obs, tools: Object.keys(tools) });
    // plan = { tool: 'fill', args: {...} } eller { tool:'click', args:{...} } osv.
    // Kald det ønskede tool:
    // @ts-ignore
    obs = await tools[plan.tool](...(Array.isArray(plan.args)? plan.args: [plan.args]));
    if (plan.tool === 'assertVisible' && obs?.ok) break;
  }

  await browser.close();
})();
```

**Hvorfor virker det godt?**

* LLM’en “ser” strukturen (roller/navne), ikke hele DOM’en (token-økonomi).
* Alle handlinger går gennem sikre tools.
* Du kan indsætte dine egne **policy-checks** (f.eks. forbud mod at klikke destructive knapper i produktion).

---

# Goal-driven scenarier (eksempler)

1. **Login-flow:** udfyld email/pass, klik Login, assert “Velkommen”.
2. **CRUD-cyklus:** opret post, redigér, slet, assert flash-message.
3. **UI-indstillinger:** skift tema til “Dark”, assert body har `.dark`.
4. **i18n:** skift til “Dansk”, assert knaptekster opdateres.
5. **A11y-rundtur:** naviger med tastatur (`Tab/Enter/Space`), assert fokus-ordre fornuftig.

---

# Robusthed: selectors & “human-like” brug

* Brug **rolle-baserede locators** (`getByRole`) og **navne** fremfor CSS-klasser.
* Fald tilbage til `css` kun hvis nødvendigt.
* Indfør **retry/backoff** for flappies (spinner/async).
* Tilføj `waitForResponse` hvis din app loader data via XHR/GraphQL.

---

# Rapportering

* Aktivér **Playwright trace**:

  ```bash
  npx playwright test --trace=on
  npx playwright show-trace trace.zip
  ```
* Gem **step-screenshots** via `tools.screenshot("before-login")`.
* Lad LLM’en generere **fejlrapport** (markdown) ud fra logs + skærmbilleder.

---

# CI/CD eksempel (GitHub Actions)

```yaml
name: agentic-ui
on: [push]
jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build && npm run preview &  # start app
      - run: node ./agent/run-agent.js           # kør agenten
      - run: npx playwright show-trace trace.zip || true
      - uses: actions/upload-artifact@v4
        with:
          name: traces
          path: |
            trace.zip
            artifacts/*.png
```

---

# Evalueringsregler (enkelt, men effektivt)

Lav en lille YAML testplan pr. “opgave”, som agenten får:

```yaml
goal: "Skift tema til Dark og bekræft at body har class 'dark'"
success:
  - type: dom-has-class
    selector: "body"
    class: "dark"
fallback_assertions:
  - type: text-visible
    text: "Dark mode aktiveret"
failure_screenshots: true
```

Agenten stopper når **success** er opfyldt, ellers afleverer den fallback-assertions og screenshots.

---

# Edge cases & tips

* **Auth**: bypass evt. ved at seede testtoken i localStorage/cookie før navigation.
* **CAPTCHA**: slå fra i testmiljø eller mock endpoint.
* **Feature flags**: pin flags i test for deterministisk UI.
* **Data reset**: kør seeds/fixtures pr. test-run.
* **State leakage**: ny, inkognito profil pr. test.

---

# Hvornår bruge vision?

* Når UI’et er **canvas-baseret** eller stærkt **custom** (dårlig DOM/ARIA).
* Til **visuelle regressioner** (layout-brud): sammenlign screenshots.
* Brug vision kun som fallback – DOM-først er hurtigst og mest stabilt.

---

# Quickstart for dig (Svelte/Tailwind)

1. `npm i -D @playwright/test`
2. `npx playwright install`
3. Opret `agent-tools.ts` og `run-agent.ts` (som ovenfor).
4. Tilføj en simpel `callLLM()` der bruger din foretrukne model (GPT-5/Claude-Code).
5. Kør: `node agent/run-agent.js` mens din dev server kører.

Vil du have, at jeg smider en **færdig skabelon** (filer + mapper + scripts) du kan copy-paste ind i dit repo (SvelteKit/Tailwind) med 1-2 eksempel-opgaver (login + dark mode)?
