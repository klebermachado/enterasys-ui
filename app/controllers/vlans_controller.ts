// import type { HttpContext } from '@adonisjs/core/http'

import { inject } from '@adonisjs/core'
import HtmxService from '../services/htmx_service.js'

@inject()
export default class VlansController {
  constructor(private hx: HtmxService) {}

  async create() {
    return this.hx.render('pages/vlans/index')
  }
}
