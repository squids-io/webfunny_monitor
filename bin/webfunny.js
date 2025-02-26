#!/usr/bin/env node

    var app = require('../app');
    var debug = require('debug')('demo:server');
    var { accountInfo } = require("../config/AccountConfig")
    
    var port = normalizePort(process.env.PORT || accountInfo.localServerPort);
    app.listen(port);
    
    function normalizePort(val) {
      var port = parseInt(val, 10);
    
      if (isNaN(port)) {
        // named pipe
        return val;
      }
    
      if (port >= 0) {
        // port number
        return port;
      }
    
      return false;
    }
    
    function onError(error) {
      if (error.syscall !== 'listen') {
        throw error;
      }
    
      var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;
    
      // handle specific listen errors with friendly messages
      switch (error.code) {
        case 'EACCES':
          console.error(bind + ' requires elevated privileges');
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(bind + ' is already in use');
          process.exit(1);
          break;
        default:
          throw error;
      }
    }
    
    function onListening() {
      var addr = server.address();
      var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
      debug('Listening on ' + bind);
    }
    
    // 启动静态文件服务器
    const KoaStatic = require('koa');
    const appStatic = new KoaStatic();
    const server = require('koa-static');
    /* gzip压缩配置 start */
    const compress = require('koa-compress');
    const options = { 
        threshold: 1024 //数据超过1kb时压缩
    };
    /* gzip压缩配置 end */
    
    // 1.主页静态网页 把静态页统一放到public中管理
    const publicServer = server('./views');
    // 2.重定向判断
    const redirect = ctx => {
      ctx.response.redirect('/webfunny/home.html')
    };
    // 3.分配路由
    appStatic.use(compress(options))
    appStatic.use(async (ctx, next) => {
      if (ctx.url === '/' || ctx.url === '/webfunny/') {
        redirect(ctx)
      } else {
        await next()
      }
    });
    appStatic.use(publicServer);
    appStatic.listen(accountInfo.localAssetsPort);