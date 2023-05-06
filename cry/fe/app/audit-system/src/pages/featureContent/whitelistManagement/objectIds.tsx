import React, { FC, useState } from 'react';
import { connect, useDispatch } from 'dva';

import { Input, Upload, message, Form } from 'antd';

// import Iconfont from '@/components/Dumb/Iconfont';
import { InboxOutlined } from '@ant-design/icons';

import { Dispatch } from '@/models/connect';

const { Dragger } = Upload;

interface ObjectIdsProps {
  // dispatch: Dispatch;
  type?: string; // 'textarea' | 'upload'
}

const ObjectIds: FC<ObjectIdsProps> = React.memo(({ type }) => {
  const dispatch = useDispatch();
  const [objectIdStr, setObjectIdStr] = useState('');
  const onChange = (event: any) => {
    const content = event.target.value.replace(/[^\d\n]/g, '');
    // const content = event.target.value;
    // console.log('content', content);
    setObjectIdStr(content);
    dispatch({
      type: 'synchronizeState/saveWebExcelData',
      payload: {
        webExcelData: content,
      },
    });
  };

  const [fileList, setFileList] = useState([]);
  // 上传属性
  const uploadProps = {
    action: '',
    name: 'file',
    accept: '.xlsx,.xls,.csv',
    multiple: false,
    maxCount: 1,
    // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    // action: 'http://dev.api.moufans.com/admin/v1/imgUpload/uploadImgs',
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

  // object ids 属性
  const textAreaProps = {
    rows: 4,
    allowClear: true,
    // showCount: true,
    onChange: onChange,
    placeholder: '请输入自媒体ID，可同时输入多个，每行一个，最多添加3000条',
  };

  // const handleAddSuccess = () => {
  //   console.log('handleAddSuccess...');
  // };

  return (
    <>
      {type === 'textarea' && (
        <>
          {/* <Form.Item
            label="词内容"
            name="objectId"
            // initialValue={objectIdStr}
            rules={[
              {
                required: true,
                // pattern: /[\d\n]/g,
                message: '请输入自媒体ID，可同时输入多个，每行一个',
              },
            ]}
          >
            <Input.TextArea {...textAreaProps} />
          </Form.Item> */}
          <div className="excel-op-panel">
            <span>
              <span style={{ color: 'red' }}>* </span>
              <span>词内容</span>
            </span>
          </div>
          <div className="item-block">
            <Input.TextArea {...textAreaProps} value={objectIdStr} />
          </div>
        </>
      )}
      {type === 'upload' && (
        <>
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
        </>
      )}
    </>
  );
});

export default connect()(ObjectIds);
