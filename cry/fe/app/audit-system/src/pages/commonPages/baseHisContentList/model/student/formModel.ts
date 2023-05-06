import { BaseFormModelType } from '@/types';
import { auditStatus } from '@/data/constants';

const initFormSchema = () => {
  const formModel: Array<BaseFormModelType> = [
    {
      label: '审核状态',
      name: 'isAudited',
      sourceData: auditStatus,
      type: 'select',
    },
    {
      label: '内容',
      name: 'userId',
      type: 'text',
      isReplaceName: true,
      preSelect: [
        {
          label: '用户ID',
          value: 'userId',
        },
        {
          label: '用户昵称',
          value: 'userNick',
        },
        {
          label: '学校名称',
          value: 'verifyTarget',
        },
      ],
    },
  ];
  return formModel;
};

export const filterFormKey =
  'machineLabels,sensitiveCategories,sensitiveWords,machineAuditResult,articleAuthorId,objectId';

export const replaceFormItem = initFormSchema();
