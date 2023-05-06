import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Card, Button, Divider, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';

import { YInput, YTextarea, YSelect, YModal, YIcon, CForm, FormItem, YTimePicker } from '@/components';
import { TIME_FORMAT } from '@/config/app.config';
import { TimeOptions, TimeValues, defaultLaunch, FORM_ID } from '@/config/launch.config';
import { FORM_CARD, FORM_STRATEGY, FORM_TITLE, FORM_REMARK, FORM_START, FORM_END } from '@/config/launch.config';
import { useModeContext, useDebFunc, useRoute } from '@/hooks';
import { ConnectState, LaunchModelState, CardModelState, StratModelState, Dispatch } from '@/types/connect';
import { FormRouteParam, LaunchForm, FormRouteQuery } from '@/types/launch';
import { parseRecord, reparseRecord } from '@/utils';

import './index.less';

interface LaunchFormType extends LaunchModelState, CardModelState, StratModelState {
  dispatch: Dispatch;
}

// 数据的初始化时机是什么
const LaunchForm: React.FC<LaunchFormType> = ({ dispatch, launch, cardOption = [], stratOption = [] }) => {
  const commitRef = useRef<HTMLInputElement>(null);
  const form = useForm({ defaultValues: defaultLaunch, mode: 'onBlur' });

  const { mode } = useModeContext();
  const { params, query, history } = useRoute<FormRouteParam, FormRouteQuery>();

  const [timeValue, setTimeValue] = useState<number>(0);
  const [showCommit, setShowCommit] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [cardLoading, setCardLoading] = useState<boolean>(false);
  const [stratLoading, setStratLoading] = useState<boolean>(false);

  const launchId = params.id;
  const cardId = query.card;
  const isNewLaunch = launchId === 'new';

  // TODO：设定了默认投放时间是从第二天8点开始，待确认
  const handleTimeExtra = useCallback((time: number) => {
    setTimeValue(time);

    let launch_start: number | undefined = undefined;
    let launch_end: number | undefined = undefined;

    if (time !== 0) {
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;
      const date = new Date().getDate();
      const today = new Date(`${year}-${month}-${date} 8:00:00`).getTime();

      launch_start = today + 24 * 3600 * 1000;
      launch_end = today + 24 * (time + 1) * 3600 * 1000;
    }

    form.setValue(FORM_START, launch_start);
    form.setValue(FORM_END, launch_end);
  }, []);

  const handleSubmit = useCallback(
    (data: Record<string, any>) => {
      const postdata = parseRecord(data);

      if (Object.keys(postdata).length === 0) {
        message.error('投放数据不能为空');
        return;
      }
      dispatch({
        type: 'launch/postlaunch',
        payload: { data: postdata, mode, isnew: isNewLaunch },
        callback: () => setShowConfirm(true),
      });
    },
    [mode, isNewLaunch],
  );

  const handleCommitReturn = useCallback(() => {
    dispatch({
      type: 'launch/updatelaunch',
      payload: { launch: defaultLaunch },
    });

    history.push('/launch');
  }, []);

  const handleCommitConfirm = useCallback(() => {
    setShowCommit(false);

    if (!commitRef.current) {
      return dispatch({
        type: 'common/message',
        payload: { type: 'error', message: '未找到提交按钮' },
      });
    }
    commitRef.current.click();
  }, [commitRef]);

  const handleConfirmReturn = () => {
    setShowConfirm(false);

    dispatch({
      type: 'launch/updatelaunch',
      payload: { launch: defaultLaunch },
    });

    history.push('/launch');
  };

  const handleFetchCard = useDebFunc((value: string) => {
    setCardLoading(true);
    dispatch({
      type: 'card/fetchcardoption',
      payload: { mode: mode, inputId: value },
      callback: () => setCardLoading(false),
    });
  }, 500);

  const handleFetchStrat = useDebFunc((value: string) => {
    setStratLoading(true);
    dispatch({
      type: 'strategy/fetchstratoption',
      payload: { mode: mode, inputId: value },
      callback: () => setStratLoading(false),
    });
  }, 500);

  // 新建时带过来卡片ID参数
  useEffect(() => {
    if (isNewLaunch) {
      return;
    }
    dispatch({
      type: 'launch/fetchlaunch',
      payload: { id: launchId, mode },
    });
  }, []);

  useEffect(() => {
    if (!isNewLaunch || !cardId) {
      return void 0;
    }
    handleFetchCard(cardId);
    form.setValue(FORM_CARD, cardId);
  }, [cardId]);

  useEffect(() => {
    if (!launch) {
      return;
    }
    form.reset(reparseRecord(launch, defaultLaunch));

    const { launch_end, launch_start } = launch;
    const timeDis = (launch_end - launch_start) % (24 * 3600 * 1000);
    const timeGap = (launch_end - launch_start) / (24 * 3600 * 1000);

    if (!timeDis && TimeValues.includes(timeGap)) {
      setTimeValue(timeGap);
    }
  }, [launch]);

  return (
    <FormProvider {...form}>
      <h3>投放管理/新建投放</h3>
      <Card className="launchform form" type="inner">
        <CForm className="launchform-form" submitRef={commitRef} onSubmit={handleSubmit}>
          <FormItem form name={FORM_ID} label="投放ID">
            <YInput disabled={true} placeholder="自动生成" />
          </FormItem>

          <FormItem
            form
            name={FORM_TITLE}
            label="投放名称"
            rule={{ required: { value: true, message: '该字段为必填字段' } }}
          >
            <YInput />
          </FormItem>

          <FormItem
            form
            name={FORM_CARD}
            label="投放卡片"
            rule={{ required: { value: true, message: '该字段为必填字段' } }}
          >
            <YSelect
              placeholder="请输入卡片ID"
              notFoundContent={cardLoading ? <YIcon type="loading" /> : <p>暂无数据</p>}
              showSearch
              options={cardOption}
              onSearch={handleFetchCard}
            />
          </FormItem>

          <FormItem
            form
            name={FORM_STRATEGY}
            label="投放策略"
            rule={{ required: { value: true, message: '该字段为必填字段' } }}
          >
            <YSelect
              placeholder="请输入策略ID"
              notFoundContent={stratLoading ? <YIcon type="loading" /> : <p>暂无数据</p>}
              showSearch
              options={stratOption}
              onSearch={handleFetchStrat}
            />
          </FormItem>

          <FormItem label="投放时间" rule={{ required: { value: true, message: '该字段为必填字段' } }}>
            <YSelect value={timeValue} options={TimeOptions} onChange={handleTimeExtra} />
          </FormItem>

          <FormItem label="时间范围" rule={{ required: true }}>
            <div className="formitem-flex">
              <FormItem form name={FORM_START} rule={{ required: { value: true, message: '开始时间为必填字段' } }}>
                <YTimePicker placeholder="开始时间" />
              </FormItem>
              <span> - </span>
              <FormItem form name={FORM_END} rule={{ required: { value: true, message: '结束时间为必填字段' } }}>
                <YTimePicker placeholder="结束时间" />
              </FormItem>
            </div>
          </FormItem>

          <FormItem form name={FORM_REMARK} label="投放说明">
            <YTextarea placeholder="选填，仅做内部复盘查看" />
          </FormItem>
        </CForm>
        <Divider />
        <section className="launchform-form-operation">
          <Button className="item" size="small" onClick={handleCommitReturn}>
            返回
          </Button>
          <YModal
            className="item"
            label="提 交"
            type="modal"
            showModal={showCommit}
            onShowModal={() => setShowCommit(true)}
            onCloseModal={() => setShowCommit(false)}
            buttonProps={{ type: 'primary' }}
            modalProps={{
              title: '提交新建投放',
              footer: (
                <>
                  <YModal
                    label="确 认"
                    type="modal"
                    showModal={showConfirm}
                    onShowModal={handleCommitConfirm} // 点击了提交窗的确认按钮
                    onCloseModal={() => setShowConfirm(false)}
                    buttonProps={{ type: 'primary' }}
                    modalProps={{
                      title: '提交新建投放',
                      footer: (
                        <Button size="small" type="primary" onClick={handleConfirmReturn}>
                          返回列表
                        </Button>
                      ),
                    }}
                    content={
                      <>
                        <p>
                          <YIcon type="checked" />
                          <span>策略配置已提交</span>
                        </p>
                        <p>{`投放ID: ${launch?.launch_id}`}</p>
                        <p>{`投放名称: ${launch?.launch_name || '--'}`}</p>
                        <p>{`投放说明: ${launch?.launch_name || '--'}`}</p>
                        <p>
                          {`投放时间:
                              ${moment(launch ? new Date(+launch.launch_start) : new Date()).format(TIME_FORMAT)}
                              --
                              ${moment(launch ? new Date(+launch.launch_end) : new Date()).format(TIME_FORMAT)}`}
                        </p>
                      </>
                    }
                  />
                  <Button size="small" onClick={() => setShowCommit(false)}>
                    取 消
                  </Button>
                </>
              ),
            }}
            content="是否要提交该投放？"
          />
        </section>
      </Card>
    </FormProvider>
  );
};

export default connect(({ user, launch, card, strategy }: ConnectState) => {
  return { ...user, ...launch, cardOption: card.cardOption, stratOption: strategy.stratOption };
})(React.memo(LaunchForm));
