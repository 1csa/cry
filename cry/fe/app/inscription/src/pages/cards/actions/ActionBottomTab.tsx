import React from 'react';

import { FORM_FROMID, FORM_TAB, BottomTabOptions } from '@/config/action.config';
import { FormItem, YInput, YSelect } from '@/components';

interface ActionBottomTab {
  appid?: string; // 暂定没有appid
  name: string;
  defaultParam?: Record<string, any>;
}

const ActionBottomTab: React.FC<ActionBottomTab> = ({ name, defaultParam }) => {
  return (
    <>
      <FormItem
        form
        label="底栏Tab"
        name={`${name}[${FORM_TAB}]`}
        defaultValue={defaultParam ? defaultParam[FORM_TAB] : null}
      >
        <YSelect options={BottomTabOptions} />
      </FormItem>
      <FormItem
        form
        label="FromId"
        name={`${name}[${FORM_FROMID}]`}
        defaultValue={defaultParam ? defaultParam[FORM_FROMID] : null}
      >
        <YInput />
      </FormItem>
    </>
  );
};

export default React.memo(ActionBottomTab);
