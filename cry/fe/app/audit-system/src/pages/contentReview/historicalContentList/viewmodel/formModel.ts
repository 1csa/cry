import { BaseFormModelType } from '@/types';

export const filterFormKey = 'objectId,articleAuthorId';

const initFormSchema = () => {
  const formModel: Array<BaseFormModelType> = [
    {
      label: 'userId',
      name: 'userId',
      type: 'text',
    },
  ];
  return formModel;
};

// 如果需要有插入的元素可以将内容写在replaceFormItem中根据规则修改baseHisContentList/viewmodel/formModel
// 但是可能需要定义一些字段的类型
// export const replaceFormItem = [];
export const replaceFormItem = initFormSchema();
