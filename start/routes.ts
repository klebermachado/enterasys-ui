import router from '@adonisjs/core/services/router'
import SwitchesController from '../app/controllers/switches_controller.js'
import VlansController from '../app/controllers/vlans_controller.js'
import ArchitecturesController from '../app/controllers/architectures_controller.js'

router.get('/', [SwitchesController, 'show'])
router.get('switches/create', [SwitchesController, 'create'])
router.get('switches/:id', [SwitchesController, 'index'])
router.get('switches/:id/vlans', [SwitchesController, 'vlansPage'])
router.get('switches/:id/ports', [SwitchesController, 'portsPage'])
router.get('switches/:id/config', [SwitchesController, 'configPage'])
router.get('switches/:id/backup', [SwitchesController, 'backupPage'])
router.put('switches/:id/vlans', [SwitchesController, 'updateVlans'])
router.get('vlans', [VlansController, 'create'])
router.post('vlans', [VlansController, 'store'])
router.delete('vlans/:id', [VlansController, 'destroy'])

router.get('architecture', [ArchitecturesController, 'index'])
