import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';

const IntegrationTest = () => {
  const [testResults, setTestResults] = useState({
    health: null,
    ping: null,
    connection: null,
    dataSubmission: null,
    auth: null
  });
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    const results = { health: null, ping: null, connection: null, dataSubmission: null, auth: null };

    // Test 1: Health Check
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      results.health = { success: true, data };
    } catch (error) {
      results.health = { success: false, error: error.message };
    }

    // Test 2: Ping
    try {
      const response = await fetch('/api/health/ping');
      const data = await response.json();
      results.ping = { success: true, data };
    } catch (error) {
      results.ping = { success: false, error: error.message };
    }

    // Test 3: Connection Test
    try {
      const data = await apiService.testConnection();
      results.connection = { success: true, data };
    } catch (error) {
      results.connection = { success: false, error: error.message };
    }

    // Test 4: Data Submission Test
    try {
      const testData = { message: 'Hello from frontend!', timestamp: Date.now() };
      const data = await apiService.testDataSubmission(testData);
      results.dataSubmission = { success: true, data };
    } catch (error) {
      results.dataSubmission = { success: false, error: error.message };
    }

    // Test 5: Auth Test (try to get users without token)
    try {
      const response = await fetch('/api/users');
      results.auth = { 
        success: response.status === 401, // Should be unauthorized
        status: response.status,
        message: response.status === 401 ? 'Auth protection working' : 'Auth protection failed'
      };
    } catch (error) {
      results.auth = { success: false, error: error.message };
    }

    setTestResults(results);
    setIsRunning(false);
  };

  const TestResult = ({ title, result }) => {
    if (!result) return null;

    return (
      <div className="card mb-2">
        <div className="card-body p-3">
          <h6 className="card-title d-flex align-items-center">
            {result.success ? (
              <i className="fas fa-check-circle text-success me-2"></i>
            ) : (
              <i className="fas fa-times-circle text-danger me-2"></i>
            )}
            {title}
          </h6>
          {result.data && (
            <pre className="small text-muted mb-0" style={{fontSize: '0.75rem'}}>
              {JSON.stringify(result.data, null, 2)}
            </pre>
          )}
          {result.error && (
            <p className="text-danger small mb-0">Error: {result.error}</p>
          )}
          {result.message && (
            <p className="text-info small mb-0">{result.message}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Frontend-Backend Integration Test</h5>
            </div>
            <div className="card-body">
              <div className="alert alert-info">
                <strong>Test Purpose:</strong> Verify that frontend changes are properly saved to the backend database.
              </div>
              
              <button 
                className="btn btn-primary mb-3"
                onClick={runTests}
                disabled={isRunning}
              >
                {isRunning ? (
                  <>
                    <i className="fas fa-spinner fa-spin me-2"></i>
                    Running Tests...
                  </>
                ) : (
                  <>
                    <i className="fas fa-play me-2"></i>
                    Run Integration Tests
                  </>
                )}
              </button>

              <div className="row">
                <div className="col-md-6">
                  <TestResult title="1. Health Check" result={testResults.health} />
                  <TestResult title="2. Ping Test" result={testResults.ping} />
                  <TestResult title="3. Connection Test" result={testResults.connection} />
                </div>
                <div className="col-md-6">
                  <TestResult title="4. Data Submission" result={testResults.dataSubmission} />
                  <TestResult title="5. Auth Protection" result={testResults.auth} />
                </div>
              </div>

              {Object.values(testResults).some(r => r !== null) && (
                <div className="alert alert-success mt-3">
                  <strong>Integration Status:</strong>
                  <ul className="mb-0 mt-2">
                    <li><strong>Health Check:</strong> Tests basic backend connectivity</li>
                    <li><strong>Ping Test:</strong> Tests API response time</li>
                    <li><strong>Connection Test:</strong> Tests custom API endpoints</li>
                    <li><strong>Data Submission:</strong> Tests frontend → backend data flow</li>
                    <li><strong>Auth Protection:</strong> Verifies JWT authentication is working</li>
                  </ul>
                  <hr />
                  <p className="mb-0">
                    <strong>Next Steps:</strong> If all tests pass, your frontend changes will be saved to the MySQL database.
                    Try registering a new user or adding a property to see the integration in action!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationTest;