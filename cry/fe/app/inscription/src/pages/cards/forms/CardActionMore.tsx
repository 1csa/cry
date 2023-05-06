/**
 * 跳转更多的通用表单
 */

import React from 'react';
import { Divider } from 'antd';
import { useFormContext } from 'react-hook-form';

import { YInput, YRadio, FormItem, YSelect } from '@/components';
import { YesNoOptions, ActionTypes, FORM_MORE, FORM_MORE_TEXT } from '@/config/card.config';
import { FORM_MORE_TOPITEM, FORM_MORE_ACTION, FORM_MORE_PARAM } from '@/config/card.config';
import * as actions from '@/pages/cards/actions';

interface CardMore {
  name: string;
}

const CardMore: React.FC<CardMore> = ({ name }) => {
  const form = useFormContext();
  const actionMore = form.watch(`${name}[${FORM_MORE}]`);
  const action = form.watch(`${name}[${FORM_MORE_ACTION}]`);

  // 组件名和下拉值之间的绑定关系
  const genActionName = (action: string) => {
    const actionName = action.replace(/^\w/g, p => p.toUpperCase()).replace(/_\w/g, p => p.slice(1).toUpperCase());
    return `Action${actionName}`;
  };

  return (
    <>
      <h4>跳转配置</h4>
      <FormItem form name={`${name}[${FORM_MORE}]`} label="支持更多跳转">
        <YRadio options={YesNoOptions} />
      </FormItem>
      {actionMore ? (
        <>
          <FormItem form name={`${name}[${FORM_MORE_TEXT}]`} label="跳转按钮文案">
            <YInput />
          </FormItem>
          <FormItem form name={`${name}[${FORM_MORE_TOPITEM}]`} label="跳转封面内容ID">
            <YInput />
          </FormItem>

          <FormItem form name={`${name}[${FORM_MORE_ACTION}]`} label="跳转类型">
            <YSelect options={ActionTypes} />
          </FormItem>
          {action ? React.createElement(actions[genActionName(action)], { name: `${name}[${FORM_MORE_PARAM}]` }) : null}
        </>
      ) : null}
      <Divider />
    </>
  );
};

export default CardMore;
