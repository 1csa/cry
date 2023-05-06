/**
 * 子卡片: 竖图子模版
 * 这里的默认值怎么灌进去？
 */

import React, { useEffect } from 'react';
import { Button, Divider } from 'antd';
import { useDispatch, useSelector } from 'dva';
import { useFormContext, ArrayField, useWatch } from 'react-hook-form';

import { FormItem, YInput, YUpload, YIcon, YColor, YSelect } from '@/components';
import { useModeContext } from '@/hooks';

import { FORM_ID, FORM_TEMP, FORM_CSS, TEMP_2002 } from '@/config/card.config';
import { child_options, childCssList, FORM_CONTENT, FORM_ACTIONS, FORM_STYLE } from '@/config/card.config';
import { FORM_TOPITEM, FORM_MAIN, FORM_SUB, FORM_COVER, FORM_LABEL_TEXT, FORM_LABEL_COLOR } from '@/config/card.config';
import { CardAction } from '@/pages/cards/forms';
import { ConnectState } from '@/types/connect';
import { CardForm, DocInfo } from '@/types/card';

interface Card_2002 {
  name: string;
  field: ArrayField<CardForm, 'id'>;
}

// 这里的整组件重刷来自于watch的使用，根本原因在于context的使用
// 其他组件的重刷来自
const Card_2002: React.FC<Card_2002> = ({ name, field }) => {
  const dispatch = useDispatch();
  const docinfo = useSelector<ConnectState, Record<string, DocInfo>>(state => state.card.docinfo);

  const { setValue, control } = useFormContext<CardForm>();
  const { mode } = useModeContext();
  const docid = useWatch<string>({ name: `${name}[${FORM_CONTENT}][${FORM_TOPITEM}]`, control });

  const handleQueryDoc = () => {
    if (!docid) {
      return dispatch({
        type: 'common/error',
        payload: { type: 'error', message: '请输入docid' },
      });
    }
    dispatch({
      type: 'card/fetchdoc',
      payload: { docid, mode },
    });
  };

  useEffect(() => {
    if (!docinfo || !docid || !docinfo[docid]) {
      return;
    }

    setValue(`${name}[${FORM_CONTENT}][${FORM_MAIN}]`, docinfo[docid].title);
    setValue(`${name}[${FORM_CONTENT}][${FORM_COVER}]`, docinfo[docid].image);
  }, [docid, docinfo]);

  return (
    <>
      <FormItem form={true} label="卡片ID" name={`${name}[${FORM_ID}]`} defaultValue={field[FORM_ID]}>
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
        label="主标题"
        name={`${name}[${FORM_CONTENT}][${FORM_MAIN}]`}
        defaultValue={field[FORM_CONTENT][FORM_MAIN]}
      >
        <YInput />
      </FormItem>

      <FormItem
        form
        label="副标题"
        name={`${name}[${FORM_CONTENT}][${FORM_SUB}]`}
        defaultValue={field[FORM_CONTENT][FORM_SUB]}
      >
        <YInput />
      </FormItem>

      <FormItem
        form
        label="封面图"
        name={`${name}[${FORM_CONTENT}][${FORM_COVER}]`}
        defaultValue={field[FORM_CONTENT][FORM_COVER]}
      >
        <YUpload>
          <span>竖图子卡片封面图比例为3:4</span>
        </YUpload>
      </FormItem>

      {/*样式*/}
      <FormItem
        form
        label="标签文案"
        name={`${name}[${FORM_STYLE}][${FORM_LABEL_TEXT}]`}
        defaultValue={field[FORM_STYLE][FORM_LABEL_TEXT]}
      >
        <YInput />
      </FormItem>
      <FormItem
        form
        label="标签颜色"
        name={`${name}[${FORM_STYLE}][${FORM_LABEL_COLOR}]`}
        defaultValue={field[FORM_STYLE][FORM_LABEL_COLOR]}
      >
        <YColor />
      </FormItem>

      {/* 跳转 */}
      <CardAction name={`${name}[${FORM_ACTIONS}]`} defaultAction={field[FORM_ACTIONS]} />
    </>
  );
};

export default React.memo(Card_2002);
