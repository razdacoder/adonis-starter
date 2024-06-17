import type { HttpContext } from '@adonisjs/core/http'

export default class LoginController {
  async index({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }
}
