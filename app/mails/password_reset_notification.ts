import env from '#start/env'
import router from '@adonisjs/core/services/router'
import { BaseMail } from '@adonisjs/mail'

export default class PasswordResetNotification extends BaseMail {
  constructor(
    private email: string,
    private token: string
  ) {
    super()
  }
  from = 'noreply@razzystarter.com'
  subject = 'Password Reset'

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
      .makeSigned('auth.reset.show')
    this.message.to(this.email).htmlView('emails/password-reset', { url })
  }
}
