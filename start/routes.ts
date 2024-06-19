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
const VerifyEmailsController = () => import('#controllers/auth/verify_emails_controller')

router.on('/').render('pages/home').as('home')

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
    router.get('/verify-email/:token', [VerifyEmailsController, 'show']).as('verify.show')
    // router.get('/verify-email', [LoginController, 'show']).as('verify.show')
    router
      .group(() => {
        router.get('/', [ResetPasswordsController, 'index']).as('index').use(middleware.guest())
        router
          .get('/confirm/:token', [ResetPasswordsController, 'show'])
          .as('show')
          .use(middleware.guest())
      })
      .prefix('reset-password')
      .as('reset')
  })
  .prefix('/auth')
  .as('auth')
