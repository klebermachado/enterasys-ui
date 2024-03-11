// import type { HttpContext } from '@adonisjs/core/http'

import { inject } from '@adonisjs/fold'
import HtmxService from '../services/htmx_service.js'

@inject()
export default class ArchitecturesController {
  constructor(private hx: HtmxService) {}

  async index() {
    return this.hx.render('pages/architecture/index')
  }
}
