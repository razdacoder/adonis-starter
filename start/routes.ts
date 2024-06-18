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

router.on('/').render('pages/home').as('home')

router
  .group(() => {
    router.get('/register', [RegisterController, 'show']).as('register.show')
    router.post('/register', [RegisterController, 'store']).as('register.store')

    router.get('/login', [LoginController, 'show']).as('login.show')
    router
      .group(() => {
        router.get('/', [ResetPasswordsController, 'index']).as('index')
        router.get('/confirm/:token', [ResetPasswordsController, 'show']).as('show')
      })
      .prefix('reset-password')
      .as('reset')
  })
  .prefix('/auth')
  .as('auth')
