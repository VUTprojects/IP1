document.addEventListener('DOMContentLoaded', function() {
  var button = document.getElementsByClassName('sendRequest');

  button[0].addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];

      // Send a message to the content script to execute the analyzePage function
      chrome.tabs.sendMessage(activeTab.id, { action: 'executeAnalyzePage' });
    });
  });
});

// Content script (content.js)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzePageResult') {
    const result = request.result;

    // Prepare JSON data using the analyzed information
    const jsonData = {
      pageTitle: result.pageTitle,
      url: sender.tab.url,
      timestamp: new Date().toISOString(),
    };

    // Send a POST request to the specified URL with the gathered data
    fetch('http://localhost:80/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData),
    })
    .then(response => response.text())
    .then(htmlResponse => {
      // Receive the HTML response and display it as an overlay
      chrome.tabs.sendMessage(sender.tab.id, { action: 'displayHtmlOverlay', htmlResponse });
    })
    .catch(error => {
      console.error('Error sending or receiving POST request:', error);
    });
  }
});
