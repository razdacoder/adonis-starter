/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const AuthController = () => import('#controllers/auth_controller')
const HomeController = () => import('#controllers/home_controller')

router.get('/', [HomeController, 'index']).as('home').use(middleware.auth())

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
