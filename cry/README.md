### 环境搭建：

版本要求：

- Node v10.16.0 (不支持 v8 以下版本)
- Yarn v1.17.3 (推荐更新到最新版本，脚手架基于 1.17.3 开发，低于此版本可能无法运行脚手架)

[安装或者升级 Yarn](https://yarnpkg.com/zh-Hans/docs/install#mac-stable)

```shell
(sudo) npm i yarn -g
```

项目启动：

YARN_REGISTRY=http://10.103.18.168:4873/ yarn

在根目录执行 yarn，然后 cd fe，再次执行 yarn，公共的模块，如 fe/common，需要添加到 fe/package.json 里的 workspace 里

```shell
# 启动 Node 服务
yarn start
# or npm start

# 通过脚手架创建、启动、或打包项目，根据提示执行
yarn eris
```

> 如果通过 yarn eris 无法启动项目，可尝试执行 yarn fe-install 修复
>
> 如果执行 yarn eris 时提示无法找到 xxx 包，可通过进入 fe 目录执行 `yarn` 更新依赖修复

### node开启多个实例
thinkjs 本身有cluster模式，虽然这个项目用pm2 守护进程，但是thinkjs 的cluster 跟 pm2 的cluster是冲突的
具体看这个：[https://thinkjs.org/zh-cn/doc/3.0/deploy.html](https://thinkjs.org/zh-cn/doc/3.0/deploy.html)

### 脚手架

脚手架使用帮助文档：[http://ydwiki.yidian-inc.com/pages/viewpage.action?pageId=73347001](http://ydwiki.yidian-inc.com/pages/viewpage.action?pageId=73347001)

脚手架使用命令：

```shell
# 总命令，进入交互式命令行
yarn eris

# 查看帮助
yarn eris --help
```

### 代码风格检测

VS Code 推荐插件：

- EditorConfig for VS Code
- Prettier - Code formatter

#### 检测 node 代码是否符合规范

规则为根目录：`.eslintrc`
```
npm run lint
```


### 测试

1. 先创建pipelines https://git.yidian-inc.com:8021/webui/zeus/pipelines

2. 配置项可以填PORT，指定测试的端口，默认5000

3. 先点build_docker，再点deploy_test，访问http://venus.int.yidian-inc.com:PORT
### 发布

1. 先创建pipelines https://git.yidian-inc.com:8021/webui/zeus/pipelines

2. 线上发布jenkins: http://jenkins.yidian-inc.com:8080/job/superfe-web-zeus/  COMMIT_ID填pipeline id        
新的deploy地址： http://jenkins.yidian-inc.com:8080/job/infoflow-superfe-zeus/            

服务器情况： http://axe.yidian-inc.com/#/service?path=yidian%3Esuperfe%3Eweb%3Einternal%3Ezeus_v

### 更新基础包
1. 更新master分支上的package 基础包
2. ssh swan 登录swan
3. ssh xxx@10.103.17.21 登录该机器
4. su - worker, 切换到worker,  然后执行sh /home/worker/zhangxiaozheng/build_base_images/ui/build_ui_base_image.sh conf/zeus.conf init
