const express = require('express')
const router = express.Router()

const db = require('../models')
const Record = db.Record

const { authenticated } = require('../config/auth')

router.get('/', authenticated, (req, res) => {
  res.send('列出所有支出清單與總金額')
})

router.get('/new', authenticated, (req, res) => {
  res.send('新增支出頁面')
})

router.post('/', authenticated, (req, res) => {
  res.send('新增支出')
})

router.get('/:id/edit', authenticated, (req, res) => {
  res.send('修改支出頁面')
})

router.post('/:id/edit', authenticated, (req, res) => {
  res.send('修改支出')
})

router.post('/:id/delete', authenticated, (req, res) => {
  res.send('刪除支出')
})

module.export = router