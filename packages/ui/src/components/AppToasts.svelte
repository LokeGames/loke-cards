<script lang="ts">
  // Toast notifications component
  let toasts: Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }> = [];

  export function addToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    const id = Date.now().toString();
    toasts = [...toasts, { id, message, type }];
    
    setTimeout(() => {
      toasts = toasts.filter(t => t.id !== id);
    }, 3000);
  }
</script>

<div class="fixed bottom-4 right-4 z-50 space-y-2">
  {#each toasts as toast (toast.id)}
    <div 
      class="px-4 py-3 rounded-lg shadow-lg text-white transform transition-all duration-300 ease-in-out"
      class:bg-blue-500={toast.type === 'info'}
      class:bg-green-500={toast.type === 'success'}
      class:bg-red-500={toast.type === 'error'}
    >
      {toast.message}
    </div>
  {/each}
</div>