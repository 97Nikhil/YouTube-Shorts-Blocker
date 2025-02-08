document.addEventListener("DOMContentLoaded", function () {
  let toggle = document.getElementById("toggleShorts");

  // Fetch saved state and set the toggle accordingly
  chrome.storage.sync.get("shortsBlocked", (data) => {
    toggle.checked = data.shortsBlocked || false;
  });

  // Toggle Shorts blocking when the switch is clicked
  toggle.addEventListener("change", function () {
    let newState = toggle.checked;

    // Save the new state in chrome storage
    chrome.storage.sync.set({ shortsBlocked: newState });

    // Send a message to content.js to update the block state
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) return;

      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          files: ["content.js"],
        },
        () => {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: "toggle",
            state: newState,
          });
        }
      );
    });
  });
});
