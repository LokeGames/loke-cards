import './styles/main.css';
import localforage from 'localforage';

// Initialize LocalForage
localforage.config({
  name: 'loke-cards',
  storeName: 'scenes',
  description: 'Loke Cards scene storage'
});

console.log('Loke Cards initialized');
console.log('LocalForage ready:', localforage);

// Test message
const app = document.querySelector('#app main');
if (app) {
  app.innerHTML = `
    <div class="bg-white rounded-lg shadow-md p-6 mt-4">
      <h2 class="text-xl font-semibold mb-4 text-blue-600">Loke Cards Editor</h2>
      <p class="text-gray-700 mb-4">Development environment is ready!</p>
      <div class="bg-blue-50 border-l-4 border-blue-500 p-4">
        <p class="text-sm text-blue-800">
          <strong>Tech Stack:</strong><br>
          ✓ Vite<br>
          ✓ Tailwind CSS<br>
          ✓ LocalForage<br>
          ✓ PWA Support
        </p>
      </div>
    </div>
  `;
}
