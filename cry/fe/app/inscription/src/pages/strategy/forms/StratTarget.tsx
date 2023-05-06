/**
 * 用户圈选
 */

import React from 'react';

import { FORM_PACKAGE, FORM_BUCKET, FORM_WHITELIST } from '@/config/strat.config';
import { YForm, YInput, FormItem } from '@/components';

interface StratUser {}

const StratTarget: React.FC<StratUser> = ({}) => {
  return (
    <>
      <FormItem form name={FORM_PACKAGE} label="用户包ID">
        <YInput placeholder="可输入多个，用半角逗号隔开" />
      </FormItem>
      <FormItem form name={FORM_BUCKET} label="用户Bucket">
        <YInput placeholder="可输入多个，用半角逗号隔开" />
      </FormItem>
      <FormItem form name={FORM_WHITELIST} label="用户白名单">
        <YInput placeholder="可输入多个，用半角逗号隔开" />
      </FormItem>
    </>
  );
};

export default React.memo(StratTarget);
