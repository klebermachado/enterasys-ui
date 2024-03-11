import { inject } from '@adonisjs/core'
import HtmxService from '../services/htmx_service.js'
import { HttpContext } from '@adonisjs/http-server'

@inject()
export default class SwitchesController {
  constructor(private hx: HtmxService) {}

  async index({ params }: HttpContext) {
    return this.hx.render('pages/switches/index', { slug: `Switch baum demais ${params.slug}` })
  }

  async show() {
    return this.hx.render('pages/home')
  }

  async create() {
    return this.hx.render('pages/switches/create')
  }
}
