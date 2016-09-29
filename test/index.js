/* global describe it */
const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
const cheerio = require('cheerio')

var Main = require('../index.js')

chai.use(chaiHttp)

describe('Main', function () {
  it('should exist', function () {
    expect(Main).to.not.be.undefined
  })
})

describe('#pageExistence', function () {
  it('should exists a page to host the form on localhost', function (done) {
    chai.request(Main)
      .get('/')
      .end(function (err, res) {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res).to.be.html
        done()
      })
  })
})

describe('#requiredInputsExistence', function () {
  it('should exists of required inputs in the form to be filled by user', function (done) {
    chai.request(Main)
      .get('/')
      .end(function (err, res) {
        expect(err).to.be.null
        var $ = cheerio.load(res.text)
        expect($('input#inputName').length).to.equal(1)
        expect($('input#inputName').attr('required')).to.equal('required')
        expect($('input#inputEmail').length).to.equal(1)
        expect($('input#inputEmail').attr('required')).to.equal('required')
        done()
      })
  })
})

describe('#optionalInputsExistence', function () {
  it('should exists of optional inputs in the form to be filled by user', function (done) {
    chai.request(Main)
      .get('/')
      .end(function (err, res) {
        expect(err).to.be.null
        var $ = cheerio.load(res.text)
        expect($('input#inputHtml').length).to.equal(1)
        expect($('input#inputCss').length).to.equal(1)
        expect($('input#inputJavascript').length).to.equal(1)
        expect($('input#inputPython').length).to.equal(1)
        expect($('input#inputDjango').length).to.equal(1)
        expect($('input#inputIos').length).to.equal(1)
        expect($('input#inputAndroid').length).to.equal(1)
        done()
      })
  })
})

describe('#sendWrongDataToForm', function () {
  it('should return an error message', function (done) {
    chai.request(Main)
      .post('/send')
      .end(function (err, res) {
        expect(err).to.be.null
        expect(res.text).to.equal('Invalid data, please inform at least name and email field.')
        done()
      })
  })
})

describe('#checkMailType', function () {
  it('should return an message for front-end', function () {
    let res = Main.checkMailType({
      'name': 'Teste Front-End',
      'email': 'rafael@fumasa.org',
      'html': 9,
      'css': 8,
      'javascript': 7,
      'python': 5,
      'django': 3,
      'ios': 1,
      'android': 0
    })
    expect(res).to.be.string
    expect(res).to.equal('Email Front-End')
  })

  it('should return an message for back-end', function () {
    let res = Main.checkMailType({
      'name': 'Teste Back-End',
      'email': 'rafael@fumasa.org',
      'html': 9,
      'css': 3,
      'javascript': 5,
      'python': 7,
      'django': 8,
      'ios': 1,
      'android': 0
    })
    expect(res).to.be.string
    expect(res).to.equal('Email Back-End')
  })

  it('should return an message for mobile', function () {
    let res = Main.checkMailType({
      'name': 'Teste Mobile',
      'email': 'rafael@fumasa.org',
      'html': 1,
      'css': 3,
      'javascript': 5,
      'python': 4,
      'django': 2,
      'ios': 1,
      'android': 8
    })
    expect(res).to.be.string
    expect(res).to.equal('Email Mobile')
  })

  it('should return an message for generic', function () {
    let res = Main.checkMailType({
      'name': 'Teste Generico',
      'email': 'rafael@fumasa.org',
      'html': 1,
      'css': 0,
      'javascript': 1,
      'python': 0,
      'django': 2,
      'ios': 1,
      'android': 0
    })
    expect(res).to.be.string
    expect(res).to.equal('Email Generico')
  })

  it('should return an message for front-end and mobile', function () {
    let res = Main.checkMailType({
      'name': 'Teste Generico',
      'email': 'rafael@fumasa.org',
      'html': 7,
      'css': 8,
      'javascript': 9,
      'python': 1,
      'django': 7,
      'ios': 8,
      'android': 0
    })
    expect(res).to.be.string
    expect(res).to.equal('Email Front-End|Email Mobile')
  })

  it('should return an message for back-end and mobile', function () {
    let res = Main.checkMailType({
      'name': 'Teste Email Back-End|Email Mobile',
      'email': 'rafael@fumasa.org',
      'html': 1,
      'css': 0,
      'javascript': 1,
      'python': 10,
      'django': 8,
      'ios': 1,
      'android': 9
    })
    expect(res).to.be.string
    expect(res).to.equal('Email Back-End|Email Mobile')
  })

  it('should return an message for front-end and back-end', function () {
    let res = Main.checkMailType({
      'name': 'Teste Email Front-End|Email Back-End',
      'email': 'rafael@fumasa.org',
      'html': 10,
      'css': 9,
      'javascript': 8,
      'python': 10,
      'django': 8,
      'ios': 1,
      'android': 2
    })
    expect(res).to.be.string
    expect(res).to.equal('Email Front-End|Email Back-End')
  })

  it('should return an message for front-end and back-end and mobile', function () {
    let res = Main.checkMailType({
      'name': 'Teste Email Front-End|Email Back-End|Email Mobile',
      'email': 'rafael@fumasa.org',
      'html': 10,
      'css': 9,
      'javascript': 8,
      'python': 10,
      'django': 8,
      'ios': 7,
      'android': 8
    })
    expect(res).to.be.string
    expect(res).to.equal('Email Front-End|Email Back-End|Email Mobile')
  })
})

describe('#sendDataToForm', function () {
  it('should return an error message', function (done) {
    chai.request(Main)
      .post('/send')
      .send({
        'name': 'Teste Generico',
        'email': 'rafael@fumasa.org',
        'html': 1,
        'css': 0,
        'javascript': 1,
        'python': 0,
        'django': 2,
        'ios': 1,
        'android': 0
      })
      .end(function (err, res) {
        expect(err).to.be.null
        expect(res).to.redirect
        done()
      })
  })
})
