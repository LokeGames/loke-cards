<script lang="ts">
  export let to: string = '/';
  export let baseClass: string = 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded block';
  export let activeClass: string = 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white';
  let currentPath: string = '';
  $: isActive = currentPath === to;
  $: className = `nav-item ${baseClass} ${isActive ? activeClass : ''}`;
  if (typeof window !== 'undefined') {
    currentPath = window.location.pathname;
  }
</script>

<a href={to} class={className}>
  <slot />
</a>
