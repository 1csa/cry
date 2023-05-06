/**
 * 直播类型的子卡：无pk
 */

import React from 'react';

import { ArrayField } from 'react-hook-form';

import { FormItem, YInput, YDatePicker, YUpload } from '@/components';
import { FORM_ID, FORM_BATTLE_TIME, FORM_BATTLE_TITLE, FORM_BATTLE_SUB, FORM_ITEM_ICON, FORM_ITEM_NAME } from '@/config/card.config';
import { FORM_CONTENT, FORM_STYLE, FORM_ACTIONS, FORM_LABEL_TEXT, FORM_LABEL_COLOR } from '@/config/card.config';
import { CardForm } from '@/types/card';

import CardAction from '../forms/CardAction';

interface Card_2007Props {
  name: string;
  field: ArrayField<CardForm, 'id'>;
}

const Card_2007: React.FC<Card_2007Props> = ({ name, field }) => {
  return (
    <>
      <FormItem form name={`${name}[${FORM_ID}]`} label="卡片ID" defaultValue={field[FORM_ID]}>
        <YInput disabled placeholder="保存后自动生成" />
      </FormItem>

      {/* 内容 */}
      <FormItem
        form
        name={`${name}[${FORM_CONTENT}][${FORM_BATTLE_TITLE}]`}
        label="直播主题"
        defaultValue={field[FORM_CONTENT][FORM_BATTLE_TITLE]}
      >
        <YInput />
      </FormItem>
      <FormItem
        form
        name={`${name}[${FORM_CONTENT}][${FORM_BATTLE_SUB}]`}
        label="直播副标题"
        defaultValue={field[FORM_CONTENT][FORM_BATTLE_SUB]}
      >
        <YInput />
      </FormItem>
      <FormItem
        form
        name={`${name}[${FORM_CONTENT}][${FORM_BATTLE_TIME}]`}
        label="直播时间"
        defaultValue={field[FORM_CONTENT][FORM_BATTLE_TIME]}
      >
        <YDatePicker format={'YYYY-MM-DD HH:mm:ss'} />
      </FormItem>
      <FormItem
        form
        name={`${name}[${FORM_CONTENT}][${FORM_ITEM_NAME}]`}
        label="项目名称"
        defaultValue={field[FORM_CONTENT][FORM_ITEM_NAME]}
      >
        <YInput />
      </FormItem>
      <FormItem
        form
        name={`${name}.${FORM_CONTENT}.${FORM_ITEM_ICON}`}
        label="项目icon"
        defaultValue={field[FORM_CONTENT][FORM_ITEM_ICON]}
      >
        <YUpload />
      </FormItem>

      {/* 样式 */}
      <FormItem
        form
        name={`${name}[${FORM_STYLE}][${FORM_LABEL_TEXT}]`}
        label="标签文案"
        defaultValue={field[FORM_STYLE][FORM_LABEL_TEXT]}
      >
        <YInput />
      </FormItem>
      <FormItem
        form
        name={`${name}[${FORM_STYLE}][${FORM_LABEL_COLOR}]`}
        label="标签颜色"
        defaultValue={field[FORM_STYLE][FORM_LABEL_COLOR]}
      >
        <YInput />
      </FormItem>

      {/* 跳转 */}
      <CardAction name={`${name}[${FORM_ACTIONS}]`} defaultAction={field[FORM_ACTIONS]} />
    </>
  );
};

export default React.memo(Card_2007);
