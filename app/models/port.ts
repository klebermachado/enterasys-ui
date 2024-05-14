import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Vlan from './vlan.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Egress from './egress.js'

export default class Port extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare switchId: number

  @column()
  declare vlanId: number

  @column()
  declare portName: number

  @column()
  declare alias: number

  @column()
  declare description: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Vlan)
  declare vlan: BelongsTo<typeof Vlan>

  @hasMany(() => Egress)
  declare egress: HasMany<typeof Egress>
}
