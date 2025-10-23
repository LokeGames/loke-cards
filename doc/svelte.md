# Svelte Documentation

## Svelte Packages Overview

Svelte offers a comprehensive ecosystem of packages that work together to create modern web applications. Here's an overview of the key packages:

### Core Packages

#### **@sveltejs/kit**

The official SvelteKit framework - a full-stack web application framework built on Svelte.

- File-based routing
- Server-side rendering (SSR) and static site generation (SSG)
- API routes and form actions
- Built-in optimizations and progressive enhancement

#### **svelte**

The core Svelte compiler and runtime.

- Reactive programming model
- Component-based architecture
- Compile-time optimizations
- No virtual DOM - compiles to vanilla JavaScript

### Development Tools

#### **@sveltejs/vite-plugin**

Vite plugin for Svelte development.

- Hot module replacement (HMR)
- Preprocessing support (TypeScript, SCSS, etc.)
- Optimized builds

#### **svelte-check**

TypeScript type checker for Svelte components.

- Static analysis of Svelte files
- TypeScript integration
- IDE support with language server

### UI and Styling

#### **@sveltejs/package**

Tool for building Svelte component libraries.

- Package mode for component distribution
- TypeScript definitions generation
- Tree-shaking optimizations

#### **svelte-preprocess**

Preprocessor for Svelte components.

- TypeScript, SCSS/Sass, Less support
- PostCSS integration
- Custom preprocessing pipelines

### State Management

#### **svelte/store**

Built-in state management solution.

- Reactive stores (writable, readable, derived)
- Simple and lightweight
- Works seamlessly with Svelte's reactivity

#### **svelte/motion**

Animation and motion utilities.

- Tweened values
- Spring physics
- Smooth transitions

### Integration Packages

#### **@sveltejs/adapter-\***

Deployment adapters for various platforms:

- `adapter-static` - Static site generation
- `adapter-node` - Node.js server
- `adapter-vercel` - Vercel deployment
- `adapter-netlify` - Netlify deployment
- `adapter-cloudflare` - Cloudflare Workers

### Testing

#### **@sveltejs/kit/testing**

Testing utilities for SvelteKit applications.

- Component testing setup
- Routing test helpers
- Mock server utilities

### Key Benefits

1. **Performance**: Compile-time optimizations result in smaller bundles and faster runtime
2. **Developer Experience**: Intuitive syntax with less boilerplate
3. **Flexibility**: Works for SPAs, SSR, static sites, and hybrid applications
4. **TypeScript**: First-class TypeScript support
5. **Ecosystem**: Rich package ecosystem for various use cases

### Getting Started

```bash
# Create new SvelteKit project
npm create svelte@latest my-app
cd my-app
npm install
npm run dev
```

### Resources

- [Official Documentation](https://svelte.dev/docs)
- [SvelteKit Documentation](https://kit.svelte.dev)
- [Package Registry](https://www.npmjs.com/search?q=%40sveltejs)
- [Discord Community](https://svelte.dev/chat)
