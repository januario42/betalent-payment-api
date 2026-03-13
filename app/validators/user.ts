import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(2),
    email: vine.string().email(),
    password: vine.string().minLength(6),
    role: vine.enum(['admin', 'user']).optional(),
  })
)

export const updateUserValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(2).optional(),
    email: vine.string().email().optional(),
    password: vine.string().minLength(6).optional(),
    role: vine.enum(['admin', 'user']).optional(),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(6),
  })
)