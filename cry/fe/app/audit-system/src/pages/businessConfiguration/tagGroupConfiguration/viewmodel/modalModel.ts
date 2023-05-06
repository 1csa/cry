import { BaseFormModelType } from '@/types';
const formModel: Array<BaseFormModelType> = [
  {
    label: '标签组名称',
    name: 'name',
    type: 'text',
    rules: [{ required: true, message: '请输入标签组名称，2~50个字符。', min: 2, max: 50 }],
  },
  {
    label: '标签组描述',
    name: 'description',
    type: 'text',
    rules: [{ required: false, max: 150 }],
  },
  {
    label: '确认',
    type: 'button',
  },
];
export default formModel;
