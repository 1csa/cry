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
  base: `/app/short_video_ugc`,
  publicPath: isProd ? `/dist/app/short_video_ugc/` : '/',
  outputPath: `../../../www/dist/app/short_video_ugc/`,
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
        title: '小视频ugc活动管理工具',
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
        headScripts: [
          {src: 'http://pandora.yidian-inc.com/static/modules/common/Logger.js'}
        ]
      },
    ],
  ],
};

export default config;
