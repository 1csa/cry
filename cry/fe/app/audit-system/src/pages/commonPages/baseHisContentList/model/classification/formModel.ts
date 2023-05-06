import { BaseFormModelType, OnChangeFnType } from '@/types';
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
      label: '大类',
      name: 'bigCategoryName',
      sourceData: [],
      type: 'select',
      onChange: (value: OnChangeFnType[0], fn?: OnChangeFnType[1]) => {
        return fn && fn({ smallCategoryName: value });
      },
    },
    {
      label: '小类',
      name: 'smallCategoryName',
      sourceData: [],
      type: 'select',
    },
    {
      label: '标签',
      name: 'categoryLabels',
      type: 'text',
    },
  ];
  return formModel;
};
export const filterFormKey =
  'auditResult,machineAuditResult,manualAuditResult,manualLabels,' +
  +'machineLabels,sensitiveCategories,sensitiveWords,articleAuthorId';
// 如果需要有插入的元素可以将内容写在replaceFormItem中根据规则修改baseHisContentList/viewmodel/formModel
// 但是可能需要定义一些字段的类型
export const replaceFormItem = initFormSchema();
