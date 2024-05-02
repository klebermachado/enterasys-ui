import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'configs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('switch_id').unsigned()
      table.text('content')
      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.foreign('switch_id').references('switches.id')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
