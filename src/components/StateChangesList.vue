<template>
  <div class="state-changes-list">
    <div class="flex items-center justify-between mb-2">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        State Changes
        <span class="text-gray-500 text-xs">(optional)</span>
      </label>
      <button
        @click="addStateChange"
        class="px-3 py-1 text-sm font-medium rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors"
      >
        + Add State Change
      </button>
    </div>

    <div v-if="stateChanges.length === 0" class="text-center py-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
      <p class="text-gray-500 dark:text-gray-500 text-sm">
        No state changes. Click "Add State Change" to modify game state.
      </p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="(change, index) in stateChanges"
        :key="change.id || index"
        class="p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900"
      >
        <div class="flex items-start justify-between mb-3">
          <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">
            State Change {{ index + 1 }}
          </span>
          <button
            @click="removeStateChange(index)"
            class="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-1"
            title="Remove state change"
          >
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <!-- Variable -->
          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Variable
            </label>
            <input
              :value="change.variable"
              @input="updateStateChange(index, 'variable', $event.target.value)"
              type="text"
              placeholder="health"
              list="state-variables"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Operator -->
          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Operator
            </label>
            <select
              :value="change.operator"
              @change="updateStateChange(index, 'operator', $event.target.value)"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="=">=</option>
              <option value="+=">=</option>
              <option value="-=">-=</option>
              <option value="*=">*=</option>
              <option value="/=">/=</option>
            </select>
          </div>

          <!-- Value -->
          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Value
            </label>
            <input
              :value="change.value"
              @input="updateStateChange(index, 'value', $event.target.value)"
              type="text"
              placeholder="10"
              list="state-values"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <p v-if="errors[index]" class="mt-2 text-xs text-red-600 dark:text-red-400">
          {{ errors[index] }}
        </p>
        <p v-else class="mt-2 text-xs text-gray-500 dark:text-gray-500 font-mono">
          state->{{ change.variable || '...' }} {{ change.operator || '...' }} {{ change.value || '...' }};
        </p>
      </div>
    </div>

    <p class="mt-2 text-xs text-gray-500 dark:text-gray-500">
      Modify GameState variables (e.g., health, gold, has_key)
    </p>

    <!-- Datalist for common state variables -->
    <datalist id="state-variables">
      <option value="health">
      <option value="gold">
      <option value="karma">
      <option value="progress">
      <option value="has_key">
      <option value="has_sword">
      <option value="has_map">
    </datalist>

    <!-- Datalist for common values -->
    <datalist id="state-values">
      <option value="true">
      <option value="false">
      <option value="0">
      <option value="10">
      <option value="50">
      <option value="100">
    </datalist>
  </div>
</template>

<script setup>
const props = defineProps({
  stateChanges: {
    type: Array,
    default: () => []
  },
  errors: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:stateChanges']);

function addStateChange() {
  const newStateChanges = [...props.stateChanges, {
    variable: '',
    operator: '=',
    value: ''
  }];
  emit('update:stateChanges', newStateChanges);
}

function removeStateChange(index) {
  const newStateChanges = props.stateChanges.filter((_, i) => i !== index);
  emit('update:stateChanges', newStateChanges);
}

function updateStateChange(index, field, value) {
  const newStateChanges = [...props.stateChanges];
  newStateChanges[index] = {
    ...newStateChanges[index],
    [field]: value
  };
  emit('update:stateChanges', newStateChanges);
}
</script>
