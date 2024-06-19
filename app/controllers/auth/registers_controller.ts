import VerifyEmailNotification from '#mails/verify_e_notification'
import Token from '#models/token'
import User from '#models/user'
import { registerValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import mail from '@adonisjs/mail/services/main'

export default class RegisterController {
  async show({ view }: HttpContext) {
    return view.render('pages/auth/register')
  }
  async store({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(registerValidator)
    const user = await User.create(data)
    const token = await Token.generateEmailVerificationToken(user)
    await mail.sendLater(new VerifyEmailNotification(user, token))
    session.flash('notification', {
      type: 'success',
      message: 'Account Created. Verification Email Sent',
    })

    return response.redirect().back()
  }
}
