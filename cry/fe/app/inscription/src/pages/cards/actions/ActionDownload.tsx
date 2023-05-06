import React from 'react';

import { YesNoOptions, FORM_URL, FORM_TVPRETYPEINSTALL } from '@/config/action.config';
import { FormItem, YInput, YRadio } from '@/components';

interface ActionDownload {
  name: string;
  defaultParam?: Record<string, any>;
}

const ActionDownload: React.FC<ActionDownload> = ({ name, defaultParam }) => {
  return (
    <>
      <FormItem
        form
        label="URL"
        name={`${name}[${FORM_URL}]`}
        defaultValue={defaultParam ? defaultParam[FORM_URL] : null}
      >
        <YInput />
      </FormItem>
      <FormItem
        form
        label="默认安装"
        name={`${name}[${FORM_TVPRETYPEINSTALL}]`}
        defaultValue={defaultParam ? defaultParam[FORM_TVPRETYPEINSTALL] : null}
      >
        <YRadio options={YesNoOptions} />
      </FormItem>
    </>
  );
};

export default React.memo(ActionDownload);
