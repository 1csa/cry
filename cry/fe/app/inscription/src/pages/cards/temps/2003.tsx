/**
 * 子卡片: 方图子模版
 */

import React, { useEffect } from 'react';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'dva';
import { useFormContext, ArrayField } from 'react-hook-form';

import { FormItem, YInput, YIcon, YUpload, YSelect } from '@/components';
import { useModeContext } from '@/hooks';

import { child_options, childCssList, FORM_CONTENT, FORM_ACTIONS, TEMP_2003 } from '@/config/card.config';
import { FORM_ID, FORM_TOPITEM, FORM_MAIN, FORM_COVER, FORM_TEMP, FORM_CSS } from '@/config/card.config';
import { CardAction } from '@/pages/cards/forms';

import { ConnectState } from '@/types/connect';
import { CardForm, DocInfo } from '@/types/card';

interface Card_2003 {
  name: string;
  field: ArrayField<CardForm, 'id'>;
}

const Card_2003: React.FC<Card_2003> = ({ name, field }) => {
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

      {/* 内容 */}
      <FormItem form name={`${name}[${FORM_CONTENT}][${FORM_CSS}]`} label="卡片样式">
        <YSelect options={childCssList} />
      </FormItem>
      <FormItem
        form
        label="封面内容"
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
        label="卡片标题"
        name={`${name}[${FORM_CONTENT}][${FORM_MAIN}]`}
        defaultValue={field[FORM_CONTENT][FORM_MAIN]}
      >
        <YInput />
      </FormItem>
      <FormItem
        form
        label="封面配图"
        name={`${name}[${FORM_CONTENT}][${FORM_COVER}]`}
        defaultValue={field[FORM_CONTENT][FORM_COVER]}
      >
        <YUpload>
          <span>方图子卡片封面图比例为1:1</span>
        </YUpload>
      </FormItem>

      {/*  跳转 */}
      <CardAction name={`${name}[${FORM_ACTIONS}]`} defaultAction={field[FORM_ACTIONS]} />
    </>
  );
};

export default React.memo(Card_2003);
