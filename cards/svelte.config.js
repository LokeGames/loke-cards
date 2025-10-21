import adapter from '@sveltejs/adapter-auto';

const config = {
  kit: {
    adapter: adapter(),
    alias: {
      '@shared': '../shared/src'
    }
  }
};

export default config;

