import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class HtmxService {
  constructor(private ctx: HttpContext) {}

  render(page: string | string[], content?: any, template?: string) {
    if (!template) {
      template = 'layouts/app'
    }
    if (this.ctx.request.header('HX-Target')) {
      if (Array.isArray(page)) {
        return this.ctx.view.render(page[page.length - 1], content)
      } else {
        return this.ctx.view.render(page, content)
      }
    }
    if (Array.isArray(page)) {
      const pages = page
        .map((p, i) => ({ [`pageLevel${i + 1}`]: p }))
        .reduce((acc, curr) => ({ ...acc, ...curr }), {})
      return this.ctx.view.render(template, {
        ...pages,
        ...content,
      })
    } else {
      return this.ctx.view.render(template, {
        pageLevel1: page,
        ...content,
      })
    }
  }
}
