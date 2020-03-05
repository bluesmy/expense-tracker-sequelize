const express = require('express')
const router = express.Router()

const db = require('../models')
const Record = db.Record
const User = db.User

const { authenticated } = require('../config/auth')

router.get('/', authenticated, (req, res) => {
  res.redirect('/')
})

router.get('/new', authenticated, (req, res) => {
  const date = new Date()
  const y = date.getFullYear()
  const m = ('0' + (date.getMonth() + 1)).slice(-2)
  const d = ('0' + date.getDate()).slice(-2)
  defaultDate = `${y}-${m}-${d}`
  res.render('new', { date: defaultDate })
})

router.post('/', authenticated, (req, res) => {
  Record.create({
    name: req.body.name,
    category: req.body.category,
    date: req.body.date,
    amount: req.body.amount,
    merchant: req.body.merchant,
    UserId: req.user.id
  })
    .then(record => {
      return res.redirect('/')
    })
    .catch(error => {
      return res.status(422).json(error)
    })
})

router.get('/:id/edit', authenticated, (req, res) => {
  User.findByPk(req.user.id)
    .then(user => {
      if (!user) throw new Error("User not found!")
      return Record.findOne({
        raw: true,
        where: {
          id: req.params.id, UserId: req.user.id
        }
      })
        .then(record => {
          const y = record.date.getFullYear()
          const m = ('0' + (record.date.getMonth() + 1)).slice(-2)
          const d = ('0' + record.date.getDate()).slice(-2)
          record.date = `${y}-${m}-${d}`
          switch (record.category) {
            case '家居物業':
              record.household = true
              break
            case '交通出行':
              record.transportation = true
              break
            case '休閒娛樂':
              record.entertainment = true
              break
            case '餐飲食品':
              record.food = true
              break
            default:
              record.others = true
              break
          }
          return res.render('edit', { record })
        })
        .catch(error => {
          return res.status(422).json(error)
        })
    })
})

router.put('/:id', authenticated, (req, res) => {
  Record.findOne({
    where: {
      id: req.params.id, UserId: req.user.id
    }
  })
    .then(record => {
      record.name = req.body.name
      record.category = req.body.category
      record.date = req.body.date
      record.amount = req.body.amount
      record.merchant = req.body.merchant
      return record.save()
    })
    .then(record => {
      return res.redirect('/')
    })
    .catch(error => {
      return res.status(422).json(error)
    })
})

router.delete('/:id/delete', authenticated, (req, res) => {
  User.findByPk(req.user.id)
    .then(user => {
      if (!user) throw new Error("User not found!")
      return Record.destroy({
        where: {
          id: req.params.id, UserId: req.user.id
        }
      })
        .then(record => {
          return res.redirect('/')
        })
        .catch(error => {
          return res.status(422).json(error)
        })
    })
})

router.get('/filter', authenticated, (req, res) => {
  User.findByPk(req.user.id)
    .then(user => {
      if (!user) throw new Error("User not found!")

      return Record.findAll({
        raw: true,
        where: {
          UserId: req.user.id
        },
        order: [['date', 'DESC']]
      })
        .then(records => {

          for (let record of records) {
            record.month = ('0' + (record.date.getMonth() + 1)).slice(-2).toString()
          }
          const categoryFiltered = req.query.category || ''
          const monthFiltered = req.query.month || ''
          const firstResults = records.filter(record => {
            return record.category.includes(categoryFiltered)
          })

          const results = firstResults.filter(record => {
            return record.month.includes(monthFiltered)
          })

          let totalAmount = 0
          for (let result of results) {
            totalAmount += result.amount
            const y = result.date.getFullYear()
            const m = ('0' + (result.date.getMonth() + 1)).slice(-2)
            const d = ('0' + result.date.getDate()).slice(-2)
            result.date = `${y}-${m}-${d}`
            switch (result.category) {
              case '家居物業':
                result.household = true
                break
              case '交通出行':
                result.transportation = true
                break
              case '休閒娛樂':
                result.entertainment = true
                break
              case '餐飲食品':
                result.food = true
                break
              default:
                result.others = true
                break
            }
          }

          let categoryFilter = false
          if (req.query.category) {
            categoryFilter = true
          }
          let monthFilter = false
          if (req.query.month) {
            monthFilter = true
          }

          res.render('index', { records: results, totalAmount, categoryFilter, categoryFiltered, monthFilter, monthFiltered })
        })
        .catch(error => {
          return res.status(422).json(error)
        })
    })
})

module.exports = router