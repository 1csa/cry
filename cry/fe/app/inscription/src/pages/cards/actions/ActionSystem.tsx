import React from 'react';
import { FormItem, YEmptyForm } from '@/components';

interface ActionSystem {
  name: string;
  defaultParam?: Record<string, any>;
}

const ActionSystem: React.FC<ActionSystem> = () => {
  return (
    <FormItem form label="">
      <YEmptyForm />
    </FormItem>
  );
};

export default React.memo(ActionSystem);
