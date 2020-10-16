

class userController {
  static async login(ctx,next) {
    const res = await ctx.service.user.login(ctx,next);
    ctx.body = res;
  }

  static async getInfo(ctx,next) {
    const res = await ctx.service.user.getInfo(ctx,next);
    ctx.body = res;
  }
}
module.exports = userController
