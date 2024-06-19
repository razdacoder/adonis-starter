/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const RegisterController = () => import('#controllers/auth/registers_controller')
const LoginController = () => import('#controllers/auth/login_controller')
const ResetPasswordsController = () => import('#controllers/auth/reset_passwords_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const LogoutsController = () => import('#controllers/logouts_controller')
const HomeController = () => import('#controllers/home_controller')
const VerifyEmailsController = () => import('#controllers/auth/verify_emails_controller')

router.get('/', [HomeController, 'index']).as('home').use(middleware.auth())

router
  .group(() => {
    router
      .get('/register', [RegisterController, 'show'])
      .as('register.show')
      .use(middleware.guest())
    router
      .post('/register', [RegisterController, 'store'])
      .as('register.store')
      .use(middleware.guest())

    router.get('/login', [LoginController, 'show']).as('login.show').use(middleware.guest())
    router.post('/login', [LoginController, 'store']).as('login.store').use(middleware.guest())
    router.post('/logout', [LogoutsController, 'store']).as('logout.store').use(middleware.auth())
    router
      .get('/verify-email/:token', [VerifyEmailsController, 'show'])
      .as('verify.show')
      .use(middleware.guest())
    // router.get('/verify-email', [LoginController, 'show']).as('verify.show')
    router
      .group(() => {
        router.get('/', [ResetPasswordsController, 'index']).as('index').use(middleware.guest())
        router.post('/', [ResetPasswordsController, 'store']).as('store').use(middleware.guest())
        router
          .get('/confirm/:token', [ResetPasswordsController, 'show'])
          .as('show')
          .use(middleware.guest())
        router
          .post('/confirm/:token', [ResetPasswordsController, 'confirm'])
          .as('confirm')
          .use(middleware.guest())
      })
      .prefix('reset-password')
      .as('reset')
  })
  .prefix('/auth')
  .as('auth')
