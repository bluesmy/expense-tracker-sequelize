const express = require('express')
const app = express()
const exphbs = require('express-handlebars')

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

app.listen(3000, (req, res) => {
  console.log('App is running!')
})