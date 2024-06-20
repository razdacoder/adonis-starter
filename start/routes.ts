/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import app from '@adonisjs/core/services/app'
import router from '@adonisjs/core/services/router'
import { normalize, sep } from 'node:path'
import { middleware } from './kernel.js'
const UsersController = () => import('#controllers/users_controller')
const AuthController = () => import('#controllers/auth_controller')
const HomeController = () => import('#controllers/home_controller')

const PATH_TRAVERSAL_REGEX = /(?:^|[\\/])\.\.(?:[\\/]|$)/

router
  .get('/uploads/*', ({ request, response }) => {
    const filePath = request.param('*').join(sep)
    const normalizedPath = normalize(filePath)

    if (PATH_TRAVERSAL_REGEX.test(normalizedPath)) {
      return response.badRequest('Malformed path')
    }

    const absolutePath = app.makePath('uploads', normalizedPath)
    return response.download(absolutePath)
  })
  .as('upload')

router.get('/', [HomeController, 'index']).as('home').use(middleware.auth())

router
  .group(() => {
    router.get('/', [UsersController, 'index']).as('index')
    router.post('/update-profile', [UsersController, 'update_profile']).as('update_profile')
    router.post('/update-password', [UsersController, 'update_password']).as('update_password')
    router.post('/delete', [UsersController, 'destroy']).as('destroy')
  })
  .prefix('/me')
  .as('me')
  .use(middleware.auth())

router
  .group(() => {
    router
      .get('/register', [AuthController, 'register_show'])
      .as('register.show')
      .use(middleware.guest())
    router
      .post('/register', [AuthController, 'register_store'])
      .as('register.store')
      .use(middleware.guest())

    router.get('/login', [AuthController, 'login_show']).as('login.show').use(middleware.guest())
    router.post('/login', [AuthController, 'login_store']).as('login.store').use(middleware.guest())
    router.post('/logout', [AuthController, 'logout']).as('logout.store').use(middleware.auth())
    router
      .get('/verify-email/:token', [AuthController, 'verify_show'])
      .as('verify.show')
      .use(middleware.guest())

    router
      .group(() => {
        router.get('/', [AuthController, 'password_reset_show']).as('index').use(middleware.guest())
        router
          .post('/', [AuthController, 'password_reset_store'])
          .as('store')
          .use(middleware.guest())
        router
          .get('/confirm/:token', [AuthController, 'password_reset_confirm_show'])
          .as('show')
          .use(middleware.guest())
        router
          .post('/confirm/:token', [AuthController, 'password_reset_confirm_store'])
          .as('confirm')
          .use(middleware.guest())
      })
      .prefix('reset-password')
      .as('reset')
  })
  .prefix('/auth')
  .as('auth')
