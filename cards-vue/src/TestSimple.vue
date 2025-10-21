<template>
  <div class="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-8">
    <div class="max-w-4xl mx-auto">
      <!-- Simple test card -->
      <div class="bg-white rounded-lg shadow-xl p-8 mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Tailwind CSS Test
        </h1>
        <p class="text-xl text-gray-600 mb-6">
          Hvis du kan se denne tekst med korrekt styling, så virker Tailwind CSS!
        </p>

        <!-- Color test -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-red-500 text-white p-4 rounded">Rød</div>
          <div class="bg-green-500 text-white p-4 rounded">Grøn</div>
          <div class="bg-blue-500 text-white p-4 rounded">Blå</div>
        </div>

        <!-- Size test -->
        <div class="space-y-4">
          <div class="text-sm bg-gray-100 p-2 rounded">Small text</div>
          <div class="text-base bg-gray-200 p-3 rounded">Base text</div>
          <div class="text-lg bg-gray-300 p-4 rounded">Large text</div>
          <div class="text-xl bg-gray-400 p-5 rounded text-white">Extra large text</div>
        </div>
      </div>

      <!-- Responsive test -->
      <div class="bg-yellow-300 p-8 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold mb-4">Responsive Test</h2>
        <p class="mb-4">Ændre browser bredden og se grid ændre sig:</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-pink-500 text-white p-4 rounded text-center">1</div>
          <div class="bg-purple-500 text-white p-4 rounded text-center">2</div>
          <div class="bg-indigo-500 text-white p-4 rounded text-center">3</div>
          <div class="bg-blue-500 text-white p-4 rounded text-center">4</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Ingen logic nødvendig for denne test
</script>
