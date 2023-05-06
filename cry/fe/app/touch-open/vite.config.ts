
import { UserConfig, ConfigEnv, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue';
import path from "path";

const port = 3000;
const appId = 'touch-open';

function resovePath(paths: string) {
  // 如何 __dirname 找不到 需要 yarn add @types/node --save-dev
  return path.resolve(__dirname, paths);
}

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfig => {

  const isDev = command === 'serve';
  const publicPath = isDev ? '/' : `/dist/app/${appId}/`;
  const distDir = path.join(__dirname, `../../../www/${publicPath}`);

  return {
    root: path.join(__dirname, '.'),
    base: publicPath, // 设置打包路径
    // server
    server: {
      // 服务配置
      port: port, // 类型： number 指定服务器端口;
      open: true, // 类型： boolean | string在服务器启动时自动在浏览器中打开应用程序；
      cors: false, // 类型： boolean | CorsOptions 为开发服务器配置 CORS。默认启用并允许任何源
      host: 'dev.yidian-inc.com', // IP配置，支持从IP启动
      proxy: {
        '/api': {
          target: 'http://10.136.10.8:8030',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, "")
        },
        // '/api': {
        //   target: loadEnv(mode, process.cwd()).VITE_APP_PROXY_API2_URL,
        //   ws: true,
        //   changeOrigin: true,
        //   rewrite: (path) => path.replace(/^\/api/, "")
        // }
      },
    },
    // plugins
    plugins: [vue()],

    // css
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          // 这样就能全局使用 src/assets/styles/base.less 定义的 变量
          // additionalData: `@import "${resovePath('src/assets/styles/base.less')}";`
        },
      },
    },



    // build
    build: {
      emptyOutDir: true,
      outDir: distDir,
      sourcemap: false,
      chunkSizeWarningLimit: 2000,
    },

    resolve: {
      alias: {
        "@": path.resolve(__dirname, 'src'),
        '@composables': resovePath('.src/composables'),
        "@components": resovePath('./src/components'),
        '@utils': resovePath('./src/utils'),
        '@services': resovePath('./src/services'),
      }
    },
  }
};


