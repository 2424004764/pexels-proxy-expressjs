const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

try {
  // 创建一个代理中间件，将以 /photos 开头的请求代理到目标地址
  const photosProxy = createProxyMiddleware({
    target: "http://images.pexels.com/photos",
    changeOrigin: true, // 设置更改请求头中的 Origin
    pathRewrite: {
      // 将 /photos 开头的请求重写为目标地址的不同路径，保留 /photos
      '^/photos': '' // 保留 /photos 部分，只替换后面的部分
    },
    onProxyRes: function (proxyRes, req, res) {
      // 修改响应头信息，隐藏跳转细节
      proxyRes.headers['X-Forwarded-Host'] = req.headers['host'];
      proxyRes.headers['X-Forwarded-Proto'] = req.headers['x-forwarded-proto'] || 'http';
    },
  });

    // 创建一个代理中间件，将以 /videos 开头的请求代理到目标地址
    const videosProxy = createProxyMiddleware({
      target: "http://images.pexels.com/videos",
      changeOrigin: true, // 设置更改请求头中的 Origin
      pathRewrite: {
        // 将 /photos 开头的请求重写为目标地址的不同路径，保留 /videos
        '^/videos': '' // 保留 /videos 部分，只替换后面的部分
      },
      onProxyRes: function (proxyRes, req, res) {
        // 修改响应头信息，隐藏跳转细节
        proxyRes.headers['X-Forwarded-Host'] = req.headers['host'];
        proxyRes.headers['X-Forwarded-Proto'] = req.headers['x-forwarded-proto'] || 'http';
      },
    });

  // 使用代理中间件来处理以 /photos 开头的请求
  app.use('/photos', photosProxy);
  // 使用代理中间件来处理以 /photos 开头的请求
  app.use('/videos', videosProxy);

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

  app.listen(80, () => {
    console.log("启动成功");
  });
} catch (error) {
  console.error('Failed to start application:', error);
  process.exit(1); // 退出应用并返回非零状态码
}

