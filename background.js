chrome.runtime.onInstalled.addListener(() => {
  // Set default value when the extension is installed or reset
  chrome.storage.sync.set({ shortsBlocked: true }); // Set Shorts to be blocked by default
});
