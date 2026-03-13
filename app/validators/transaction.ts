import vine from '@vinejs/vine'

export const createTransactionValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2),
    email: vine.string().email(),
    cardNumber: vine.string().fixedLength(16).regex(/^\d+$/),
    cvv: vine.string().minLength(3).maxLength(4).regex(/^\d+$/),
    products: vine.array(
      vine.object({
        id: vine.number().positive(),
        quantity: vine.number().positive(),
      })
    ).minLength(1),
  })
)