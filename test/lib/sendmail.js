/* global describe it */
const chai = require('chai')
const expect = chai.expect

describe('SendMail', function () {
  it('should exist', function () {
    expect(require('../../lib/sendmail.js')).to.not.be.undefined
  })
})

let SendMail = require('../../lib/sendmail.js')

describe('#validateEmail', function () {
  it('should validate email field and return a boolean', function () {
    expect(SendMail.validateEmail('test')).to.be.equal(false)
    expect(SendMail.validateEmail('test@teste.com')).to.be.equal(true)
  })
})

describe('#validateFields', function () {
  it('should validate email fields and return a boolean', function () {
    let emailFields = {
      'from': 'teste@teste.com',
      'to': 'test@test.com',
      'subject': 'Mail Test',
      'body': 'Some body content'
    }
    let mailObj = SendMail.validateFields(emailFields)
    expect(mailObj).to.be.equal(true)
  })
})

describe('#sendMail', function () {
  it('should take email fields and send the mail, returning true or false', function (done) {
    this.timeout(5000)
    let emailFields = {
      'from': 'teste@teste.com',
      'to': 'rafael@fumasa.org',
      'subject': 'Mail Test',
      'body': 'Some body content'
    }
    SendMail.sendMail(emailFields, function (err, res) {
      expect(err).to.be.null
      expect(res.statusCode).to.be.equal(202)
      done()
    })
  })
})
