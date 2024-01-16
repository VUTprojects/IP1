// Variables to store page title and active URL
var title = "";
var active_url = "";

// Wait for the DOM content to be fully loaded before executing the code
document.addEventListener('DOMContentLoaded', function () {
  // Select the button with the class 'sendRequest'
  var button = document.getElementsByClassName('sendRequest');

  // Add a click event listener to the button
  button[0].addEventListener('click', () => {
    // Query the currently active tab in the current window
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // Get the information of the active tab
      const activeTab = tabs[0];

      // Get the title and URL of the active tab
      title = getPageTitle(activeTab);
      active_url = getPageUrl(activeTab);

      // Execute a script in the active tab to get the text content of the entire page
      chrome.tabs.executeScript(
        activeTab.id,
        {
        code: `document.body.innerText`
        },
        // Callback function to handle the result of the executed script
        submit
      );
    });
  });
});

// Callback function to handle the result of the executed script
function submit(website) {
  // Log the retrieved website content
  console.log(website);

  // Prepare JSON data with page title, active URL, website content, and timestamp
  const jsonData = {
    pageTitle: title,
    url: active_url,
    data: website,
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
      // Handle the response if needed
      console.log('Response from server:', htmlResponse);
    })
    .catch(error => {
      console.error('Error sending or receiving POST request:', error);
    });
}

// Function to be executed in the context of the active tab to get the page title
function getPageTitle(tab) {
  return tab.title;
}

// Function to be executed in the context of the active tab to get the page URL
function getPageUrl(tab) {
  return tab.url;
}
