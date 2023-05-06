const path = require('path');

module.exports = {
  outputDir: path.resolve('../../../www/dist/app/user-stimulation'),
  publicPath: '/dist/app/user-stimulation',
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://dev.yidian-inc.com:5000',
        changeOrigin: true,
      },
    },
  },
};
