const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')
const port = 3000

const db = require('./models')
const Record = db.Record
const User = db.User

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(session({
  secret: 'your secret key',
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

require('./config/passport')(passport)

app.use((req, res, next) => {
  res.locals.user = req.user
  next()
})


app.get('/', (req, res) => {
  res.render('index')
})

app.get('/record', (req, res) => {
  res.send('列出所有支出清單與總金額')
})

app.get('/record/new', (req, res) => {
  res.send('新增支出頁面')
})

app.post('/record', (req, res) => {
  res.send('新增支出')
})

app.get('/record/:id/edit', (req, res) => {
  res.send('修改支出頁面')
})

app.post('/record/:id/edit', (req, res) => {
  res.send('修改支出')
})

app.post('record/:id/delete', (req, res) => {
  res.send('刪除支出')
})

app.use('/users', require('./routes/user'))

app.listen(port, (req, res) => {
  console.log(`App is running on port ${port}!`)
})