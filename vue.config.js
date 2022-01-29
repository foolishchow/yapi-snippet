/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
    chainWebpack(config){
        config.optimization.minimize(true)
        config.devtool(false)
    }
}
