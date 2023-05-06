import React from 'react';

import BusinessSelector from '@/components/Smart/BusinessConfiguration/BusinessSelector';
import { fetchBusinessList } from '@/services/businessConfiguration';
import { fetchAuditLabelGroups } from '@/services/dropdownList';
import { material_type } from '@/data/constants';
import { BaseFormModelType } from '@/types';

const initModalModel = (isEdit: boolean) => {
  const init: Array<BaseFormModelType> = [
    {
      label: '子业务名称',
      name: 'businessUnitName',
      type: 'text',
      rules: [{ required: true, message: '请输入子业务名称，2~50个字符。', min: 2, max: 50 }],
    },
    {
      label: '子业务ID',
      name: 'businessUnitId',
      type: 'text',
      rules: [
        {
          required: true,
          message: '子业务ID应该是4~10位中，长度为偶数的数字！',
          min: 4,
          max: 10,
          validator: (_, value) => {
            // 不是数字的话就提示
            if (Number.isNaN(+value)) {
              return Promise.reject(new Error('子业务ID应该是4~10位中，长度为偶数的数字！'));
            } else {
              // 是数字的话按照规则来
              const len = `${value}`.length;
              if (len < 4 || len % 2 !== 0 || len > 11) {
                return Promise.reject(new Error('子业务ID应该是4~10位中，长度为偶数的数字！'));
              } else {
                return Promise.resolve();
              }
            }
          },
        },
      ],
      disabled: isEdit,
    },
    {
      type: 'component',
      renderComponent: React.createElement(BusinessSelector, {
        selectProps: {
          label: '所属业务',
          name: 'businessId',
          rules: [{ required: true, message: '请选择所属业务～' }],
        },
        servicesFunction: fetchBusinessList,
      }),
    },
    {
      label: '内容类型',
      name: 'contentType',
      sourceData: material_type,
      type: 'select',
      rules: [{ required: true, message: '请选择内容类型～' }],
    },
    {
      label: '审核模板标识',
      name: 'template',
      // sourceData: [
      //   {
      //     label: '模板1',
      //     value: 1,
      //   },
      // ],
      type: 'text',
      // rules: [{ required: true, message: '请输入审核模板～' }],
    },
    {
      type: 'component',
      renderComponent: React.createElement(BusinessSelector, {
        selectProps: {
          label: '标签组',
          name: 'tagId',
          rules: [{ required: true, message: '请选择标签组～' }],
        },
        servicesFunction: fetchAuditLabelGroups,
      }),
    },
  ];
  const end = [
    // {
    //   label: '联系人',
    //   name: 'user',
    //   type: 'text',
    // },
    {
      label: '确认',
      type: 'button',
    },
  ];
  return isEdit
    ? [
        ...init,
        {
          label: 'Token',
          name: 'token',
          type: 'text',
          disabled: true,
        },
        ...end,
      ]
    : [...init, ...end];
};
export default initModalModel;
