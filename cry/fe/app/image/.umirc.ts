import { IConfig } from 'umi-types';
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isProd = process.env.NODE_ENV === 'production';

// 工具 ID
const PANDORA_TOOL_ID = '';

// ref: https://umijs.org/config/
const config: IConfig = {
  treeShaking: true,
  cssLoaderOptions: {
    localIdentName: '[local]',
  },
  hash: true,
  autoprefixer: {
    browsers: ['> 1%', 'last 2 versions', 'not ie <= 10'],
  },
  extraBabelIncludes: [/app\-common/, /\/common\//],
  base: `/app/image`,
  publicPath: isProd ? `/dist/app/image/` : '/',
  outputPath: `../../../www/dist/app/image/`,
  proxy: {
    '/api': {
      target: 'http://dev.yidian-inc.com:5000',
      changeOrigin: true,
    },
  },
  define: {
    APP_ENV: isProd ? 'production' : 'development',
    PANDORA_TOOL_ID,
  },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: { webpackChunkName: true },
        title: '图片视频小工具',
        scripts: [
          {
            src: `http://pandora.yidian-inc.com/tools/toolbridge?toolid=${PANDORA_TOOL_ID}&position=left&theme=default`,
          },
        ],
        dll: false,
        routes: {
          exclude: [
            /models\//,
            /services\//,
            /model\.(t|j)sx?$/,
            /service\.(t|j)sx?$/,
            /components\//,
          ],
        },
      },
    ],
  ],

  chainWebpack(config) {
    // console.log('config start ---------');
    // console.log(config);
    // console.log('config end -----------');
    config.merge(
      isProd
        ? {
            // plugins: [new BundleAnalyzerPlugin()],
            optimization: {
              minimize: true,
              splitChunks: {
                chunks: 'async',
                minSize: 30000,
                minChunks: 2,
                automaticNameDelimiter: '.',
                cacheGroups: {
                  vendor: {
                    name: 'vendors',
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'all',
                    priority: 10,
                  },
                  antd: {
                    name: 'antd',
                    test: /[\\/]node_modules[\\/](@ant-design|antd)[\\/]/,
                    chunks: 'all',
                    priority: 11,
                  },
                  xgplayer: {
                    name: 'xgplayer',
                    // test: /[\\/]node_modules[\\/]xgplayer[\\/]/,
                    test: /xgplayer/,
                    chunks: 'async',
                    priority: 11,
                  },
                  // bizcharts: {
                  //   name: 'bizcharts',
                  //   test: /[\\/]node_modules[\\/]bizcharts[\\/]/,
                  //   chunks: 'async',
                  //   priority: 11,
                  // },
                  // xlsx: {
                  //   name: 'xlsx',
                  //   test: /[\\/]node_modules[\\/]xlsx[\\/]/,
                  //   chunks: 'async',
                  //   priority: 11,
                  // },
                  commons: {
                    // 其余同步加载包
                    name: 'commons',
                    chunks: 'all',
                    priority: 8,
                    minChunks: 2,
                  },
                },
              },
            },
          }
        : {},
    );
    // 利用缓存加速打包构建，基本可以从1.32m => 29或者16s
    // isProd && config.plugin('HardSourceWebpackPlugin').use(HardSourceWebpackPlugin);
    // config.module
    //   .rule('compile')
    //   .use('thread')
    //   .loader('thread-loader')
    //   .options({ workers: 4 });
  },
  ignoreMomentLocale: true,
};

export default config;
