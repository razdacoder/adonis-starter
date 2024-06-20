import vine from '@vinejs/vine'

export const updateProfileInfo = vine.compile(
  vine.object({
    fullName: vine.string().maxLength(100).optional(),
    avatar: vine.file({ extnames: ['jpeg', 'jpg', 'png'], size: '2mb' }).optional(),
    email: vine.string().email().normalizeEmail().optional(),
  })
)

export const changePassword = vine.compile(
  vine.object({
    currentPassword: vine.string(),
    password: vine.string().minLength(8).confirmed(),
  })
)
