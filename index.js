const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// 创建一个代理中间件，将 folgode.com 的请求代理到 aa.com
const proxyMiddleware = createProxyMiddleware({
  target: 'images.pexels.com',  // 目标代理地址
  changeOrigin: true,        // 更改请求头中的 Origin
  // 其他可选配置项
});

// 使用代理中间件来处理所有 folgode.com 的请求
app.use('*', (req, res, next) => {
  // 检查请求的主机名是否为 folgode.com
  if (req.hostname === '	pexels-proxy.folgode.com') {
    // 使用代理中间件处理请求
    proxyMiddleware(req, res, next);
  } else {
    // 如果请求的主机名不是 folgode.com，则继续正常的请求处理
    next();
  }
});
const port = process.env.PORT || 80;

async function bootstrap() {
  // await initDB();
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}

bootstrap();
