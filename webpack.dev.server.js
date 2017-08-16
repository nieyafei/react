var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');



var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')

var compiler = webpack(config);



// 相当于通过本地node服务代理请求到了http://cnodejs.org/api
//http://60.205.142.21:8088/home?name=zhangsan3
/*var proxy = [{
 path: '/api/!*',
 target: 'https://cnodejs.org',
 host: 'cnodejs.org'
 }];*/



var proxy = [{
    path: '/api',
    target: 'http://localhost:9090',
    host: 'localhost',
    changeOrigin:true
}];



//启动服务
var server = new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    proxy: proxy,
    stats: {
        colors: true,
        historyApiFallback: true,
        hot:true
    },
});




// server.use(require("webpack-dev-middleware")(compiler, {
//     noInfo: true, publicPath: config.output.publicPath
// }));
//
// server.use(require("webpack-hot-middleware")(compiler));


server.use(webpackDevMiddleware(compiler, { poll: true, noInfo: true, publicPath: config.output.publicPath }))
// server.use(webpackHotMiddleware(compiler))
server.use(webpackHotMiddleware(compiler, {
    log: console.log,
    path: '/__webpack_hmr',
    reload : true
}));



//将其他路由，全部返回index.html
server.app.get('*', function (req, res) {
    res.sendFile(__dirname + '/index.html')
});
server.app.post('*', function (req, res) {
    res.sendFile(__dirname + '/index.html')
})

server.listen(4000);
