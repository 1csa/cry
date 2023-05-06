import { audit_level } from '@/data/constants';
import { BaseFormModelType, OnChangeFnType } from '@/types';
const formModel: Array<BaseFormModelType> = [
  {
    label: '所属业务',
    name: 'business_type',
    sourceData: [],
    type: 'select',
    disabled: false,
    onChange: (value: OnChangeFnType[0], fn?: OnChangeFnType[1]) => {
      /**
       * 数据流 : >>>>> formModel作为顶层组件的数据源，将数据先传给list的BasicForm组件，BasicForm再将数据传给最基础组件CustomsizeSelect <<<<<
       * 这里在CustomsizeSelect里的handleChange是antd的onchage事件，通过父子组件通信，handleChange回调给父组件BasicForm的item.onchage(value, fn)
       * 来接受数据onchange的value数据和list页面接受数据的处理方法handleCascader，这样在item.onchage也就是这里截获数据处理映射，以及将获取的参数函数，
       * fn(handleCascader)，传递处理好的参数，再return出去，list页面就可以接收到处理完的数据
       * BasicForm 暴露 handleCascader接口方法来着页面获取回调值
       */
      return fn && fn({ business_unit_type: value });
    },
  },
  {
    label: '子业务',
    name: 'business_unit_type',
    sourceData: [],
    type: 'select',
    onChange: (value: OnChangeFnType[0], fn?: OnChangeFnType[1]) => {
      return fn && fn({ part_zones: value });
    },
  },
  {
    label: '审核分区',
    name: 'part_zones',
    sourceData: [],
    type: 'select',
    disabled: false,
    onChange: (value: OnChangeFnType[0], fn?: OnChangeFnType[1]) => {
      // 这个回调函数是为了 审核阶段的待审核数
      return fn && fn({ audit_level: value });
    },
  },
  {
    label: '审核阶段',
    name: 'audit_level',
    sourceData: audit_level,
    type: 'select',
  },
  {
    label: '刷新待审核数',
    type: 'button',
    disabled: false,
    buttonName: '刷新待审核数',
  },
];
export default formModel;
