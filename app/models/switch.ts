import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Switch extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare vlanId: number

  @column()
  declare name: number

  @column()
  declare ipAddress: number

  @column()
  declare hostname: number

  @column()
  declare user: number

  @column()
  declare password: number

  @column.dateTime()
  declare last_update: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
