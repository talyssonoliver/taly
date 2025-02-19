# Experiments Directory - Purpose and Results

## Overview

The `experiments/` directory is dedicated to prototyping, testing, and validating new ideas and technologies for the Taly platform. It serves as a sandbox environment where concepts can be explored before integrating them into the main codebase.

---

## Purpose

1. **Validate New Technologies**: Evaluate the feasibility and performance of frameworks, libraries, and tools.
2. **Prototyping Features**: Quickly iterate on new features to assess their viability.
3. **Optimization Testing**: Experiment with methods to enhance performance, scalability, and efficiency.
4. **Knowledge Sharing**: Document findings to help the team make informed decisions for future implementations.

---

## Directory Structure

```
C:\taly\dir-taly\taly\experiments
├── poc-1/                    # Proof of Concept 1
├── poc-2/                    # Proof of Concept 2
└── README.md                 # Documentation for experiments
```

---

## How to Use

### **For Prototyping**

- Create a new subdirectory with a descriptive name (e.g., `poc-new-feature`).
- Include necessary files, scripts, and documentation in the directory.
- Use README files to outline:
  - The hypothesis being tested.
  - Steps to reproduce results.
  - Outcomes and insights.

### **For Technology Evaluations**

- Compare multiple tools by creating separate subdirectories.
- Document criteria such as:
  - Ease of use
  - Performance benchmarks
  - Compatibility with the Taly platform

### **For Sharing Results**

- Consolidate findings in a well-structured report.
- Include diagrams, metrics, or visualizations to support conclusions.

---

## Completed Experiments

### **Proof of Concept 1: Event Bus Integration**

- **Goal**: Test RabbitMQ vs. Kafka for asynchronous communication.
- **Outcome**: RabbitMQ was chosen for its simplicity and suitability for current scale.
- **Details**: See `experiments/poc-1/` for configuration and benchmarks.

### **Proof of Concept 2: Serverless Functions**

- **Goal**: Evaluate AWS Lambda for processing notifications.
- **Outcome**: AWS Lambda demonstrated cost efficiency but had limitations in cold start times.
- **Details**: See `experiments/poc-2/` for implementation notes.

---

## Guidelines

1. **Isolate Changes**: Ensure experiments do not interfere with the main codebase.
2. **Document Thoroughly**: Provide enough context for others to understand and reproduce your work.
3. **Collaborate**: Share your findings with the team during review meetings or via documentation.
4. **Retain Results**: Preserve valuable experiments for reference in future projects.

---

## Contact

For questions about experiments or suggestions for new ideas, reach out to:

- **Email**: experiments@taly.dev
- **Slack**: #experiments
