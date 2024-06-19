import type { HttpContext } from '@adonisjs/core/http'

export default class LogoutsController {
  async store({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect().toRoute('auth.login.show')
  }
}
