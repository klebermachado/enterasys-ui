import { inject } from '@adonisjs/core'
import HtmxService from '../services/htmx_service.js'
import { HttpContext } from '@adonisjs/http-server'

@inject()
export default class SwitchesController {
  constructor(private hx: HtmxService) {}

  async index({ params }: HttpContext) {
    return this.hx.render('pages/switches/index', { id: 23 })
  }

  async show() {
    return this.hx.render('pages/home')
  }

  async create() {
    return this.hx.render('pages/switches/create')
  }

  async vlansPage({ params }: HttpContext) {
    return this.hx.render('pages/switches/vlans', { slug: params.slug })
  }

  async portsPage({ params }: HttpContext) {
    return this.hx.render('pages/switches/ports', { slug: params.slug })
  }

  async configPage({ params }: HttpContext) {
    return this.hx.render('pages/switches/config', { slug: params.slug })
  }

  async backupPage({ params }: HttpContext) {
    return this.hx.render('pages/switches/backup', { slug: params.slug })
  }
}
