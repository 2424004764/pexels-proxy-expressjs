const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// 创建一个代理中间件，将以 /photos 开头的请求代理到目标地址
const photosProxy = createProxyMiddleware('/photos', {
  target: 'images.pexels.com/photos',  // 目标代理地址
  changeOrigin: true,        // 更改请求头中的 Origin
});

// 使用代理中间件来处理以 /photos 开头的请求
app.use('/photos', photosProxy);

// 根目录路由处理函数，输出当前时间
app.get('/', (req, res) => {
  const currentTime = new Date().toLocaleString();  // 获取当前时间
  res.send(`Current time is: ${currentTime}`);       // 返回当前时间到客户端
});


const port = process.env.PORT || 80;

async function bootstrap() {
  // await initDB();
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}

bootstrap();
