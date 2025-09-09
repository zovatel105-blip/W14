import React, { useState } from 'react';

const TestConnection = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult('Testing...');
    
    try {
      console.log('Testing connection to:', process.env.REACT_APP_BACKEND_URL);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'test@test.com', password: 'test123456' }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (response.ok) {
        const data = await response.json();
        setResult(`SUCCESS: ${JSON.stringify(data, null, 2)}`);
      } else {
        const errorData = await response.text();
        setResult(`HTTP ERROR ${response.status}: ${errorData}`);
      }
      
    } catch (error) {
      console.error('Fetch error:', error);
      setResult(`NETWORK ERROR: ${error.name} - ${error.message}`);
    }
    
    setLoading(false);
  };

  const testSimpleEndpoint = async () => {
    setLoading(true);
    setResult('Testing simple endpoint...');
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/`);
      const data = await response.text();
      setResult(`Simple endpoint response: ${data}`);
    } catch (error) {
      setResult(`Simple endpoint error: ${error.message}`);
    }
    
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
      <h1>Connection Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <p><strong>REACT_APP_BACKEND_URL:</strong> {process.env.REACT_APP_BACKEND_URL || 'UNDEFINED'}</p>
        <p><strong>User Agent:</strong> {navigator.userAgent}</p>
        <p><strong>Location:</strong> {window.location.href}</p>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testConnection}
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            marginRight: '10px',
            backgroundColor: '#333', 
            color: '#fff', 
            border: 'none', 
            cursor: loading ? 'not-allowed' : 'pointer' 
          }}
        >
          {loading ? 'Testing...' : 'Test Login API'}
        </button>
        
        <button 
          onClick={testSimpleEndpoint}
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#333', 
            color: '#fff', 
            border: 'none', 
            cursor: loading ? 'not-allowed' : 'pointer' 
          }}
        >
          Test Root Endpoint
        </button>
      </div>
      
      <div style={{ 
        backgroundColor: '#111', 
        padding: '20px', 
        borderRadius: '5px',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        maxHeight: '400px',
        overflow: 'auto'
      }}>
        {result || 'Click a button to test connection...'}
      </div>
    </div>
  );
};

export default TestConnection;