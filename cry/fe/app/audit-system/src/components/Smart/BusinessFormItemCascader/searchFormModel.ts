import { stage } from '@/data/constants';

import { BaseFormModelType, OnChangeFnType } from '@/types';
const formModel: Array<BaseFormModelType> = [
  {
    label: '所属业务',
    name: 'businessId',
    sourceData: [],
    type: 'select',
    onChange: (value: OnChangeFnType[0], fn?: OnChangeFnType[1]) => {
      // 用下一个key和当前的change的value拼接联动
      return fn && fn({ businessUnitId: value });
    },
  },
  {
    label: '子业务',
    name: 'businessUnitId',
    sourceData: [],
    type: 'select',
    onChange: (value: OnChangeFnType[0], fn?: OnChangeFnType[1]) => {
      return fn && fn({ partitionId: value });
    },
  },
  {
    label: '审核分区',
    name: 'partitionId',
    sourceData: [],
    type: 'select',
  },
  {
    label: '审核阶段',
    name: 'stage',
    sourceData: stage,
    type: 'select',
  },
];
export default formModel;
