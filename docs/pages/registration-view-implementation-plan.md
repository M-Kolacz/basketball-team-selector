# View Implementation Plan: Registration Page

## 1. Overview

The Registration Page allows new users to create accounts in the Basketball Team
Selector application. The view provides a user registration form with real-time
validation, password strength feedback, and clear error messaging. Upon
successful registration, the user isredirected to login screen. The
implementation follows the existing authentication pattern established by the
login view and integrates with the POST /api/auth/register endpoint.

## 2. View Routing

**Path:** `/register`

**Access:** Public (unauthenticated users only)

**Redirect behavior:** After successful registration, users are redirected to
`/`

## 3. Component Structure

```
RegisterPage (app/register/page.tsx)
└── RegistrationForm (app/register/registration-form.tsx)
    ├── Card (shadcn/ui)
    │   ├── CardHeader
    │   │   ├── CardTitle
    │   │   └── CardDescription
    │   └── CardContent
    │       └── form
    │           ├── UsernameField
    │           │   ├── Label
    │           │   ├── Input
    │           │   └── ErrorMessage (conditional)
    │           ├── PasswordField
    │           │   ├── Label
    │           │   ├── Input
    │           │   ├── PasswordStrengthIndicator
    │           │   ├── PasswordRequirements
    │           │   └── ErrorMessage (conditional)
    │           ├── ConfirmPasswordField
    │           │   ├── Label
    │           │   ├── Input
    │           │   └── ErrorMessage (conditional)
    │           ├── FormError (conditional)
    │           ├── Button (submit)
    │           └── LoginLink
```

## 4. Component Details

### 4.1 RegisterPage

**Description:** Server component that serves as the route page for `/register`.
Acts as a container for the RegistrationForm component.

**Main elements:**

- Root `div` wrapper with centering layout classes
- RegistrationForm component

**Handled interactions:** None (delegated to RegistrationForm)

**Validation:** None

**Types:** None

**Props:** None (Next.js page component)

### 4.2 RegistrationForm

**Description:** Client component that handles the complete user registration
flow including form state management, validation, API integration, and user
feedback.

**Main elements:**

- Card component from shadcn/ui
- CardHeader with title "Create Account" and description
- CardContent containing the registration form
- Form element with three input fields (username, password, confirmPassword)
- Password strength indicator
- Password requirements list
- Submit button with loading state
- Link to login page

**Handled interactions:**

- Form submission
- Input field changes (username, password, confirmPassword)
- Input field blur events for validation
- Real-time password strength calculation
- Navigation to login page

**Validation:**

- Username: Required, max 50 characters, trimmed
- Password: Required, min 8 characters, max 100 characters
- Confirm Password: Required, must match password field
- Form-level validation before submission
- Field-level validation on blur and change

**Types:**

- `RegisterCommandDto` (request)
- `RegisterResponseDto` (response)
- `RegistrationFormErrors` (view model)
- `PasswordStrength` (view model)

**Props:** None (root client component)

### 4.3 UsernameField

**Description:** Composite component rendering the username input field with
label and error display. This is a logical grouping within RegistrationForm
rather than a separate component file.

**Main elements:**

- `div` wrapper with flex layout
- Label component with htmlFor="username"
- Input component (type="text")
- Conditional error message paragraph

**Handled interactions:**

- onChange: Updates username state, clears field error
- onBlur: Validates required field and max length

**Validation:**

- Required field check
- Maximum 50 characters
- Whitespace trimming

**Types:**

- `string` for value
- `RegistrationFormErrors['username']` for error

**Props:**

- value: string
- onChange: (value: string) => void
- onBlur: () => void
- error: string | undefined
- disabled: boolean

### 4.4 PasswordField

**Description:** Composite component rendering the password input field with
strength indicator, requirements list, and error display. This is a logical
grouping within RegistrationForm.

**Main elements:**

- `div` wrapper with flex layout
- Label component with htmlFor="password"
- Input component (type="password")
- PasswordStrengthIndicator component
- PasswordRequirements component
- Conditional error message paragraph

**Handled interactions:**

- onChange: Updates password state, calculates strength, clears field error
- onBlur: Validates minimum length requirement

**Validation:**

- Required field check
- Minimum 8 characters
- Maximum 100 characters
- Strength calculation for user feedback

**Types:**

- `string` for value
- `PasswordStrength` for strength indicator
- `RegistrationFormErrors['password']` for error

**Props:**

- value: string
- onChange: (value: string) => void
- onBlur: () => void
- error: string | undefined
- disabled: boolean
- strength: PasswordStrength

### 4.5 PasswordStrengthIndicator

**Description:** Visual component displaying password strength as a progress bar
with color coding and text label.

**Main elements:**

- `div` wrapper for the indicator container
- Progress bar `div` with dynamic width and color
- Text label showing strength level ("Weak", "Fair", "Good", "Strong")

**Handled interactions:** None (display only)

**Validation:** None

**Types:**

- `PasswordStrength` (props)

**Props:**

- strength: PasswordStrength

### 4.6 PasswordRequirements

**Description:** Component displaying password requirements as a checklist with
visual indicators for met/unmet criteria.

**Main elements:**

- `div` wrapper
- Heading: "Password must:"
- Unordered list with requirement items
- Visual indicators (checkmark/circle) per requirement

**Handled interactions:** None (display only)

**Validation:** None

**Types:**

- `string` for password value (props)
- `boolean` for each requirement check

**Props:**

- password: string
- isVisible: boolean

### 4.7 ConfirmPasswordField

**Description:** Composite component rendering the password confirmation field
with label and error display. This is a logical grouping within
RegistrationForm.

**Main elements:**

- `div` wrapper with flex layout
- Label component with htmlFor="confirmPassword"
- Input component (type="password")
- Conditional error message paragraph

**Handled interactions:**

- onChange: Updates confirmPassword state, clears field error
- onBlur: Validates password match

**Validation:**

- Required field check
- Must match password field

**Types:**

- `string` for value
- `RegistrationFormErrors['confirmPassword']` for error

**Props:**

- value: string
- passwordValue: string
- onChange: (value: string) => void
- onBlur: () => void
- error: string | undefined
- disabled: boolean

### 4.8 FormError

**Description:** Component displaying form-level error messages (e.g., network
errors, server errors).

**Main elements:**

- `div` wrapper with destructive background styling
- Error message text

**Handled interactions:** None (display only)

**Validation:** None

**Types:**

- `string` for error message

**Props:**

- message: string

### 4.9 Button (Submit)

**Description:** Primary action button from shadcn/ui for form submission with
loading state.

**Main elements:**

- Button component with type="submit"
- Dynamic text content based on submission state

**Handled interactions:**

- Click triggers form submission

**Validation:** Disabled during submission or when form is invalid

**Types:** Standard button props from shadcn/ui

**Props:**

- type: "submit"
- disabled: boolean
- className: string

### 4.10 LoginLink

**Description:** Navigation link directing existing users to the login page.

**Main elements:**

- `div` wrapper with text centering
- Descriptive text
- Next.js Link component to `/login`

**Handled interactions:**

- Click navigates to login page

**Validation:** None

**Types:** Standard Link props from Next.js

**Props:**

- href: "/login"

## 5. Types

### 5.1 Existing DTOs (from src/types/dto.ts)

**RegisterCommandDto**

```typescript
{
	username: string
	password: string
	confirmPassword: string
}
```

Used as the request payload for POST /api/auth/register.

**RegisterResponseDto**

```typescript
{
	user: UserDto
}
```

Received from POST /api/auth/register on successful registration.

**UserDto**

```typescript
Pick<User, 'id' | 'username' | 'role'>
{
	id: string
	username: string
	role: UserRole
}
```

Represents the authenticated user data returned after registration.

### 5.2 New View Models (to be created in src/types/registration.ts)

**RegistrationFormState**

```typescript
{
	username: string
	password: string
	confirmPassword: string
	isSubmitting: boolean
	errors: RegistrationFormErrors
	passwordStrength: PasswordStrength
}
```

Represents the complete state of the registration form including all field
values, submission status, validation errors, and password strength calculation.

**RegistrationFormErrors**

```typescript
{
  username?: string
  password?: string
  confirmPassword?: string
  form?: string
}
```

Contains error messages for each field and form-level errors. All fields are
optional and only present when there's an error.

- `username`: Validation errors for username field
- `password`: Validation errors for password field
- `confirmPassword`: Validation errors for confirm password field
- `form`: General form errors (network, server errors, duplicate username)

**PasswordStrength**

```typescript
{
	score: 0 | 1 | 2 | 3 | 4
	label: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong'
	color: 'red' | 'orange' | 'yellow' | 'blue' | 'green'
	percentage: number
}
```

Represents password strength calculation results for visual feedback.

- `score`: Numeric strength score from 0 (very weak) to 4 (strong)
- `label`: Human-readable strength description
- `color`: Color code for visual indicator
- `percentage`: Percentage value for progress bar (0-100)

**PasswordRequirementCheck**

```typescript
{
	minLength: boolean
	hasUpperCase: boolean
	hasLowerCase: boolean
	hasNumber: boolean
	hasSpecialChar: boolean
}
```

Boolean flags indicating which password requirements are met. Used for
displaying requirement checklist.

**RegistrationFormProps**

```typescript
{
  onSuccess?: (user: UserDto) => void
  redirectUrl?: string
}
```

Optional props for customizing registration form behavior (for future
extensibility).

- `onSuccess`: Optional callback after successful registration
- `redirectUrl`: Optional custom redirect URL (default: '/games')

## 6. State Management

The registration view uses local component state managed with React's `useState`
hook. No custom hooks or external state management libraries are required for
the MVP.

### State Variables

**Form Fields:**

- `username: string` - Stores the username input value
- `password: string` - Stores the password input value
- `confirmPassword: string` - Stores the password confirmation input value

**UI State:**

- `isSubmitting: boolean` - Tracks form submission status, used to disable
  inputs and show loading state
- `errors: RegistrationFormErrors` - Stores validation error messages for each
  field and form-level errors

**Password Feedback:**

- `passwordStrength: PasswordStrength` - Calculated password strength for visual
  feedback

### State Updates

**Field Updates:** Each input field has an onChange handler that updates its
corresponding state variable and clears any existing error for that field.

**Validation Updates:** Errors are set during blur events (field-level
validation) and before form submission (complete form validation).

**Submission Flow:**

1. User triggers form submission
2. Set `isSubmitting = true`
3. Clear all errors
4. Perform form validation
5. If valid, make API call
6. On success: redirect to `/games`
7. On error: populate `errors` object with appropriate messages
8. Set `isSubmitting = false`

**Password Strength:** Calculated on every password change using a helper
function that evaluates length, character variety, and complexity. The result
updates the `passwordStrength` state immediately.

## 7. API Integration

### Endpoint

**POST** `/api/auth/register`

**Request Type:** `RegisterCommandDto`

```typescript
{
	username: string
	password: string
	confirmPassword: string
}
```

**Response Type:** `RegisterResponseDto`

```typescript
{
	user: UserDto
}
```

### Implementation

**Request Configuration:**

```typescript
fetch('/api/auth/register', {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({
		username,
		password,
		confirmPassword,
	} satisfies RegisterCommandDto),
	credentials: 'include',
})
```

The `credentials: 'include'` option ensures that the JWT token cookie set by the
server is properly stored by the browser.

### Response Handling

**201 Created (Success):**

- Parse response body as `RegisterResponseDto`
- Extract user data from response
- Redirect to `/games` using Next.js router
- JWT token automatically stored in cookie by browser

**409 Conflict (Username Exists):**

- Set form-level error: "Username already exists. Please choose a different
  username."
- Clear password fields for security
- Keep username field populated

**422 Unprocessable Entity (Validation Error):**

- Parse error response to extract field-specific errors
- Populate `errors` state with field-specific messages
- Common validation errors:
  - Password too short (< 8 characters)
  - Passwords don't match
  - Username too long (> 50 characters)
  - Missing required fields

**Network Errors:**

- Catch fetch exceptions
- Set form-level error: "Network error. Please check your connection."

**Other Errors (500, etc.):**

- Set form-level error: "An error occurred. Please try again."

### Error Response Structure

For 422 errors, the API may return field-specific errors. The frontend should
map these to the appropriate fields in the `RegistrationFormErrors` object.

## 8. User Interactions

### 8.1 Page Load

**User Action:** User navigates to `/register`

**System Response:**

- Render empty registration form
- Auto-focus on username field
- Display password requirements (collapsed or minimized initially)

### 8.2 Username Input

**User Action:** User types in username field

**System Response:**

- Update username state on each keystroke
- Clear username error if present
- Trim whitespace from input value

**User Action:** User leaves username field (blur)

**System Response:**

- Validate username is not empty
- Validate username length (max 50 characters)
- Display error message if validation fails

### 8.3 Password Input

**User Action:** User types in password field

**System Response:**

- Update password state on each keystroke
- Calculate password strength in real-time
- Update PasswordStrengthIndicator visual display
- Update PasswordRequirements checklist
- Clear password error if present

**User Action:** User leaves password field (blur)

**System Response:**

- Validate password meets minimum length (8 characters)
- Display error message if validation fails
- Show password requirements if not met

### 8.4 Confirm Password Input

**User Action:** User types in confirm password field

**System Response:**

- Update confirmPassword state on each keystroke
- Clear confirmPassword error if present
- Optionally show real-time match indicator

**User Action:** User leaves confirm password field (blur)

**System Response:**

- Validate confirmPassword matches password
- Display error message if passwords don't match

### 8.5 Form Submission

**User Action:** User clicks "Create Account" button

**System Response:**

1. Prevent default form submission
2. Validate all fields
3. If validation fails:
   - Display all field errors
   - Keep form enabled
   - Focus on first error field
4. If validation passes:
   - Disable all inputs
   - Change button text to "Creating account..."
   - Send API request
   - Handle response (see API Integration section)

### 8.6 Successful Registration

**User Action:** API returns 201 Created

**System Response:**

- Show success message or loading indicator (optional)
- Redirect to `/games` using router.push()
- JWT token stored in cookie automatically

### 8.7 Registration Error

**User Action:** API returns error status

**System Response:**

- Re-enable form inputs
- Display appropriate error message
- For 409 (duplicate username):
  - Clear password fields
  - Focus on username field
- For 422 (validation error):
  - Show field-specific errors
  - Focus on first invalid field
- For network/server errors:
  - Show general error message
  - Keep all field values

### 8.8 Navigate to Login

**User Action:** User clicks "Already have an account? Login" link

**System Response:**

- Navigate to `/login` using Next.js Link
- No form data preserved

## 9. Conditions and Validation

### 9.1 Username Field Validation

**Condition:** Required field

- **Check:** `username.trim().length > 0`
- **When:** On blur, before submission
- **Error message:** "Username is required"
- **UI impact:** Red border on input, error text below field

**Condition:** Maximum length

- **Check:** `username.length <= 50`
- **When:** On blur, before submission
- **Error message:** "Username must be at most 50 characters"
- **UI impact:** Red border on input, error text below field

**Condition:** Trimmed value

- **Check:** Whitespace removed before submission
- **When:** On change, before submission
- **Implementation:** `username.trim()` in API payload

### 9.2 Password Field Validation

**Condition:** Required field

- **Check:** `password.length > 0`
- **When:** On blur, before submission
- **Error message:** "Password is required"
- **UI impact:** Red border on input, error text below field

**Condition:** Minimum length

- **Check:** `password.length >= 8`
- **When:** On blur, before submission
- **Error message:** "Password must be at least 8 characters"
- **UI impact:** Red border on input, error text below field, red indicator in
  requirements

**Condition:** Maximum length

- **Check:** `password.length <= 100`
- **When:** Before submission
- **Error message:** "Password must be at most 100 characters"
- **UI impact:** Red border on input, error text below field

### 9.3 Password Strength Calculation (Advisory, Not Blocking)

**Condition:** Minimum length (8+ characters)

- **Check:** `password.length >= 8`
- **Impact:** +1 to strength score, green checkmark in requirements

**Condition:** Contains uppercase letter

- **Check:** `/[A-Z]/.test(password)`
- **Impact:** +1 to strength score, suggestion in requirements

**Condition:** Contains lowercase letter

- **Check:** `/[a-z]/.test(password)`
- **Impact:** +1 to strength score, suggestion in requirements

**Condition:** Contains number

- **Check:** `/[0-9]/.test(password)`
- **Impact:** +1 to strength score, suggestion in requirements

**Condition:** Contains special character

- **Check:** `/[!@#$%^&*(),.?":{}|<>]/.test(password)`
- **Impact:** +1 to strength score, suggestion in requirements

**Strength Scoring:**

- 0-1 criteria met: Very Weak (red, 20%)
- 2 criteria met: Weak (orange, 40%)
- 3 criteria met: Fair (yellow, 60%)
- 4 criteria met: Good (blue, 80%)
- 5 criteria met: Strong (green, 100%)

### 9.4 Confirm Password Field Validation

**Condition:** Required field

- **Check:** `confirmPassword.length > 0`
- **When:** On blur, before submission
- **Error message:** "Password confirmation is required"
- **UI impact:** Red border on input, error text below field

**Condition:** Passwords match

- **Check:** `password === confirmPassword`
- **When:** On blur, before submission
- **Error message:** "Passwords do not match"
- **UI impact:** Red border on input, error text below field

### 9.5 Form-Level Validation

**Condition:** All fields valid

- **Check:** No errors in `RegistrationFormErrors` object
- **When:** Before submission
- **Impact:** Allow API call if true, block if false

**Condition:** Not currently submitting

- **Check:** `isSubmitting === false`
- **When:** Form submission attempt
- **Impact:** Disable submit button and inputs when true

### 9.6 Server-Side Validation (API Response)

**Condition:** Username availability

- **Check:** Performed by server
- **Response:** 409 Conflict if username exists
- **Error message:** "Username already exists. Please choose a different
  username."
- **UI impact:** Form-level error, password fields cleared

**Condition:** Server-side field validation

- **Check:** Performed by server (Zod schema)
- **Response:** 422 Unprocessable Entity with field errors
- **Error messages:** Field-specific messages from server
- **UI impact:** Display errors on respective fields

### 9.7 UI State Conditions

**Condition:** Submit button disabled

- **Check:** `isSubmitting === true`
- **When:** During API call
- **UI impact:** Button disabled, text shows "Creating account..."

**Condition:** Input fields disabled

- **Check:** `isSubmitting === true`
- **When:** During API call
- **UI impact:** All inputs disabled to prevent changes during submission

**Condition:** Error display

- **Check:** `errors[fieldName] !== undefined`
- **When:** After validation fails
- **UI impact:** Show error message, apply error styling to input

**Condition:** Password requirements visibility

- **Check:** `password.length > 0`
- **When:** User starts typing password
- **UI impact:** Show/expand password requirements list

## 10. Error Handling

### 10.1 Client-Side Validation Errors

**Scenario:** Empty username

- **Trigger:** User submits form without entering username or blur with empty
  field
- **Handling:** Display "Username is required" below username field
- **Recovery:** User enters username, error clears on change

**Scenario:** Username too long

- **Trigger:** User enters > 50 characters and blurs field
- **Handling:** Display "Username must be at most 50 characters"
- **Recovery:** User shortens username, error clears on change

**Scenario:** Empty password

- **Trigger:** User submits form without entering password or blur with empty
  field
- **Handling:** Display "Password is required" below password field
- **Recovery:** User enters password, error clears on change

**Scenario:** Password too short

- **Trigger:** User enters < 8 characters and blurs field or submits
- **Handling:** Display "Password must be at least 8 characters"
- **Recovery:** User adds more characters, error clears on change

**Scenario:** Empty confirm password

- **Trigger:** User submits form without confirming password or blur with empty
  field
- **Handling:** Display "Password confirmation is required" below confirm
  password field
- **Recovery:** User enters confirmation, error clears on change

**Scenario:** Passwords don't match

- **Trigger:** User enters different values in password and confirm password
  fields
- **Handling:** Display "Passwords do not match" below confirm password field
- **Recovery:** User corrects confirm password, error clears on change

### 10.2 Server-Side Validation Errors (422)

**Scenario:** Username already exists

- **HTTP Status:** 409 Conflict
- **Handling:**
  - Display form-level error: "Username already exists. Please choose a
    different username."
  - Clear password and confirmPassword fields for security
  - Keep username field populated
  - Focus username field
- **Recovery:** User enters different username and resubmits

**Scenario:** Server-side validation failure

- **HTTP Status:** 422 Unprocessable Entity
- **Handling:**
  - Parse error response for field-specific errors
  - Map server errors to form fields
  - Display errors on respective fields
  - Common server validations:
    - Username format/length
    - Password requirements
    - Password mismatch
- **Recovery:** User corrects invalid fields and resubmits

### 10.3 Network Errors

**Scenario:** Network request fails

- **Trigger:** Fetch throws exception (no network, CORS, timeout)
- **Handling:**
  - Catch exception in try/catch block
  - Display form-level error: "Network error. Please check your connection."
  - Keep all form data populated
  - Re-enable form inputs
- **Recovery:** User checks connection and retries submission

**Scenario:** Request timeout

- **Trigger:** Server doesn't respond within reasonable time
- **Handling:**
  - Display form-level error: "Request timed out. Please try again."
  - Re-enable form inputs
- **Recovery:** User retries submission

### 10.4 Server Errors (500)

**Scenario:** Internal server error

- **HTTP Status:** 500 Internal Server Error
- **Handling:**
  - Display form-level error: "An error occurred. Please try again."
  - Keep all form data populated
  - Re-enable form inputs
  - Consider logging error to monitoring service
- **Recovery:** User retries submission

### 10.5 Authentication State Errors

**Scenario:** User already authenticated

- **Trigger:** Authenticated user navigates to `/register`
- **Handling:** Redirect to `/games` (implement in layout or page component)
- **Implementation:** Check auth state in page component, redirect if
  authenticated

### 10.6 Edge Cases

**Scenario:** Rapid form submissions

- **Trigger:** User clicks submit button multiple times
- **Handling:**
  - Disable submit button immediately on first click
  - Ignore subsequent clicks while `isSubmitting === true`
- **Prevention:** Button disabled state controlled by `isSubmitting`

**Scenario:** Browser autofill

- **Trigger:** Browser fills username/password from saved credentials
- **Handling:**
  - Form should work normally with autofilled values
  - Validate on submission
  - No special handling required

**Scenario:** Copy/paste passwords

- **Trigger:** User pastes password into fields
- **Handling:**
  - Allow paste operations
  - Calculate password strength on pasted value
  - Validate match on submit

**Scenario:** Special characters in username

- **Trigger:** User enters special characters in username
- **Handling:**
  - Allow all characters (server validates acceptable characters)
  - Trim whitespace only
  - Let server return validation error if characters not allowed

### 10.7 Error Message Display

**Field Errors:**

- Display below the relevant input field
- Use red color (destructive variant)
- Include `role="alert"` for screen readers
- Link to input with `aria-describedby`

**Form-Level Errors:**

- Display above submit button
- Use destructive background styling
- Include `role="alert"` and `aria-live="polite"`
- Clear on next submission attempt

**Error Persistence:**

- Field errors: Clear on input change
- Form errors: Clear on next submit attempt
- All errors: Clear on successful submission

## 11. Implementation Steps

### Step 1: Create Type Definitions

1. Create `src/types/registration.ts` file
2. Define `RegistrationFormState` type
3. Define `RegistrationFormErrors` type
4. Define `PasswordStrength` type
5. Define `PasswordRequirementCheck` type
6. Define `RegistrationFormProps` type (for future extensibility)
7. Export all types

### Step 2: Create Utility Functions

1. Create `src/lib/password-strength.ts` file
2. Implement `calculatePasswordStrength(password: string): PasswordStrength`
   - Check length (>= 8 characters)
   - Check for uppercase letters
   - Check for lowercase letters
   - Check for numbers
   - Check for special characters
   - Calculate score and return strength object
3. Implement
   `checkPasswordRequirements(password: string): PasswordRequirementCheck`
   - Return boolean flags for each requirement
4. Export utility functions

### Step 3: Create PasswordStrengthIndicator Component

1. Create component in `RegistrationForm` file or separate file if preferred
2. Accept `strength: PasswordStrength` as prop
3. Render progress bar with dynamic width based on `strength.percentage`
4. Apply color based on `strength.color`
5. Display `strength.label` text
6. Style with Tailwind CSS classes

### Step 4: Create PasswordRequirements Component

1. Create component in `RegistrationForm` file or separate file if preferred
2. Accept `password: string` and `isVisible: boolean` as props
3. Use `checkPasswordRequirements` utility to get requirement status
4. Render list of requirements with checkmark/circle icons
5. Apply conditional styling (green checkmark if met, gray circle if not)
6. Show/hide based on `isVisible` prop

### Step 5: Create RegistrationForm Component Structure

1. Create `src/app/register/registration-form.tsx` file
2. Mark as 'use client'
3. Import necessary dependencies:
   - React hooks (useState)
   - Next.js router (useRouter)
   - shadcn/ui components (Button, Input, Label, Card)
   - Type definitions
   - Utility functions
4. Define component skeleton with Card structure
5. Add form element with onSubmit handler

### Step 6: Implement Form State Management

1. Initialize state variables with `useState`:
   - `username = ''`
   - `password = ''`
   - `confirmPassword = ''`
   - `isSubmitting = false`
   - `errors = {}`
   - `passwordStrength = calculatePasswordStrength('')`
2. Create `useRouter` hook instance

### Step 7: Implement Validation Logic

1. Create `validateForm(): boolean` function
   - Check username required and length
   - Check password required and length
   - Check confirmPassword required and match
   - Return true if no errors, false otherwise
   - Update `errors` state with validation results
2. Create field-level validation helpers
   - `validateUsername()` for blur events
   - `validatePassword()` for blur events
   - `validateConfirmPassword()` for blur events

### Step 8: Implement Input Handlers

1. Create `handleUsernameChange(value: string)` function
   - Update username state
   - Clear username error if present
2. Create `handlePasswordChange(value: string)` function
   - Update password state
   - Calculate and update password strength
   - Clear password error if present
3. Create `handleConfirmPasswordChange(value: string)` function
   - Update confirmPassword state
   - Clear confirmPassword error if present
4. Create blur handlers for each field

### Step 9: Implement Form Submission

1. Create `handleSubmit(e: FormEvent)` async function
2. Prevent default form submission
3. Run form validation, return early if invalid
4. Set `isSubmitting = true`
5. Clear errors
6. Make fetch request to `/api/auth/register` with proper headers and
   credentials
7. Handle response based on status code:
   - 201: Parse response, redirect to `/games`
   - 409: Set form error for duplicate username, clear passwords
   - 422: Parse and set field-specific errors
   - Other: Set generic form error
8. Catch network errors and set error message
9. Set `isSubmitting = false` in finally block

### Step 10: Build Form UI - Username Field

1. Create wrapper div with flex layout
2. Add Label component with "Username" text and htmlFor="username"
3. Add Input component:
   - Set type="text"
   - Set id="username"
   - Bind value to username state
   - Set onChange to handleUsernameChange
   - Set onBlur to validateUsername
   - Set disabled based on isSubmitting
   - Set aria-invalid based on error presence
   - Set aria-describedby if error exists
   - Set autoFocus
4. Add conditional error message paragraph
   - Show if `errors.username` exists
   - Include role="alert"
   - Use destructive text color

### Step 11: Build Form UI - Password Field

1. Create wrapper div with flex layout
2. Add Label component with "Password" text and htmlFor="password"
3. Add Input component:
   - Set type="password"
   - Set id="password"
   - Bind value to password state
   - Set onChange to handlePasswordChange
   - Set onBlur to validatePassword
   - Set disabled based on isSubmitting
   - Set aria-invalid and aria-describedby
4. Add PasswordStrengthIndicator component
   - Pass passwordStrength state
   - Conditionally show if password.length > 0
5. Add PasswordRequirements component
   - Pass password state
   - Conditionally show if password.length > 0
6. Add conditional error message paragraph

### Step 12: Build Form UI - Confirm Password Field

1. Create wrapper div with flex layout
2. Add Label component with "Confirm Password" text and
   htmlFor="confirmPassword"
3. Add Input component:
   - Set type="password"
   - Set id="confirmPassword"
   - Bind value to confirmPassword state
   - Set onChange to handleConfirmPasswordChange
   - Set onBlur to validateConfirmPassword
   - Set disabled based on isSubmitting
   - Set aria-invalid and aria-describedby
4. Add conditional error message paragraph

### Step 13: Build Form UI - Form Error and Submit Button

1. Add conditional form-level error display
   - Show if `errors.form` exists
   - Use destructive background styling
   - Include role="alert" and aria-live="polite"
2. Add Button component:
   - Set type="submit"
   - Set disabled based on isSubmitting
   - Set className for full width
   - Show "Creating account..." text when submitting, "Create Account" otherwise

### Step 14: Build Form UI - Login Link

1. Create wrapper div with centered text
2. Add descriptive text: "Already have an account?"
3. Add Next.js Link component:
   - Set href="/login"
   - Apply primary color and underline styling
   - Text: "Login"

### Step 15: Create Register Page Component

1. Create `src/app/register/page.tsx` file
2. Create server component (default)
3. Add centered layout wrapper div
4. Import and render RegistrationForm component
5. Export as default

### Step 16: Update Login Page with Register Link

1. Open `src/app/login-form.tsx`
2. Verify Link to `/register` exists (based on code review, it already exists at
   lines 176-182)
3. No changes needed if link already present
