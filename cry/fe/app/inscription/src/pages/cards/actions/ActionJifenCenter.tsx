import React from 'react';
import { FormItem, YEmptyForm } from '@/components';

interface ActionJifenCenter {
  name: string;
  defaultParam?: Record<string, any>;
}

const ActionJifenCenter: React.FC<ActionJifenCenter> = () => {
  return (
    <FormItem form label="">
      <YEmptyForm />
    </FormItem>
  );
};

export default React.memo(ActionJifenCenter);
