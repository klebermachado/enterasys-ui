import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'switches'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name', 255).notNullable()
      table.string('ip', 255).notNullable()
      table.string('hostname', 255).notNullable()
      table.string('location', 255).notNullable()
      table.string('user', 255).notNullable()
      table.string('password', 255).notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
