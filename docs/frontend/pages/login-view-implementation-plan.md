# View Implementation Plan: Login Page

## 1. Overview

The Login Page serves as the authentication entry point for the Basketball Team
Selector application. It provides a secure interface for both admin and regular
users to authenticate themselves using username and password credentials. Upon
successful authentication, users are redirected to the games list view. The view
prioritizes accessibility, security, and user experience with clear error
handling and loading states.

## 2. View Routing

**Path:** `/`

This is the root path of the application and serves as the default landing page
for unauthenticated users.

## 3. Component Structure

```
LoginPage (Server Component)
└── LoginForm (Client Component)
    ├── ApplicationHeader
    │   ├── Logo/Branding
    │   └── Title
    ├── LoginCard
    │   ├── UsernameInput (with Label)
    │   ├── PasswordInput (with Label)
    │   ├── ErrorMessage (conditional)
    │   ├── SubmitButton (with loading state)
    │   └── RegistrationLink
    └── Footer (optional)
```

## 4. Component Details

### LoginPage

- **Component description:** Server component that serves as the root page
  layout for the login route. It wraps the LoginForm client component and
  provides the main page structure.
- **Main elements:**
  - `<main>` container with centered layout styling
  - `LoginForm` client component
- **Handled interactions:** None (delegates to child components)
- **Handled validation:** None (delegates to child components)
- **Types:**
  - None specific (uses Next.js page component pattern)
- **Props:** None (Next.js page component)

### LoginForm

- **Component description:** Client component that manages the authentication
  form state, handles user input, and communicates with the login API endpoint.
  It provides real-time validation feedback and manages loading states during
  authentication.
- **Main elements:**
  - `<form>` element with `onSubmit` handler
  - Application branding section (heading/logo)
  - Two input fields (username and password) from shadcn/ui
  - Submit button with loading spinner
  - Error message display area
  - Link to registration page
- **Handled interactions:**
  - Form submission (preventDefault and API call)
  - Input field changes (controlled inputs)
  - Navigation to registration page
  - Focus management (auto-focus on username)
- **Handled validation:**
  - Username required: Must not be empty (client-side)
  - Password required: Must not be empty (client-side)
  - Minimum length validation: Username and password must have at least 1
    character
  - Real-time validation feedback on blur or submit attempt
  - API-level validation error display (401, 422 status codes)
- **Types:**
  - `LoginCommandDto` (request payload)
  - `LoginResponseDto` (response payload)
  - `LoginFormState` (component state interface)
  - `LoginFormErrors` (validation errors interface)
- **Props:** None (root form component)

### UsernameInput

- **Component description:** Controlled input component for username entry using
  shadcn/ui Input component. Includes label, auto-focus, and error state
  styling.
- **Main elements:**
  - `<Label>` component with htmlFor attribute
  - `<Input>` component from shadcn/ui
  - Error message text (conditional)
- **Handled interactions:**
  - `onChange` event for controlled input
  - `onBlur` event for validation trigger
  - Keyboard navigation (Tab, Enter)
- **Handled validation:**
  - Required field validation
  - Display error state styling when validation fails
- **Types:**
  - `InputProps` from shadcn/ui
  - `string` for value
  - `string | undefined` for error message
- **Props:**
  ```typescript
  {
    value: string
    onChange: (value: string) => void
    onBlur: () => void
    error?: string
    disabled?: boolean
  }
  ```

### PasswordInput

- **Component description:** Controlled input component for password entry with
  masked input and optional visibility toggle. Uses shadcn/ui Input component
  with type="password".
- **Main elements:**
  - `<Label>` component with htmlFor attribute
  - `<Input>` component from shadcn/ui with type="password"
  - Error message text (conditional)
  - Optional eye icon for password visibility toggle
- **Handled interactions:**
  - `onChange` event for controlled input
  - `onBlur` event for validation trigger
  - Keyboard navigation (Tab, Enter)
  - Password visibility toggle (optional)
- **Handled validation:**
  - Required field validation
  - Display error state styling when validation fails
- **Types:**
  - `InputProps` from shadcn/ui
  - `string` for value
  - `string | undefined` for error message
- **Props:**
  ```typescript
  {
    value: string
    onChange: (value: string) => void
    onBlur: () => void
    error?: string
    disabled?: boolean
  }
  ```

### ErrorMessage

- **Component description:** Reusable component for displaying authentication
  error messages with appropriate styling and ARIA attributes for accessibility.
- **Main elements:**
  - `<div>` or `<p>` container with error styling
  - Error icon (optional)
  - Error text content
- **Handled interactions:** None (display only)
- **Handled validation:** None (receives validated error message)
- **Types:**
  - `string` for error message
- **Props:**
  ```typescript
  {
    message: string
    variant?: 'field' | 'form'
  }
  ```

### SubmitButton

- **Component description:** Submit button component that shows loading state
  during authentication and is disabled when form is invalid or submitting. Uses
  shadcn/ui Button component.
- **Main elements:**
  - `<Button>` component from shadcn/ui
  - Loading spinner icon (conditional)
  - Button text ("Login" or "Logging in...")
- **Handled interactions:**
  - Click event (form submission)
  - Disabled state during loading
- **Handled validation:**
  - Disabled when form has validation errors
  - Disabled during API request
- **Types:**
  - `ButtonProps` from shadcn/ui
  - `boolean` for loading state
- **Props:**
  ```typescript
  {
  	isLoading: boolean
  	disabled: boolean
  }
  ```

### RegistrationLink

- **Component description:** Navigation link component that directs users to the
  registration page. Uses Next.js Link component for client-side navigation.
- **Main elements:**
  - `<Link>` component from next/link
  - Text content ("Create new account" or similar)
- **Handled interactions:**
  - Click event for navigation
  - Keyboard navigation (Enter, Space)
- **Handled validation:** None
- **Types:**
  - `LinkProps` from next/link
- **Props:**
  ```typescript
  {
  	href: string
  }
  ```

## 5. Types

### Existing DTOs (from dto.ts)

```typescript
export type LoginCommandDto = {
	username: string
	password: string
}

export type UserDto = Pick<User, 'id' | 'username' | 'role'>

export type LoginResponseDto = {
	user: UserDto
}
```

### New ViewModel Types

```typescript
export type LoginFormState = {
	username: string
	password: string
	isSubmitting: boolean
	errors: LoginFormErrors
}
```

**Field breakdown:**

- `username`: Current value of the username input field (string)
- `password`: Current value of the password input field (string)
- `isSubmitting`: Boolean flag indicating if authentication request is in
  progress
- `errors`: Object containing validation error messages for form fields

```typescript
export type LoginFormErrors = {
	username?: string
	password?: string
	form?: string
}
```

**Field breakdown:**

- `username`: Optional error message for username field validation
- `password`: Optional error message for password field validation
- `form`: Optional error message for general authentication errors (e.g.,
  invalid credentials, server errors)

```typescript
export type LoginFormProps = {
	onSuccess?: (user: UserDto) => void
	redirectUrl?: string
}
```

**Field breakdown:**

- `onSuccess`: Optional callback function executed after successful
  authentication
- `redirectUrl`: Optional URL to redirect to after successful login (defaults to
  '/games')

## 6. State Management

The login view uses local component state management with React hooks. No global
state management or custom hooks are required for the MVP implementation.

### State Variables

**In LoginForm component:**

1. **Form State** (using single state object or separate useState calls):

   ```typescript
   const [formState, setFormState] = useState<LoginFormState>({
   	username: '',
   	password: '',
   	isSubmitting: false,
   	errors: {},
   })
   ```

   OR (separate states):

   ```typescript
   const [username, setUsername] = useState('')
   const [password, setPassword] = useState('')
   const [isSubmitting, setIsSubmitting] = useState(false)
   const [errors, setErrors] = useState<LoginFormErrors>({})
   ```

### Optional Custom Hook (for code reusability)

If desired, a `useLoginForm` custom hook can be created to encapsulate form
logic:

```typescript
function useLoginForm() {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [errors, setErrors] = useState<LoginFormErrors>({})
	const router = useRouter()

	const validateForm = (): boolean => {
		const newErrors: LoginFormErrors = {}

		if (!username.trim()) {
			newErrors.username = 'Username is required'
		}

		if (!password.trim()) {
			newErrors.password = 'Password is required'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()

		if (!validateForm()) return

		setIsSubmitting(true)
		setErrors({})

		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password }),
			})

			if (!response.ok) {
				const errorData = await response.json()

				if (response.status === 401) {
					setErrors({ form: 'Invalid username or password' })
				} else if (response.status === 422) {
					setErrors({ form: 'Please fill in all required fields' })
				} else {
					setErrors({ form: 'An error occurred. Please try again.' })
				}

				return
			}

			const data: LoginResponseDto = await response.json()
			router.push('/games')
		} catch (error) {
			setErrors({ form: 'Network error. Please check your connection.' })
		} finally {
			setIsSubmitting(false)
		}
	}

	return {
		username,
		setUsername,
		password,
		setPassword,
		isSubmitting,
		errors,
		handleSubmit,
	}
}
```

## 7. API Integration

### Endpoint Details

**Endpoint:** `POST /api/auth/login`

**Request Type:** `LoginCommandDto`

```typescript
{
	username: string
	password: string
}
```

**Response Type:** `LoginResponseDto`

```typescript
{
	user: {
		id: string
		username: string
		role: 'admin' | 'user'
	}
}
```

### Integration Implementation

```typescript
async function loginUser(
	credentials: LoginCommandDto,
): Promise<LoginResponseDto> {
	const response = await fetch('/api/auth/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(credentials),
		credentials: 'include',
	})

	if (!response.ok) {
		throw new Error(`Login failed with status: ${response.status}`)
	}

	return response.json()
}
```

### Response Handling

- **200 OK:** Authentication successful, JWT token stored in HTTP-only cookie,
  redirect to `/games`
- **401 Unauthorized:** Display "Invalid username or password" error message
- **422 Unprocessable Entity:** Display "Please fill in all required fields"
  error message
- **Network Error:** Display "Network error. Please check your connection" error
  message
- **Other Errors:** Display generic "An error occurred. Please try again" error
  message

### Session Management

After successful authentication, the JWT token is automatically stored in an
HTTP-only cookie by the server. The frontend does not need to manually handle
token storage. Subsequent API requests will automatically include the cookie.

## 8. User Interactions

### Primary Interactions

1. **Page Load:**
   - Username input receives automatic focus
   - Form is in initial state (empty fields, no errors)
   - Submit button is enabled

2. **Username Input:**
   - User types username
   - Field updates in real-time (controlled input)
   - On blur: Field-level validation runs
   - If empty: Display "Username is required" error
   - Error clears when user starts typing again

3. **Password Input:**
   - User types password
   - Field displays masked characters (••••)
   - On blur: Field-level validation runs
   - If empty: Display "Password is required" error
   - Error clears when user starts typing again

4. **Form Submission:**
   - User clicks "Login" button or presses Enter in any field
   - Client-side validation runs
   - If validation fails: Display field errors, prevent submission
   - If validation passes:
     - Submit button shows loading state ("Logging in...")
     - Submit button becomes disabled
     - API request sent to `/api/auth/login`
     - On success: Redirect to `/games`
     - On failure: Display appropriate error message, re-enable form

5. **Registration Link:**
   - User clicks "Create new account" link
   - Client-side navigation to registration page
   - Current form state is lost (expected behavior)

6. **Keyboard Navigation:**
   - Tab: Move between username, password, submit button, and registration link
   - Shift+Tab: Move backwards
   - Enter: Submit form (from any field)
   - Space: Activate focused button or link

### Error Recovery

1. **Invalid Credentials (401):**
   - Display error message below form
   - Keep entered username (user can correct)
   - Clear password field (security best practice)
   - Focus returns to password field

2. **Validation Errors (422):**
   - Display field-specific errors inline
   - Form remains enabled for correction
   - First invalid field receives focus

3. **Network Errors:**
   - Display error message below form
   - Provide retry option (form remains filled)
   - Submit button re-enabled

## 9. Conditions and Validation

### Client-Side Validation Rules

#### Username Field

**Condition:** Username is required

- **When checked:** On form submission and on field blur
- **Error message:** "Username is required"
- **UI impact:** Red border on input, error text below field, submit button
  remains enabled
- **Component:** UsernameInput

#### Password Field

**Condition:** Password is required

- **When checked:** On form submission and on field blur
- **Error message:** "Password is required"
- **UI impact:** Red border on input, error text below field, submit button
  remains enabled
- **Component:** PasswordInput

#### Form-Level Validation

**Condition:** All fields must pass validation before submission

- **When checked:** On form submission (before API call)
- **UI impact:** Prevents API call, displays all field errors
- **Component:** LoginForm

### API-Level Validation

#### 401 Unauthorized

**Condition:** Invalid username/password combination

- **When returned:** After API call to `/api/auth/login`
- **Error message:** "Invalid username or password"
- **UI impact:** Error message displayed below form, password field cleared,
  focus on password field
- **Component:** LoginForm (ErrorMessage child)

#### 422 Unprocessable Entity

**Condition:** Missing required fields (server-side validation)

- **When returned:** After API call when required fields are missing
- **Error message:** "Please fill in all required fields"
- **UI impact:** Error message displayed below form
- **Component:** LoginForm (ErrorMessage child)

### Loading State Conditions

**Condition:** Form is submitting

- **When active:** From form submission until API response received
- **UI impact:**
  - Submit button shows loading spinner
  - Submit button disabled
  - Form inputs disabled (optional, prevents user confusion)
  - Registration link disabled (optional)
- **Components:** SubmitButton, LoginForm

### Accessibility Validation

**Condition:** Form must be keyboard navigable

- **Validation method:** Manual testing with Tab/Shift+Tab/Enter
- **Required elements:** All inputs, buttons, and links must be focusable
- **ARIA labels:** All form elements must have associated labels

**Condition:** Error messages must be announced to screen readers

- **Implementation:** Use `aria-live="polite"` on error message container
- **Impact:** Screen readers announce errors when they appear

## 10. Error Handling

### Client-Side Errors

#### Empty Form Submission

**Scenario:** User submits form with empty fields **Handling:**

- Prevent API call
- Display field-specific error messages
- Apply error styling to invalid fields
- Focus on first invalid field
- Do not disable form (allow correction)

#### Network Failure

**Scenario:** API request fails due to network issues **Handling:**

- Catch fetch errors in try-catch block
- Display user-friendly error: "Network error. Please check your connection."
- Re-enable submit button
- Keep form data intact for retry
- Log error to console for debugging

### Server-Side Errors

#### 401 Unauthorized

**Scenario:** Invalid credentials provided **Handling:**

- Display error message: "Invalid username or password"
- Clear password field for security
- Keep username field populated
- Focus on password field
- Re-enable form for retry

#### 422 Unprocessable Entity

**Scenario:** Server-side validation fails **Handling:**

- Parse error response for field-specific errors (if provided)
- Display generic message: "Please fill in all required fields"
- Keep form data intact
- Re-enable form for correction

#### 500 Internal Server Error

**Scenario:** Server error during authentication **Handling:**

- Display generic error: "An error occurred. Please try again."
- Keep form data intact
- Re-enable submit button
- Log error details to console

### Edge Cases

#### Session Already Exists

**Scenario:** User is already authenticated **Handling:**

- Implement middleware check in LoginPage
- If session exists, redirect to `/games` immediately
- Prevent unnecessary login attempt

#### Multiple Rapid Submissions

**Scenario:** User clicks submit button multiple times quickly **Handling:**

- Disable submit button immediately on first click
- Ignore subsequent clicks while `isSubmitting` is true
- Prevent multiple API calls

#### Redirect After Login

**Scenario:** User accesses login page from a protected route **Handling:**

- Accept optional `redirectUrl` query parameter
- After successful login, redirect to specified URL or default `/games`
- Example: `/?redirect=/games/123` redirects to `/games/123` after login

### User Feedback

All error messages should:

- Be clear and actionable
- Avoid technical jargon
- Be displayed prominently (red color, proper contrast)
- Include error icon for visual clarity
- Be announced to screen readers
- Persist until user takes corrective action

## 11. Implementation Steps

### Step 1: Create Type Definitions

Create or update type definition files for the login view:

1. Verify `LoginCommandDto` and `LoginResponseDto` exist in `src/types/dto.ts`
2. Create `src/types/login.ts` for view-specific types:
   - `LoginFormState`
   - `LoginFormErrors`
   - `LoginFormProps` (if needed)

### Step 2: Create LoginPage Server Component

1. Create `src/app/(auth)/login/page.tsx` (or `src/app/page.tsx` if root route)
2. Implement server component with centered layout
3. Add metadata for SEO (title, description)
4. Import and render LoginForm client component
5. Optional: Add middleware check for existing session

### Step 3: Create LoginForm Client Component

1. Create `src/components/auth/LoginForm.tsx` or
   `src/app/(auth)/login/LoginForm.tsx`
2. Add `"use client"` directive at top of file
3. Set up component state:
   - `username` state
   - `password` state
   - `isSubmitting` state
   - `errors` state
4. Implement form validation logic:
   - `validateField` function for individual field validation
   - `validateForm` function for full form validation
5. Implement `handleSubmit` function:
   - Prevent default form submission
   - Run validation
   - Handle API call
   - Handle response/errors
   - Redirect on success
6. Set up Next.js router for navigation (`useRouter` from `next/navigation`)

### Step 4: Implement Input Components

1. Create `UsernameInput` component:
   - Import shadcn/ui Label and Input components
   - Accept props: value, onChange, onBlur, error, disabled
   - Add auto-focus attribute
   - Apply error styling conditionally
   - Add ARIA attributes for accessibility
   - Render error message if present

2. Create `PasswordInput` component:
   - Similar structure to UsernameInput
   - Use `type="password"` for Input component
   - Optional: Add password visibility toggle
   - Apply error styling conditionally
   - Add ARIA attributes

### Step 5: Create Supporting Components

1. Create `ErrorMessage` component:
   - Accept message and variant props
   - Apply appropriate styling (red text, error icon)
   - Add `aria-live="polite"` for screen reader announcements
   - Add `role="alert"` for error regions

2. Create `SubmitButton` component:
   - Import shadcn/ui Button component
   - Accept `isLoading` and `disabled` props
   - Render loading spinner when `isLoading` is true
   - Change text based on loading state
   - Apply disabled styles appropriately

3. Create `RegistrationLink` component:
   - Import Next.js Link component
   - Link to registration route
   - Apply appropriate styling
   - Add ARIA label if needed

### Step 6: Implement API Integration

1. Create API utility function (optional):
   - Create `src/lib/api/auth.ts`
   - Implement `loginUser` function that handles fetch call
   - Export typed function

2. Or implement inline in LoginForm:
   - Use fetch API directly in `handleSubmit`
   - Set proper headers (Content-Type: application/json)
   - Set credentials: 'include' for cookie handling
   - Parse response as JSON
   - Handle different status codes

### Step 7: Style Components

1. Apply Tailwind CSS classes for layout:
   - Centered container for LoginPage
   - Card layout for LoginForm
   - Proper spacing and padding
   - Responsive design (mobile-first)

2. Style form elements:
   - Input field styling (border, focus states)
   - Error state styling (red borders, error text color)
   - Button styling (primary color, hover states, loading state)
   - Link styling

3. Ensure consistent design system:
   - Use design tokens from `globals.css`
   - Match shadcn/ui component styles
   - Ensure proper contrast ratios for accessibility

### Step 8: Implement Accessibility Features

1. Add ARIA attributes:
   - `aria-label` for form
   - `aria-describedby` for error messages
   - `aria-invalid` for invalid inputs
   - `aria-live` for dynamic error messages

2. Ensure keyboard navigation:
   - Test Tab/Shift+Tab navigation
   - Test Enter key form submission
   - Ensure focus visible styles
   - Proper focus order

3. Add proper HTML semantics:
   - Use `<form>` element
   - Associate labels with inputs using `htmlFor`
   - Use semantic button types
   - Use heading hierarchy properly
