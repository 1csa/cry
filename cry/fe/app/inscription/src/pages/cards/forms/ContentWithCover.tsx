import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Tooltip, Divider } from 'antd';

import { FormItem, YRadio, YInput, YUpload, YIcon, YSelect } from '@/components';
import { YesNoOptions, cardCssList, FORM_SHOW_TITLE, FORM_COVER, FORM_TITLE, FORM_MAIN } from '@/config/card.config';
import { FORM_IMAGE_WIDTH, FORM_IMAGE_HEIGHT, FORM_BUTTON_LABEL, FORM_CSS } from '@/config/card.config';
import { isNumStr } from '@/utils';

interface CardContent {
  name: string;
}

const CardContent: React.FC<CardContent> = ({ name }) => {
  const form = useFormContext();
  const showTitle = form.watch(`${name}.${FORM_SHOW_TITLE}`);

  const handleTitleChange = (value: string) => {
    form.setValue(FORM_TITLE, value);
  };

  return (
    <>
      <h4>内容配置</h4>
      <FormItem form name={`${name}.${FORM_CSS}`} label="卡片样式">
        <YSelect options={cardCssList}/>
      </FormItem>
      <FormItem form name={`${name}.${FORM_SHOW_TITLE}`} label="展示标题">
        <YRadio options={YesNoOptions} />
      </FormItem>
      {showTitle ? (
        // <FormItem form label="卡片标题" name={`${name}.${FORM_TITLE}`}>
        <FormItem form label="卡片标题" name={`${name}.${FORM_MAIN}`}>
          <YInput onExtraChange={handleTitleChange} />
        </FormItem>
      ) : null}
      <FormItem form name={`${name}.${FORM_COVER}`} label="封面图">
        <YUpload>
          <span>
            温馨提示：
            <br />
            1、请上传600px400的8:3比例的封面图 {/* TODO: 单图卡片封面比例待定 */}
            <br />
            2、仅支持jpg、jpeg、png、gif
            <br />
            3、图片大小不要超过3M
          </span>
        </YUpload>
      </FormItem>
      <div className="formitem">
        <label className="formitem-label">图片宽高</label>
        <div className="formitem-content formitem-flex">
          <FormItem
            form
            name={`${name}.${FORM_IMAGE_WIDTH}`}
            rule={{ validate: data => (isNumStr(data) === false ? '图片宽度应当为数值型' : undefined) }}
          >
            <YInput placeholder="图片宽度" />
          </FormItem>
          <span>--</span>
          <FormItem
            form
            name={`${name}.${FORM_IMAGE_HEIGHT}`}
            rule={{ validate: data => (isNumStr(data) === false ? '图片高度应当为数值型' : undefined) }}
          >
            <YInput placeholder="图片高度" />
          </FormItem>
          <Tooltip placement="right" title="非必填，不填客户端按照预设尺寸展示。如填写，则客户端严格按照填写尺寸展示">
            <YIcon type="question" />
          </Tooltip>
        </div>
      </div>
      <FormItem form label="按钮文案" name={`${name}.${FORM_BUTTON_LABEL}`}>
        <YInput />
      </FormItem>
      <Divider />
    </>
  );
};

export default React.memo(CardContent);
