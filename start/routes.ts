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
import VlansController from '../app/controllers/vlans_controller.js'

router.get('/', [SwitchesController, 'show'])
router.get('switches', [SwitchesController, 'create'])
router.get('vlans', [VlansController, 'create'])
