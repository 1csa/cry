# 自动文件创建工具

## 使用说明

使用前提：遵守路由文件在 `src/config/app.config.ts` 的时候才会自动写入路由，否则会有问题。

- nvm 切换到高一点的node版本

- `zues` 根目录下执行 `npm link`，报错的话去nvm的路径里删掉acr

```bash
ExperimentalWarning: The fs.promises API is experimental
npm ERR! code EEXIST
npm ERR! path /Users/admin/.nvm/versions/node/v13.8.0/bin/acr
npm ERR! EEXIST: file already exists
npm ERR! File exists: /Users/admin/.nvm/versions/node/v13.8.0/bin/acr
npm ERR! Remove the existing file and try again, or run npm
npm ERR! with --force to overwrite files recklessly.
```

出现这个情况的话，控制台执行 open /Users/admin/.nvm/versions/node/v13.8.0/bin 删掉acr，重新npm link

- `acr init`

  - 选择是需要在哪个工具中创建`（appName）`，即 `fe/app` 工具下你项目的工具文件名称。
  - 选择需要创建的类型，需要创建新的组件还是新的页面。
  - 输入要创建的文件夹或者文件名称。具体可以看注意事项。
  - 最终创建的时候其实已经不需要自己判断是组件还是页面了，你只需要创建最终的 components或者pages下的目录。例如 `请输入要创建组件的文件夹或文件名称，默认创建index.tsx文件 Dumb/SimilarVideos/index.tsx` 创建出来就是 `src/components/Dumb/SimilarVideos/index.tsx`

## 注意事项

输入要创建的名称，工具会默认将其看作是文件夹名称，如果需要创建文件，需要自己带上文件类型，也就说如果你输入的名字是 `newFile`，那么将创建对应的页面或组件，最终创建的结果类似于 `src/pages(components)/newFile/index.tsx`。如果你要创建带后缀的文件 `newFile.tsx`，则工具会帮你创建 `src/pages(components)/newFile.tsx` 文件。其中单层和多层文件目录同样也适用此规则。

支持两级文件夹的创建，最多层级为 `a/b/c.tsx`

可以先创建一个新工具熟悉一下。
