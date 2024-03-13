import { inject } from '@adonisjs/core'
import HtmxService from '#services/htmx_service'
import { HttpContext } from '@adonisjs/http-server'

import { generateRandomID } from './../helpers/utils.ts'

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

  async update({ params, request }: HttpContext) {
    // console.log('atualizando' + params.id, request.body())
  }

  async vlansPage({ params }: HttpContext) {
    return this.hx.render('pages/switches/vlans', { id: params.id, generateRandomID })
  }

  async portsPage({ params }: HttpContext) {
    return this.hx.render('pages/switches/ports', { id: params.id })
  }

  async configPage({ params }: HttpContext) {
    return this.hx.render('pages/switches/config', { id: params.id })
  }

  async backupPage({ params }: HttpContext) {
    return this.hx.render('pages/switches/backup', { id: params.id })
  }
}
