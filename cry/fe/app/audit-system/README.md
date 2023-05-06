# 暴雪系统 文件信息

版本`"antd": "^4.4.1"` `"react": "^16.8.6"`

文件目录说明 请查看 `DIRECTORYLIST.md` 文件

## 组件的一些使用注意事项

### BasicForm

掌握表单组件的使用方法，参考 imageClassification/historicalContentList 的使用 表单的 formModel 都是在一个viewModel 的文件里，表格筛选的列也是。commonPages 下的 baseHisContentList 下能看到有一个基础的表单和表格的文件，所有的以后的新需求的表单和表格都是在这个基础上扩展。因为模块有图文和视频所以为了避免在自己业务页面写两套，都拿来放在了 commonPages/baseHisContentList 下，所以只有一套的话就在对应的业务页面写，两套的话可以考虑放在这里，对应的业务页面引入即可。

具体的 BasicForm 组件的使用方法，是将jsx转为json数据处理，所以你对表单的处理最终落为了对json的处理，暴露的接口有几点说明一下

- initialValues 是表单回显用的数据，初始化的数据。
- 暴露的ref是为了页面的一些逻辑调用其一些实例的方法。
- formDataModel 这个是最重要的，你的表单需要展示哪些，把这个传进去就行了，这个数据的来源就是 viewModel里你定义的数据，具体的如何使用，可以看一些对应的文件。
- onSearch 点击查询按钮的时候的回调函数方法，可以捕获到表单目前已经填写的数据，具体的数据格式在底层已经封装过了，如果数据格式有变动，可以在组件中对应的逻辑处做处理。
- handleCascader 这也是比较重要的一个接口，功能是 暴露出 所有下拉菜单选择之后的回调结果，基本上主要是用来做联动，viewmodel里对应的类型会钩住onchange的回调结果，然后在viewmodel里将下一个联动的表单项的key和当前的值做一个数据的封装，返回给顶层组件。

扩展以及注意事项：扩展组件中不存在的类型的组件，可以按照目前的格式新增文件，编写type类型做强映射。如果对于定制化要求比较高的表单，可以不考虑使用本组件。

一个时间段回显的时候需要利用moment，举例：

```js
[
  {
    label: '生效时间设置',
    name: 'operationTime',
    type: 'rangePicker',
    timeKey: ['startTime', 'endTime'],
    formateTime: DATE_FORMAT_SS,
    rules: [{ required: true }],
  }
]

// 指定name，然后赋值
rowItem.operationTime = [
  moment(rowItem.startTime, DATE_FORMAT_SS),
  moment(rowItem.endTime, DATE_FORMAT_SS),
];
```
