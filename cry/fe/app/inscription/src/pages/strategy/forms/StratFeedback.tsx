/**
 * 负反馈策略
 */

import React, { useEffect, useRef } from 'react';
import { Button } from 'antd';
import { FormProvider, useForm } from 'react-hook-form';

import { YInput, YRadio, FormItem, CForm } from '@/components';
import { FORM_DAY, FORM_DOWN, FORM_COUNT, FORM_DAYS, FORM_NAME, FORM_FBID } from '@/config/strat.config';
import { YesNoOptions, defaultFeedbacks } from '@/config/strat.config';
import { FeedbackForm } from '@/types/strat';
import { Dispatch } from '@/types/connect';
import { isNumStr, parseRecord, reparseRecord } from '@/utils';

interface StratFeedback {
  edit?: boolean;
  authed?: boolean;
  feedback?: FeedbackForm;
  dispatch?: Dispatch;
  onCommit?: (data: FeedbackForm, isnew: boolean) => void;
}

export default React.memo(({ edit, feedback, authed, onCommit, dispatch }: StratFeedback) => {
  const form = useForm({ defaultValues: defaultFeedbacks });
  const commitRef = useRef<HTMLInputElement>(null);

  const downRight = form.watch(FORM_DOWN);

  const handleFbSubmit = (data: FeedbackForm) => {
    console.log(data.feedback_id)
    onCommit && onCommit(parseRecord(data as Record<string, unknown>), data.feedback_id === null);
  };

  const handleSubmitClick = () => {
    if (!commitRef.current) {
      return dispatch!({
        type: 'common/message',
        payload: { type: 'error', message: '未找到提交按钮' },
      });
    }
    commitRef.current.click();
  };

  useEffect(() => {
    if (!feedback || Object.keys(feedback).length === 0) {
      return;
    }
    form.reset(reparseRecord(feedback, defaultFeedbacks));
  }, [feedback]);

  return (
    <div className="feedback">
      <FormProvider {...form}>
        <CForm submitRef={commitRef} onSubmit={handleFbSubmit}>
          <section className="feedback-form">
            <FormItem form name={FORM_FBID} label="负反馈ID">
              <YInput disabled placeholder="自动生成" />
            </FormItem>
            <FormItem
              form
              name={FORM_NAME}
              label="负反馈名称"
              rule={{ required: { value: true, message: '该字段为必填字段' } }}
            >
              <YInput />
            </FormItem>
            <FormItem
              form
              name={FORM_DAY}
              label="禁用天数"
              rule={{
                required: { value: true, message: '该字段为必填字段' },
                validate: data => (isNumStr(data) === false ? '该字段需为数值型' : undefined),
              }}
            >
              <YInput />
            </FormItem>
            <FormItem form name={FORM_DOWN} label="展示无点击后降权">
              <YRadio options={YesNoOptions} />
            </FormItem>
            {downRight ? (
              <>
                <FormItem form name={FORM_COUNT} label="展示无点击次数">
                  <YInput />
                </FormItem>
                <FormItem form name={FORM_DAYS} label="降权天数">
                  <YInput />
                </FormItem>
              </>
            ) : null}
          </section>
          <section className="feedback-operation">
            {edit ? (
              <>
                <Button size="small" onClick={() => history.go(-1)}>
                  返 回
                </Button>
                {/* <Button className="item" size="small" type="primary" onClick={handleSubmitClick}> disabled={authed === false} /> */}
                <Button className="item" size="small" type="primary" onClick={handleSubmitClick}>
                  提 交
                </Button>
              </>
            ) : null}
          </section>
        </CForm>
      </FormProvider>
    </div>
  );
});
