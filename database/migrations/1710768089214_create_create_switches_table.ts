import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'switches'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('vlan_id').unsigned().references('id').inTable('vlans')
      table.string('name')
      table.string('ip_address')
      table.string('hostname')
      table.string('user')
      table.string('password')
      table.timestamp('last_update')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
