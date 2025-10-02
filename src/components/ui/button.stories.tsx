import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./button";
import { Plus } from "lucide-react";
import { disableControls, selectControl } from "#app/lib/storybook";

const variants = [
  "default",
  "destructive",
  "outline",
  "secondary",
  "ghost",
  "link",
] as const;

const sizes = ["sm", "default", "lg", "icon"] as const;

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: selectControl(variants),
    size: selectControl(sizes),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex gap-3 items-center">
      {variants.map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
  ...disableControls<typeof Button>("variant"),
};

export const AllSizes: Story = {
  render: (args) => (
    <div className="flex gap-3 items-center">
      {sizes.map((size) => (
        <Button key={size} size={size} {...args}>
          {size === "icon" ? <Plus /> : size}
        </Button>
      ))}
    </div>
  ),
  ...disableControls("size"),
};
