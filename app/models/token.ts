import string from '@adonisjs/core/helpers/string'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { randomUUID } from 'node:crypto'
import User from './user.js'

type TokenType = 'PASSWORD_RESET' | 'VERIFY_EMAIL'

export default class Token extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @column()
  declare type: string

  @column()
  declare token: string

  @column.dateTime()
  declare expiresAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @beforeCreate()
  static assignUuid(token: Token) {
    token.id = randomUUID()
  }

  static async generatePasswordResetToken(user: User) {
    const token = string.generateRandom(64)
    await this.expireTokens(user, 'passwordResetTokens')
    const record = await user.related('tokens').create({
      type: 'PASSWORD_RESET',
      expiresAt: DateTime.now().plus({ minute: 10 }),
      token,
    })
    return record.token
  }

  static async generateEmailVerificationToken(user: User) {
    const token = string.generateRandom(64)
    await this.expireTokens(user, 'verifyEmailTokens')
    const record = await user.related('tokens').create({
      type: 'VERIFY_EMAIL',
      expiresAt: DateTime.now().plus({ day: 1 }),
      token,
    })
    return record.token
  }

  static async expireTokens(user: User, relationName: 'passwordResetTokens' | 'verifyEmailTokens') {
    await user.related(relationName).query().update({
      expiresAt: DateTime.now(),
    })
  }

  static async getTokenUser(token: string, type: TokenType) {
    const record = await Token.query()
      .preload('user')
      .where('token', token)
      .where('expiresAt', '>', DateTime.now().toSQL())
      .where('type', type)
      .orderBy('createdAt', 'desc')
      .first()

    return record?.user
  }

  static async verify(token: string, type: TokenType) {
    const record = await Token.query()
      .where('token', token)
      .where('expiresAt', '>', DateTime.now().toSQL())
      .where('type', type)
      .first()

    return !!record
  }
}
