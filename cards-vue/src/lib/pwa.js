/**
 * PWA Install Prompt
 * Manages the PWA installation prompt.
 */

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI to notify the user they can install the PWA
  showInstallPromotion();
});

function showInstallPromotion() {
  const installButton = document.getElementById('pwa-install-button');
  if (installButton) {
    installButton.style.display = 'block';
  }
}

export function handleInstallPrompt() {
  if (!deferredPrompt) {
    return;
  }
  // Show the install prompt
  deferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    deferredPrompt = null;
  });
}

window.addEventListener('appinstalled', () => {
  // Hide the app-provided install promotion
  hideInstallPromotion();
  // Clear the deferredPrompt so it can be garbage collected
  deferredPrompt = null;
  // Optionally, send analytics event to indicate successful install
  console.log('PWA was installed');
});

function hideInstallPromotion() {
    const installButton = document.getElementById('pwa-install-button');
    if (installButton) {
        installButton.style.display = 'none';
    }
}
