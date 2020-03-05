const express = require('express')
const app = express()
const exphbs = require('express-handlebars')

const db = require('./models')
const Record = db.Record
const User = db.User

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

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

app.get('/users/login', (req, res) => {
  res.render('login')
})

app.post('/users/login', (req, res) => {
  res.send('login')
})

app.get('/users/register', (req, res) => {
  res.render('register')
})

app.post('/users/register', (req, res) => {
  res.send('register')
})

app.get('/users/logout', (req, res) => {
  res.send('logout')
})

app.listen(3000, (req, res) => {
  console.log('App is running!')
})