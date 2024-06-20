import { changePassword, updateProfileInfo } from '#validators/user'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import hash from '@adonisjs/core/services/hash'

export default class UsersController {
  /**
   * Display a list of resource
   */
  async index({ view, auth }: HttpContext) {
    auth.getUserOrFail()
    return view.render('pages/profile')
  }

  /**
   * Display form to create a new record
   */
  async update_profile({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(updateProfileInfo)
    const user = await auth.getUserOrFail()
    await data.avatar?.move(app.makePath('uploads'), {
      name: `${cuid()}.${data.avatar?.extname}`,
    })
    await user
      .merge({ fullName: data.fullName, email: data.email, avatarUrl: data.avatar?.fileName })
      .save()

    return response.redirect().back()
  }

  /**
   * Update Password
   */
  async update_password({ request, response, auth, session }: HttpContext) {
    const { currentPassword, password } = await request.validateUsing(changePassword)
    const user = await auth.getUserOrFail()
    const passwordValid = await hash.verify(user.password, currentPassword)
    if (!passwordValid) {
      session.flash('notification', {
        type: 'error',
        message: 'Incorrect Password',
      })
      return response.redirect().back()
    }
    await user.merge({ password }).save()
    await auth.use('web').logout()
    return response.redirect().toRoute('auth.login.show')
  }

  // /**
  //  * Delete record
  //  */
  // async destroy({ params }: HttpContext) {}
}
