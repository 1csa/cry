/**
 * 基础上传组件 可传入参数可以按照需求为类型扩展
 */
import React, { useState } from 'react';

import { Upload, message, Form } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

interface ICustomizeUpload {}

const { Dragger } = Upload;

const CustomizeUpload: React.FC<ICustomizeUpload> = ({}) => {
  const [fileList, setFileList] = useState([]);
  // 上传属性
  const uploadProps = {
    // action: '',
    name: 'file',
    accept: '.xlsx,.xls,.csv',
    multiple: false,
    maxCount: 1,
    onChange: (info: any) => {
      const { status } = info.file;
      setFileList(info.fileList);
      if (status !== 'uploading') {
        // console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} 上传成功`);
      } else if (status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    },
    // onDrop: (e: any) => {
    //   // console.log('Dropped files', e.dataTransfer.files);
    // },
    onRemove: () => {},
  };

  return (
    <Form.Item
      label="文件上传"
      name="xlsxFile"
      rules={[
        {
          required: true,
          message: '点击或拖拽文件到该区域进行上传，支持xls,xlsx,csv格式文件的上传',
        },
      ]}
    >
      <Dragger fileList={fileList} {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽文件到该区域进行上传</p>
        <p className="ant-upload-hint">支持xls,xlsx,csv格式文件的上传</p>
      </Dragger>
    </Form.Item>
  );
};

export default CustomizeUpload;
