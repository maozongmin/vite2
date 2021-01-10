const reg = /^\/@modules\//
const path = require('path');
const fs = require('fs').promises;
function moduleResolvePlugin({ app, root }) {
    app.use(async (ctx, next) => {
        console.log(ctx.path)
        // 如果没有匹配到@module，就往下执行
        if (!reg.test(ctx.path)) {
            return next();
        }
        const id = ctx.path.replace(reg,'');
        let mapping = {
            vue: path.resolve(root,'node_modules','@vue/runtime-dom/dist/runtime-dom.esm-browser.js')
        }

            
        const content = await fs.readFile(mapping[id],'utf8');
        ctx.type = 'js';
        ctx.body = content;
        console.log(id + '_xx')
    })
}

module.exports = moduleResolvePlugin;