import PasswordResetNotification from '#mails/password_reset_notification'
import VerifyEmailNotification from '#mails/verify_e_notification'
import Token from '#models/token'
import User from '#models/user'
import {
  loginValidator,
  registerValidator,
  resetPasswordConfirmValidator,
  resetPasswordValidator,
} from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import mail from '@adonisjs/mail/services/main'

export default class AuthController {
  /**
   * Display a register page
   */
  async register_show({ view }: HttpContext) {
    return view.render('pages/auth/register')
  }

  /**
   * Register a new user
   */
  async register_store({ request, response, session }: HttpContext) {
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

  /**
   * Display a login page
   */

  async login_show({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }

  /**
   * Login user
   */

  async login_store({ auth, request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(email, password)
    await auth.use('web').login(user, !!request.input('remember_me'))
    response.redirect().toRoute('home')
  }

  /**
   * Verify user
   */

  async verify_show({ view, params, session }: HttpContext) {
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

  /**
   * Password Reset Page
   */
  async password_reset_show({ view }: HttpContext) {
    return view.render('pages/auth/reset-password')
  }

  /**
   *  Password Reset Send Mail
   */
  async password_reset_store({ request, session, response }: HttpContext) {
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

  /**
   * Password Reset Confirm Page
   */
  async password_reset_confirm_show({ view }: HttpContext) {
    return view.render('pages/auth/reset-password-confirm')
  }

  /**
   *  Password Reset New Password
   */
  async password_reset_confirm_store({ request, response, session }: HttpContext) {
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

  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect().toRoute('auth.login.show')
  }
}
