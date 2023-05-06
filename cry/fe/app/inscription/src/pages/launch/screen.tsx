/**
 * 投放列表的筛选表单
 */
import React, { useCallback, useRef, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Button } from 'antd';

import { YInput, YSelect, YTimePicker, FormItem, CForm, YIcon } from '@/components';
import { StatusOptions, defaultScreen } from '@/config/launch.config';
import { SCREEN_ID, SCREEN_CARD, SCREEN_APPID, SCREEN_NAME, SCREEN_STATUS } from '@/config/launch.config';
import { SCREEN_CREATE_START, SCREEN_CREATE_END, SCREEN_LAUNCH_START, SCREEN_LAUNCH_END } from '@/config/launch.config';
import { useModeContext, useDebFunc } from '@/hooks';
import { SelectOption } from '@/types/comp';
import { Dispatch } from '@/types/connect';

// TODO: 类型未精细化
interface LaunchScreenForm {
  dispatch: Dispatch;
  onConfirm: (data: any) => void;

  launchOption: SelectOption[];
  cardOption: SelectOption[];
}

const LaunchScreenForm: React.FC<LaunchScreenForm> = ({ launchOption, cardOption, dispatch, onConfirm }) => {
  const form = useForm({ defaultValues: defaultScreen });
  const modeContext = useModeContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const [cardLoading, setCardLoading] = useState<boolean>(false);
  const [launchLoading, setLaunchLoading] = useState<boolean>(false);

  const handleFetchLaunch = useDebFunc((value: string) => {
    setLaunchLoading(true);
    dispatch({
      type: 'launch/fetchlaunchoption',
      payload: { mode: modeContext.mode, inputId: value },
      callback: () => setLaunchLoading(false),
    });
  }, 500);

  const handleFetchCard = useDebFunc((value: string) => {
    setCardLoading(true);
    dispatch({
      type: 'card/fetchcardoption',
      payload: { mode: modeContext.mode, inputId: value },
      callback: () => setCardLoading(false),
    });
  }, 500);

  const handleSubmit = useCallback(() => {
    if (!inputRef.current) {
      return dispatch({
        type: 'common/message',
        payload: { type: 'error', message: '未找到确认按钮' },
      });
    }
    inputRef.current.click();
  }, [inputRef]);

  return (
    <FormProvider {...form}>
      <h4>筛选</h4>
      <CForm submitRef={inputRef} onSubmit={onConfirm}>
        <FormItem form name={SCREEN_ID} label="投放ID">
          <YSelect
            placeholder="请输入投放ID"
            notFoundContent={launchLoading ? <YIcon type="loading" /> : <p>暂无数据</p>}
            showSearch
            allowClear
            options={launchOption}
            onSearch={handleFetchLaunch}
          />
        </FormItem>
        <FormItem form name={SCREEN_CARD} label="投放卡片">
          <YSelect
            placeholder="请输入卡片ID"
            notFoundContent={cardLoading ? <YIcon type="loading" /> : <p>暂无数据</p>}
            options={cardOption}
            showSearch
            allowClear
            onSearch={handleFetchCard}
          />
        </FormItem>

        <FormItem form name={SCREEN_APPID} label="APPID">
          <YInput placeholder="请输入appid" defaultValue={null} />
        </FormItem>

        <FormItem form name={SCREEN_STATUS} label="投放状态">
          <YSelect options={StatusOptions} defaultValue={0} />
        </FormItem>

        <FormItem label="创建时间">
          <div className="formitem-flex">
            <FormItem form name={SCREEN_CREATE_START}>
              <YTimePicker placeholder="开始时间" />
            </FormItem>
            <span> - </span>
            <FormItem form name={SCREEN_CREATE_END}>
              <YTimePicker placeholder="结束时间" />
            </FormItem>
          </div>
        </FormItem>

        <FormItem label="投放时间">
          <div className="formitem-flex">
            <FormItem form name={SCREEN_LAUNCH_START}>
              <YTimePicker placeholder="开始时间" />
            </FormItem>
            <span> - </span>
            <FormItem form name={SCREEN_LAUNCH_END}>
              <YTimePicker placeholder="结束时间" />
            </FormItem>
          </div>
        </FormItem>

        {/* <FormItem form label="创建时间">
          <YRangePicker startTime={SCREEN_CREATE_START} endTime={SCREEN_CREATE_END} label="创建时间" />
        </FormItem>
        <FormItem form label="投放时间">
          <YRangePicker startTime={SCREEN_LAUNCH_START} endTime={SCREEN_LAUNCH_END} label="投放时间" />
        </FormItem> */}
      </CForm>
      <Button size="small" type="primary" onClick={handleSubmit}>
        确 认
      </Button>
    </FormProvider>
  );
};

export default React.memo(LaunchScreenForm);
