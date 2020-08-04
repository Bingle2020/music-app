//导入express模块
const express = require('express');

//创建express实例
const app = express();

//创建静态目录
app.use(express.static('public'));


//创建请求路由
app.get('/', function (req, res) {
	//req： 请求对象
	//res:  响应对象
	res.send('访问成功');
})

//监听端口
app.listen(10001, function () {
	console.log('the server running at http://127.0.0.1:10001');
})