(function() {
  // Find the script tag that is being used to load this file
  const scriptUrl = document.currentScript.src;
  const urlParams = new URLSearchParams(scriptUrl.split('?')[1]);  // Get the query part of the URL
  const customerId = urlParams.get('id');

  if (customerId) {
      // Create the iframe for the chatbot
      const iframe = document.createElement('iframe');
      iframe.src = 'http://localhost:3000/chat/';
      iframe.style.position = 'fixed';
      iframe.style.bottom = '0';
      iframe.style.right = '0';
      iframe.style.width = '480px';
      iframe.style.height = '600px';
      iframe.style.border = 'none';
      iframe.style.display = 'block';  // Make iframe visible by default
      iframe.style.borderRadius = '10px 10px 0 0'; // Rounded top corners
      iframe.style.zIndex = '9999';   // Ensure it appears on top of other elements
      iframe.style.backgroundColor = 'transparent';

      // Append the iframe to the body
      document.body.appendChild(iframe);
  } else {
      console.error('Customer ID is not provided in the URL');
  }
})();