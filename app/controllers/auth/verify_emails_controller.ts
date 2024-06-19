import Token from '#models/token'
import type { HttpContext } from '@adonisjs/core/http'

export default class VerifyEmailsController {
  async show({ view, params, session }: HttpContext) {
    const token = params.token
    const isValidToken = await Token.verify(token, 'VERIFY_EMAIL')
    if (!isValidToken) {
      session.flash('notification', {
        type: 'error',
        message: 'Account Verification Failed',
      })
    }

    const user = await Token.getTokenUser(token, 'VERIFY_EMAIL')
    if (user) {
      user.isActive = true
      await user.save()
      session.flash('notification', {
        type: 'success',
        message: 'Account Verification Successful',
      })
    }
    return view.render('pages/auth/verify-email', { isVerified: isValidToken && !!user })
  }
}
