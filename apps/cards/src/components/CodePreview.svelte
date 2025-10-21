<script lang="ts">
  import type { Scene } from '@schemas';
  import { generateC, type Choice, type StateChange } from '../lib/codegen';
  export let scene: Scene;
  export let choices: Choice[] = [];
  export let state: StateChange[] = [];
  $: code = generateC(scene, choices, state);
</script>

<pre class="text-xs bg-gray-900 text-gray-100 p-3 rounded overflow-auto" data-testid="code-preview"><code>{code}</code></pre>

