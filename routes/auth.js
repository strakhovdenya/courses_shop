const { Router } = require('express')
const bcrypt = require('bcryptjs')
const router = Router()
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
const User = require('./../models/user')
const keys = require('../keys')
const regEmail = require('../emails/registration')
const sgMail = require('@sendgrid/mail');


sgMail.setApiKey(keys.SENDGRID_API_KEY);
const transporter = nodemailer.createTransport(sendgrid({
    auth: { api_key: keys.SENDGRID_API_KEY }
}))

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true,
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError')

    })
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login')
    })

})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        const candidate = await User.findOne({ email })

        if (candidate) {
            const isSame = await bcrypt.compare(password, candidate.password)

            if (isSame) {
                req.session.user = candidate
                req.session.isAuthenticated = true
                req.session.save(err => {
                    if (err) {
                        throw err
                    }
                    res.redirect('/')
                })
                return
            }
        }
        req.flash('loginError', 'Email или пароль неправильные')
        res.redirect('/auth/login#login')

    } catch (e) {
        console.log(e);
    }

})

router.post('/register', async (req, res) => {
    try {
        const { email, password, confirm, name } = req.body
        const candidate = await User.findOne({ email })

        if (candidate) {
            req.flash('registerError', 'Пользователь с таким email уже существует')
            res.redirect('/auth/login#register')
        } else {
            const hashPassword = bcrypt.hashSync(password, 10)
            const user = new User({
                email,
                password: hashPassword,
                name,
                cart: { items: [] }
            })

            await user.save()
           
            await sgMail.send(regEmail(email))
            res.redirect('/auth/login#login')
        }
    } catch (e) {
        console.log(e);
    }
})

module.exports = router