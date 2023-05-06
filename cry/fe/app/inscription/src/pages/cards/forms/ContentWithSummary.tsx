/**
 * 封面内容设置: 封面内容、卡片标题、封面图
 * 需要将debug mode这个字段内容写进context
 */
import React, { useEffect } from 'react';
import { Button, Divider } from 'antd';
import { UseFormMethods } from 'react-hook-form';

import { FormItem, YInput, YUpload, YIcon, YSelect } from '@/components';
import { FORM_TOPITEM, FORM_TITLE, FORM_COVER, FORM_SUMMARY, FORM_MAIN } from '@/config/card.config';
import { FORM_CSS, cardCssList } from '@/config/card.config';
import { DocInfo, CardForm } from '@/types/card';

interface CardCover {
  form: UseFormMethods<CardForm>;
  name: string;
  docinfo: Record<string, DocInfo>;
  onQueryDoc: (docid: string) => void;
}

// 如果将业务写在这里，就会变成service和ui耦合
const CardCover: React.FC<CardCover> = ({ form, name, docinfo, onQueryDoc }) => {
  const docid = form.watch<string, string>(`${name}.${FORM_TOPITEM}`);

  const handleTitleChange = (value: string) => {
    form.setValue(FORM_TITLE, value);
  };

  useEffect(() => {
    if (!docinfo || !docid || !docinfo[docid]) {
      return void 0;
    }

    form.setValue(FORM_TITLE, docinfo[docid].title);
    // form.setValue(`${name}.${FORM_TITLE}`, docinfo[docid].title);
    form.setValue(`${name}.${FORM_MAIN}`, docinfo[docid].title);
    form.setValue(`${name}.${FORM_COVER}`, docinfo[docid].image);
  }, [docinfo, docid]);

  return (
    <>
      <h4>内容配置</h4>
      <FormItem form name={`${name}.${FORM_CSS}`} label="卡片样式">
        <YSelect options={cardCssList} />
      </FormItem>
      <FormItem form label="封面内容ID(docid)" name={`${name}.${FORM_TOPITEM}`}>
        <YInput flex={true}>
          <Button size="small" icon={<YIcon type="search" />} type="primary" onClick={() => onQueryDoc(docid)}>
            获取文章
          </Button>
        </YInput>
      </FormItem>
      {/* <FormItem form label="卡片标题" name={`${name}.${FORM_TITLE}`}> */}
      <FormItem form label="卡片标题" name={`${name}.${FORM_MAIN}`}>
        <YInput onExtraChange={handleTitleChange} />
      </FormItem>
      <FormItem form label="封面图" name={`${name}.${FORM_COVER}`}>
        <YUpload>
          <span>
            温馨提示：
            <br />
            1、请上传600px400的16:10比例的封面图
            <br />
            2、仅支持jpg、jpeg、png、gif
            <br />
            3、图片大小不要超过3M
          </span>
        </YUpload>
      </FormItem>
      <FormItem form name={`${name}.${FORM_SUMMARY}`} label="卡片简介">
        <YInput />
      </FormItem>
      <Divider />
    </>
  );
};

export default React.memo(CardCover);
