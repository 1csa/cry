import React, { useState, useCallback } from 'react';
import { Button } from 'antd';

import { YForm, YTextarea, YInput, YSelect, YUpload } from '@/components';
import { DebugMode } from '@/types/app';
import { cards, FORM_TYPE, FORM_TOPITEM, FORM_TITLE, FORM_COVER, FORM_REMARK } from '@/config/card.config';

interface CardBasic {
  mode: DebugMode;
}

const CardBasic: React.FC<CardBasic> = () => {
  const [preview, setPreview] = useState<string>();

  const handleTypeChange = useCallback((value: string | number) => {
    const targetType = cards.find(cardItem => cardItem.template_id === value);
    if (!targetType) {
      return void 0;
    }
    setPreview(targetType.preview);
  }, []);

  return (
    <YForm>
      <YSelect
        type="form"
        label="卡片类型"
        labelName="template_name"
        valueName="template_id"
        name={FORM_TYPE}
        options={cards}
        onChange={handleTypeChange}
      >
        {preview && <img src={preview} />}
      </YSelect>
      <YInput type="form" flex={true} label="封面内容" name={FORM_TOPITEM}>
        <Button size="small" type="primary">
          获取文章
        </Button>
      </YInput>
      <YInput type="form" label="卡片标题" name={FORM_TITLE} />
      <YUpload type="form" label="封面图" name={FORM_COVER}>
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
      <YTextarea type="form" label="卡片说明" name={FORM_REMARK} />
    </YForm>
  );
};

export default React.memo(CardBasic);
