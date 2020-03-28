const { Router } = require('express')
const router = Router()
const Course = require('../models/course')

function mapCartItems(cart) {
    return cart.items.map(c => ({
         ...c.courseId._doc,
         id:c.courseId.id, 
         count: c.count 
        }))
}

function computePrise(courses) {
    return courses.reduce((total, course) => {
        return total += course.price * course.count
    }, 0)
}

router.post('/add', async (req, res) => {
    const course = await Course.findById(req.body.id)
    await req.user.addToCart(course)

    res.redirect('/card')
})

router.delete('/remove/:id', async (req, res) => {
    await req.user.removeFromCart(req.params.id)
    const user = await req.user.populate('cart.items.courseId').execPopulate()

    const courses = mapCartItems(user.cart)
    const cart = {
        courses, price:computePrise(courses)
    }
    res.status(200).json(cart)
})

router.get('/', async (req, res) => {
    const user = await req.user
        .populate('cart.items.courseId')
        .execPopulate()
    const courses = mapCartItems(user.cart)

    res.render('card', {
        title: 'Корзина',
        courses: courses,
        price: computePrise(courses),
        isCard: true
    })

})

module.exports = router