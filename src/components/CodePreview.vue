<template>
  <div class="code-preview bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
        Generated C Code
      </h3>
      <div class="flex items-center gap-2">
        <button
          @click="copyToClipboard"
          class="px-3 py-1 text-xs font-medium rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          :disabled="!code || code.length === 0"
        >
          {{ copied ? 'Copied!' : 'Copy' }}
        </button>
        <button
          v-if="collapsible"
          @click="isCollapsed = !isCollapsed"
          class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
        >
          <svg
            class="w-5 h-5 transition-transform"
            :class="{ 'rotate-180': !isCollapsed }"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Code Block -->
    <div v-show="!isCollapsed" class="relative">
      <pre class="p-4 overflow-x-auto text-sm leading-relaxed bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-mono max-h-96 overflow-y-auto"><code>{{ code || '// No code generated yet' }}</code></pre>

      <!-- Line Numbers (optional) -->
      <div v-if="showLineNumbers && code" class="absolute top-0 left-0 p-4 pr-2 text-sm text-gray-500 dark:text-gray-600 select-none pointer-events-none">
        <div v-for="(line, index) in codeLines" :key="index" class="leading-relaxed">{{ index + 1 }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  code: {
    type: String,
    default: ''
  },
  collapsible: {
    type: Boolean,
    default: true
  },
  showLineNumbers: {
    type: Boolean,
    default: false
  }
});

const isCollapsed = ref(false);
const copied = ref(false);

const codeLines = computed(() => {
  return props.code ? props.code.split('\n') : [];
});

async function copyToClipboard() {
  if (!props.code) return;

  try {
    await navigator.clipboard.writeText(props.code);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy code:', err);
  }
}
</script>

<style scoped>
/* Custom scrollbar for code block */
pre::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

pre::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-900;
}

pre::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-700 rounded;
}

pre::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400 dark:bg-gray-600;
}

/* Ensure code doesn't wrap */
code {
  white-space: pre;
  word-wrap: normal;
}
</style>
