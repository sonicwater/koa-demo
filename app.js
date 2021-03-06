const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const service = require('koa-service')
const cors = require('koa2-cors')
const koaJwt = require('koa-jwt') 
const { secret } = require('./src/config/jwt');

//统一错误异常处理
const errorHandler = require('./src/middleware/errorHandler');
errorHandler(app);

const path = require('path')

const router = require('./src/routes/routers')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))


app.use(koaJwt({secret,passthrough:true}).unless({
  path:[/\/register/, /\/login/]
}))

app.use(service({serviceRoot: path.join(__dirname, '/src/service')}))

app.use(cors({
  origin: function(ctx) { //设置允许来自指定域名请求
    // if (ctx.url === '/test') {
    //     return '*'; // 允许来自所有域名请求
    // }
    return '*';
  },
  maxAge: 5, //指定本次预检请求的有效期，单位为秒。
  credentials: true, //是否允许发送Cookie
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
  exposeHeaders: ['WWW-Authenticate', 'Authorization'] //设置获取其他自定义字段
}));

// app.all('*', function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//   res.header("X-Powered-By",' 3.2.1')
//   res.header("Content-Type", "application/json;charset=utf-8");
//   next();
// });

// app.use(async(ctx, next)=> {
//   // let token = ctx.headers.authorization;
//   let token = ctx.header.authorization;
//   console.log('--------');
//   console.log(token);
//   console.log('--------');
//   if(token == undefined){
//     await next();
//   }else{
//     jwt.verify(token, secret, function(err, res){
//       //这一步是为了把解析出来的用户信息存入全局state中，这样在其他任一中间价都可以获取到state中的值
//       if (err) {
//         console.log(err)
//         ctx.state = {
//           data:err
//         };
//       }else{
//         console.log(res)
//         ctx.state = {
//           data:res
//         };
//       }
//     })
//     await next();
//   }
// })

// app.use(async(ctx, next)=>{
//   return next().catch((err) => {
//     if (401 == err.status) {
//       ctx.status = 401;
//       ctx.body = {
//         status:401,
//         msg:'登录过期，请重新登录'
//       }
//     } else {
//       throw err;
//     }
//   });
// });

// logger
app.use(async (ctx, next) => {
  const start = new Date()

  // // 允许来自所有域名请求
  // ctx.set("Access-Control-Allow-Origin", "*");
  // // 这样就能只允许 http://localhost:8080 这个域名的请求了
  // // ctx.set("Access-Control-Allow-Origin", "http://localhost:8080"); 

  // // 设置所允许的HTTP请求方法
  // ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");

  // // 字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段.
  // ctx.set("Access-Control-Allow-Headers", "x-requested-with, accept, origin, content-type");

  // // 服务器收到请求以后，检查了Origin、Access-Control-Request-Method和Access-Control-Request-Headers字段以后，确认允许跨源请求，就可以做出回应。

  // // Content-Type表示具体请求中的媒体类型信息
  // ctx.set("Content-Type", "application/json;charset=utf-8");

  // // 该字段可选。它的值是一个布尔值，表示是否允许发送Cookie。默认情况下，Cookie不包括在CORS请求之中。
  // // 当设置成允许请求携带cookie时，需要保证"Access-Control-Allow-Origin"是服务器有的域名，而不能是"*";
  // ctx.set("Access-Control-Allow-Credentials", true);

  // // 该字段可选，用来指定本次预检请求的有效期，单位为秒。
  // // 当请求方法是PUT或DELETE等特殊方法或者Content-Type字段的类型是application/json时，服务器会提前发送一次请求进行验证
  // // 下面的的设置只本次验证的有效时间，即在该时间段内服务端可以不用进行验证
  // ctx.set("Access-Control-Max-Age", 300);

  // /*
  // CORS请求时，XMLHttpRequest对象的getResponseHeader()方法只能拿到6个基本字段：
  //     Cache-Control、
  //     Content-Language、
  //     Content-Type、
  //     Expires、
  //     Last-Modified、
  //     Pragma。
  // */
  // // 需要获取其他字段时，使用Access-Control-Expose-Headers，
  // // getResponseHeader('myData')可以返回我们所需的值
  // ctx.set("Access-Control-Expose-Headers", "myData");
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(router.routes())



// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
