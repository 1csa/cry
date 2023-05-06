import React from 'react';
import BusinessFormItemCascader from '@/components/Smart/BusinessFormItemCascader';

const initFormSchema = (material_type: number[], refsProps?: any, disabled?: boolean) => {
  return [
    {
      type: 'component',
      renderComponent: React.createElement(BusinessFormItemCascader, {
        multiProps: {
          refreshCount: true,
          disabled, // 通过参数来控制是否需要禁用
          refsProps,
        },
        material_type,
        isSearch: false,
      }),
    },
    {
      label: '开始审核',
      type: 'button',
      disabled: false,
      loading: false,
      buttonName: '开始审核任务按钮',
    },
  ];
};

export default initFormSchema;
