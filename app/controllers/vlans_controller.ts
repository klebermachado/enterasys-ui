// import type { HttpContext } from '@adonisjs/core/http'

import { inject } from '@adonisjs/core'
import HtmxService from '#services/htmx_service'
import { HttpContext } from '@adonisjs/core/http'
import Vlan from '../models/vlan.ts'

@inject()
export default class VlansController {
  constructor(private hx: HtmxService) {}

  async all() {
    return Vlan.all()
  }

  async create() {
    const vlans = (await Vlan.all()).sort((a, b) => parseInt(a.tag) - parseInt(b.tag))
    return this.hx.render('pages/vlans/index', { vlans })
  }

  async store({ request }: HttpContext) {
    const data = request.only(['tag', 'description'])
    const vlan = await Vlan.create(data)
    return vlan
  }

  async destroy({ params }: HttpContext) {
    const vlan = await Vlan.find(params.id)
    await vlan?.delete()
    return true
  }
}
