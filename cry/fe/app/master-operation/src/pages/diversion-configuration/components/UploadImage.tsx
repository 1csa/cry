import React, { useState, useEffect } from 'react';
import { Upload, Icon, Modal } from 'antd';
import { Dispatch } from '@/models/connect';
import appConfig from '../../../config/app.config';
import './uploadImage.less';
interface IUploadArea {
  dispatch: Dispatch;
  imageUrl: string;
  name: string;
}

const OnlyUpload: React.FC<IUploadArea> = ({ dispatch, name, imageUrl }) => {
  function handleChange(info: any) {
    let { status, response } = info.file;
    if (status === 'done' && response.status === 'success') {
      dispatch({
        type: 'modalSetting/setPageData',
        payload: {
          [name]: {
            image: response.url,
          },
        },
      });
    }
  }
  return (
    <>
      {imageUrl ? (
        <Upload
          showUploadList={false}
          action={appConfig.uploadAction}
          onChange={handleChange}
          name="image"
        >
          <Icon type="plus" className="icon" />
        </Upload>
      ) : (
        <Upload
          showUploadList={false}
          action={appConfig.uploadAction}
          onChange={handleChange}
          listType="picture-card"
          name="image"
        >
          <Icon type="plus" className="icon" />
        </Upload>
      )}
    </>
  );
};
const UploadEdit: React.FC<IUploadArea> = ({ imageUrl, dispatch, name }) => {
  function handleRemovePic() {
    dispatch({
      type: 'modalSetting/setPageData',
      payload: {
        [name]: {
          image: '',
        },
      },
    });
  }
  return (
    <>
      <div className="box-image">
        <img className="image-container" src={imageUrl} />
        <div className="avatar-uploader">
          <OnlyUpload imageUrl={imageUrl} dispatch={dispatch} name={name} />
        </div>
        <div className="delete-icon">
          <Icon type="delete" className="icon" onClick={handleRemovePic} />
        </div>
      </div>
    </>
  );
};

const UploadArea: React.FC<IUploadArea> = ({ imageUrl, dispatch, name }) => {
  return (
    <>
      <div style={{ color: '#000', marginBottom: '10px' }}>图片：</div>
      {imageUrl ? (
        <UploadEdit imageUrl={imageUrl} dispatch={dispatch} name={name} />
      ) : (
        <OnlyUpload imageUrl={imageUrl} dispatch={dispatch} name={name} />
      )}
    </>
  );
};

export default UploadArea;
