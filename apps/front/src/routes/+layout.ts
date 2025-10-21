import { initDataApi } from '$lib/dataStore';

export const load = () => {
  // Initialize worker connection on app start
  if (typeof window !== 'undefined') initDataApi();
  return {};
};

