function removeShorts() {
  // Remove any Shorts-related content from YouTube feed
  document
    .querySelectorAll("ytd-rich-section-renderer")
    .forEach((el) => el.remove());
  document
    .querySelectorAll('a[href*="shorts"]')
    .forEach((el) => el.closest("ytd-grid-video-renderer")?.remove());
}

// Function to observe changes and dynamically remove Shorts
function observeChanges() {
  const observer = new MutationObserver(() => {
    chrome.storage.sync.get("shortsBlocked", (data) => {
      if (data.shortsBlocked) {
        removeShorts();
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// Check for stored value when the page loads and apply accordingly
chrome.storage.sync.get("shortsBlocked", (data) => {
  if (data.shortsBlocked) {
    removeShorts(); // Apply removal on page load
    observeChanges(); // Observe for further changes
  }
});

// Listen for toggle action from popup.js
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "toggle") {
    if (request.state) {
      removeShorts(); // Apply removal if enabled
      observeChanges(); // Start observing dynamically
    } else {
      location.reload(); // Refresh the page to restore Shorts
    }
  }
});
