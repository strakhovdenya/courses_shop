const {Router} = require('express')
const router = Router()

router.get('/', (req,res)=>{
    res.render('index',{
        title: 'Главня',
        isHome: true
    })
})



module.exports = router