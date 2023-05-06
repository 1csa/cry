import React, { useState } from 'react';
import { Upload, message, Button, Icon, Tooltip, Tag, Popover } from 'antd';
import appConfig from '@/config/app.config';
const uploadXlsxUrl = `/api/app/common/upload/uploadXlsxConvertToJson`;
const uploadImageUrl = `/api/app/common/upload`;

interface IUploadProps {
  name: string;
  buttonText: string;
  onSuccess: (info: any) => void;
  handleRemove: (info: any) => void;
}
let allFileNameList: Array<string> = [];

const UploadFile: React.FC<IUploadProps> = ({ name, onSuccess, buttonText, handleRemove }) => {
  function onChange(info: any) {
    if (info.file.status !== 'uploading') {
      if (info.file.response) {
      }
    }
    if (info.file.status === 'done') {
      if (info.file.response) {
        const { status, url, result } = info.file.response;
        if (status === 'success') {
          let resData = name === 'xlxsFile' ? result : url;
          onSuccess && onSuccess(resData);
          message.success(`${info.file.name} 文件上传成功`);
        }
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上传失败`);
    }
  }
  function onRemove(file: any) {
    // console.log(file);
    if (file.response) {
      const { status, result } = file.response;
      if (status === 'success') {
        handleRemove && handleRemove(result);
      }
    }
  }
  const content = (
    <div>
      <img style={{ width: '200px' }} src="http://si1.go2yd.com/get-image/0dGGnjom9p2" alt="" />
    </div>
  );
  return (
    <div style={{ marginBottom: '10px', minHeight: '60px', textAlign: 'right' }}>
      <Popover content={content} title="excel字段示例">
        <Tag color="blue">鼠标移入预览查看</Tag>
      </Popover>
      <Upload
        name={name}
        action={
          name === 'xlxsFile'
            ? `${appConfig.UPLOAD_HOST}${uploadXlsxUrl}`
            : `${appConfig.UPLOAD_HOST}${uploadImageUrl}`
        }
        onChange={onChange}
        onRemove={onRemove}
      >
        <Tooltip placement="topLeft" title="上传前请查看示例">
          <Button>
            <Icon type="upload" /> {buttonText}
          </Button>
        </Tooltip>
      </Upload>
    </div>
  );
};

export default UploadFile;
