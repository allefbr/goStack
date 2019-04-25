const express = require('express')
const nunjucks = require('nunjucks')

const app = express()

nunjucks.configure('view', {
  autoescape: true,
  express: app,
  watch: true
})

app.set('view engine', 'njk')
app.use(express.urlencoded({ extended: false }))

const ROUTES = {
  home: '/',
  minor: '/minor',
  major: '/major',
  check: '/check'
}

// helper
const createUrlWithParam = (route, param) => {
  return `${route}?age=${param}`
}

const makeRedirect = (res, route, param) => {
  if (param) return res.redirect(createUrlWithParam(route, param))
  return res.redirect(route)
}

// Middlewares
const checkMiddleware = (req, res, next) => {
  const age = req.query.age
  return !age ? makeRedirect(ROUTES.home) : next()
}

// ROTAS
app.get(ROUTES.home, (req, res) => {
  res.render('check')
})

app.get(ROUTES.major, checkMiddleware, (req, res) => {
  const age = req.query.age
  res.render('major', { age })
})

app.get(ROUTES.minor, checkMiddleware, (req, res) => {
  const age = req.query.age
  res.render('minor', { age })
})

app.post(ROUTES.check, (req, res) => {
  const age = req.body.age
  return age >= 18
    ? makeRedirect(res, ROUTES.major, age)
    : makeRedirect(res, ROUTES.minor, age)
})

app.listen(3000)
