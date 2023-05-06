import { machinePower, audit_level, reviewAreaConst } from '@/data/constants';

export default [
  {
    label: '所属业务',
    name: 'business_type',
    sourceData: [],
    type: 'multiple',
  },
  {
    label: '子业务',
    name: 'business_unit_type',
    sourceData: [],
    type: 'select',
  },
  // {
  //   label: '内容类型',
  //   name: 'material_type',
  //   sourceData: [],
  //   type: 'multiple',
  //   onChange: (value: Array<number>, fn: (value: Array<number>) => void) => {
  //     /**
  //      * 数据流 : >>>>> formModel作为顶层组件的数据源，将数据先传给list的BasicForm组件，BasicForm再将数据传给最基础组件CustomsizeSelect <<<<<
  //      * 这里在CustomsizeSelect里的handleChange是antd的onchage事件，通过父子组件通信，handleChange回调给父组件BasicForm的item.onchage(value, fn)
  //      * 来接受数据onchange的value数据和list页面接受数据的处理方法handleCascader，这样在item.onchage也就是这里截获数据处理映射，以及将获取的参数函数，
  //      * fn(handleCascader)，传递处理好的参数，再return出去，list页面就可以接收到处理完的数据
  //      */
  //     let realKey: Array<number> = []
  //     // 将图文、视频、评论映射为需要联动的key
  //     value.forEach((e: number) => {
  //       realKey = [...realKey, ...[reviewAreaConst[e]]]
  //     })

  //     return fn && fn(realKey)
  //   }
  // },
  {
    label: '审核分区',
    name: 'part_zones',
    sourceData: [],
    type: 'multiple',
  },
  {
    label: '入库时间',
    name: 'insertTime',
    type: 'rangePicker',
    timeKey: ['time_start', 'time_end'],
  },
  {
    label: '审核时间',
    name: 'reviewTime',
    type: 'rangePicker',
    timeKey: ['time_man_audit_start', 'time_man_audit_end'],
  },
  {
    label: '机审能力',
    name: 'machine_type',
    sourceData: machinePower,
    type: 'select',
  },
  // {
  //   label: '机审标签',
  //   name: 'sensitive_words',
  //   sourceData: [],
  //   type: 'select'
  // },
  // {
  //   label: '人审标签',
  //   name: 'reviewTag',
  //   sourceData: [],
  //   type: 'select'
  // },
  {
    label: '审核阶段',
    name: 'audit_level',
    sourceData: audit_level,
    type: 'select',
  },
  {
    label: '审核状态',
    name: 'status',
    sourceData: [],
    type: 'select',
    allowClear: false,
  },
  // {
  //   label: 'docid',
  //   name: 'docids',
  //   type: 'text'
  // },
  // {
  //   label: '标题',
  //   name: 'title',
  //   type: 'text'
  // },
  // {
  //   label: '审核员邮箱前缀',
  //   name: 'auditor_id',
  //   type: 'text',
  //   width: 350
  // },
  {
    label: '查询',
    type: 'button',
  },
];
