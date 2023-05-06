import { IConfig } from 'umi-types';

const CompressionWebpackPlugin = require('compression-webpack-plugin');
const isProd = process.env.NODE_ENV === 'production'; // 这里NODE_ENV 被umi官方定死，所以不能修改。如果要使用全局变量，可以使用cross-env做另外的参数设置
const real_env = process.env.REAL_ENV || "development"; // // 标记当前的实际环境，可以为development、test、production, 给个默认值为development
const PANDORA_TOOL_ID = ''; // 工具 ID

// ref: https://umijs.org/config/
const config: IConfig = {
  treeShaking: true,
  cssLoaderOptions: {
    localIdentName: '[local]',
  },
  chainWebpack: function (config) {
    config.resolve.extensions.add('.jsx');

    config.plugin('compression-webpack-plugin').use(
      new CompressionWebpackPlugin({
        test: /\.(js|css)(\?.*)?$/i,
        // filename: '[path].gz[query]',
        algorithm: 'gzip',
        // 只处理大于xx字节 的文件，默认：0
        threshold: 10240,
        // 示例：一个1024b大小的文件，压缩后大小为768b，minRatio : 0.75
        minRatio: 0.8, // 默认: 0.8
        // 是否删除源文件，默认: false
        deleteOriginalAssets: false,
      })
    )

  },
  hash: true,
  autoprefixer: {
    browsers: ['> 1%', 'last 2 versions', 'not ie <= 10'],
  },
  extraBabelIncludes: [/app\-common/, /\/common\//],
  base: `/app/inscription`,
  publicPath: isProd ? `/dist/app/inscription/` : '/',
  outputPath: `../../../www/dist/app/inscription/`,
  proxy: {
    '/api': {
      target: 'http://dev.yidian-inc.com:5000',
      changeOrigin: true,
    },
  },
  define: {
    APP_ENV: isProd ? 'production' : 'development',
    REAL_ENV: real_env
  },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: { webpackChunkName: true },
        title: 'inscription',
        // scripts: [ // 图片资源太大了 没啥用 去掉了
        //   {
        //     src: `http://pandora.yidian-inc.com/tools/toolbridge?toolid=${PANDORA_TOOL_ID}&position=left&theme=default`,
        //   },
        // ],
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
  // 约定路由的path和sider menus的key值相对应
  routes: [
    {
      path: '/',
      component: './../layouts',
      routes: [{
        path: '/',
        redirect: '/home'
      }, {
        path: '/home',
        component: './home'
      }, {
        path: "/card",
        component: './cards/list'
      }, {
          path: "/card/:id",
          component: './cards/form'
        }, {
        //   path: '/info',
        //   component: './cards/list'
        // }, {
        //   path: '/info/:id',
        //   component: './cards/form'
        // }, {
        path: "activity",
        component: "cards/list"
      }, {
        path: "activity/:id",
        component: "cards/form"
      }, {
        path: '/strategy',
        component: './strategy/list',
      }, {
        path: "/strategy/feedback", // 会优先匹配这一条
        component: "./strategy/feedback"
      }, {
        path: '/strategy/:id',
        component: './strategy/form'
      }, {
        path: '/launch',
        component: './launch/list'
      }, {
        path: '/launch/:id',
        component: './launch/form'
      }, {
        path: '/history', component: './history/list'
      },
      ],
    },
  ],
};

export default config;
