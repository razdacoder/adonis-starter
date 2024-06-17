import type { HttpContext } from '@adonisjs/core/http'

export default class RegisterController {
  async index({ view }: HttpContext) {
    return view.render('pages/auth/register')
  }
}
