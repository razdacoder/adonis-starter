import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().maxLength(100).optional(),
    email: vine
      .string()
      .email()
      .normalizeEmail()
      .unique(async (db, value, _field) => {
        const result = await db.from('users').select('id').where('email', value)
        return result.length ? false : true
      }),
    password: vine.string().minLength(8).confirmed(),
  })
)
