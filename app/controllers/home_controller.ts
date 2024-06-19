import type { HttpContext } from '@adonisjs/core/http'

export default class HomeController {
  async index({ view, auth }: HttpContext) {
    auth.getUserOrFail()
    return view.render('pages/home')
  }
}
