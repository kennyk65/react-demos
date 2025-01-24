import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS globally

function App() {
  const [result, setResult] = useState('Ready...');

  // Create a callback function called handleApiCall
  const handleApiCall = async () => {
    try {
      const response = await fetch('/api/hello');
      const text = await response.text();
      setResult(response.ok ? `Response: ${text}` : `Error: ${response.status} - ${text}`);
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
  };

  return (
    <div className="container text-center mt-5 mx-auto">
      <h1>CloudFront Demo</h1>
      <p>Click the button to call the API Gateway resource.</p>
      <button id="callApiButton" className="btn btn-primary" onClick={handleApiCall}>
        Call /api/hello
      </button>
      <div id="result" className="mt-3 fs-5 text-muted">
        {result}
      </div>
    </div>
  );
}

export default App;