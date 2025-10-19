# Server Action Implementation Plan: createPlayer

## 1. Server Action Overview

The `createPlayer` server action creates a new basketball player in the system.
This is an admin-only operation that validates player data, ensures uniqueness
constraints, and persists the player to the database. The action follows a
defensive security model by validating all inputs, enforcing authorization, and
returning type-safe responses.

## 2. Input Details

- **Function Name**: `createPlayer`
- **File Location**: `src/actions/players.ts`
- **Parameters**:
  - **Required**:
    - `name`: string (1-100 characters, trimmed)
    - `skillTier`: SkillTier enum ('S' | 'A' | 'B' | 'C' | 'D')
    - `positions`: Position[] array (min 1 item, each: 'PG' | 'SG' | 'SF' | 'PF'
      | 'C')

- **Input Validation**: Zod schema `CreatePlayerSchema` in
  `src/lib/validations/player.ts`

```typescript
export const CreatePlayerSchema = z.object({
	name: z
		.string()
		.min(1, 'Player name is required')
		.max(100, 'Player name must be at most 100 characters')
		.trim(),
	skillTier: z.enum(['S', 'A', 'B', 'C', 'D'], {
		message: 'Skill tier must be one of: S, A, B, C, D',
	}),
	positions: z
		.array(z.enum(['PG', 'SG', 'SF', 'PF', 'C']), {
			message: 'Position must be one of: PG, SG, SF, PF, C',
		})
		.min(1, 'At least one position is required'),
})
```

## 3. Used Types

**Existing DTOs** (from `src/types/dto.ts`):

- `CreatePlayerCommandDto` - Input command model
- `PlayerResponseDto` - Response DTO (alias for PlayerAdminDto)
- `SkillTier`, `Position` - Enums from db.server

**New Zod Schema** (to add to `src/lib/validations/player.ts`):

- `CreatePlayerSchema` - Input validation schema
- `CreatePlayerCommand` - Inferred type from schema

**Service Function** (to add to `src/services/player.service.ts`):

```typescript
export async function createPlayer(
	data: CreatePlayerCommandDto,
): Promise<PlayerAdminDto>
```

## 4. Output Details

**Success Response**:

```typescript
{
  success: true;
  player: {
    id: string;
    name: string;
    skillTier: SkillTier;
    positions: Position[];
    createdAt: Date;
    updatedAt: Date;
  }
}
```

**Error Response** (expected errors):

```typescript
{
  success: false;
  error: {
    code: 'UNAUTHORIZED' | 'VALIDATION_ERROR' | 'PLAYER_NAME_EXISTS';
    message: string;
    fields?: Record<string, string[]>; // For validation errors
  }
}
```

**Thrown Errors** (unexpected errors):

- Database connection errors
- Unexpected Prisma errors
- JWT verification errors

## 5. Data Flow

1. **Authentication Check**: Retrieve current user via `getCurrentUser()` from
   `auth.server.ts`
2. **Authorization Check**: Verify user exists and has `admin` role
3. **Input Validation**: Validate input against `CreatePlayerSchema` using Zod
4. **Service Call**: Invoke `createPlayer()` service function with validated
   data
5. **Database Operation**: Service uses Prisma to create player record
6. **Response Formation**: Return success response with player data
7. **Error Handling**: Catch and handle errors at each layer appropriately

```
Client → createPlayer (action)
  → getCurrentUser (auth check)
  → CreatePlayerSchema.parse (validation)
  → createPlayer (service)
    → prisma.player.create
  → Return success response
```

## 6. Security Considerations

1. **Authentication**: Must verify user is logged in via JWT session cookie
2. **Authorization**: Must enforce admin-only access (role check)
3. **Input Validation**:
   - Zod schema validates all inputs before processing
   - Name trimmed to prevent whitespace exploitation
   - Enum validation prevents invalid skill tiers and positions
   - Array length validation ensures at least one position
4. **SQL Injection Prevention**: Prisma ORM handles parameterization
5. **Unique Constraint**: Database-level unique constraint on player name
6. **Data Sanitization**: Trim whitespace from name field

## 7. Error Handling

| Error Scenario            | Error Code           | HTTP Equivalent | Message                      | Action                   |
| ------------------------- | -------------------- | --------------- | ---------------------------- | ------------------------ |
| User not authenticated    | `UNAUTHORIZED`       | 401             | "Authentication required"    | Return error             |
| User not admin            | `UNAUTHORIZED`       | 403             | "Insufficient permissions"   | Return error             |
| Invalid input data        | `VALIDATION_ERROR`   | 400             | Field-specific messages      | Return error with fields |
| Duplicate player name     | `PLAYER_NAME_EXISTS` | 409             | "Player name already exists" | Return error             |
| Database connection error | N/A                  | 500             | N/A                          | Throw error              |
| Unexpected Prisma error   | N/A                  | 500             | N/A                          | Throw error              |

**Error Detection Strategy**:

- Prisma unique constraint violation: Check for `error.code === 'P2002'` and
  `error.meta?.target?.includes('name')`
- Validation errors: Caught by Zod parse with field-level details
- Auth errors: Check user existence and role before proceeding

## 8. Performance Considerations

**Potential Bottlenecks**:

- Database write operation (single INSERT query)
- Unique constraint check on name field (already indexed by Prisma)

**Optimization Strategies**:

- Prisma automatically indexes unique fields (no manual optimization needed)
- Single database round-trip for creation
- No N+1 query issues (single record creation)
- Consider database connection pooling for high-traffic scenarios (already
  handled by Prisma)

**Performance Notes**:

- Expected operation time: <100ms under normal load
- No complex joins or aggregations required
- Triggers will auto-update `updated_at` timestamp (minimal overhead)

## 9. Implementation Steps

### Step 1: Create Zod Validation Schema

Add to `src/lib/validations/player.ts`:

```typescript
export const CreatePlayerSchema = z.object({
	name: z
		.string()
		.min(1, 'Player name is required')
		.max(100, 'Player name must be at most 100 characters')
		.trim(),
	skillTier: z.enum(['S', 'A', 'B', 'C', 'D'], {
		message: 'Skill tier must be one of: S, A, B, C, D',
	}),
	positions: z
		.array(z.enum(['PG', 'SG', 'SF', 'PF', 'C']), {
			message: 'Position must be one of: PG, SG, SF, PF, C',
		})
		.min(1, 'At least one position is required'),
})

export type CreatePlayerCommand = z.infer<typeof CreatePlayerSchema>
```

### Step 2: Add Service Function

Add to `src/services/player.service.ts`:

```typescript
export async function createPlayer(
	data: CreatePlayerCommandDto,
): Promise<PlayerAdminDto> {
	const player = await prisma.player.create({
		data: {
			name: data.name,
			skillTier: data.skillTier,
			positions: data.positions,
		},
		select: {
			id: true,
			name: true,
			skillTier: true,
			positions: true,
			createdAt: true,
			updatedAt: true,
		},
	})

	return player
}
```

### Step 3: Implement Server Action

Add to `src/actions/players.ts`:

```typescript
export async function createPlayer(
	name: string,
	skillTier: SkillTier,
	positions: Position[],
) {
	// 1. Authentication check
	const currentUser = await getCurrentUser()

	if (!currentUser) {
		return {
			success: false,
			error: {
				code: 'UNAUTHORIZED',
				message: 'Authentication required',
			},
		}
	}

	// 2. Authorization check
	if (currentUser.role !== 'admin') {
		return {
			success: false,
			error: {
				code: 'UNAUTHORIZED',
				message: 'Insufficient permissions',
			},
		}
	}

	// 3. Input validation
	const validationResult = CreatePlayerSchema.safeParse({
		name,
		skillTier,
		positions,
	})

	if (!validationResult.success) {
		const fieldErrors = validationResult.error.flatten().fieldErrors
		return {
			success: false,
			error: {
				code: 'VALIDATION_ERROR',
				message: 'Invalid player data',
				fields: fieldErrors,
			},
		}
	}

	// 4. Create player via service
	try {
		const player = await createPlayerService(validationResult.data)

		return {
			success: true,
			player,
		}
	} catch (error) {
		// Handle unique constraint violation
		if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
			return {
				success: false,
				error: {
					code: 'PLAYER_NAME_EXISTS',
					message: 'Player name already exists',
				},
			}
		}

		// Rethrow unexpected errors
		throw error
	}
}
```

### Step 4: Add Imports

Update imports in `src/actions/players.ts`:

```typescript
import { getCurrentUser } from '#app/services/auth.server'
import { createPlayer as createPlayerService } from '#app/services/player.service'
import { CreatePlayerSchema } from '#app/lib/validations/player'
import type { SkillTier, Position } from '#app/lib/db.server'
```

### Step 5: Update Service Imports

Update imports in `src/services/player.service.ts`:

```typescript
import type { CreatePlayerCommandDto, PlayerAdminDto } from '#app/types/dto'
```
