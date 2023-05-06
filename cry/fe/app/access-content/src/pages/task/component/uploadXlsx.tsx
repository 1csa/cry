import React, { useState } from 'react';
import {Upload, Button, Icon, message} from 'antd';
import {API} from '../../../config/constant';
interface ConvertXlxsProps{
  onChange?: (value: any) => void
}
const ConvertXlxs: React.FC<ConvertXlxsProps> = ({onChange}) => {
  const [filename, setFilename] = useState();
  const props: any = {
    name: 'xlxsFile',
    action: API['uploadXlxs'],
    onChange(info: any){
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
        let {status, result} = info.file.response || {};
        if(status && status === 'success'){
          // console.log(result, '===');
          onChange && onChange(result);
        }
        setFilename(info.file.name);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    showUploadList: false
  }
  return (<>
    <Upload {...props}>
      {
        filename ?
        <span>{filename}</span>
        :
        <Button>
          <Icon type="upload" /> 上传模板文件
        </Button>
      }
    </Upload>
  </>);
}

export default ConvertXlxs;
