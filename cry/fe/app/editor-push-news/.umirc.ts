import { IConfig } from 'umi-types';

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
  base: `/app/editor-push-news`,
  publicPath: isProd ? `/dist/app/editor-push-news/` : '/',
  outputPath: `../../../www/dist/app/editor-push-news/`,
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
        title: 'editor-push-news',
        scripts: [
          {
            src: `http://pandora.yidian-inc.com/tools/toolbridge?toolid=${PANDORA_TOOL_ID}&position=left&theme=default`,
          },
          {
            src: 'http://api.map.baidu.com/api?v=2.0&ak=FQAPxDwz11GD6RZgU7UuYfc9nAG0PyQP',
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
  chainWebpack (memo) {
    memo.resolve.extensions.add('tsx')
  }
};

export default config;
