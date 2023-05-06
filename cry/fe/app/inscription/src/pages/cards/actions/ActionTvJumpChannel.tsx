import React from 'react';

import { TvChannelOpenOptions, FORM_OPENTYPE, FORM_CATEGORY, FORM_OPENVALUE } from '@/config/action.config';
import { FormItem, YInput, YSelect } from '@/components';

interface ActionTvStation {
  name: string;
  defaultParam?: Record<string, any>;
}

const ActionTvStation: React.FC<ActionTvStation> = ({ name, defaultParam }) => {
  return (
    <>
      <FormItem
        form
        label="分类"
        name={`${name}[${FORM_OPENTYPE}]`}
        defaultValue={defaultParam ? defaultParam[FORM_OPENTYPE] : null}
      >
        <YSelect options={TvChannelOpenOptions} />
      </FormItem>
      <FormItem
        form
        label="目录ID"
        name={`${name}[${FORM_CATEGORY}]`}
        defaultValue={defaultParam ? defaultParam[FORM_CATEGORY] : null}
      >
        <YInput />
      </FormItem>
      <FormItem
        form
        label="定位单条"
        name={`${name}[${FORM_OPENVALUE}]`}
        defaultValue={defaultParam ? defaultParam[FORM_OPENVALUE] : null}
      >
        <YInput />
      </FormItem>
    </>
  );
};

export default React.memo(ActionTvStation);
