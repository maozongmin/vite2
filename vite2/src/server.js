const Koa = require('koa');
const moduleResolvePlugin = require('./serverPluginModuleResolve');
const moduleRewritePlugin = require('./serverPluginModuleRewrite');
const serveStaticPlugin = require('./serverPluginServerStatic');
const vuePlugin = require('./serverPluginVue');

function createServer(){
    let app = new Koa();
    // 实现静态服务功能，koa-static 可以返回对应文件

    const context = { // 创建一个上下文，给不同的插件共享功能
        app,
        root: process.cwd() // 根目录（命令行执行时的路径）
    }
    const resolvePlugin = [
        moduleRewritePlugin, // 模块路径重写,之后浏览器会再次发送请求
        moduleResolvePlugin, // 获取文件
        vuePlugin, // 解析.vue文件
        serveStaticPlugin, // 静态服务插件
    ];
    resolvePlugin.forEach(plugin => plugin(context))
    return app;
}

createServer().listen(4000,() => {
    console.log('vite start 4000')
})

// nodemon 热更新node服务