import { BaseFormModelType, OnChangeFnType } from '@/types';

import { feedBackReasonsList } from '@/data/constants';

const initFormSchema = () => {
  const formModel: Array<BaseFormModelType> = [
    {
      label: '举报类型',
      name: 'feedBackReasons',
      type: 'multiple',
      sourceData: feedBackReasonsList,
    },
  ]
  return formModel;
}
export const replaceFormItem = initFormSchema();
