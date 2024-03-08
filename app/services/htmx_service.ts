import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class HtmxService {
  constructor(private ctx: HttpContext) {}

  render(page: string, content?: any, template?: string) {
    if (!template) {
      template = 'layouts/app'
    }
    if (this.ctx.request.header('HX-Request')) {
      return this.ctx.view.render(page, content)
    }
    return this.ctx.view.render(template, { partialHtmx: page, ...content })
  }
}
