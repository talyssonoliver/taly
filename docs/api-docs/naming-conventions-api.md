# Naming Conventions for Taly Project

## Files

- **Singular nouns**: Use singular form for entities, DTOs, services, etc.
- **Kebab case**: Use kebab case for filenames (e.g., `user.entity.ts`, `create-user.dto.ts`)
- **Descriptive suffixes**: Include type suffixes (e.g., `.entity.ts`, `.dto.ts`, `.service.ts`)

## Classes

- **PascalCase**: Use PascalCase for class names
- **Descriptive prefixes/suffixes**: Include role in name (e.g., `UserService`, `CreateUserDto`)

## Methods

- **Camel case**: Use camelCase for method names
- **Verb prefixes**: Start with verb describing action (e.g., `findById`, `createUser`)
- **Consistent CRUD verbs**: Use `find`, `create`, `update`, `delete` (not `get`, `add`, etc.)

## Variables

- **Camel case**: Use camelCase for variable names
- **Descriptive names**: Avoid abbreviations unless very common (e.g., `id`, `dto`)
- **Boolean prefixes**: Use `is`, `has`, `should` for booleans (e.g., `isActive`, `hasPermission`)

## DTOs

- **Verb-noun format**: Use format like `CreateUserDto`, `UpdateClientDto`
- **Consistent with entities**: Fields should match entity names where possible
- **Required/optional**: Use TypeScript optional marker (`?`) for optional fields

## Interfaces

- **PascalCase**: Use PascalCase for interface names
- **No 'I' prefix**: Don't use 'I' prefix (e.g., use `User` not `IUser`)
- **Descriptive**: Names should clearly describe purpose

## Enums

- **PascalCase**: Use PascalCase for enum names
- **UPPER_SNAKE_CASE**: Use UPPER_SNAKE_CASE for enum values
- **Singular**: Use singular form for enum name (e.g., `UserRole` not `UserRoles`)

## Constants

- **UPPER_SNAKE_CASE**: Use UPPER_SNAKE_CASE for constant names
- **Group by purpose**: Group related constants in objects (e.g., `AUTH_CONSTANTS`)