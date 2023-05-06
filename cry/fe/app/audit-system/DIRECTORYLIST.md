|-- app
    |-- .DS_Store
    |-- .editorconfig
    |-- .env
    |-- .eslintrc
    |-- .prettierignore
    |-- .prettierrc
    |-- .umirc.ts
    |-- DIRECTORYLIST.md
    |-- README.md
    |-- package-lock.json
    |-- package.json
    |-- tsconfig.json
    |-- tslint.yml
    |-- typings.d.ts
    |-- yarn-error.log
    |-- mock // mock的一些文件 基本上现阶段不再使用了
    |   |-- businessConfiguration.ts
    |   |-- commonLogic.ts
    |   |-- dataStatistics.ts
    |   |-- featureContent.ts
    |   |-- imageClassification.ts
    |   |-- picAuditList.ts
    |   |-- picFeedback.ts
    |   |-- qualityMarking.ts
    |   |-- ruleSetting.ts
    |   |-- systemManagement.ts
    |   |-- userprofile.ts
    |   |-- videoClassification.ts
    |-- src
        |-- .DS_Store
        |-- app.ts
        |-- global.less // 这个文件里放了一些全局的样式 例如上下左右间距10 20的 可以看一下 使用还算方便
        |-- global.ts
        |-- rum.ts // 这是当时集成 apm 增加一个方法 如果以后apm的地址变动需要修改这里
        |-- assets
        |   |-- .DS_Store
        |-- components // 所有的组件目前都在这个文件夹下存放 只要分为两大块 一个Smart 、BusinessLogic 和一个 Dumb 看名字你应该能清楚
        |   |-- .DS_Store
        |   |-- Authority
        |   |   |-- index.less
        |   |   |-- index.tsx
        |   |-- BusinessLogic // 业务逻辑 这里非JSX的组件 而是一些业务上公共的逻辑处理的东西。
        |   |   |-- fetchAsyncRes.ts // 封装了一个简单的 请求方法 主要是为了统一后端接口返回的数据才用这个 你可以选择不用或者如果接口返回的数据格式跟这个一样 可以选择全局搜一下使用。
        |   |   |-- fetchNewVideoUrl.ts // 之前视频模块以及曝光审核的视频是无法播放的 403或者路径问题 所以提取了一个公共方法请求后端接口用老地址换可以播放的新地址。
        |   |   |-- getFeaturesInfo.ts // 获取模型标记
        |   |   |-- getRealVideoUrlFromString.ts // 这个就是上边说的 曝光审核的数据是html字符串 需要截取做一系列处理 调接口换能播放的地址 返回值 把data也要返回 因为所有的处理都走了这个文件 所以不处理的数据要原封不动的返回。
        |   |   |-- highlightHtml.ts // 页面中html字符串高亮展示的逻辑 命中敏感词之后需要显示。
        |   |   |-- index.ts // 这个文件名起的不好 里面涉及到的逻辑还是比较多的，除了用户的一些逻辑，基本上能在这里找到但是也看情况。
        |   |   |-- parseReshowData.ts // 处理各模块中 回显标签的方法 新增模块之后如果要显示打标之后的数据 可以用。
        |   |   |-- tableColumnsParse.ts // 表格的一些数据需要做映射处理 敏感词的合并展示 context title subtitle等以及用户的头像、昵称、简介的敏感词合并展示 只要是 页面上需要合并展示敏感词的 都可以用这个方法 如果再多了字段 可以增加 fk 来扩展。
        |   |   |-- userprofilePanelData.ts // 用户审核的一些数据 提交啊、打标啊、逻辑标红等单独在这个文件中。
        |   |   |-- common
        |   |       |-- index.ts // 收口导出文件
        |   |       |-- parseResData.ts // 这是因为接口有好几个字段返回的是json string而不是object所以 这里就解析转换了一下，再把解析的数据和原来的数据做替换。
        |   |       |-- cascaderItems // 联动的一些逻辑 基本都是请求后端的接口 这里的联动主要是用在历史的页面，历史接口要做修改，可以看看这里。
        |   |           |-- auditRetUserReviewTags.ts
        |   |           |-- categoryMarkLabelsItem.ts
        |   |           |-- getDropdownItem.ts
        |   |           |-- getMachineLabelItem.ts
        |   |           |-- getSensitiveCategoriesItem.ts
        |   |-- Dumb // 无状态的展示组件
        |   |   |-- .DS_Store
        |   |   |-- CopyToClipboard // 重新加了一层的复制到剪贴板组件。
        |   |   |   |-- index.tsx
        |   |   |-- CustomCountdown // 审核页面的倒计时组件，但是应该没有使用，后期修改的话可以考虑把页面的所有倒计时都迁移成独立的组件。
        |   |   |   |-- index.less
        |   |   |   |-- index.tsx
        |   |   |-- DebugWordsEnv // 这是敏感词debug的一个组件，看文件内容应该知道如何使用。
        |   |   |   |-- index.tsx
        |   |   |-- FormItem // 这是 BasicForm 组件使用的一些最基础的组件的封装，现在封装的只是目前业务使用的，未考虑还没使用的，所以假设有checkbox的组件，你必须在这里重新封装一次，在 Smart->BasicForm 中引入。统一命名。
        |   |   |   |-- CustomsizeCascader.tsx
        |   |   |   |-- CustomsizeInput.tsx
        |   |   |   |-- CustomsizeRangePicker.tsx
        |   |   |   |-- CustomsizeSelect.tsx
        |   |   |   |-- CustomsizeSwitch.tsx
        |   |   |-- Iconfont // 系统的所有图标都是使用iconfont，具体使用请搜索。
        |   |   |   |-- index.less
        |   |   |   |-- index.tsx
        |   |   |-- MediaContentTitlePanel // 审核以及历史的页面，主内容的标题组件。
        |   |   |   |-- index.less
        |   |   |   |-- index.tsx
        |   |   |-- ReportPanel // 负反馈的审核和历史页面有一个 用户举报类型 的组件。
        |   |   |   |-- index.tsx
        |   |   |-- SimilarVideos // 相似命中的组件 包括黑样本和相似视频。
        |   |       |-- Index.tsx
        |   |       |-- index.less
        |   |-- GlobalFooter
        |   |   |-- Index.tsx
        |   |   |-- index.less
        |   |-- GlobalHeader
        |   |   |-- index.less
        |   |   |-- index.tsx
        |   |-- GlobalHeaderWithMenu
        |   |   |-- index.less
        |   |   |-- index.tsx
        |   |-- GlobalSider
        |   |   |-- index.less
        |   |   |-- index.tsx
        |   |-- PageHeader
        |   |   |-- index.less
        |   |   |-- index.tsx
        |   |-- Smart // 有状态的组件
        |       |-- AuditOperationPanel // 所有的审核模板、应该是除了用户资料基本都在这个文件夹下，以后如果有新的模板，也应该在这里，但是具体的分发的话，长的跟曝光、负反馈、质量、分类标注一样的才会在index里做分发，也就是 走MediaContentMainPanel的才走这里，具体的目前它们分别是：
        |       |   |-- CategoryMarkPanel.tsx // 分类标注模板
        |       |   |-- CommentPanel.tsx // 评论审核模板，目前评论审核标签按钮都是通过接口逻辑来控制的，后续的其他标签的开发或者重构可以参考这里。
        |       |   |-- ExposurePanel.tsx // 曝光审核模板 -> TODO 曝光审核的模板考虑重构，标签的数据接口返回会和评论的一致，所以重构可以参考评论。
        |       |   |-- FeedbackPanel.tsx // 负反馈审核的模板，比较简单只有两组按钮。
        |       |   |-- QualityPanel.tsx // 质量标注模板
        |       |   |-- handleTaskSubmit.ts // 提交审核结论的方法的提取，新增模板之后提交结论，请用它。
        |       |   |-- index.less
        |       |   |-- index.tsx // 这里做的比较重，当时曝光审核比较复杂组件，把一部分逻辑放在这了，如果重构之后handleMenuTags可能会用不上，所以这里的逻辑将来也可能会比较清晰，主要的方法就是getPanel动态匹配和分发组件。
        |       |-- AuditUserSelect // 业务组件审核员选择组件，选择审核员传递审核员id查询。
        |       |   |-- index.tsx
        |       |-- BasicForm // 这是一个很重要的组件，主要逻辑就是从顶层页面获取json schema来先遍历一次，通过type类型来分发组件，然后也处理查询的参数，以及清除标签的一些逻辑。
        |       |   |-- index.tsx
        |       |-- BasicSelector // 基础的联动的下拉菜单选择，这里的组件主要是是用在业务配置模块，具体的可以看页面交互，然后看用法。businessConfiguration/subConfiguration/viewmodel/formModel 文件中有具体的数据流向说明。
        |       |   |-- index.tsx
        |       |-- BasicTable // 基础的表格组件，基本上无需关注实现，会用就行。
        |       |   |-- CustomizeTable.tsx
        |       |-- BusinessConfiguration // 专门为业务配置的选择器联动做的组件 依赖 BasicSelector 组件。
        |       |   |-- BusinessSelector.tsx
        |       |-- BusinessFormItemCascader // 历史页面和查询表单的联动的一部分处理，主要是 所属业务、子业务、审核分区、审核阶段这四个联动，历史里的其他联动在历史的业务页面，可以考虑拿出来，这里为啥写俩model是因为接口历史原因，仔细看字段不一样，为了兼容只能这么做了。
        |       |   |-- formModel.ts // 这里领取任务的页面的表单数据。
        |       |   |-- index.tsx // 主要的处理逻辑。
        |       |   |-- searchFormModel.ts // 历史查询页面。
        |       |-- DangerouslyArticleHtml // 高亮敏感词的组件，曝光、负反馈只要用htm字符串渲染的都走这个组件。
        |       |   |-- index.tsx
        |       |-- ExpandedRowTable // 历史列表的扩展表格。
        |       |   |-- index.tsx
        |       |-- MediaContentMainPanel // 这个组件的主要功能是 包谷那个、负反馈、分类、质量模块基本都一样，所以组件的分发是在任务列表中执行这里，TaskReview getPanel方法会执行这里逻辑。
        |       |   |-- index.less
        |       |   |-- index.tsx // 主要的逻辑在这里，这个组件包括了图文和视频以及右侧面板展示的所有内容分发，并且会根据相应的模板将审核操作的面板进行分发，因为评论和用户资料的审核模板比较特殊没有在这里处理，放在了顶层组件，觉得不妥也可以在这层判断来设置。
        |       |   |-- utils.ts // 组合敏感词的高亮以及apollo里配置的颜色设置，主要是用在审核面板右侧的敏感词模块的展示以及点击跳转的自定义数据。
        |       |-- MediaInfo // 媒体信息组件，审核页面右侧的非操作区的内容展示。
        |       |   |-- ArticleInfo.tsx // 文章信息模块
        |       |   |-- AuthorInfo.tsx // 作者信息
        |       |   |-- MachineInfoPanel.tsx // 机身信息的一些展示、机审敏感词标签关键词命中、模型算法的展示。
        |       |   |-- index.less
        |       |   |-- index.tsx // 视频指纹相似、视频封面图、内容媒体
        |       |-- OperationButton // 这是后来接入后端接口来设置的审核标签的组件，主要功能就是可以动态设置标签内容以及按钮的状态是单选、多选、能否取消等功能。可以扩展。单选、多选的能力都是利用CheckableTag过滤来实现的。
        |       |   |-- index.less
        |       |   |-- index.tsx
        |       |-- PromptModal // 在当前页面如果有审核任务在审核，切换路由或者刷新的时候会提示是否要结束任务，前置拦截。
        |       |   |-- index.tsx
        |       |-- ReviewLog // 审核历史也就是历史页面，点击日志的弹窗和审核页面的历史弹窗。
        |       |   |-- index.tsx // 主要逻辑 引入表格设置的数据在modal中展示。
        |       |   |-- tableColumns.tsx // 对于表格的数据单独进行处理。
        |       |-- TodayReviewPanel // 审核页面刚进来未领取任务的时候页面
        |       |   |-- index.tsx
        |       |-- UploaderParseExcel // 这是敏感词管理那边的一个解析本地excel到antdesign表格的组件，因为当时antd的组件有一些问题后来直接用原生的实现。
        |       |   |-- index.tsx
        |       |-- UserprofilePanel // 用户审核的页面的组件 包括用户头像、昵称、简介 处理了待审和历史的情况。
        |       |   |-- index.less
        |       |   |-- index.tsx // 如果你想通一模块 可以把这个放在 AuditOperationPanel 下
        |       |-- VideoPanel // 视频播放组件 视频的播放器组件、抽帧图片 等
        |           |-- index.less
        |           |-- index.tsx
        |-- config
        |   |-- app.config.ts // 接口源地址设置
        |   |-- app.d.ts
        |-- context // 这里只放了一个context 是包的 MediaInfo 组件，透传数据。
        |   |-- index.ts
        |-- data // 一些常用的前端的数据 下拉菜单以及一些映射数据。
        |   |-- articleQuality.ts // 质量打标的打标面板的数据。
        |   |-- constants.ts // 全局的一些常量 但是有不仅仅只是常量和映射这么简单有的页面逻辑也是需要在这里配置例如如果新加了页面 ContentType就需要设置接口的code，是视频还是图文 就需要设置videoType、articleType等。
        |   |-- fakeData.ts // 一个模拟接口假数据的文件。
        |   |-- shitData.ts // 开发阶段用的造数据的文件。
        |-- hooks // 这是一个预留的功能，以后扩展的话也许会用上以及实现了，具体是：接口应该会在图片处理之后将图片的文字坐标返回，直接用这个钩子就可以在图片上画出来标注。
        |   |-- useSVGDraw.ts
        |-- layouts
        |   |-- BasicLayout.less
        |   |-- BasicLayout.tsx
        |   |-- SidebarLayout.less
        |   |-- SidebarLayout.tsx
        |   |-- index.tsx
        |-- models // 全局的dva数据
        |   |-- categoryMarking.ts // 分类标注的内容，包括可以通过devtool查看redux中的数据，包括全部的分类数据以及子类、和标签。
        |   |-- commonLogic.ts // 通用的一些数据，具体的是敏感词的级联下拉数据、以及历史的下拉菜单数据、以及全局的一个当前任务（仅仅是对于那种需要从当前页面进到下个页面的模板来说，如果历史操作还在当前页面的话就不存在这种情况），一般情况下是不需要修改的可能会有扩展。
        |   |-- connect.d.ts
        |   |-- synchronizeState.ts // 一些全局同步的数据，例如当前面包屑的展示currentBreadcrumb、formModelParams是预留的一个当前查询获取的数据因为历史现在有个问题，编辑回来之后需要重新查优化的话可以用这个，将数据存起来，结束审核回来再给对应的表单赋值，但是涉及到父子联动，所以你必须要多请求才能获取到下拉菜单数据，否则就是一串数字在下拉菜单里。webExcelData 配置页面有一个类似webexcel的东西，数据存在那里。
        |   |-- user.ts // 用户的全局信息以及左边菜单要收起还是展开的状态。
        |-- pages // 所有的页面都在这里，文件即路由
        |   |-- .DS_Store
        |   |-- index.less
        |   |-- index.tsx // 不多说了，欢迎页。
        |   |-- .umi
        |   |   |-- TitleWrapper.jsx
        |   |   |-- dva.js
        |   |   |-- history.js
        |   |   |-- polyfills.js
        |   |   |-- router.js
        |   |   |-- umi.js
        |   |   |-- umiExports.ts
        |   |-- businessConfiguration // 业务配置菜单，你能发现其实这三个子菜单页面张的基本都是一样，所以很多逻辑都是可以复用，例如弹窗啊、表单啊、表格啊
        |   |   |-- .DS_Store
        |   |   |-- BasisConfiguration.tsx // 一个容器组件，封装了一些公共逻辑，将弹窗、表单、表格的viewmodel数据以及接口传递下去，这里负责执行以及展示。看懂这里基本就能看懂所有了。
        |   |   |-- common.less
        |   |   |-- partitionConfiguration // 分区配置
        |   |   |   |-- index.less
        |   |   |   |-- index.tsx
        |   |   |   |-- viewmodel
        |   |   |       |-- formModel.ts
        |   |   |       |-- modalModel.ts
        |   |   |       |-- tableColumns.tsx
        |   |   |-- subConfiguration // 子业务配置
        |   |   |   |-- index.less
        |   |   |   |-- index.tsx
        |   |   |   |-- viewmodel
        |   |   |       |-- formModel.ts
        |   |   |       |-- modalModel.ts
        |   |   |       |-- tableColumns.tsx
        |   |   |-- tagConfiguration // 标签设置
        |   |   |   |-- .DS_Store
        |   |   |   |-- index.less
        |   |   |   |-- index.tsx
        |   |   |   |-- viewmodel
        |   |   |       |-- formModel.ts
        |   |   |       |-- modalModel.ts
        |   |   |       |-- tableColumns.tsx
        |   |   |-- tagGroupConfiguration // 标签组设置
        |   |       |-- index.less
        |   |       |-- index.tsx
        |   |       |-- viewmodel
        |   |           |-- formModel.ts
        |   |           |-- modalModel.ts
        |   |           |-- tableColumns.tsx
        |   |-- commonPages // 这个模块是所有页面的核心
        |   |   |-- baseHisContentList // 基础的历史内容业务页面
        |   |   |   |-- index.tsx // 整个历史的页面的所有逻辑都在这里。
        |   |   |   |-- viewmodel // 配置数据中心
        |   |   |       |-- defaultFormModel.ts // 默认的历史页面的表单配置json 这里又一个扩展就是 会接受参数来先在基础的表单里过滤掉不需要的字段，然后通过splice接口给数组添加扩展。
        |   |   |       |-- defaultTableColumns.tsx // 默认表格字段的配置以及解析逻辑，这里的扩展也是 同上。
        |   |   |       |-- classification // 分类标注的 为什么要吧他们放在这里是因为有视频和图文两套为了不在每个页面都写一次
        |   |   |       |   |-- classificationFormModel.ts // 这里有一些过滤掉基础表单中的字段 然后再扩展
        |   |   |       |   |-- classificationTableColumns.tsx // 跟上边这个一个道理
        |   |   |       |-- quality // 质量标注的 数据 上边的分类看懂 下边也懂了
        |   |   |           |-- qualityFormModel.ts
        |   |   |           |-- qualityTableColumns.tsx
        |   |   |-- list // 这是之前老的历史不用了一直没删除 可以和接口以及产品确认下要不要删掉
        |   |   |   |-- index.less
        |   |   |   |-- index.tsx
        |   |   |   |-- viewmodel
        |   |   |       |-- formModel.ts
        |   |   |       |-- tableColumns.tsx
        |   |   |-- taskReview // 领取任务的页面
        |   |       |-- index.less
        |   |       |-- index.tsx // 领取任务的所有逻辑处理都在这里 这里会先领取任务，然后通过接口字段来区分是什么模板，然后再进行各自渲染。所以这里的逻辑很重要。别的页面都是调一下这个组件，传递点参数就完事了。
        |   |       |-- viewmodel // 领取任务页面的表单配置，一个业务组件，业务组件就是 那个固定联动的组件。
        |   |           |-- formModel.ts
        |   |-- contentReview // 内容审核
        |   |   |-- auditList // 废弃了
        |   |   |   |-- index.tsx
        |   |   |-- historicalContentList // 用户审核的历史，这里引入了上边的 baseHisContentList 业务组件
        |   |   |   |-- index.tsx
        |   |   |   |-- viewmodel // 一些表单或者表格需要过滤掉的数据
        |   |   |       |-- formModel.ts
        |   |   |-- userprofile // 用户审核页面
        |   |       |-- index.tsx
        |   |-- dataStatistics // 数据统计
        |   |   |-- businessDataStatistics // 业务数据
        |   |   |   |-- index.tsx
        |   |   |   |-- viewModel
        |   |   |       |-- panelStatistics.ts
        |   |   |       |-- tableColumn.ts
        |   |   |-- components // 因为两个页面也是比较相似的 所以又把所有的逻辑封装在一个业务组件里
        |   |   |   |-- formModel.ts
        |   |   |   |-- index.less
        |   |   |   |-- index.tsx
        |   |   |-- manualReviewDataStatistics // 人审数据
        |   |       |-- index.tsx
        |   |       |-- viewModel
        |   |           |-- tableColumn.ts
        |   |-- featureContent // 特征内容
        |   |   |-- keywordManagement // 关键词管理菜单
        |   |   |   |-- index.less
        |   |   |   |-- index.tsx // 入口
        |   |   |   |-- keywordSetting.tsx // 敏感词添加、修改的页面
        |   |   |   |-- mutipleParseByExcel.tsx // 这是以前的上传的需求 后来后端没时间做 先放下了 以后需要的话可以用一下和接口调试下看，基本上已经通了
        |   |   |   |-- components // 敏感词部分的一些组件
        |   |   |   |   |-- CompoundWordsFormItem.tsx // 组合词间距的组件，在增加和编辑的页面的表单中使用
        |   |   |   |   |-- EffectiveInfo.tsx // 这就是那个敏感词的表格组件
        |   |   |   |   |-- KeywordSettingForm.tsx // keywordSetting 需要一个表单 就是这个 因为自定义程度太高 没用那个表单生成器
        |   |   |   |   |-- OperationGroupPanel.tsx // 敏感词管理首页那一排操作按钮区域 生效信息
        |   |   |   |   |-- steps // 步骤条的组件
        |   |   |   |       |-- ConnectBusiness.tsx // 关联业务
        |   |   |   |       |-- UploadFile.tsx // 上传文件
        |   |   |   |       |-- WriteContentStatus.tsx // 等待后端写入
        |   |   |   |-- viewmodel // 敏感词部分的一些配置
        |   |   |       |-- constants.ts
        |   |   |       |-- formModel.ts // 敏感词的首页表单的配置
        |   |   |       |-- tableColumns.tsx // 首页表格设置
        |   |   |       |-- uploadTableColumn.ts // 上传的表格预览 通过xlsx解析本地excel数据到antdesign表格
        |   |   |       |-- utils.ts // 处理数据的一些方法
        |   |   |       |-- writeContentTableColumn.ts // 步骤条写入之后有一个数据展示
        |   |   |-- whitelistManagement // 白名单配置
        |   |       |-- ExcelSheet.tsx // web Excel的功能
        |   |       |-- index.less
        |   |       |-- index.tsx // 入口
        |   |       |-- viewmodel // 白名单首页需要的数据
        |   |           |-- formModel.ts
        |   |           |-- modalModel.ts // 新增弹窗中的数据
        |   |           |-- tableColumns.tsx
        |   |-- imageClassification // 图文分类标注 都引入的是commonPages下的两个文件
        |   |   |-- historicalContentList // 历史 引入的是 commonPages/baseHisContentList
        |   |   |   |-- index.tsx
        |   |   |-- marking // 打标 引入的是 commonPages/taskReview
        |   |       |-- index.less
        |   |       |-- index.tsx
        |   |-- imageQuality // 图文质量打标
        |   |   |-- historicalContentList // 历史 引入的是 commonPages/baseHisContentList
        |   |   |   |-- index.tsx
        |   |   |-- marking // 打标 引入的是 commonPages/taskReview
        |   |       |-- index.less
        |   |       |-- index.tsx
        |   |-- pictureArticleReview // 图文审核
        |   |   |-- auditList // 废弃
        |   |   |   |-- index.tsx
        |   |   |-- historicalContentList // 历史 引入的是 commonPages/baseHisContentList
        |   |   |   |-- index.tsx
        |   |   |   |-- viewmodel
        |   |   |       |-- formModel.ts
        |   |   |       |-- tableColumns.ts
        |   |   |-- mediaContentReview // 引入的是 commonPages/taskReview
        |   |       |-- index.tsx
        |   |-- shortContent // 评论内容审核
        |   |   |-- auditList // 废弃 已经接入新的历史
        |   |   |   |-- index.tsx
        |   |   |-- commentReview // 引入的是 commonPages/taskReview
        |   |   |   |-- index.tsx
        |   |   |-- historicalContentList // 历史 引入的是 commonPages/baseHisContentList
        |   |       |-- index.tsx
        |   |       |-- viewmodel
        |   |           |-- formModel.ts
        |   |           |-- tableColumns.tsx
        |   |-- systemManagement // 系统管理
        |   |   |-- operationLog // 操作日志 页面比较简单
        |   |       |-- index.less
        |   |       |-- index.tsx
        |   |       |-- viewmodel
        |   |           |-- formModel.ts
        |   |           |-- tableColumns.tsx
        |   |-- videoClassification // 视频分类标注
        |   |   |-- historicalContentList
        |   |   |   |-- index.tsx
        |   |   |-- marking
        |   |       |-- index.less
        |   |       |-- index.tsx
        |   |-- videoQuality // 视频质量标注
        |   |   |-- historicalContentList
        |   |   |   |-- index.less
        |   |   |   |-- index.tsx
        |   |   |-- marking
        |   |       |-- index.less
        |   |       |-- index.tsx
        |   |-- videoReview // 视频审核
        |       |-- auditList // 废弃
        |       |   |-- index.tsx
        |       |-- historicalContentList // 视频审核历史
        |       |   |-- index.tsx
        |       |   |-- viewmodel
        |       |       |-- formModel.ts
        |       |       |-- tableColumns.tsx
        |       |-- mediaContentReview // 审核页面
        |           |-- index.tsx
        |-- services // 接口请求文件
        |   |-- apolloSetting.ts // 这个是配置的敏感词 对应分类的请求
        |   |-- baseHisContentList.ts // 历史页面接口的请求
        |   |-- businessConfiguration.ts // 业务配置
        |   |-- classificationLabels.ts // 分类标注
        |   |-- commonServices.ts // 一些公共的业务
        |   |-- dataStatistics.ts // 数据统计
        |   |-- dropdownList.ts // 下拉菜单的数据
        |   |-- featureContent.ts // 特征内容
        |   |-- systemManagement.ts // 系统管理
        |   |-- user.ts // 用户
        |   |-- videoReview.ts // 视频抽帧
        |-- styles
        |   |-- variables.less
        |-- types // 全局的一些类型文件
        |   |-- apiResponse.d.ts // 这就是上边提到的为了统一接口返回的类型特意封装了一个请求的方法和请求的返回类型
        |   |-- commonPage.d.ts // 一些公共的类型
        |   |-- count.d.ts // 用的比较少
        |   |-- form.d.ts // 表单配置的类型
        |   |-- index.d.ts // 汇总入口
        |   |-- tableOperation.d.ts // 表格的类型
        |-- utils // 工具方法
            |-- dev_helper.ts // 一些小的工具函数
            |-- exportExcelModel.ts
            |-- get_current_route.ts
            |-- pySegSort.ts // 拼音排序的方法
            |-- request.ts
            |-- ExcelExportByNode.ts // 用node导出excel的方法 不太好 后来采用了csv
            |-- exportJsonToCSV.ts // 现在历史数据导出的方法
