# Dependency Management Strategy

This document outlines the dependency management strategy for the Taly monorepo.

## Single Source of Truth

We use PNPM's overrides mechanism as a single source of truth for dependency versions throughout the monorepo. This ensures consistency across packages and reduces peer dependency conflicts.

## Key Components

### 1. Version Overrides

The root `package.json` contains overrides for key dependencies:

```json
"overrides": {
  "typescript": "^5.3.3",
  "@types/react": "^19.0.12",
  "eslint": "^9.0.0",
  // ...and more
}
```

### 2. Package Extensions

We use PNPM's package extensions to handle peer dependencies across the workspace:

```json
"packageExtensions": {
  "*": {
    "peerDependencies": {
      "typescript": "*",
      "react": "*"
    }
  },
  "@nestjs/*": {
    "peerDependencies": {
      "@nestjs/common": "*",
      "@nestjs/core": "*"
    }
  }
}
```

### 3. Automated Scripts

Two scripts help maintain dependency consistency:

- `sync-deps`: Removes redundant peer dependency declarations from workspace packages
- `update-deps`: Adds overrides for known deprecated packages

## Best Practices

1. **Adding Dependencies**:
   - Add dependencies to the workspace package that needs them
   - If it's a shared dependency, consider adding it to the overrides

2. **Updating Versions**:
   - Update the version in the root package.json's overrides section
   - Run `pnpm run clean:full` to apply changes

3. **Resolving Conflicts**:
   - Add package-specific extensions in the root package.json
   - Use wildcards (`*`) where possible for flexibility

## Examples

### Handling a New Peer Dependency

If package X requires peer dependency Y:

```json
"packageExtensions": {
  "package-x": {
    "peerDependencies": {
      "package-y": "*"
    }
  }
}
```

### Upgrading a Dependency

To upgrade typescript:

1. Update in overrides section:
```json
"overrides": {
  "typescript": "^5.4.0"
}
```

2. Run `pnpm run clean:full`

## Maintenance

Run `pnpm run clean:full` periodically to ensure all dependencies are properly synchronized across the monorepo.

## Troubleshooting

### Version Not Found Errors

If you encounter "No matching version found" errors:

1. Check available versions using:
   ```
   pnpm view package-name versions
   ```

2. Update the override to use an available version:
   ```json
   "overrides": {
     "problem-package": "^available.version.number"
   }
   ```

3. Run `pnpm install` again

### Handling Legacy Dependencies

Some deprecated packages don't have newer versions available. For these cases:

1. Consider finding an alternative package
2. Override to the latest available version
3. Document any technical debt related to using deprecated packages
