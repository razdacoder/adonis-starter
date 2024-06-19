import User from '#models/user'
import env from '#start/env'
import router from '@adonisjs/core/services/router'
import { BaseMail } from '@adonisjs/mail'

export default class VerifyEmailNotification extends BaseMail {
  constructor(
    private user: User,
    private token: string
  ) {
    super()
  }
  from = 'noreply@razzystarter.com'
  subject = 'Verify Email Address'

  /**
   * The "prepare" method is called automatically when
   * the email is sent or queued.
   */
  prepare() {
    const domain = env.get('DOMAIN')
    const url = router
      .builder()
      .prefixUrl(domain)
      .params({ token: this.token })
      .makeSigned('auth.verify.show')
    this.message.to(this.user.email).htmlView('emails/verify_email', { url, user: this.user })
  }
}
