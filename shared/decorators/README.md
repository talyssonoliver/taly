# Shared Decorators - Taly CRM

This directory contains reusable NestJS decorators that streamline and standardize common functionalities across the Taly CRM project. By using these decorators, developers can maintain clean, maintainable, and consistent code throughout the application.

## 📁 Directory Structure

```
shared/
├── decorators/
│   ├── auth-guard.decorator.ts       # Combines JWT and role-based guards for authentication
│   ├── pagination.decorator.ts       # Automatically extracts pagination parameters
│   ├── public-route.decorator.ts     # Marks a route as publicly accessible
│   ├── request-ip.decorator.ts       # Retrieves the client's IP address
│   ├── roles.decorator.ts            # Assigns role-based access control to routes
│   ├── user.decorator.ts             # Retrieves the current authenticated user
│   └── README.md                     # Documentation for shared decorators
```

## 🛠️ Available Decorators

### `@Authenticated()`

- **Purpose:** Applies both JWT and role-based guards to protect routes.
- **Example:**

```typescript
@Authenticated()
@Get('protected')
getProtectedData() {
    return 'This is a protected resource.';
}
```

### `@Roles()`

- **Purpose:** Restricts access to specific roles.
- **Example:**

```typescript
@Roles('ADMIN', 'COMPANY_OWNER')
@Get('admin-data')
getAdminData() {
    return 'Accessible only by admins and company owners.';
}
```

### `@PublicRoute()`

- **Purpose:** Marks a route as publicly accessible, bypassing authentication.
- **Example:**

```typescript
@PublicRoute()
@Get('public')
getPublicData() {
    return 'This is a public resource.';
}
```

### `@RequestIp()`

- **Purpose:** Retrieves the IP address of the request origin.
- **Example:**

```typescript
@Get('track')
trackUser(@RequestIp() ip: string) {
    return `User's IP address is ${ip}`;
}
```

### `@CurrentUser()`

- **Purpose:** Retrieves the currently authenticated user or a specific property of the user.
- **Example:**

```typescript
@Get('profile')
getProfile(@CurrentUser('email') email: string) {
    return `Your email is ${email}`;
}
```

### `@Pagination()`

- **Purpose:** Automatically extracts pagination parameters (`page`, `limit`) from the query string.
- **Example:**

```typescript
@Get('items')
getItems(@Pagination() { page, limit }: PaginationParams) {
    return `Fetching items on page ${page} with limit ${limit}`;
}
```

## 🚀 Best Practices

- **Use Decorators for Common Patterns:** Avoid repetitive code in controllers by leveraging custom decorators.
- **Centralize Authentication and Authorization:** The `@Authenticated()` and `@Roles()` decorators help enforce security consistently.
- **Validate Input Automatically:** The `@Pagination()` decorator ensures pagination parameters are always valid.

## 📚 Contributing to Decorators

- When creating new decorators, ensure they are well-documented and tested.
- Follow the existing pattern of using `SetMetadata`, `createParamDecorator`, and `applyDecorators` as needed.

For additional information or to contribute to the decorators, refer to the main Taly CRM project documentation or contact the development team.
