import { BaseFormModelType, OnChangeFnType } from '@/types';

const initFormSchema = () => {
  const formModel: Array<BaseFormModelType> = [
    {
      label: '数美模型标记',
      name: 'shumeiMarks',
      type: 'text',
    },
    {
      label: '文章',
      name: 'articleId',
      type: 'text',
      isReplaceName: true,
      preSelect: [
        {
          label: 'ID',
          value: 'articleId',
        },
        {
          label: '标题',
          value: 'articleTitle',
        },
      ],
    },
    {
      label: '短文本',
      name: 'objectId',
      type: 'text',
      isReplaceName: true,
      preSelect: [
        {
          label: 'ID',
          value: 'objectId',
        },
        {
          label: '内容',
          value: 'content',
        },
      ],
    },
    {
      label: '用户',
      name: 'userId',
      type: 'text',
      isReplaceName: true,
      preSelect: [
        {
          label: 'ID',
          value: 'userId',
        },
        {
          label: '昵称',
          value: 'userNick',
        },
      ],
    },
  ];
  return formModel;
};
export const filterFormKey = 'objectId,articleAuthorId,machineLabels';
// 如果需要有插入的元素可以将内容写在replaceFormItem中根据规则修改baseHisContentList/viewmodel/formModel
// 但是可能需要定义一些字段的类型
export const replaceFormItem = initFormSchema();
