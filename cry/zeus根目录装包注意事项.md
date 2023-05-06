# 注意事项

`npm3` 之后的 `node_modules` 的深层依赖会被 `npm` 打平不再是深层嵌套，所以你装的某一个工具函数的包，例如 `lodash`，可能因为在别的包里有，所以会被 `npm` 打平到第一级的 `node_modules` 下，你以为成功了但是其实不一定成功。所以装的某一个包很生僻或者使用率不高的话就在打基础镜像的时候要注意一些事情。有必要的话可以在机器上 `pull` 下来 `docker` 镜像看一下 `node_modules` 里到底有没有安装成功。

个人建议打包和构建基础镜像之后可以在当前的机器上 `pull` 下来构建后的镜像看一下镜像中的包有没有装成功，再去上线，具体可以按照如下操作，操作之前最好先通读一遍根目录的 .`gitlab-ci.yml` 文件内容，了解每一个阶段都做了什么。

## 步骤

- 先确保根目录下的 `package.json` 中已经添加了对应的三方包，将代码合并到主分支。

- 单拿 `zeus` 来说，需要登入公共装包机器 `ssh 10.103.17.21` 执行 `sh /home/worker/zhangxiaozheng/build_base_images/ui/build_ui_base_image.sh conf/zeus.conf init`。

- 等待装包和构建基础镜像，打包成功之后应该能看到
`docker2.yidian.com:5000/webui/zeus     (版本号, 例如20210311)  IMAGE ID(例如ffa876ca457b)   更新时间(4 hours ago)         size(1.141 GB)`。

- 到 `gitlab pipeline` 执行一次任务，从第一次的 `stage build docker` 的日志中能看到 `FROM docker2.yidian.com:5000/webui/zeus:版本号`，在日志中找到 `harbor.int.yidian-inc.com/webui-zeus/webui-zeus-pipeline-39949-image` 中间的数字就是本次 `piepline` 的 `commitid`。

- 到刚刚的机器上执行 `docker pull image` 其中 `image` 就是刚刚从第一阶段复制的构建后的镜像名称，所以示例为 `docker pull harbor.int.yidian-inc.com/webui-zeus/webui-zeus-pipeline-39949-image:latest`，`pull` 完可以利用 `docker images` 看一下当前机器是否有更新成功的镜像。

- 执行 `docker run -it image` 进入镜像，`image` 同上 `docker run -it harbor.int.yidian-inc.com/webui-zeus/webui-zeus-pipeline-39949-image:latest`。

- `cd /`。

- `cd opt/project_lib/node_modules/`。

- `ll` 查看当前的 node_modules 下有没有成功安装所需要的包。

### 成功

- 如果安装成功，用刚刚 `gitlab pipeline` 的 `commitid` 上线应该没有问题，可以一边上线一边对着 `AXE` 看。

### 失败

- 如果进到 `docker` 里发现要安装的文件不存在，需要进行一下处理。

- 在装包构建镜像的根目录下 `cd zhangxiaozheng/build_base_images/ui`，  `vim conf/zeus.conf` 修改文件中的 `image_name='docker2.yidian.com:5000/webui/zeus:20210311'` `zeus:` 后的版本号为当前的年月日，保存退出。

- `zeus` 项目根目录下，修改 `gitlab-ci.yml` 中的基础镜像 `DOCKER_IMAGE_NAME` 的版本号，使 `zeus:` 后的版本和上一步修改的日期保持同步。

- 提交本次变动到远程主分支。

- 回头 `cd ~` 下执行 最初的打包命令，`sh /home/worker/zhangxiaozheng/build_base_images/ui/build_ui_base_image.sh conf/zeus.conf init`，等待安装和构建，成功之后去按照之前的步骤操作即可。

<hr/>

解释一下流程，`.gitlab-ci.yml` 文件

```shell
  # 基础镜像名
  DOCKER_IMAGE_NAME: docker2.yidian.com:5000/webui/zeus:20210311
  # 构建后的镜像名
  DEPLOY_DOCKER_NAME: harbor.int.yidian-inc.com/webui-$CI_PROJECT_NAME/webui-$CI_PROJECT_NAME-pipeline-$CI_PIPELINE_ID-image
```

`stage - assemble`

```shell
docker build -t $DEPLOY_DOCKER_NAME .
docker push $DEPLOY_DOCKER_NAME
```

`stage - deploy`

```shell
  docker pull $DEPLOY_DOCKER_NAME
  docker run -d -t -i -e TZ=Asia/Shanghai --name $CONTAINER_NAME_PREFIX-$CI_JOB_ID-image --net=host -p $PORT:$PORT $DEPLOY_DOCKER_NAME /bin/bash -c "cd /home/services/zeus.yidian-inc.com/ && sh start.sh testing $PORT"
```

- `assemble - stage` 中最终 `build` 的其实是构建后的镜像 `harbor` 开头的镜像，基础镜像只是为了在 `zeus` 在上线的时候，自己需要哪些基础镜像，先更新下来基础的，再加自己项目需要的。你可以理解为，基础镜像就是 `eris` 为你创建一个基础项目的样子，构建后的镜像就是你负责的工具最终上线的样子。最终会将构建后的镜像 `push` 到镜像仓库。

- `deploy - stage` 中是从仓库中 `pull` 下来构建后的可用的镜像，然后进入镜像并且启动。所以最终 `zeus` 跑的镜像是构建后的 `harbor` 镜像。

# 导致构建镜像失败，无法启动的问题点在哪？

`conf/zeus.conf` 的 `image_name` 的版本号不变，即使基础镜像中包已经安装成功，如果不更新版本号，构建后的镜像拉取新的基础镜像的时候，发现本地版本没变，依旧使旧的，就相当于浏览器的强缓存，其实文件已经失效了，文件名没变导致新的资源一直无法请求回来，一个道理。
