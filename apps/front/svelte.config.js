import { sveltekit } from '@sveltejs/kit/vite';
export default {
  kit: {
    adapter: undefined,
    vite: { plugins: [sveltekit()] },
  },
};

