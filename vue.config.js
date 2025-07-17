// vue.config.js
module.exports = {
    chainWebpack: config => {
        config.plugins.delete('progress') // 禁用进度插件
    },

    // 同时确保使用 Webpack 4 兼容配置
    configureWebpack: {
        plugins: [
            // 其他插件...
        ]
    }
}