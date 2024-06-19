import PasswordResetNotification from '#mails/password_reset_notification'
import Token from '#models/token'
import User from '#models/user'
import { resetPasswordConfirmValidator, resetPasswordValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import mail from '@adonisjs/mail/services/main'

export default class ResetPasswordsController {
  async index({ view }: HttpContext) {
    return view.render('pages/auth/reset-password')
  }
  async show({ view }: HttpContext) {
    return view.render('pages/auth/reset-password-confirm')
  }
  async store({ request, session, response }: HttpContext) {
    const { email } = await request.validateUsing(resetPasswordValidator)
    const user = await User.findBy('email', email)
    if (user) {
      const token = await Token.generatePasswordResetToken(user)
      await mail.sendLater(new PasswordResetNotification(user.email, token))
    }
    session.flash('notification', {
      type: 'success',
      message: 'Password reset link sent to your email.',
    })

    return response.redirect().back()
  }
  async confirm({ request, response, session }: HttpContext) {
    const token = request.param('token')
    console.log(token)
    const isValid = await Token.verify(token, 'PASSWORD_RESET')
    if (!isValid) {
      session.flash('notification', {
        type: 'error',
        message: 'Password Reset Link has expired. Try requesting a new one.',
      })
      return response.redirect().back()
    }
    const user = await Token.getTokenUser(token, 'PASSWORD_RESET')
    const { password } = await request.validateUsing(resetPasswordConfirmValidator)

    if (user) {
      await user.merge({ password }).save()
      session.flash('notification', {
        type: 'success',
        message: 'Password Reset Successful',
      })
      return response.redirect().back()
    }
    session.flash('notification', {
      type: 'error',
      message: 'No user found for this token',
    })
    return response.redirect().back()
  }
}
