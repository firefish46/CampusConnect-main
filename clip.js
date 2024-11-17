// Add event listener for "Generate Code" button
document.getElementById('generateCodeButton').addEventListener('click', function() {
    const textCode = document.getElementById('textCode').value;
    const pasteText = document.getElementById('pasteArea').value;
  
    if (!textCode || !pasteText) {
      alert('Please enter both a code and some text!');
      return;
    }
  
    // Generate a unique code based on the input text and code
    const uniqueCode = generateUniqueCode(textCode, pasteText);
  
    // Display the generated code
    document.getElementById('generatedCode').value = uniqueCode;
  });
  
  // Function to generate a unique code
  function generateUniqueCode(code, text) {
    const hash = Math.abs(text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 10000;
    const timestamp = new Date().getTime();
    return `${code}-${hash}-${timestamp}`;
  }
  
  // Add event listener for "Find Code" button
  document.getElementById('findCodeButton').addEventListener('click', function() {
    const codeToFind = document.getElementById('textCode').value;
    
    if (!codeToFind) {
      alert('Please enter a code to find the text!');
      return;
    }
  
    // Simulate finding the text associated with the code
    const foundText = findTextByCode(codeToFind);
    
    if (foundText) {
      // Display found text
      document.getElementById('foundTextArea').innerText = `Found Text: ${foundText}`;
    } else {
      document.getElementById('foundTextArea').innerText = 'No text found for this code.';
    }
  });
  
  // Simulate a text retrieval system (this would ideally be replaced with a database or localStorage)
  function findTextByCode(code) {
    // Example: This would look up the code from a database or local storage
    // For now, we just simulate by checking the entered code
    const storedText = {
      "text001": "Sample text data for text001",
      "text002": "Another example of pasted text"
    };
  
    return storedText[code] || null;  // If the code exists, return the associated text; otherwise, null
  }