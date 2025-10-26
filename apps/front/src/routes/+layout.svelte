<script lang="ts">
  import type { ComponentType } from 'svelte';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import '../app.css';
  import AppShell from '@loke/ui/components/AppShell.svelte';
  import AppHeader from '@loke/ui/components/AppHeader.svelte';
  import AppToasts from '@loke/ui/components/AppToasts.svelte';
  import ProjectDashboard from '@loke/ui/components/ProjectDashboard.svelte';
  import LoadingState from '@loke/ui/components/states/LoadingState.svelte';
  import SettingsIcon from '@loke/ui/icons/Settings.svelte';
  import ThemeToggleIcon from '$lib/components/ThemeToggleIcon.svelte';
  import { frontModules } from '$lib/front-modules';
  import { resolveModuleView, type FrontModuleDefinition } from '@loke/front-api';
  import { themePreference } from '@loke/ui';
  import { getCurrentProject, loadCurrentProject } from '@loke/shared/stores/project.svelte';

  const moduleNavItems = frontModules.map((module) => ({
    id: module.id,
    label: module.label,
    icon: module.icon,
    href: module.defaultPath ?? `/${module.id}`,
  }));

  const shellActions = [
    {
      id: 'toggle-theme',
      label: 'Toggle theme',
      icon: ThemeToggleIcon,
      onClick: () => themePreference.toggle(),
    },
    {
      id: 'settings',
      label: 'Open settings',
      icon: SettingsIcon,
      href: '/settings',
    },
  ];

  const activeModuleId = $derived.by<string | null>(() => {
    const pathname = $page.url.pathname;
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) {
      return null;
    }
    return segments[0];
  });

  const activeModuleDefinition = $derived.by<FrontModuleDefinition | null>(() => {
    return frontModules.find((module) => module.id === activeModuleId) ?? null;
  });

  let ActiveModuleComponent = $state<ComponentType | null>(null);
  let moduleLoading = $state(false);
  let moduleError = $state<string | null>(null);
  let requestToken = 0;

  const currentProject = $derived.by(() => getCurrentProject());
  const hasProject = $derived.by(() => currentProject !== null);

  onMount(async () => {
    await loadCurrentProject();
  });

  $effect(() => {
    requestToken += 1;
    const token = requestToken;
    const definition = activeModuleDefinition;

    if (!hasProject || !definition) {
      ActiveModuleComponent = null;
      moduleError = null;
      moduleLoading = false;
      return;
    }

    moduleLoading = true;
    moduleError = null;

    resolveModuleView(definition)
      .then((component) => {
        if (token !== requestToken) {
          return;
        }
        ActiveModuleComponent = component;
      })
      .catch((error) => {
        if (token !== requestToken) {
          return;
        }
        ActiveModuleComponent = null;
        moduleError = error instanceof Error ? error.message : String(error);
        console.error(`Failed to load front module "${definition.id}"`, error);
      })
      .finally(() => {
        if (token !== requestToken) {
          return;
        }
        moduleLoading = false;
      });
  });
</script>

<AppShell
  modules={moduleNavItems}
  actions={shellActions}
  activeModuleId={activeModuleId}
  navHidden={!hasProject}
>
  <svelte:fragment slot="header">
    <AppHeader title="Loke Cards" showProjectPicker={false} showThemeToggle={false} />
  </svelte:fragment>

  {#if !hasProject}
    <div class="flex h-full items-center justify-center p-6">
      <ProjectDashboard />
    </div>
  {:else if activeModuleDefinition}
    {#if moduleLoading}
      <div class="flex h-full items-center justify-center p-6">
        <LoadingState message="Loading module..." />
      </div>
    {:else if moduleError}
      <div class="flex h-full flex-col items-center justify-center gap-3 bg-red-50 p-6 text-center text-sm text-red-700 dark:bg-red-900/20 dark:text-red-200">
        <p class="font-medium">Something went wrong while loading this workspace.</p>
        <pre class="max-w-full overflow-auto rounded bg-red-100 px-3 py-2 text-xs text-red-700 dark:bg-red-900/40 dark:text-red-200">{moduleError}</pre>
      </div>
    {:else if ActiveModuleComponent}
      <ActiveModuleComponent />
    {:else}
      <div class="flex h-full items-center justify-center p-6 text-sm text-gray-500 dark:text-gray-400">
        <p>Select a module to begin.</p>
      </div>
    {/if}
  {:else}
    <div class="h-full overflow-auto p-6">
      <slot />
    </div>
  {/if}
</AppShell>

<AppToasts />
