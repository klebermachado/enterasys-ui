// import type { HttpContext } from '@adonisjs/core/http'

import { inject } from '@adonisjs/core'
import HtmxService from '../services/htmx_service.js'

@inject()
export default class SwitchesController {
  constructor(private hx: HtmxService) {}

  async show() {
    return this.hx.render('pages/home')
  }
}
