import User from '#models/user'
import { registerValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class RegisterController {
  async show({ view }: HttpContext) {
    return view.render('pages/auth/register')
  }
  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(registerValidator)
    const user = await User.create(data)
    console.log({ user: user.serialize() })
    return response.redirect().toRoute('home')
  }
}
