const { Router } = require('express')
const bcrypt = require('bcryptjs')
const router = Router()
const User = require('./../models/user')

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true
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
            res.redirect('auth/login#register')
        } else {
            const hashPassword = bcrypt.hashSync(password, 10)
            const user = new User({
                email,
                password: hashPassword,
                name,
                cart: { items: [] }
            })

            await user.save()
            res.redirect('/auth/login#login')
        }
    } catch (e) {
        console.log(e);
    }
})

module.exports = router