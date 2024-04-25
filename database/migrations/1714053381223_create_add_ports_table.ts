import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'ports'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('switch_id').unsigned()
      table.integer('vlan_id').unsigned()
      table.string('port_name')
      table.string('alias')
      table.string('description')
      table.foreign('switch_id').references('switches.id')
      table.foreign('vlan_id').references('vlans.id')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
