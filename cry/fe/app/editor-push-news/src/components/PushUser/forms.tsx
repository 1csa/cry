import React, { useState, useEffect } from 'react';
import { useSelector } from 'dva';
import { useField, useFormikContext } from 'formik';
import { Select, Input, FormItem, Checkbox } from 'formik-antd';

import { parseselect } from '@/utils';

import { TagForm } from '@/components/TagForm';

import { userelayermapSelector, storedInTagSelector, storedExTagSelector, storedInterTagSelector } from '@/selectors/editorpush';
import { getOppoPushIsOver } from '@/services/editorpushService';
import { currentTemplateSelector } from '@/selectors/template';

import { useridsValidate, engWithSerpValidate, tagsValidate } from '@/validation/editorpush';
import { defaultTags, defaultTags1, defaultTags2 } from '@/config/editorpush/push.config';

interface FormikItemProps {
  fieldname: string;
  children: React.ReactElement;
}

export const FormikPushContent: React.FC<FormikItemProps> = React.memo(({ fieldname, children }) => {
  const [_, { value }] = useField(fieldname);

  return React.cloneElement(children, { value });
});

// 用户层级：全类型可配， 无先验条件
export const UserlayerFormItem: React.FC = React.memo(() => {
  const userlayerMap = useSelector(userelayermapSelector);

  return (
    <FormItem className="form-item" name="user_layer_channel" label="用户层级">
      <Select name="user_layer_channel" mode="multiple" showArrow>
        {parseselect(userlayerMap)}
      </Select>
    </FormItem>
  );
});

// 热点脉络文章
// TODO 写入工具权限
export const VeinsFormItem: React.FC = React.memo(() => {
  const validator = (value: string) => engWithSerpValidate(value, '热点脉络文章');

  return (
    <FormItem className="form-item" name="veins_docids" label="热点脉络文章" validate={validator}>
      <div className="userform-flex">
        <Input name="veins_docids" />
        <FormItem className="userform-flex-right" name="retrieve_strategy">
          <Checkbox name="retrieve_strategy">个性化</Checkbox>
        </FormItem>
      </div>
    </FormItem>
  );
});

// 用户ID
export const UseridFormItem: React.FC = React.memo(() => {
  return (
    <FormItem className="form-item" name="userids" label="用户ID" required={true} validate={useridsValidate}>
      <Input name="userids" />
    </FormItem>
  );
});

// 推送圈选标签
export const IntagFormItem: React.FC = React.memo(() => {
  const [intagOpt, setIntagOpt] = useState<Record<string, string>>({});
  const inTag = useSelector(storedInTagSelector); // 从model state获取对应tag值 根据useEffect动态修改
  useEffect(() => {
    setIntagOpt(inTag);
  }, [inTag]);
  const validator = (value: string[]) => tagsValidate(value);

  return (
    <FormItem className="form-item" name="tags" label="推送圈选标签" required={true} validate={validator}>
      <TagForm type="include" form tagOptions={intagOpt} onOptionChange={setIntagOpt} />
    </FormItem>
  );
});

// 推送圈选交集标签
export const Inter_channelFormItem: React.FC = React.memo(() => {
  const [intagOpt, setIntagOpt] = useState<Record<string, string>>({});
  const inTag = useSelector(storedInterTagSelector); // 从model state获取对应tag值 根据useEffect动态修改
  useEffect(() => {
    setIntagOpt(inTag);
  }, [inTag]);
  // const validator = (value: string[]) => tagsValidate(value);

  return (
    <FormItem className="form-item" name="inter_channel" label="推送交集标签">
      <TagForm type="inter" form tagOptions={intagOpt} onOptionChange={setIntagOpt} />
    </FormItem>
  );
});

// 排除圈选标签
export const ExtagFormItem: React.FC = React.memo(() => {
  const formik: any = useFormikContext();
  const [extagOpt, setExtagOpt] = useState<Record<string, string>>({});
  const [currentValue, setCurrentValue] = useState<string []>(['']);
  const exTag = useSelector(storedExTagSelector); // 从model state获取对应tag值 根据useEffect动态修改
  const templateId = useSelector(currentTemplateSelector)
  
  let cateValue = formik['values']['cate'] || ''

  useEffect(() => {
    handelInitFn()
  }, [exTag, templateId, cateValue]);

  useEffect(() => {
    // 只有在模板2下才生效
    if (templateId === '002' && cateValue === 'z38') { // 推送分类选择【活动】的时候 取消排除 “oppo中度沉默用户”
      let arr: string [] = formik['values']['excludeTags'] || []
      let i = arr.indexOf('e2465906')
      if (arr.length && i > -1) {
        arr.splice(i, 1)
      }
      formik.setFieldValue('excludeTags', arr)
      setCurrentValue(arr)
    }
  }, [cateValue])

  const handelInitFn = async () => {
    const isOpenOppoPushButton = await getOppoPushIsOver() 
    let useDefaultTags = {}
    if (templateId === '001' || templateId === '003') {
      useDefaultTags = {...defaultTags1, ...exTag}
      // useDefaultTags['e3144742'] = '华为渠道所有用户'
    }
    if (templateId === '002') {
      useDefaultTags = {...defaultTags2, ...exTag};
      // useDefaultTags['e3144742'] = '华为渠道所有用户'
    }
    if (isOpenOppoPushButton) {
      useDefaultTags = JSON.parse(JSON.stringify(useDefaultTags))
      if (templateId === '001' || templateId === '002' || templateId === '003') {
        useDefaultTags['e3138922'] = '当日已活跃用户_除北京'
      }
      if (templateId === '003') {
        useDefaultTags['e2465915'] = 'oppo渠道所有用户'
      }
    }

    setExtagOpt(useDefaultTags);
  }
  
  return (
    <FormItem className="form-item" name="excludeTags" label="排除推送标签">
      <TagForm type="exclude" form tagOptions={extagOpt} onOptionChange={setExtagOpt} />
    </FormItem>
  );
});
