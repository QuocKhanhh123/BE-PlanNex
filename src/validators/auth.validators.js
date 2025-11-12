const { z } = require('zod');


const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    fullName: z.string().min(1),
    phone: z.string().min(8).max(20).optional()
});


const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});

const updateProfileSchema = z.object({
    fullName: z.string().min(1).optional(),
    phone: z.string().min(8).max(20).optional().nullable(),
    avatar: z.string().url().optional().nullable(),
    description: z.string().max(500).optional().nullable()
});

module.exports = { registerSchema, loginSchema, updateProfileSchema };