import React from 'react';

import { FORM_TVPRETYPETVTYPE, FORM_ACTIONTYPE, FORM_OPENVALUE } from '@/config/action.config';
import { TvStationTypeOptions, TvStationActionOptions } from '@/config/action.config';
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
        name={`${name}[${FORM_TVPRETYPETVTYPE}]`}
        defaultValue={defaultParam ? defaultParam[FORM_TVPRETYPETVTYPE] : null}
      >
        <YSelect options={TvStationTypeOptions} />
      </FormItem>
      <FormItem
        form
        label="打开方式"
        name={`${name}[${FORM_ACTIONTYPE}]`}
        defaultValue={defaultParam ? defaultParam[FORM_ACTIONTYPE] : null}
      >
        <YSelect options={TvStationActionOptions} />
      </FormItem>
      <FormItem
        form
        label="单条参数"
        name={`${name}[${FORM_OPENVALUE}]`}
        defaultValue={defaultParam ? defaultParam[FORM_OPENVALUE] : null}
      >
        <YInput />
      </FormItem>
    </>
  );
};

export default React.memo(ActionTvStation);
