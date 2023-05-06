import React from 'react';
import { FormItem, YEmptyForm } from '@/components';

interface ActionWemediaCenter {
  name: string;
  defaultParam?: Record<string, any>;
}

const ActionWemediaCenter: React.FC<ActionWemediaCenter> = () => {
  return (
    <FormItem form label="">
      <YEmptyForm />
    </FormItem>
  );
};

export default React.memo(ActionWemediaCenter);
