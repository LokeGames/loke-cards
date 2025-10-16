<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-blue-600 text-white shadow-lg">
      <div class="container mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-blue-500 rounded flex items-center justify-center">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
              <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div>
            <h1 class="text-xl font-bold">Loke Cards</h1>
            <p class="text-xs text-blue-200">Vue 3 + Tailwind CSS</p>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <span class="text-sm bg-green-500 px-3 py-1 rounded-full">Synced</span>
          <button class="md:hidden">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <!-- Welcome Card -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6 border-2 border-dashed border-gray-300">
          <h2 class="text-3xl font-bold text-gray-800 mb-4">Welcome to Loke Cards</h2>
          <p class="text-gray-600 mb-4">
            Interactive Fiction Scene Editor for Loke Engine
          </p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 class="font-semibold text-blue-900 mb-2">Scenes</h3>
              <p class="text-3xl font-bold text-blue-600">0</p>
            </div>
            <div class="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 class="font-semibold text-green-900 mb-2">Chapters</h3>
              <p class="text-3xl font-bold text-green-600">2</p>
            </div>
            <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 class="font-semibold text-purple-900 mb-2">Status</h3>
              <p class="text-lg font-semibold text-purple-600">Online</p>
            </div>
          </div>
        </div>

        <!-- Getting Started -->
        <div class="bg-white rounded-lg shadow-md p-6 border-2 border-dashed border-gray-300">
          <h3 class="text-xl font-bold text-gray-800 mb-4">Getting Started</h3>
          <ul class="space-y-2 text-gray-700">
            <li class="flex items-start">
              <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              Vue 3 with Composition API
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              Vite for lightning-fast hot reload
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              Tailwind CSS for fully responsive UI
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              Real-time C code generation
            </li>
          </ul>
        </div>

        <!-- Test Responsive Layout -->
        <div class="mt-6 bg-white rounded-lg shadow-md p-6 border-2 border-dashed border-yellow-300">
          <h3 class="text-xl font-bold text-gray-800 mb-4">Responsive Test</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-red-100 p-4 rounded border border-red-300 text-center">
              <p class="font-semibold">Mobile</p>
              <p class="text-sm text-gray-600">1 column</p>
            </div>
            <div class="bg-blue-100 p-4 rounded border border-blue-300 text-center">
              <p class="font-semibold">Tablet</p>
              <p class="text-sm text-gray-600">2 columns</p>
            </div>
            <div class="bg-green-100 p-4 rounded border border-green-300 text-center">
              <p class="font-semibold">Desktop</p>
              <p class="text-sm text-gray-600">4 columns</p>
            </div>
            <div class="bg-purple-100 p-4 rounded border border-purple-300 text-center">
              <p class="font-semibold">Wide</p>
              <p class="text-sm text-gray-600">4 columns</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Demo state
const synced = ref(true)
</script>

<style>
/* Global styles handled by Tailwind */
</style>
