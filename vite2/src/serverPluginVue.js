const path = require('path')
const fs = require('fs').promises;
function vuePlugin({app,root   }){
    app.use(async (ctx,next) => {
        if(!ctx.path.endsWith('.vue')){
            return next();
        }
        // 路径有/用path.join，没有/的用path.resolve
        const filePath = path.join(root,ctx.path);
        const content = await fs.readFile(filePath,'utf8');
        
        // 解析模板
        const {compileTemplate,parse} = require(path.resolve(root,'node_modules','@vue/compiler-sfc/dist/compiler-sfc.cjs.js'));
        console.log(content)
        let {descriptor} = parse(content);

        if(!ctx.query.type){
            // app.vue文件
            let code = ''
            console.log(descriptor)
            if(descriptor.script){
                let content = descriptor.script.content;

                code += content.replace(/((?:^|\n|;)\s*)export default/,'$1const __script=')
            }

            if(descriptor.template){
                const requestPath =  ctx.path + '?type=template';
                code += `\nimport {render as __render } from "${requestPath}"`;
                code += `\n__script.render = __render`
            }
            code += `\nexport default __script`;
            ctx.type = 'js'
            ctx.body = code

        }
        if(ctx.query.type === 'template'){
            ctx.type = 'js';
            let content = descriptor.template.content;
            const {code} = compileTemplate({source: content})
            ctx.body = code;
        }


    })
}
module.exports = vuePlugin;