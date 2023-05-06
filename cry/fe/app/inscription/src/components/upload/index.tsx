import React, { useState, useCallback, useEffect } from 'react';
import { Input, Upload, Modal, Button } from 'antd';
import { UploadChangeParam, UploadFile } from 'antd/es/upload/interface';
import { InputProps } from 'antd/es/input';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import { YIcon } from '@/components';
import { ZEUS_IMG_PATH } from '@/constants/app';
import { ResponseType, UploadType } from '@/types/app';
import { FormItem } from '@/types/comp';
import { parseImage } from '@/utils';

import './index.less';

type YUploadFile = UploadFile<ResponseType<string>>;
type YUploadImgFile = UploadFile<ResponseType<UploadType>>;

interface YUpload extends FormItem {
  limit?: number;
  haveLink?: boolean; // 判断是不是有 图片生成工具这个链接
}

const YUpload: React.FC<YUpload> = ({ limit = 1, className, children, value: imageUrl = '', onChange, haveLink }) => {
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [previewImage, setPreviewImgae] = useState<string>();
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  const [imagelist, setImageList] = useState<YUploadFile[]>([]);

  const handleInputChange: Required<InputProps>['onChange'] = e => {
    onChange!(e.target.value);
  };

  const handleUploadChange = useCallback(
    ({ file }: UploadChangeParam<YUploadImgFile>) => {
      if (file.status === 'uploading') {
        return setUploadLoading(true);
      }

      if (file.status === 'removed') {
        const newList = imagelist.filter(item => item.url !== file.url);
        const newUrl = newList.map(item => item.url).join(',');
        setImageList(newList);
        return onChange!(newUrl);
      }
      if (file.status === 'done' && file.response && file.response.status === 'success') {
        setUploadLoading(false);
        const newImageUrl = imageUrl ? imageUrl + file.response.data?.url : file.response.data?.url;
        onChange!(newImageUrl);
      }
    },
    [imagelist, imageUrl],
  );

  const handleOpenPreview = useCallback((url?: string) => {
    setShowPreview(true);
    setPreviewImgae(url);
  }, []);

  const handleCancelPreview = useCallback(() => {
    setShowPreview(false);
    setPreviewImgae(undefined);
  }, []);

  useEffect(() => {
    if (!imageUrl || /(\w|\d)+(,(\w|\d))?/.test(imageUrl) === false) {
      return;
    }

    const newImageList = imageUrl.split(',').map(img => {
      return {
        uid: parseImage(img),
        size: 0,
        name: 'image.png',
        status: 'done',
        type: 'image/', // type 要设置成这个 不然会导致 不显示缩略图
        url: parseImage(img),
      };
    });
    setImageList(newImageList);
  }, [imageUrl]);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <div className={className}>
        {haveLink ? (
          <div style={{ display: 'flex' }}>
            <Input size="small" value={imageUrl} onChange={handleInputChange} />
            <Button size="small" type="primary">
              <a href="http://feedback.yidian-inc.com/tools/uploader" target="_blank">
                图片id生成工具
              </a>
            </Button>
          </div>
        ) : (
          <Input size="small" value={imageUrl} onChange={handleInputChange} />
        )}

        <div className="yupload-content">
          {/* 当 fileList 为空数组的时候 不能用  会导致一直 loading 状态 */}
          {imagelist.length ? (
            <Upload
              key="upload1"
              accept="image/*"
              action={ZEUS_IMG_PATH + '/upload'}
              listType="picture-card"
              fileList={imagelist}
              onChange={handleUploadChange}
              onPreview={file => handleOpenPreview(file.url)}
            >
              {/* {imagelist.length >= limit ? null : <YIcon type={uploadLoading ? 'loading' : 'plus'} />} */}
              {imagelist.length >= 1 ? null : uploadButton}
            </Upload>
          ) : (
            <Upload
              key="upload2"
              accept="image/*"
              action={ZEUS_IMG_PATH + '/upload'}
              listType="picture-card"
              onChange={handleUploadChange}
              onPreview={file => handleOpenPreview(file.url)}
            >
              {/* {imagelist.length >= limit ? null : <YIcon type={uploadLoading ? 'loading' : 'plus'} />} */}
              {imagelist.length >= 1 ? null : uploadButton}
            </Upload>
          )}

          <div>{children}</div>
        </div>
      </div>
      <Modal visible={showPreview} footer={null} closable={false} onCancel={handleCancelPreview}>
        <img style={{ width: '100%' }} src={previewImage} alt="图片预览" />
      </Modal>
    </>
  );
};

export default React.memo(YUpload);
