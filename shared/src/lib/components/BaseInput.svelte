<script>
  export let id;
  export let label = '';
  export let type = 'text';
  export let value = '';
  export let placeholder = '';
  export let error = '';

  const onInput = (e) => {
    const v = e.target.value;
    const ev = new CustomEvent('update', { detail: v });
    dispatchEvent(ev);
  };
</script>

<div class="mb-4">
  {#if label}
    <label for={id} class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
  {/if}
  <input
    {type}
    {id}
    value={value}
    on:input={onInput}
    class={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'}`}
    {placeholder}
    aria-invalid={error ? 'true' : undefined}
    aria-describedby={error ? `${id}-error` : undefined}
  />
  {#if error}
    <p id={`${id}-error`} class="mt-1 text-sm text-red-600">{error}</p>
  {/if}
</div>

