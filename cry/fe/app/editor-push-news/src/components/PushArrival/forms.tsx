import React, { useState, useMemo, useEffect } from 'react';
import { Modal, Switch } from 'antd';
import { useField, useFormikContext } from 'formik';
import { FormItem, Radio, Input } from 'formik-antd';
import { useSelector } from 'dva';
import { ImageCutter } from '@/components/ImageCutter';
import { articleInfoSelector } from '@/selectors/editorpush';
import { yes_no_map } from '@/data';
import { parseradio, resolveImageUrl } from '@/utils';

import './index.less';

interface FormikItemProps {
  fieldname: string;
  children: React.ReactElement;
}

interface ImgUrl {
  url: string;
  random: number;
}

export const FormikPushArrival: React.FC<FormikItemProps> = React.memo(({ fieldname, children }) => {
  const [_, { value }] = useField(fieldname);

  return React.cloneElement(children, { value });
});

// 声音：无先验条件
// TODO
export const VoiceFormItem: React.FC = React.memo(() => {
  const formik = useFormikContext();
  const [_, { value: sound }] = useField('sound');
  const [checked, setChecked] = useState<boolean>(true);

  useEffect(() => {
    setChecked(sound === '1' ? true : false);
  }, [sound]);

  const handleChange = (checked: boolean) => {
    formik.setFieldValue('sound', checked ? '1' : '2');
    setChecked(checked);
  };
  return (
    <FormItem className="form-item" name="sound" label="声音">
      <Switch onChange={handleChange} defaultChecked={true} checked={checked} />
    </FormItem>
  );
});

// 展示重要推送弹窗： 无先验条件
export const TipFormItem: React.FC = React.memo(() => {
  const formik = useFormikContext();
  const [_, { value: showTips }] = useField('showTips');

  const [checked, setChecked] = useState<boolean>(false);

  useEffect(() => {
    setChecked(showTips === '1' ? true : false);
  }, [showTips]);

  const handleChange = (checked: boolean) => {
    formik.setFieldValue('showTips', checked ? '1' : '0');
    setChecked(checked);
  };
  return (
    <FormItem className="form-item" name="showTips" label="小米展示重要推送弹窗">
      <Switch onChange={handleChange} defaultChecked={false} checked={checked} />
    </FormItem>
  );
});

// 图片裁剪预览
export const ImageFormItem: React.FC = React.memo(() => {
  const articleInfo = useSelector(articleInfoSelector);
  const [imgUrl, setImgUrl] = useState<ImgUrl>({ url: '', random: 0 });
  const renderImgUrl = useMemo(() => {
    // 渲染图片
    const { serving_status, image_urls, image } = articleInfo;

    let imageList: Array<string> = [];
    if (serving_status === true /* 未删除的文章 */) {
      if (image_urls && image_urls.length > 0) {
        imageList = image_urls.map((url: string) => resolveImageUrl(url)).concat(imageList);
      } else if (image) {
        imageList.unshift(resolveImageUrl(image));
      }
    }

    return imageList.map((url, index) => {
      return (
        <div
          key={index}
          onClick={() => {
            handleClickImg(url);
          }}
          className="cximg"
        >
          <img src={url} />
        </div>
      );
    });
  }, [articleInfo]);

  const handleClickImg = (url: string) => {
    setImgUrl({ url, random: Math.random() });
  };

  return (
    <FormItem className="form-item" name="image" label="通知栏配图">
      <div className="title">{renderImgUrl}</div>
      <ImageCutter imgUrl={imgUrl} />
    </FormItem>
  );
});


export const TitleFormItem: React.FC = React.memo(() => {
  const [_, { value: img }] = useField('img'); // 获取模版对应字段
  const [__, { value: xiaomi_img_url }] = useField('xiaomi_img_url'); // 获取模版对应字段
  const [___, { value: oppo_push_notification_img_url }] = useField('oppo_push_notification_img_url'); // 获取模版对应字段
  return (
    <FormItem className="form-item" name="img" label="当前推送图片">
      <div className="imgtitle">
        {img && <img className="imgitem" src={img}></img>}
        {xiaomi_img_url && <img className="imgitem" src={xiaomi_img_url}></img>}
        {oppo_push_notification_img_url && <img className="imgitem" src={oppo_push_notification_img_url}></img>}
      </div>
    </FormItem>
  )
})
