import { IConfig } from 'umi-types';
const path = require('path');
const isProd = process.env.NODE_ENV === 'production';
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const PANDORA_TOOL_ID = '';

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
  base: `/app/audit-system`,
  publicPath: isProd ? `/dist/app/audit-system/` : '/',
  outputPath: `../../../www/dist/app/audit-system/`,
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
    [
      'umi-plugin-react',
      {
        chunks: ['vendors', 'umi'],
        antd: true,
        dva: true,
        dynamicImport: { webpackChunkName: true },
        title: '暴雪系统',
        scripts: [
          {
            src: `//at.alicdn.com/t/font_2276405_u9tpwh69bbq.js`,
          },
          {
            src: `http://pandora.yidian-inc.com/tools/toolbridge?toolid=${PANDORA_TOOL_ID}&position=left&theme=default`,
          },
          {
            src: `https://static.yidianzixun.com/modules/build/common/tagcomponent.js`,
          },
        ],
        metas: [
          { name: 'referrer', content: 'never' },
          { name: 'env', content: process.env.NODE_ENV },
          { name: 'time', content: new Date() },
        ],
        links: [{ rel: 'stylesheet', href: '//at.alicdn.com/t/font_2276405_0s5mzzsq1ogc.css' }],
        dll: false,
        routes: {
          exclude: [/models\//, /services\//, /model\.(t|j)sx?$/, /service\.(t|j)sx?$/, /components\//],
        },
      },
    ],
  ],
  chainWebpack(config) {
    config.merge(
      isProd
        ? {
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
                    test: /[\\/]node_modules[\\/]xgplayer[\\/]/,
                    chunks: 'async',
                    priority: 11,
                  },
                  bizcharts: {
                    name: 'bizcharts',
                    test: /[\\/]node_modules[\\/]bizcharts[\\/]/,
                    chunks: 'async',
                    priority: 11,
                  },
                  xlsx: {
                    name: 'xlsx',
                    test: /[\\/]node_modules[\\/]xlsx[\\/]/,
                    chunks: 'async',
                    priority: 11,
                  },
                  commons: {
                    // 其余同步加载包
                    chunks: 'all',
                    minChunks: 2,
                    name: 'commons',
                    priority: 8,
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
