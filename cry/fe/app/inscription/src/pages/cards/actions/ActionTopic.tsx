import React from 'react';

import { FORM_URL, FORM_DOCID } from '@/config/action.config';
import { FormItem, YInput } from '@/components';

interface ActionTopic {
  name: string;
  defaultParam?: Record<string, any>;
}

const ActionTopic: React.FC<ActionTopic> = ({ name, defaultParam }) => {
  return (
    <>
      <FormItem
        form
        label="Docid"
        name={`${name}[${FORM_DOCID}]`}
        defaultValue={defaultParam ? defaultParam[FORM_DOCID] : null}
      >
        <YInput>
          <span>专题类型为热点专题时必填</span>
        </YInput>
      </FormItem>
      <FormItem
        form
        label="URL"
        name={`${name}[${FORM_URL}]`}
        defaultValue={defaultParam ? defaultParam[FORM_URL] : null}
      >
        <YInput />
      </FormItem>
    </>
  );
};

export default React.memo(ActionTopic);
