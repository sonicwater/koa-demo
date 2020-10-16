const crypto = require('crypto');
const moment = require('moment');
const _ = require('lodash');
const jwt = require('jsonwebtoken'); // 生成token 
const db = require('../config/db');
const { secret } = require('../config/jwt');
// 引入Sequelize对象
const Sequelize = db.sequelize;
// 引入上一步的文章数据表模型文件
const User = Sequelize.import('../models/user');

const checkToken = require('../middleware/checkToken');


class UserService {

  // 登陆
  async login(ctx,next){
    const { username, password } = ctx.request.body;
    if( username !== '' && password !== '' ){
      const isValidUser = await this.validUser(username, password);
      if (isValidUser) {
        const token = jwt.sign({ 
          username,
          //token的创建日期
          time: Date.now(),
          //token的过期时间
          timeout: Date.now() + 60000,
        }, secret
          // ,{ expiresIn: 1000*60*60*24 }
        );
        return { code: 200, msg: '登录成功', data:{ token } };
      } else {
        return { code: 400, msg: '登录失败', data:null };
      }
    }else{
      // return { code: 400, msg: '用户名密码必须', data:null };
      // await next();
    }
  }

  // 获取用户信息
  async getInfo(ctx,next){

    let tokenItem = await checkToken(ctx,next);

    if( tokenItem.status == 200 ){

    }else{
      return tokenItem;
    }
    
  }

  // 查询user表，验证密码和花名
  async validUser(username, password) {
    const data = await this.getUser();
    const pwd = crypto.createHash('md5').update(password).digest('hex');
    for (const item of data) {
      if (item.name === username && item.password === pwd) return true;
    }
    return false;
  }

  // 获取用户，不传id则查询所有
  async getUser(id) {
    // const _this = this;
    const { ctx } = this;
    if (id) {
      // noinspection JSAnnotator
      const res = _.cloneDeep(await User.findByPk(id));
    //   res.user_role = this.getRoleName(res.user_role);
    //   res.login_time = moment(parseInt(res.login_time)).format('YYYY-MM-DD hh:mm:ss');
      return res;
    }
    return await User.findAll();
  }

}
   
module.exports = UserService;