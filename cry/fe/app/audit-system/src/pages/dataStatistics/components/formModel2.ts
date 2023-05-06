import React from 'react';
import moment from 'moment';

import BusinessFormItemCascader from '@/components/Smart/BusinessFormItemCascader';
import AuditUserSelect from '@/components/Smart/AuditUserSelect';
import { material_type as materialType } from '@/data/constants';
import { BaseFormModelType, OnChangeFnType } from '@/types';
import { DATE_FORMAT_DD } from '@/utils/dev_helper';

const initFormSchema = (material_type: number[], refsProps?: AnimationPlayState, isBusiness?: boolean) => {
  const businessFormItemCascaderParams = isBusiness
    ? {}
    : {
        renderLevel: 2,
        multiple: true,
      };
  const formModel: Array<BaseFormModelType> = [
    {
      label: '业务类型',
      name: 'material_type',
      sourceData: materialType,
      type: 'select',
      protected: true,
      onChange: (value: OnChangeFnType[0], fn?: OnChangeFnType[1]) => {
        return fn && fn([value]);
      },
    },
    {
      type: 'component',
      renderComponent: React.createElement(BusinessFormItemCascader, {
        material_type,
        isSearch: true,
        needStage: false,
        /**
         * 这里的refsProps转发是在初始化的时候获取，先传递到这里，再由此传递给BusinessFormItemCascader组件
         */
        multiProps: {
          refsProps,
        },
        ...businessFormItemCascaderParams,
      }),
    },
    {
      label: '审核时间',
      name: 'insertTime',
      type: 'rangePicker',
      timeKey: ['startDate', 'endDate'],
      format: DATE_FORMAT_DD,
      formateTime: DATE_FORMAT_DD,
      disabledDateStemp: (current: moment.Moment) => moment().add(-1, 'days') <= current || moment().add(-1, 'month') >= current,
    },
    {
      type: 'component',
      renderComponent: React.createElement(AuditUserSelect, {
        selectProps: {
          label: '审核员',
          name: 'auditorId',
        },
      }),
    },
    {
      label: '查询',
      type: 'button',
      buttonName: '数据统计查询',
    },
  ];
  return formModel;
};

export default initFormSchema;
