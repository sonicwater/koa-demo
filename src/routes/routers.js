const Router = require('koa-router')
const router = new Router()
const UserController = require('../controllers/user')
// const { secret } = require('./src/config/jwt');
// const koaJwt = require('koa-jwt')({secret})


router.post('/user/login', UserController.login)
router.post('/user/getInfo', UserController.getInfo)



router.use('/api', router.routes())
module.exports = router
