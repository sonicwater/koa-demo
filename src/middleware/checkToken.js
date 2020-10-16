const jwt = require('jsonwebtoken')
const { secret } = require('../config/jwt');

module.exports = async (ctx, next) => {
  // 否则获取到token
  let token = ctx.request.headers["authorization"];
  let result = {
    status: 401,
    message:'token 无效'
  }  
  if (token) {
    token = token.split(' ')[1];
    // console.log('------')
    // console.log(token)
    // console.log('------1')
    // 如果有token的话就开始解析
    const tokenItem = jwt.verify(token, secret)
    // 将token的创建的时间和过期时间结构出来
    const { time, timeout } = tokenItem
    // 拿到当前的时间
    let data = new Date().getTime();
    // 判断一下如果当前时间减去token创建时间小于或者等于token过期时间，说明还没有过期，否则过期
    if (data - time <= timeout) {
      // token没有过期
      result.status = 200;
      result.message = 'token 没有过期';
    } else {
      result.status = 405;
      result.message = 'token 已过期，请重新登陆';
    }
  }
  return result;
}