# Performance Testing

This directory contains performance tests for the application. These tests are designed to measure and track the performance of critical components and operations.

## Types of Tests

We conduct two main types of performance tests:

1.  **Load Testing:** Simulates expected user load to measure response times, throughput, and resource utilization under normal conditions.  This helps us understand how the system behaves with the anticipated number of concurrent users and requests.

2.  **Stress Testing:** Pushes the system beyond its expected limits to identify breaking points and bottlenecks.  This helps us understand the maximum capacity of the system and how it degrades under extreme load.

## Tools

We primarily use [**k6**](https://k6.io/) for performance testing. k6 is a modern, open-source load testing tool that allows us to write performance tests as code (JavaScript).  It provides excellent features for simulating realistic user traffic and analyzing results.

**Why k6?**

*   **Developer-Friendly:** Tests are written in JavaScript, making it easy for developers to create and maintain them.
*   **Performance:** k6 is designed for high performance and can simulate thousands of virtual users.
*   **Flexibility:** Supports various protocols (HTTP/S, WebSockets, gRPC) and provides APIs for custom metrics and checks.
*   **Integration:** Integrates well with CI/CD pipelines (GitHub Actions) and monitoring tools (Grafana, Prometheus).


## Running Performance Tests

To run all performance tests:

```
npm run test:performance
```

To run a specific performance test:

```
npm run test:performance -- --test=<test-name>
```

## Directory Structure

tests/
└── performance/
├── load-testing/ # Load test scripts
│ ├── auth-load-test.yml # Load test for authentication
│ ├── booking-load-test.yml # Load test for booking functionality
│ ├── payment-load-test.yml # Load test for payment processing
│ └── notification-load-test.yml # Load test for notification service
├── stress-testing/ # Stress test scripts
│ ├── auth-stress-test.yml # Stress test for authentication
│ ├── booking-stress-test.yml # Stress test for booking functionality
│ ├── payment-stress-test.yml# Stress test for payment processing
│ └── notification-stress-test.yml # Stress test for the notification service
└── README.md # This file

## Test Structure

Each performance test should follow this structure:

1. **Setup**: Prepare the test environment
2. **Execution**: Run the operation being measured multiple times
3. **Measurement**: Collect timing and resource usage data
4. **Reporting**: Generate and save performance metrics

## Adding New Performance Tests

Create a new file named `<feature>-performance.test.js` and follow the template below:

```javascript
const { performance } = require('perf_hooks');
const { reportPerformanceMetrics } = require('../utils/performance-utils');

describe('Feature Performance', () => {
  it('should perform operation efficiently', async () => {
    // Setup
    
    // Measure
    const startTime = performance.now();
    
    // Execute operation
    
    const endTime = performance.now();
    
    // Report
    reportPerformanceMetrics('operation-name', endTime - startTime);
    
    // Assertions
    expect(endTime - startTime).toBeLessThan(PERFORMANCE_THRESHOLD);
  });
});
```

## Performance Thresholds

| Operation | Acceptable (ms) | Warning (ms) | Critical (ms) |
|-----------|----------------|-------------|--------------|
| Page Load | < 300          | 300-500     | > 500        |
| API Request | < 100        | 100-200     | > 200        |
| Data Processing | < 50     | 50-100      | > 100        |

## CI/CD Integration

Performance tests run automatically in the CI pipeline. Tests that exceed the critical threshold will cause the build to fail.

## Performance History

Performance metrics are stored in `performance-history.json` and can be visualized using:

```
npm run visualize:performance
```

## Troubleshooting

If your performance tests are failing or showing inconsistent results:

1. Ensure you're running in a clean environment
2. Check for background processes consuming resources
3. Run tests multiple times to establish a baseline
4. Review recent code changes that might impact performance

Each subdirectory contains YAML files that define k6 test configurations. These files specify the target URLs, virtual users (VUs), duration, and other test parameters.  The actual test logic (making requests, checking responses) is written in JavaScript within these YAML files (using k6's scripting capabilities).

## Running Tests

**Prerequisites:**

*   **k6:** Install k6 following the instructions on the [official website](https://k6.io/docs/get-started/installation/).
*   **Running System:** The tests assume that the Taly platform (or the specific service you are testing) is running and accessible. You might run these tests against a locally running instance, a staging environment, or even a production environment (with *extreme* caution).

**To run a load test:**

```bash
k6 run tests/performance/load-testing/auth-load-test.yml
```
To run a stress test:
    
    ```bash
    k6 run tests/performance/stress-testing/auth-stress-test.yml
    ```
    
Important Notes:

Environment Variables: You might need to set environment variables before running the tests, such as API_BASE_URL to point to the correct backend endpoint.

Configuration: The YAML files contain k6 configuration options. You should adjust the vus (virtual users) and duration parameters to simulate different load scenarios. You may also need to configure stages for more complex ramp-up/ramp-down patterns.

Output: k6 provides detailed output to the console, including metrics like request duration, error rate, and requests per second. It can also output results in various formats (JSON, CSV) for further analysis.

Cloud Execution: For large-scale tests, consider running k6 in the cloud using k6 Cloud or a similar service. This allows you to simulate a much larger number of users.

Example k6 Test (auth-load-test.yml - Conceptual):

```yaml

# NOTE: This is a YAML file with embedded JavaScript for k6.
#       This is NOT a standard k6 test script.
#       A real k6 test would be a .js file.
#       This illustrates the CONCEPT of how we might organize the tests.
config:
  scenarios:
    login_scenario:
      executor: 'ramping-vus'  # Gradually increase VUs
      stages:
        - duration: '30s'
          target: 20        # Start with 20 VUs
        - duration: '1m'
          target: 50        # Ramp up to 50 VUs over 1 minute
        - duration: '30s'
          target: 50         # Maintain 50 VUs
        - duration: '30s'
          target: 0       # Ramp down to 0
      env: # Environment variables for the test scenario
         BASE_URL: "http://localhost:4000"
      exec: loginFlow

options:
  # Global thresholds - fail the test if these are exceeded
  thresholds:
    http_req_failed: ['rate<0.01']   # Fail if >1% of requests fail
    http_req_duration: ['p(95)<500']  # Fail if 95th percentile response time > 500ms

# Javascript code for the test.
script: |
  import http from 'k6/http';
  import { check, sleep } from 'k6';

  export function loginFlow() {
    const url = `${__ENV.BASE_URL}/api/auth/login`;  // Use environment variable
    const payload = JSON.stringify({
      email: 'testuser@example.com',
      password: 'password123',
    });
    const params = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = http.post(url, payload, params);

    check(res, {
      'is status 200': (r) => r.status === 200,
      'is token present': (r) => r.json() && r.json().token, //check token exist in response
    });

    sleep(1); // Simulate user think time
  }

  // You could define other functions here for different user flows (e.g., register, logout)

Explanation of the Example:

config: Defines the test scenarios. Here, we have one scenario: login_scenario.

executor: ramping-vus means the number of virtual users (VUs) will change over time, as defined in stages.

stages: This defines a ramp-up, steady state, and ramp-down pattern for the VUs. This is much more realistic than just hitting the server with a constant load.

env: Defines environment variables that can be accessed within the test script (using __ENV). This is crucial for making your tests configurable and avoiding hardcoding URLs.

exec: Specifies the JavaScript function that will be executed by the VUs.

options: Defines global test options, including thresholds.

thresholds: These define performance criteria that, if violated, will cause the test to fail. In this example:

http_req_failed: The rate of failed HTTP requests must be less than 1%.

http_req_duration: The 95th percentile of HTTP request duration must be less than 500ms.

script: This is the actual JavaScript code that k6 will execute. It's important to:

Import http and check: These are k6 modules.

Define loginFlow: This function is what each VU will execute.

Use __ENV.BASE_URL: Access environment variables.

Use check: This is how you assert that the responses are correct. If a check fails, it's recorded as a failure.

Use sleep: Simulate realistic user behavior by adding pauses ("think time") between requests.

To use this example:

Create a file named auth-load-test.yml (or similar) in the tests/performance/load-testing directory.

Copy and paste the content into the file.

Adapt the script:

Change the BASE_URL to point to your running backend.

Modify the payload to use valid user credentials for your test environment.

Adjust the stages to match your desired load profile.

Consider adding more checks to validate the response content.

Run the test: k6 run tests/performance/load-testing/auth-load-test.yml

This structure gives you a solid foundation for performance testing. You can create similar YAML files for other services and user flows, adjusting the URLs, payloads, and checks accordingly.