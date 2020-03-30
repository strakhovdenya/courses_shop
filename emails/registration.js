const keys = require('../keys')

module.exports = function (email) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Аккауунт создан',
        html: `
            <h1>Добро пожаловть в наш магазин</h1>
            <p>Вы успешно создали аккаунт - ${email}</p>
            <hr/>
            <a href="${keys.BASE_URL}">Магазин курсов</a>
        `
    }
}