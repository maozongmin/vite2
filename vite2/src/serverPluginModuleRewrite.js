const { readBody } = require("./utils");
const { parse } = require('es-module-lexer');
const MagicString = require('magic-string')
function rewriteImports(source) {
    let imports = parse(source)[0];
    let ms = new MagicString(source);
    if(imports.length){
        imports.forEach(v =>  {
            let {s,e} = v;
            console.log(s)
            let id = source.slice(s,e);
            if(!/^[\/\.]/.test(id)){
                id = `/@modules/${id}`;
                ms.overwrite(s,e,id);
            }
        })
    }

    return ms.toString()
}

function moduleRewritePlugin({ app, root }) {

    console.log('1moduleRewritePlugin')
    app.use(async (ctx, next) => {
        await next();
        // 默认会先执行静态服中间件，会将结果放到ctx.body
        //只处理js
        if (ctx.body && ctx.response.is('js')) {
            let r = await readBody(ctx.body); //vue => /@modules
            const result = rewriteImports(r);
            ctx.body = result;
            // console.log(r)
            // return ctx;
        }
    })
}

module.exports = moduleRewritePlugin;