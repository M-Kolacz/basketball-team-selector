import { z } from 'zod';
export var LoginSchema = z.object({
    username: z
        .string()
        .min(3, 'Username is required')
        .max(50, 'Username must be at most 50 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    redirectTo: z.string().optional(),
});
export var RegisterSchema = z
    .object({
    username: z
        .string()
        .min(1, 'Username is required')
        .max(50, 'Username must be at most 50 characters')
        .trim(),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password must be at most 100 characters'),
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
    redirectTo: z.string().optional(),
})
    .refine(function (data) { return data.password === data.confirmPassword; }, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});
export var LogoutSchema = z.object({
    redirectTo: z.string().optional(),
});
