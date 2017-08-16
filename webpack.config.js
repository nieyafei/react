var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

var path = require('path');
var BUILD_DIR = path.resolve(__dirname, 'dist');//出口目录
var APP_DIR = path.resolve(__dirname, 'src/app');//入口目录
var publicPath = "/dist/";
var plugins = [];
if (process.argv.indexOf('-p') > -1) { //生产环境
    plugins.push(new webpack.DefinePlugin({ //编译成生产版本
        'process.env': {
            NODE_ENV: JSON.stringify('production')
        }
    }));
    publicPath = '/';
    //打包的脚本有无法解析的，暂时注释掉
    plugins.push(
        /*new BundleAnalyzerPlugin({
            generateStatsFile: true
        }),*/
        new webpack.optimize.UglifyJsPlugin({
            mangle: true,
            compress: {
                warnings: false, // Suppress uglification warnings
                pure_getters: true,
                unsafe: true,
                unsafe_comps: true,
                screw_ie8: true,
                drop_console: true
            },
            output: {
                comments: false,
            },
            exclude: [/\.min\.js$/gi] // skip pre-minified libs
        })
    )
}
plugins.push(
    new webpack.LoaderOptionsPlugin({
        options: {
            postcss: function() {
                return [require('autoprefixer')];
            },
        }
    })
)
plugins.push(
    new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
        filename: './index.html', //生成的html存放路径，相对于 path
        template: 'template.html', //html模板路径
        hash: true,    //是否为静态资源生成hash值，true 或者 false
    })
)
plugins.push(
    new ExtractTextPlugin('[name].css')
)
plugins.push(
    new webpack.HotModuleReplacementPlugin()
)
plugins.push(
    // new BrowserSyncPlugin({
    //     host: 'localhost',
    //     port: 4001,
    //     proxy: 'localhost:4000',
    //     files: 'src/*',
    //     files: './'
    // })
)

//TODO:
// 上线时，把  'webpack-hot-middleware/client?path=http://localhost: 这个入口去掉，这个入口只是开发时使用的
//建议再建立一个 webpack.prod.config.js

var config = {
    entry: [
        // 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
        //'webpack-hot-middleware/client?path=http://localhost:4000/__webpack_hmr&reload=true',
        APP_DIR + '/App.jsx',//入口jsx
    ],
    output: {
        publicPath, //编译好的文件，在服务器的路径
        path: BUILD_DIR,
        filename: 'bundle.js',
    },//出口
    module: {
        rules: [
            {
                test: /\.jsx$/,
                use: [
                    'babel-loader'
                ],
                include: [
                    APP_DIR
                ]
            },
            {
                test: /\.((woff2?|svg)(\?v=[0-9]\.[0-9]\.[0-9]))|(woff2?|svg|jpe?g|png|gif|ico|jpg)$/,
                loaders: [
                    // 小于10KB的图片会自动转成dataUrl
                    'url-loader?limit=8192&name=images/[hash:8].[name].[ext]'
                ]
            },
            {
                test: /\.((ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9]))|(ttf|eot)$/,
                loader: 'url-loader?limit=10000&name=fonts/[hash:8].[name].[ext]'
            },
            {
                test: /\.(tpl|ejs)$/,
                loader: 'ejs'
            }, {
                test: /\.css$/,
                exclude: /^node_modules$/,
                loader: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader' })
            }, {
                test: /\.scss$/,
                loader: 'style!css!sass'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
            },
            {
                test: /\.less/,
                loader: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader!less-loader' })
            }
        ]
    },
    plugins,
    resolve:{
        extensions:['.web.js','.js','.jsx','.json']
    }
};
module.exports = config;