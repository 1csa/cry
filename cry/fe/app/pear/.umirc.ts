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
  base: `/app/pear`,
  publicPath: isProd ? `/dist/app/pear/` : '/',
  outputPath: `../../../www/dist/app/pear/`,
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
        title: 'pear',
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
};

export default config;
