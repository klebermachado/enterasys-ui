import router from '@adonisjs/core/services/router'
import SwitchesController from '../app/controllers/switches_controller.js'
import VlansController from '../app/controllers/vlans_controller.js'
import ArchitecturesController from '../app/controllers/architectures_controller.js'

router.get('/', [SwitchesController, 'show'])
router.get('switches/create', [SwitchesController, 'create'])
router.get('switches/:slug', [SwitchesController, 'index'])
router.get('switches/:slug/vlans', [SwitchesController, 'vlansPage'])
router.get('switches/:slug/ports', [SwitchesController, 'portsPage'])
router.get('switches/:slug/config', [SwitchesController, 'configPage'])
router.get('switches/:slug/backup', [SwitchesController, 'backupPage'])
router.get('vlans', [VlansController, 'create'])

router.get('architecture', [ArchitecturesController, 'index'])
