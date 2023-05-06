import React from 'react';

import { FormItem, YInput } from '@/components';

import { FORM_ID } from '@/config/card.config';

const FormId: React.FC = () => {
  return (
    <FormItem name={FORM_ID} label="卡片ID">
      <YInput />
    </FormItem>
  );
};

export default React.memo(FormId);
