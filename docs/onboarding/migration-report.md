# Dependency Migration Report

Generated on 29/03/2025

## Outdated Major Versions

### react: v18 → v19

Migration guide: [react v19 Migration](https://react.dev/blog/2024/04/25/react-19)

**React 19 Migration Notes:**

- Review the [React 19 release blog](https://react.dev/blog/2024/04/25/react-19)
- Update both react and react-dom packages together
- Check for deprecated lifecycle methods and update them
- Test thoroughly with React Developer Tools

**Affected files:**

- apps\booking\package.json (current: 18.2.0)
- apps\dashboard\package.json (current: 18.2.0)
- apps\payments\package.json (current: 18.2.0)
- apps\shared-ui\package.json (current: 18.2.0)

**Update command:**

```bash
pnpm add react@latest react-dom@latest
```

### react-dom: v18 → v19

**React 19 Migration Notes:**

- Review the [React 19 release blog](https://react.dev/blog/2024/04/25/react-19)
- Update both react and react-dom packages together
- Check for deprecated lifecycle methods and update them
- Test thoroughly with React Developer Tools

**Affected files:**

- apps\booking\package.json (current: 18.2.0)
- apps\dashboard\package.json (current: 18.2.0)
- apps\payments\package.json (current: 18.2.0)
- apps\shared-ui\package.json (current: 18.2.0)

**Update command:**

```bash
pnpm add react-dom@latest 
```

### jest: v27 → v29

Migration guide: [jest v29 Migration](https://jestjs.io/docs/29.0/upgrading-to-jest29)

**Jest Migration Notes:**

- Review the migration guide for breaking changes
- Update test configurations in jest.config.js
- Check for deprecated test APIs

**Affected files:**

- apps\dashboard\package.json (current: 27.0.6)

**Update command:**

```bash
pnpm add jest@latest 
```

## Update Strategy

1. Create a dedicated branch for dependency updates
2. Update one major package at a time
3. Run tests after each update
4. Fix breaking changes before moving to the next package
