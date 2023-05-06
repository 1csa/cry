/**
 * 展示相关策略
 *  1. 电视直播配置单项被去掉了，属于内容相关
 */

import React, { useState, useEffect } from 'react';
import { UseFormMethods } from 'react-hook-form';
import { useDispatch, useSelector } from 'dva';

import { YInput, YSelect, YRadio, FormItem, YModal } from '@/components';
import { StratOptions, IsFeedbackOptions, WeightOptions, PullupOptions } from '@/config/strat.config';
import { DISPLAY_MULTI, DISPLAY_FOREVER, DISPLAY_ONCE, DISPLAY_LAUNCHSHOW } from '@/config/strat.config';
import { FORM_FROMID, FORM_RANK, FORM_WEIGHT, FORM_PRIORITY, FORM_STRAT } from '@/config/strat.config';
import { FORM_MAX, FORM_INTERVAL, FORM_PULL_UP_DOWN, FORM_IS_FEEDBACK, FORM_FEEDBACK } from '@/config/strat.config';
import { StratFeedback } from '@/pages/strategy/forms';
import { DebugMode } from '@/types/app';
import { SelectOption } from '@/types/comp';
import { ConnectState } from '@/types/connect';
import { FeedbackForm } from '@/types/strat';
import { isNumStr } from '@/utils';

interface StratDisplay {
  form: UseFormMethods;
  mode?: DebugMode;
}

const StratDisplay: React.FC<StratDisplay> = ({ form, mode }) => {
  const dispatch = useDispatch();
  const fbOption = useSelector<ConnectState, SelectOption[]>(state => state.strategy.fbOption);
  const feedback = useSelector<ConnectState, FeedbackForm | undefined>(state => state.strategy.feedback);

  const support_feedback = form.watch(FORM_IS_FEEDBACK);
  const display_strat = form.watch(FORM_STRAT);
  const fb_id = form.watch(FORM_FEEDBACK);

  const [showFeedback, setShowFeedback] = useState<boolean>(false);

  const handleCheckFb = () => {
    if (!fb_id) {
      return void dispatch({
        type: 'common/message',
        payload: { type: 'error', message: '请先选择负反馈策略' },
      });
    }

    dispatch({
      type: 'strategy/fetchfbitem',
      payload: { fb_id, mode },
      callback: () => setShowFeedback(true),
    });
  };

  const handleStratChange = (value: string) => {
    switch (value) {
      case DISPLAY_ONCE:
        form.setValue(FORM_PULL_UP_DOWN, null);
      case DISPLAY_FOREVER:
        form.setValue(FORM_MAX, null);
        form.setValue(FORM_INTERVAL, null);
      case DISPLAY_LAUNCHSHOW:
        form.setValue(FORM_PULL_UP_DOWN, null);
      case DISPLAY_MULTI:
      default:
        break;
    }
  };

  const handleIsFeedbackChange = (checked: 1 | 0) => {
    if (checked === 0) {
      form.setValue(FORM_FEEDBACK, null);
    }
  };

  useEffect(() => {
    dispatch({
      type: 'strategy/fetchfboption',
      payload: { fb_name: '', mode },
    });
  }, []);

  return (
    <>
      <FormItem form name={FORM_FROMID} label="展示频道">
        <YInput placeholder="可输入多个，用半角逗号隔开" />
      </FormItem>
      <FormItem
        form
        name={FORM_RANK}
        label="展示位次"
        rule={{ validate: data => (isNumStr(data) === false ? '该字段需为数值型' : undefined) }}
      >
        <YInput placeholder="序号从0开始" />
      </FormItem>
      <FormItem form name={FORM_WEIGHT} label="展示权重">
        <YSelect options={WeightOptions} />
      </FormItem>
      <FormItem
        form
        name={FORM_PRIORITY}
        label="优先级"
        rule={{ validate: data => (isNumStr(data) === false ? '该字段需为数值型' : undefined) }}
      >
        <YInput />
      </FormItem>
      <FormItem
        form
        name={FORM_STRAT}
        label="展示策略"
        rule={{ required: { value: true, message: '该字段为必填字段' } }}
      >
        <YRadio options={StratOptions} onExtraChange={handleStratChange} />
      </FormItem>
      <FormItem
        style={{ display: [DISPLAY_MULTI].includes(display_strat) ? 'flex' : 'none' }}
        form
        name={FORM_MAX}
        label="最大展示次数"
        rule={{
          required: { value: [DISPLAY_MULTI].includes(display_strat), message: '该字段为必填字段' },
          validate: data => (isNumStr(data) === false ? '该字段需为数值类型' : undefined),
        }}
      >
        <YInput />
      </FormItem>
      <FormItem
        form
        style={{ display: [DISPLAY_MULTI].includes(display_strat) ? 'flex' : 'none' }}
        name={FORM_INTERVAL}
        label="展示间隔(h)"
        rule={{
          required: { value: [DISPLAY_MULTI].includes(display_strat), message: '该字段为必填字段' },
          validate: data => (isNumStr(data) === false ? '该字段需为数值类型' : undefined),
        }}
      >
        <YInput />
      </FormItem>
      <FormItem
        style={{ display: [DISPLAY_MULTI, DISPLAY_FOREVER].includes(display_strat) ? 'flex' : 'none' }}
        form
        name={FORM_PULL_UP_DOWN}
        label="上下拉方式"
        rule={{
          required: { value: [DISPLAY_MULTI, DISPLAY_FOREVER].includes(display_strat), message: '该字段为必填字段' },
        }}
      >
        <YSelect options={PullupOptions} />
      </FormItem>
      <FormItem
        form
        name={FORM_IS_FEEDBACK}
        label="支持负反馈"
        rule={{ required: { value: true, message: '该字段为必填字段' } }}
      >
        <YRadio options={IsFeedbackOptions} onExtraChange={handleIsFeedbackChange} />
      </FormItem>
      <FormItem style={{ display: support_feedback ? 'flex' : 'none' }} form name={FORM_FEEDBACK} label="负反馈策略">
        <YSelect options={fbOption} flex>
          <YModal
            type="modal"
            label="查 看 "
            content={<StratFeedback edit={false} feedback={feedback} />}
            showModal={showFeedback}
            onCloseModal={() => setShowFeedback(false)}
            onShowModal={handleCheckFb}
            modalProps={{ footer: null, title: '查看负反馈' }}
            buttonProps={{ size: 'small', type: 'primary' }}
          />
        </YSelect>
      </FormItem>
    </>
  );
};

export default React.memo(StratDisplay);
