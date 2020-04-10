const { body } = require('express-validator')
const User = require('../models/user')

exports.registerValidators = [
    body('email')
        .isEmail()
        .withMessage('Введите корректный email')
        .custom(async (value, { req }) => {
            try {
                const user = await User.findOne({ email: value })
                if (user) {
                    return Promise.reject('Такой email уже занят')
                }
            } catch (e) {
                console.log(e);
            }
        })
        .normalizeEmail(),
    body('password', 'Пароль должен быть минимум 6 символов')
        .isLength({ min: 6, max: 10 })
        .isAlphanumeric(),
    body('confirm').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Пароли должны совпадать')
        }
        return true
    })
        .trim(),
    body('name', 'Имя не должно быть меньше 3х символов')
        .isLength({ min: 3 })
        .trim(),
]

exports.courseValidators = [
    body('title')
        .isLength({ min: 3 })
        .withMessage('Минимальная длинна названия 3 символа')
        .trim(),
    body('price')
        .isNumeric()
        .withMessage('Введите корректную цену'),
    body('image')
        .isURL()
        .withMessage('Введите корректный Url картинки'),
]