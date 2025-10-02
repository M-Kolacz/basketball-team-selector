# Generate Storybook File

Generate a complete Storybook file for a UI component following the project's established patterns.

## Component Requirements

The component MUST follow the single source of truth pattern:

- Export variant/size style objects as plain objects (e.g., `variantStyles`, `sizeStyles`)
- These objects should contain the keys that define the available variants
- Use `class-variance-authority` (CVA) for variant management
- The CVA configuration should reference the exported style objects

## What to Generate

Create a `.stories.tsx` file that includes:

1. **Imports**:

   - Import the component and all exported style objects
   - Import necessary icons from `lucide-react` if needed
   - Import Storybook helpers: `disableControls`, `getObjectKeys`, `selectControl` from `#app/lib/storybook`
   - Import types: `Meta`, `StoryObj` from `@storybook/nextjs-vite`

2. **Extract Variant Keys**:

   - Use `getObjectKeys()` to extract keys from each style object
   - Example: `const buttonVariants = getObjectKeys(variantStyles);`

3. **Meta Configuration**:

   - Set `title` to "UI/{ComponentName}"
   - Set `parameters.layout` to "centered"
   - Add `tags: ["autodocs"]`
   - Configure `argTypes` using `selectControl()` for each variant prop

4. **Stories**:
   - **`All{PropName}`**: Create a story for each variant prop (e.g., `AllSizes`)
   - Use `disableControls()` to hide the control being demonstrated in each story
   - Wrap elements in a flex container with proper spacing

## Example Structure

```tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Component, variantStyles, sizeStyles } from "./component";
import { Icon } from "lucide-react";
import {
  disableControls,
  getObjectKeys,
  selectControl,
} from "#app/lib/storybook";

const variants = getObjectKeys(variantStyles);
const sizes = getObjectKeys(sizeStyles);

const meta = {
  title: "UI/Component",
  component: Component,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: selectControl(variants),
    size: selectControl(sizes),
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex gap-3 items-center">
      {variants.map((variant) => (
        <Component key={variant} {...args} variant={variant}>
          {variant}
        </Component>
      ))}
    </div>
  ),
  ...disableControls<typeof Component>("variant"),
};

export const AllSizes: Story = {
  render: (args) => (
    <div className="flex gap-3 items-center">
      {sizes.map((size) => (
        <Component key={size} size={size} {...args}>
          {size}
        </Component>
      ))}
    </div>
  ),
  ...disableControls("size"),
};
```

## Instructions

1. Read the component file to identify:

   - Component name
   - Exported style objects (e.g., `variantStyles`, `sizeStyles`)
   - Variant props defined in CVA

2. Verify single source of truth pattern:

   - Ensure style objects are exported
   - Confirm CVA references these objects

3. Generate the Storybook file with:

   - Proper imports including all style objects
   - Extracted keys for each variant prop
   - Meta configuration with select controls
   - Stories for each variant prop showing all options

4. Write the file as `{component-name}.stories.tsx` in the same directory as the component

## Validation

Before completing, verify:

- [ ] Component exports style objects
- [ ] All style objects are imported in the Storybook file
- [ ] `getObjectKeys()` is used to extract variant options
- [ ] Each variant prop has a corresponding `All{PropName}` story
- [ ] Stories use `.map()` to iterate over options
- [ ] Controls are properly disabled in each story
- [ ] File follows TypeScript and formatting conventions

---

**Usage**: `/generate-storybook [path-to-component]`

Example: `/generate-storybook src/components/ui/button.tsx`
