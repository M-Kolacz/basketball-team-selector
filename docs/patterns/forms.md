# Form Implementation Patterns

Complete form flow from client validation to server action to database.

## Overview

### Architecture

Forms use **Conform** + **Zod** + **Server Actions** pattern:

1. **Client**: Form validation, state management, UI feedback
2. **Validation**: Zod schemas define contract between client/server
3. **Server Action**: Async validation, auth checks, DB operations
4. **Database**: Prisma operations with transaction support

### Data Flow

```
User Input → Client Validation → Server Action → Async Validation → DB Operation → Redirect
            ↓                     ↓                ↓                  ↓
         onBlur/Input          parseWithZod    auth/uniqueness    create/update    success/error
```

### File Organization

```
src/
├── lib/
│   ├── validations/     # Zod schemas (player.ts, auth.ts, user.ts)
│   └── actions/         # Server actions (players.ts, auth.ts)
└── app/
    └── [feature]/
        └── components/  # Form components
```

## Example Flow: Login

Complete login form implementation across three layers:

- `src/lib/validations/auth.ts` - LoginSchema definition
- `src/lib/actions/auth.ts` - loginAction with async validation
- `src/app/(auth)/login/login-form.tsx` - Form setup (useForm + useActionState)