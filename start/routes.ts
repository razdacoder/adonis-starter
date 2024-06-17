/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const RegisterController = () => import('#controllers/registers_controller')
import router from '@adonisjs/core/services/router'

router.on('/').render('pages/home')

router
  .group(() => {
    router.get('/register', [RegisterController, 'index']).as('register.index')
  })
  .prefix('/auth')
  .as('auth')
