import React, { useState, useEffect } from 'react';
import { Form, Radio, Input } from 'antd';
import { Dispatch } from '@/models/connect';
import { ModalDataState } from '../models/index';

interface ITimesProps {
  dispatch: Dispatch;
  modalSetting: ModalDataState;
}

const TimesForm: React.FC<ITimesProps> = ({ modalSetting, dispatch }) => {
  function setFormValue(payload: any) {
    dispatch({
      type: 'modalSetting/setPageData',
      payload,
    });
  }
  // 修改数据，同步到state
  function handleMaxNum(e: string) {
    setFormValue({
      pop_max_num: Number(e),
    });
  }
  function handleEnable(e: string) {
    setFormValue({
      enable_close: e,
    });
  }
  function handleCloseMaxNum(e: string) {
    setFormValue({
      continuous_close_max_num: Number(e),
    });
  }

  const formItemLayout = {
    labelCol: {
      xs: { span: 6 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 8 },
      sm: { span: 8 },
    },
  };

  return (
    <Form {...formItemLayout}>
      <Form.Item label="用户每日弹窗次数">
        <Input
          placeholder="请输入每日弹窗次数"
          onChange={e => handleMaxNum(e.target.value)}
          allowClear={true}
          value={modalSetting.pop_max_num}
        />
      </Form.Item>
      <Form.Item label="用户关闭后是否继续弹窗">
        <Radio.Group onChange={e => handleEnable(e.target.value)} value={modalSetting.enable_close}>
          <Radio value={false}>弹窗</Radio>
          <Radio value={true}>不弹窗</Radio>
        </Radio.Group>
        {!modalSetting.enable_close ? null : (
          <Form.Item label="不弹窗次数" style={{ marginBottom: 0 }}>
            <Input
              placeholder="请输入不弹窗次数"
              onChange={e => handleCloseMaxNum(e.target.value)}
              value={modalSetting.continuous_close_max_num}
            />
          </Form.Item>
        )}
      </Form.Item>
    </Form>
  );
};

export default TimesForm;
