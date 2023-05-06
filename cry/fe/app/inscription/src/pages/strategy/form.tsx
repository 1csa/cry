import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useHistory, useRouteMatch } from 'react-router';
import { connect, useDispatch, useSelector } from 'dva';
import { useForm, FormProvider } from 'react-hook-form';
import { Card, Divider, Button, message } from 'antd';

import { CForm } from '@/components';
import { defaultStrat } from '@/config/strat.config';
import { AUTH_STRAT_EDIT } from '@/config/app.config';
import { useModeContext } from '@/hooks';
import { YModal, YIcon } from '@/components';
import { FormRouteParam } from '@/types/app';
import { StrategyForm } from '@/types/strat';
import { ConnectState } from '@/types/connect';
import { parseRecord, reparseRecord } from '@/utils';
import { StratBasic, StratDisplay, StratUser, StratTarget } from '@/pages/strategy/forms';

import './index.less';

interface FormStrategy {}

// 权限由前端控制
const StrategyForm: React.FC<FormStrategy> = ({}) => {
  const history = useHistory();
  const modeContext = useModeContext();
  const commitRef = useRef<HTMLInputElement>(null);
  const match = useRouteMatch<FormRouteParam>();
  const form = useForm({ defaultValues: defaultStrat });

  const dispatch = useDispatch();
  const authes = useSelector<ConnectState, string[] | undefined>(state => state.user.authes);
  const strategy = useSelector<ConnectState, StrategyForm | undefined>(state => state.strategy.strategy);

  const [showCommit, setShowCommit] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const mode = modeContext.mode;
  const stratId = match.params.id;
  const isnew = stratId === 'new';

  const handleSubmit = useCallback((data: Record<string, any>) => {
    if (Object.keys(data).length === 0) {
      message.error('卡片数据不能为空');
      return;
    }

    dispatch({
      type: 'strategy/poststrat',
      payload: { data: data, mode, isnew },
      callback: () => setShowConfirm(true),
    });
  }, []);

  const handleCommitReturn = useCallback(() => {
    history.push('/strategy');
  }, []);

  const handleConfirmReturn = () => {
    setShowConfirm(false);
    history.push('/strategy');
  };

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

  useEffect(() => {
    if (isnew) {
      return void 0;
    }

    dispatch({
      type: 'strategy/fetchstrat',
      payload: { mode, id: stratId },
    });

    return () => {
      dispatch({
        type: 'strategy/updatestrat',
        payload: { strat: defaultStrat },
      });
    };
  }, []);

  useEffect(() => {
    if (!strategy) {
      return;
    }

    form.reset(reparseRecord(strategy, defaultStrat));
  }, [strategy]);

  return (
    <FormProvider {...form}>
      <h3>策略管理/新建策略</h3>
      <Card className="form stratform" type="inner">
        <CForm className="stratform-form" submitRef={commitRef} onSubmit={handleSubmit}>
          <section className="stratform-form-basic">
            <h4>基础配置</h4>
            <StratBasic />
          </section>
          <Divider />
          <section className="stratform-form-basic">
            <h4>设备配置</h4>
            <StratUser form={form} />
          </section>
          <Divider />
          <section className="stratform-form-display">
            <h4>展示配置</h4>
            <StratDisplay form={form} mode={mode} />
          </section>
          <Divider />
          <section className="stratform-form-user">
            <h4>用户圈选</h4>
            <StratTarget />
          </section>
          <section className="stratform-form-operation">
            <Button className="item" size="small" onClick={handleCommitReturn}>
              返 回
            </Button>
            <YModal
              className="item"
              type="modal"
              label="提 交"
              content="是否提交该策略配置?"
              showModal={showCommit}
              onShowModal={() => setShowCommit(true)}
              onCloseModal={() => setShowCommit(false)}
              // buttonProps={{ disabled: authes.includes(AUTH_STRAT_EDIT) === false }}
              modalProps={{
                title: '提交新建策略',
                footer: (
                  <>
                    <Button size="small" onClick={() => setShowCommit(false)}>
                      取 消
                    </Button>
                    <YModal
                      type="modal"
                      label="确 认"
                      content={
                        <>
                          <p>
                            <YIcon type="checked" />
                            <span>策略配置已提交</span>
                          </p>
                          <p>{`策略ID: ${strategy?.strat_id}`}</p>
                          <p>{`策略名称: ${strategy?.strat_title || '--'}`}</p>
                          <p>{`策略说明: ${strategy?.strat_remark || '--'}`}</p>
                        </>
                      }
                      showModal={showConfirm}
                      onShowModal={handleCommitConfirm}
                      onCloseModal={() => setShowConfirm(false)}
                      buttonProps={{ type: 'primary' }}
                      modalProps={{
                        footer: (
                          <Button size="small" type="primary" onClick={handleConfirmReturn}>
                            返回列表
                          </Button>
                        ),
                      }}
                    />
                  </>
                ),
              }}
            />
          </section>
        </CForm>
      </Card>
    </FormProvider>
  );
};

export default connect(({ user, strategy }: ConnectState) => {
  return { ...user, ...strategy };
})(React.memo(StrategyForm));
