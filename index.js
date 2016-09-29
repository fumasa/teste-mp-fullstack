const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const sassMiddleware = require('node-sass-middleware')

const SendMail = require('./lib/sendmail')

const app = express()

app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'pug')
app.engine('pug', require('pug').__express)

const port = process.env.PORT || 8080

app.use(sassMiddleware({
  src: path.join(__dirname, '/scss'),
  dest: path.join(__dirname, '/public'),
  force: true,
  outputStyle: 'compressed',
  prefix: '/css',
  includePaths: [
    path.join(__dirname, '/node_modules/bootstrap-sass/assets/stylesheets'),
    path.join(__dirname, '/node_modules/font-awesome/scss/')
  ],
  error: function (err) {
    console.log(err)
  }
}))

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())

app.use('/node_modules', express.static(path.join(__dirname, '/node_modules')))

app.get('/', function (req, res) {
  res.render('index')
})

app.checkMailType = function (body) {
  let msgReturn = ''
  if (body === undefined || body === {} || body.name === undefined || body.name === '' || body.email === undefined || body.email === '') {
    return ''
  } else {
    let sent = false
    if (body.html >= 7 && body.css >= 7 && body.javascript >= 7) {
      sent = true
      msgReturn += 'Email Front-End'
    }
    if (body.python >= 7 && body.django >= 7) {
      sent = true
      if (msgReturn !== '') msgReturn += '|'
      msgReturn += 'Email Back-End'
    }
    if (body.ios >= 7 || body.android >= 7) {
      sent = true
      if (msgReturn !== '') msgReturn += '|'
      msgReturn += 'Email Mobile'
    }
    if (!sent) {
      msgReturn += 'Email Generico'
    }
  }
  return msgReturn
}

app.post('/send', function (req, res) {
  let msgReturn = app.checkMailType(req.body)
  if (msgReturn === '') {
    res.send('Invalid data, please inform at least name and email field.')
  } else {
    let split = msgReturn.split('|')
    for (let val in split) {
      switch (split[val]) {
        case 'Email Front-End':
          SendMail.sendMail({
            'from': 'rafael@fumasa.org',
            'to': req.body.email,
            'subject': 'Obrigado por se candidatar',
            'body': 'Obrigado por se candidatar, assim que tivermos uma vaga disponível para programador Front-End entraremos em contato.'
          }, function (err, resp) {
            if (err) console.log(err)
            if (split.length === 1) {
              res.redirect('/')
            }
          })
          break
        case 'Email Back-End':
          SendMail.sendMail({
            'from': 'rafael@fumasa.org',
            'to': req.body.email,
            'subject': 'Obrigado por se candidatar',
            'body': 'Obrigado por se candidatar, assim que tivermos uma vaga disponível para programador Back-End entraremos em contato.'
          }, function (err, resp) {
            if (err) console.log(err)
            if (split.length === 2) {
              res.redirect('/')
            }
          })
          break
        case 'Email Mobile':
          console.log('mobile-')
          SendMail.sendMail({
            'from': 'rafael@fumasa.org',
            'to': req.body.email,
            'subject': 'Obrigado por se candidatar',
            'body': 'Obrigado por se candidatar, assim que tivermos uma vaga disponível para programador Mobile entraremos em contato.'
          }, function (err, resp) {
            if (err) console.log(err)
            res.redirect('/')
          })
          break
        case 'Email Generico':
          SendMail.sendMail({
            'from': 'rafael@fumasa.org',
            'to': req.body.email,
            'subject': 'Obrigado por se candidatar',
            'body': 'Obrigado por se candidatar, assim que tivermos uma vaga disponível para programador entraremos em contato.'
          }, function (err, resp) {
            if (err) console.log(err)
            res.redirect('/')
          })
          break
        default:
          break
      }
    }
  }
})

if (module.parent !== null) {
  module.exports = app
} else {
  app.listen(port, function () {
    console.log('server running at port:%s', port)
  })
}
