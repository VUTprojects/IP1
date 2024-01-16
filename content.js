// Function to be executed in the context of the active tab to analyze page elements
function analyzePage() {
  // Example: Extract the title of the page
  const pageTitle = document.title;

  // Add additional logic to gather other relevant information from the page

  // Return the gathered information
  return {
    pageTitle: pageTitle,
    // Add other properties as needed
  };
}

// Listen for messages from the popup or other content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'executeAnalyzePage') {
    // Execute the analyzePage function in the context of the active tab
    chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      function: analyzePage,
    }, (result) => {
      // Result contains the output of the analyzePage function

      // Send the result back to the popup or other content scripts
      chrome.runtime.sendMessage({ action: 'analyzePageResult', result: result[0] });
    });
  } else if (request.action === 'displayHtmlOverlay') {
    // Create a div element to serve as the overlay
    const overlayDiv = document.createElement('div');

    // Style the overlay div to cover the entire viewport with a semi-transparent white background
    overlayDiv.style.position = 'fixed';
    overlayDiv.style.top = '0';
    overlayDiv.style.left = '0';
    overlayDiv.style.width = '100%';
    overlayDiv.style.height = '100%';
    overlayDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    overlayDiv.style.zIndex = '999999';

    // Set the content of the overlay div to the HTML response received in the message
    overlayDiv.innerHTML = request.htmlResponse;

    // Append the overlay div to the body of the current page
    document.body.appendChild(overlayDiv);

    // Close the overlay after 5 seconds (adjust as needed)
    setTimeout(() => {
      overlayDiv.remove();
    }, 5000);
  }
});
