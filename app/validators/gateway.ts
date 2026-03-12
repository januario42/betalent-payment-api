import vine from '@vinejs/vine'

export const updatePriorityValidator = vine.compile(
  vine.object({
    priority: vine.number().positive(),
  })
)