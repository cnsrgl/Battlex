module.exports = {
    chainWebpack: (config) => {
      const svgRule = config.module.rule('svg');
  
      svgRule.uses.clear();
  
      svgRule
      .use('vue-loader-v16')
      .loader('vue-loader-v16') // or `vue-loader-v16` if you are using a preview support of Vue 3 in Vue CLI
      .end()
      .use('vue-loader-v16')
      .loader('vue-loader-v16');
  },
    devServer: {
        'port': 5600
    }
  };