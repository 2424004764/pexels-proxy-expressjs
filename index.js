const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const https = require('https');

// 配置 TLS 设置，禁用 TLS 1.0
// 配置 TLS 设置，禁用 TLS 1.0，仅允许 TLS 1.1 及以上版本
const serverOptions = {
  secureOptions: require('constants').SSL_OP_NO_TLSv1, // 禁用 TLS 1.0
  minVersion: 'TLSv1.1', // 设置最小支持的 TLS 版本为 TLS 1.1
};

const app = express();
// 启用 HTTPS 服务器，并应用 TLS 设置
const server = https.createServer(serverOptions, app);

try {
  // 应用启动逻辑

  // 创建一个代理中间件，将以 /photos 开头的请求代理到目标地址
  const photosProxy = createProxyMiddleware({
    target: "http://images.pexels.com/photos",
    changeOrigin: true, // 设置更改请求头中的 Origin
    pathRewrite: {
      // 将 /photos 开头的请求重写为目标地址的不同路径，保留 /photos
      '^/photos': '' // 保留 /photos 部分，只替换后面的部分
    },
    onProxyRes: function (proxyRes, req, res) {
      proxyRes.headers['Cache-Control'] = 'no-store'; // 禁用浏览器缓存
    }
  });

  // 使用代理中间件来处理以 /photos 开头的请求
  app.use('/photos', photosProxy);

  const photosApiProxy = createProxyMiddleware({
    target: "https://api.pexels.com",
    changeOrigin: true,
    pathRewrite: {
      '^/pexels-api': ''
    }
  });

  // 当请求pexels-api时也转发
  app.use('/pexels-api', photosApiProxy);

  // 根目录路由处理函数，输出当前时间
  app.get('/', (req, res) => {
    const currentTime = new Date().toLocaleString();  // 获取当前时间
    res.send(`Current time is: ${currentTime}`);       // 返回当前时间到客户端
  });

  server.listen(80, () => {
    console.log("启动成功4");
  });
} catch (error) {
  console.error('Failed to start application:', error);
  process.exit(1); // 退出应用并返回非零状态码
}

