/**
 * 子卡片: 针对主题卡片的方图子模版
 */

import React, { useEffect } from 'react';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'dva';
import { useFormContext, ArrayField } from 'react-hook-form';

import { FormItem, YInput, YIcon, YUpload, YSelect, YRadio, YColor } from '@/components';
import { CardAction } from '@/pages/cards/forms';
import {
  child_options, FORM_CONTENT, FORM_ACTIONS, FORM_LABEL_TEXT, cardCssList,
  FORM_LABEL_COLOR, FORM_LABEL_IF, FORM_LABEL_BACK, FORM_STYLE, FORM_CSS } from '@/config/card.config';
import { YesNoOptions } from '@/config/action.config';
import { FORM_ID, FORM_TOPITEM, FORM_MAIN, FORM_COVER, FORM_TEMP } from '@/config/card.config';
import { ConnectState } from '@/types/connect';
import { CardForm, DocInfo } from '@/types/card';
import { useModeContext } from '@/hooks';

interface Card_2006 {
  name: string;
  field: ArrayField<CardForm, 'id'>;
}

const Card_2006: React.FC<Card_2006> = ({ name, field }) => {
  const dispatch = useDispatch();
  const docinfo = useSelector<ConnectState, Record<string, DocInfo>>(state => state.card.docinfo);
  const forms = useFormContext<CardForm>();
  const modeContext = useModeContext();

  const docid = forms.watch<string, string>(`${name}[${FORM_CONTENT}][${FORM_TOPITEM}]`);

  const handleQueryDoc = () => {
    if (!docid) {
      return dispatch({
        type: 'common/error',
        payload: { type: 'error', message: '请输入docid' },
      });
    }
    dispatch({
      type: 'card/fetchdoc',
      payload: { docid, mode: modeContext.mode },
    });
  };

  useEffect(() => {
    if (!docinfo || !docid || !docinfo[docid]) {
      return;
    }

    forms.setValue(`${name}[${FORM_CONTENT}][${FORM_MAIN}]`, docinfo[docid].title);
    forms.setValue(`${name}[${FORM_CONTENT}][${FORM_COVER}]`, docinfo[docid].image);
  }, [docid, docinfo]);

  return (
    <>
      <FormItem form name={`${name}[${FORM_ID}]`} label="卡片ID" defaultValue={field[FORM_ID]}>
        <YInput disabled placeholder="保存后自动生成" />
      </FormItem>

      <FormItem form name={`${name}[${FORM_TEMP}]`} style={{ display: 'none' }} defaultValue={field[FORM_TEMP]}>
        <YSelect options={child_options} />
      </FormItem>

      {/* 内容 */}
      <FormItem form name={`${name}[${FORM_CONTENT}][${FORM_CSS}]`} label="卡片样式">
        <YSelect options={cardCssList} />
      </FormItem>
      <FormItem
        form
        label="内容ID"
        name={`${name}[${FORM_CONTENT}][${FORM_TOPITEM}]`}
        defaultValue={field[FORM_CONTENT][FORM_TOPITEM]}
      >
        <YInput flex={true}>
          <Button size="small" type="primary" icon={<YIcon type="search" />} onClick={handleQueryDoc}>
            获取文章
          </Button>
        </YInput>
      </FormItem>
      <FormItem
        form
        label="内容标题"
        name={`${name}[${FORM_CONTENT}][${FORM_MAIN}]`}
        defaultValue={field[FORM_CONTENT][FORM_MAIN]}
      >
        <YInput />
      </FormItem>
      <FormItem
        form
        label="封面图"
        name={`${name}[${FORM_CONTENT}][${FORM_COVER}]`}
        defaultValue={field[FORM_CONTENT][FORM_COVER]}
      >
        <YUpload haveLink={true}>
          <span></span>
        </YUpload>
      </FormItem>
      <FormItem form name={`${name}[${FORM_STYLE}].${FORM_LABEL_TEXT}`} label="标签文案">
        <YInput />
      </FormItem>
      <FormItem form name={`${name}[${FORM_STYLE}].${FORM_LABEL_COLOR}`} label="文案色值">
        <YColor />
      </FormItem>
      <FormItem form name={`${name}[${FORM_STYLE}].${FORM_LABEL_IF}`} label="显示背景色">
        <YRadio options={YesNoOptions} />
      </FormItem>
      <FormItem form name={`${name}[${FORM_STYLE}].${FORM_LABEL_BACK}`} label="背景色值">
        <YColor />
      </FormItem>

      {/*  跳转 */}
      <CardAction name={`${name}[${FORM_ACTIONS}]`} defaultAction={field[FORM_ACTIONS]} />
    </>
  );
};

export default React.memo(Card_2006);
