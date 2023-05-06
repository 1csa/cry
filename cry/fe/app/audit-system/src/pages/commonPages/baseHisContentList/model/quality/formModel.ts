import { BaseFormModelType } from '@/types';
import { auditStatus } from '@/data/constants';
import { aging, qualityScore, allQualityLabels } from '@/data/articleQuality';

const initFormSchema = () => {
  const formModel: Array<BaseFormModelType> = [
    // {
    //   label: '文章属性',
    //   name: 'articleProperty',
    //   sourceData: articleAttr,
    //   type: 'select',
    // },
    {
      label: '时效性',
      name: 'timeliness',
      sourceData: aging,
      type: 'select',
    },
    {
      label: '质量分数',
      name: 'qualityScore',
      sourceData: qualityScore,
      type: 'select',
    },
    {
      label: '质量标签',
      name: 'qualityLabels',
      sourceData: allQualityLabels,
      type: 'select',
    },
    {
      label: '审核状态',
      name: 'isAudited',
      sourceData: auditStatus,
      type: 'select',
    },
    {
      label: '大类',
      name: 'articleBigCategoryName',
      sourceData: [],
      type: 'select',
    },
    {
      label: '作者领域',
      name: 'accountDomain',
      sourceData: [],
      type: 'select',
    },
    {
      label: '作者等级',
      name: 'accountLevel',
      sourceData: [
        ...qualityScore.filter(item => item.value !== 0),
        {
          label: '6',
          value: 6,
        },
      ],
      type: 'select',
    },
  ];
  return formModel;
};
export const filterFormKey =
  'auditResult,machineAuditResult,manualAuditResult,manualLabels,' + 'machineLabels,sensitiveCategories,sensitiveWords,articleAuthorId';
// 如果需要有插入的元素可以将内容写在replaceFormItem中根据规则修改baseHisContentList/viewmodel/formModel
// 但是可能需要定义一些字段的类型
export const replaceFormItem = initFormSchema();
