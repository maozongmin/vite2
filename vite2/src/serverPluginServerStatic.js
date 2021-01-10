const static = require('koa-static')
const path = require("path")
function serveStaticPlugin({app,root}){
    console.log('serveStaticPlugin')
    app.use(static(root));
    console.log(root)
    app.use(static(path.resolve(root,'public'))); 
}

module.exports = serveStaticPlugin;