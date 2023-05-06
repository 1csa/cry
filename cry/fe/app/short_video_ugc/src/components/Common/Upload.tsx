import React, { useState, useEffect } from 'react';
import { Upload, Icon, message } from 'antd';
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
    <div>
      <Icon type={loading ? 'loading' : 'plus'} />
      <div className="ant-upload-text">上传</div>
    </div>
  );
  return (
    <>
      <Upload
        name="image"
        listType="picture-card"
        showUploadList={false}
        action={UPLOAD_URL}
        onChange={onFileChange}
      >
        {value ?
          <img src={value} alt="avatar" style={{ width:'100px' }}/>:
          uploadButton
        }
      </Upload>
    </>
  );
};

export default UploadCustom;
