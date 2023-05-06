import React, { useState, useEffect, useRef } from 'react';
import { Steps, Button, message, Card, Spin } from 'antd';
import Iconfont from '@/components/Dumb/Iconfont/index';
import './index.less';
import appConfig from '@/config/app.config';
import { stepsItem } from './model/constants';
import UploadFile from './components/steps/UploadFile';
import ConnectBusiness, { IHandler } from './components/steps/ConnectBusiness';
import WriteContentStatus from './components/steps/WriteContentStatus';
import router from 'umi/router';

const { Step } = Steps;

const MutipleParseByExcel: React.FC<{}> = () => {
  const connectBusinessRef = useRef<IHandler>(null);
  const [current, setCurrent] = useState<number>(0);
  const [uploadDataIsEmpty, setUploadDataIsEmpty] = useState<any[]>([]);
  const [errorDataList, setErrorDataList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadRefs, setUploadRefs] = useState<any>(null);

  /**
   * 判断是否关联了业务类型
   */
  const connectBusinessIsSelected = async () => {
    const effectiveInfo = await connectBusinessRef.current?.onFinish();
    // @ts-ignore
    if (effectiveInfo && effectiveInfo.actions.length) {
      return true;
    } else {
      return false;
    }
  };

  /**
   * 上传文件到node层 node再request转发
   * @param connectBusiness 关联的业务
   */
  const uploaderToNodeController = (connectBusiness: any) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append('fileStream', uploadRefs?.current?.files[0]);
    // 接口还需要一些别的参数
    formData.append('connectBusiness', JSON.stringify(connectBusiness));
    /**
     * 这里不能设置请求头
     * 浏览器检测到后自己加上 Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryXXXx 这样
     */
    fetch(`/api/app/blizzard/uploadFile/parseExcelUpload?serviceUrl=${appConfig.SENSWORD_URL}/sensitive/word/upload`, {
      method: 'post',
      body: formData,
    })
      // .then(response => response.json())
      // .then(data => {
      //   console.log(data);
      // })
      .catch(err => {
        console.log('err', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  /**
   * 下一步方法
   */
  const next = async () => {
    const effectiveInfo = await connectBusinessRef.current?.onFinish();
    if (current === 0) {
      if (!uploadDataIsEmpty.length) {
        message.warning('请完善关键词上传先！');
        return false;
      } else if (!(await connectBusinessIsSelected())) {
        message.warning('请完善业务关联先！');
        return false;
      }
      uploaderToNodeController(effectiveInfo);
    }
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const stepFirst = () => {
    return (
      <div>
        <UploadFile handleUploadData={(value: any[]) => setUploadDataIsEmpty(value)} handleFileRefs={refs => setUploadRefs(refs)} />
        <div className="mt10 connect-business">
          <ConnectBusiness ref={connectBusinessRef} />
        </div>
      </div>
    );
  };

  const stepFinish = () => {
    return (
      <div className="upload-loading">
        <Spin spinning={isLoading} style={{ height: '300px', lineHeight: '300px' }} tip="正在上传中，请喝杯茶...">
          {!isLoading &&
            (errorDataList.length ? (
              <div className="success-tips">
                <WriteContentStatus errorDataList={errorDataList} />
              </div>
            ) : (
              <div className="success">
                <Iconfont name="iconchenggong" />
              </div>
            ))}
        </Spin>
      </div>
    );
  };

  const stepContent = () => {
    let mappingComponents = {
      0: () => stepFirst(),
      1: () => stepFinish(),
    };
    return mappingComponents[current]();
  };

  return (
    <Card className="main-content steps">
      <div className="step-panel">
        <div className="mt10">
          <h3>关键词批量导入</h3>
          <Steps current={current}>
            {stepsItem.map(item => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
        </div>
        {stepContent()}
        <div className="steps-action">
          {current < stepsItem.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              下一步
            </Button>
          )}
          {current === stepsItem.length - 1 && (
            <Button disabled={isLoading} type="primary" onClick={() => router.go(-1)}>
              完成
            </Button>
          )}
          {current > 0 && current !== stepsItem.length - 1 && (
            // {current > 0 && (
            <Button disabled={isLoading} style={{ margin: '0 8px' }} onClick={() => prev()}>
              上一步
            </Button>
          )}
          {current !== stepsItem.length - 1 && (
            <Button disabled={isLoading} style={{ margin: '0 8px' }} onClick={() => router.go(-1)}>
              返回
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MutipleParseByExcel;
