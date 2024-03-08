/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import SwitchesController from '../app/controllers/switches_controller.js'

router.get('/', [SwitchesController, 'show'])
