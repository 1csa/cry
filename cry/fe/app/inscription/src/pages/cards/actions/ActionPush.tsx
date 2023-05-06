import React from 'react';

import { FORM_DOCID, FORM_SUMMARY, FORM_TITLE } from '@/config/action.config';
import { FormItem, YInput } from '@/components';

interface ActionProfile {
  name: string;
  defaultParam?: Record<string, any>;
}

const ActionPush: React.FC<ActionProfile> = ({ name, defaultParam }) => {
  return (
    <>
      <FormItem
        form
        label="Docid"
        name={`${name}[${FORM_DOCID}]`}
        defaultValue={defaultParam ? defaultParam[FORM_DOCID] : null}
      >
        <YInput placeholder="请输入push文章" />
      </FormItem>
      <FormItem
        form
        label="标题"
        name={`${name}[${FORM_TITLE}]`}
        defaultValue={defaultParam ? defaultParam[FORM_TITLE] : null}
      >
        <YInput placeholder="请输入互动push标题" />
      </FormItem>
      <FormItem
        form
        label="摘要"
        name={`${name}[${FORM_SUMMARY}]`}
        defaultValue={defaultParam ? defaultParam[FORM_SUMMARY] : null}
      >
        <YInput placeholder="请输入互动push摘要" />
      </FormItem>
    </>
  );
};

export default React.memo(ActionPush);
