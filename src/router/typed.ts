export type RouteName =
  | 'Dashboard'
  | 'SceneList'
  | 'NewScene'
  | 'EditScene'
  | 'ChapterList'
  | 'NewChapter'
  | 'EditChapter'
  | 'Code'
  | 'Settings'
  | 'NotFound';

export function hasRequiredParams<N extends RouteName>(name: N, params: Record<string, unknown>): boolean {
  if (name === 'EditScene' || name === 'EditChapter') {
    return typeof params?.id === 'string' && params.id.length > 0;
  }
  return true;
}
