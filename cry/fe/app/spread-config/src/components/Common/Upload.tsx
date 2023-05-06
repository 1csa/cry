import React, { useState, useEffect } from 'react';
import { Upload, Icon, message, Button } from 'antd';
import { UPLOAD_URL } from '@/utils/api';

interface UploadCustomProps {
  value?: string,
  onChange?: (url: string)=> void
}
const UploadCustom: React.FC<UploadCustomProps> = ({value,onChange}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const onFileChange = ({file}: any) => {
    if(file.status === 'uploading'){
      setLoading(true);
    }
    if(file.status === 'done'){
      const response = file.response;
      if(response && response.status === 'success'){
        message.success(`上传成功`);
        onChange && onChange(response.url);
      } else{
        message.error(`${file.name}上传失败! ${response.message}`);
      }
      setLoading(false);
    }
  }
  const uploadButton = (
    <Button size="small">
      <Icon type={loading ? 'loading' : 'plus'} />上传
    </Button>
  );
  return (
    <>
      <Upload
        name="image"
        listType="text"
        showUploadList={false}
        action={UPLOAD_URL}
        onChange={onFileChange}
      >
        {value ?
          value:
          uploadButton
        }
      </Upload>
    </>
  );
};

export default UploadCustom;
