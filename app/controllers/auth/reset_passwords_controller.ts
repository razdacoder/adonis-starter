import type { HttpContext } from '@adonisjs/core/http'

export default class ResetPasswordsController {
  async index({ view }: HttpContext) {
    return view.render('pages/auth/reset-password')
  }
  async show({ view }: HttpContext) {
    return view.render('pages/auth/reset-password-confirm')
  }
}
