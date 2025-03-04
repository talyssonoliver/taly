# microfrontend-app/microfrontend-app/shared/README.md

## Structure

- **components/**: Reusable UI components.
  - `Button.tsx`
  - `Modal.tsx`
- **hooks/**: Custom React hooks.
  - `useFetch.ts`
- **utils/**: Utility functions for API calls and common tasks.
  - `api.ts`
  - `helpers.ts`
- **styles/**: Theme and global styles.
  - `theme.ts`
  - `globals.css`

# Shared Components Library

This directory contains shared UI components, utilities, and styles that can be used across different microfrontend applications within the project.

## Components

- **Button**: A reusable button component that can be customized with different styles and functionalities.
- **Modal**: A reusable modal dialog component for displaying content in an overlay.

## Utilities

- **API**: Utility functions for making API calls, handling requests and responses.
- **Helpers**: General helper functions for various common tasks throughout the application.

## Styles

- **Theme**: Contains theme-related styles and constants to ensure consistent styling across all microfrontends.

## Usage

To use the shared components in your microfrontend applications, import them as follows:

```javascript
import { Button } from "shared/src/components/Button";
import { Modal } from "shared/src/components/Modal";
```

Make sure to include the shared library in your project's dependencies to access these components and utilities.
