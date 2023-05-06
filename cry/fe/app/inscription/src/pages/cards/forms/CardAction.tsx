import React from 'react';
import { Divider } from 'antd';
import { useFormContext } from 'react-hook-form';

import * as actions from '@/pages/cards/actions';
import { FormItem, YSelect } from '@/components';
import { ActionTypes, FORM_ACTION, FORM_ACTION_PARAM } from '@/config/card.config';
interface CardAction {
  name: string;
  defaultAction?: Record<string, any>;
}

const CardAction: React.FC<CardAction> = ({ name, defaultAction }) => {
  const form = useFormContext();
  const action = form.watch(`${name}[${FORM_ACTION}]`);

  // 组件名和下拉值之间的绑定关系
  const genActionName = (action: string) => {
    const actionName = action.replace(/^\w/g, p => p.toUpperCase()).replace(/_\w/g, p => p.slice(1).toUpperCase());
    return `Action${actionName}`;
  };

  return (
    <>
      <h4>跳转配置</h4>
      <FormItem
        form
        name={`${name}[${FORM_ACTION}]`}
        label="跳转类型"
        defaultValue={defaultAction ? defaultAction[FORM_ACTION] : null}
      >
        <YSelect options={ActionTypes} />
      </FormItem>
      {action
        ? React.createElement(actions[genActionName(action)], {
            name: `${name}[${FORM_ACTION_PARAM}]`,
            defaultParam: defaultAction ? defaultAction[FORM_ACTION_PARAM] : null,
          })
        : null}
      <Divider />
    </>
  );
};

export default React.memo(CardAction);
