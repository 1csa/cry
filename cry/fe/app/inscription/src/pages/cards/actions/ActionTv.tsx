// 下线，暂时先不更新
import React from 'react';

import { FORM_TVPRETYPETVPRETYPE } from '@/config/action.config';
import { TvPreTypeOptions } from '@/config/action.config';
import { FormItem, YSelect } from '@/components';

interface ActionTv {
  name: string;
  defaultParam?: Record<string, any>;
}

const ActionTv: React.FC<ActionTv> = ({ name, defaultParam }) => {
  return (
    <FormItem
      form
      label="预告跳转类型"
      name={`${name}[${FORM_TVPRETYPETVPRETYPE}]`}
      defaultValue={defaultParam ? defaultParam[FORM_TVPRETYPETVPRETYPE] : null}
    >
      <YSelect options={TvPreTypeOptions} />
    </FormItem>
  );
};

export default React.memo(ActionTv);
