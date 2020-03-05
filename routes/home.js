const express = require('express')
const router = express.Router()

const db = require('../models')
const Record = db.Record
const User = db.User

const { authenticated } = require('../config/auth')

router.get('/', authenticated, (req, res) => {
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
          let totalAmount = 0
          for (let record of records) {
            totalAmount += record.amount
            const y = record.date.getFullYear()
            const m = ('0' + (record.date.getMonth() + 1)).slice(-2)
            const d = ('0' + record.date.getDate()).slice(-2)
            record.date = `${y}-${m}-${d}`
            record.filterMonth = `${m}`
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
          }
          return res.render('index', { records, totalAmount })
        })
        .catch(error => {
          return res.status(422).json(error)
        })
    })
})

module.exports = router