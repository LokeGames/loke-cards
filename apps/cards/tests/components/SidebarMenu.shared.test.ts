import { render } from '@testing-library/svelte';
import SidebarMenu from '../../../shared/src/lib/components/SidebarMenu.svelte';
import { currentProject } from '../../../shared/src/lib/stores/project.store';

test('renders nav links and project name', async () => {
  currentProject.set({ id: 'p1', name: 'Demo Project', chapters: [], sceneCount: 0, createdAt: 0, updatedAt: 0 });
  const { getByText } = render(SidebarMenu as any);
  expect(getByText('Dashboard')).toBeInTheDocument();
  expect(getByText('Scenes')).toBeInTheDocument();
  expect(getByText('Chapters')).toBeInTheDocument();
  expect(getByText('Story Map')).toBeInTheDocument();
  expect(getByText('C code')).toBeInTheDocument();
  expect(getByText('Settings')).toBeInTheDocument();
  expect(getByText('Demo Project')).toBeInTheDocument();
});

