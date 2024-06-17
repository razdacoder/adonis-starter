/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const RegisterController = () => import('#controllers/registers_controller')
const LoginController = () => import('#controllers/login_controller')
const ResetPasswordsController = () => import('#controllers/reset_passwords_controller')
import router from '@adonisjs/core/services/router'

router.on('/').render('pages/home')

router
  .group(() => {
    router.get('/register', [RegisterController, 'index']).as('register.index')
    router.get('/login', [LoginController, 'index']).as('login.index')
    router.get('/reset-password', [ResetPasswordsController, 'index']).as('reset.index')
  })
  .prefix('/auth')
  .as('auth')
