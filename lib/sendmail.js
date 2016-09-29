const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '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'

const helper = require('sendgrid').mail
const sendgrid = require('sendgrid')(SENDGRID_API_KEY)

let SendMail

SendMail = {
  validateEmail: function (email) {
    var re = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    return re.test(email)
  },
  validateFields: function (emailFields) {
    return (
      (emailFields.from !== undefined && emailFields.from !== '' && this.validateEmail(emailFields.from)) &&
      (emailFields.to !== undefined && emailFields.to !== '' && this.validateEmail(emailFields.to)) &&
      (emailFields.subject !== undefined && emailFields.subject !== '') &&
      (emailFields.body !== undefined && emailFields.body !== '')
    )
  },
  prepareMail: function (emailFields) {
    if (!this.validateFields(emailFields)) return false
    return new helper.Mail(
      new helper.Email(emailFields.from),
      emailFields.subject,
      new helper.Email(emailFields.to),
      new helper.Content('text/plain', emailFields.body))
  },
  sendMail: function (emailFields, callback) {
    let mail = this.prepareMail(emailFields)
    if (!mail) return false

    let request = sendgrid.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON()
    })

    sendgrid.API(request, function (error, response) {
      if (error) console.log(error)
      console.log('mail sent to:%s subject:%s', emailFields.to, emailFields.subject)
      if (callback) callback(error, response)
    })
  }
}

module.exports = SendMail
