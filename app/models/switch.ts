import { DateTime } from 'luxon'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import Port from '#models/port'
import Config from './config.js'

export default class Switch extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare ip: string

  @column()
  declare hostname: string

  @column()
  declare location: string

  @column()
  declare user: string

  @column()
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Port)
  declare ports: HasMany<typeof Port>

  @hasOne(() => Config)
  declare config: HasOne<typeof Config>
}
