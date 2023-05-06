import React from 'react';

import CustomizeUpload from '@/components/Dumb/FormItem/CustomizeUpload';

import EffectiveRangeTime from '../components/EffectiveRangeTime';

import { BaseFormModelType } from '@/types';

const initFormModel = () => {
  const defaultFormModel: Array<BaseFormModelType> = [
    {
      type: 'component',
      name: 'excel',
      renderComponent: React.createElement(EffectiveRangeTime, {}),
    },
    {
      type: 'component',
      name: 'excel',
      renderComponent: React.createElement(CustomizeUpload, {}),
    },
    {
      label: '确认',
      name: 'confirm',
      type: 'button',
    },
  ];
  return defaultFormModel;
};

export default initFormModel;
