import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { FORM_TYPE, FORM_RANKTYPE, FORM_RANKID } from '@/config/action.config';
import { RankCateOptions, RankComicOptions, RankFMOptions } from '@/config/action.config';
import { FormItem, YInput, YSelect } from '@/components';
import { SelectOption } from '@/types/comp';

interface ActionRankList {
  name: string;
  defaultParam?: Record<string, any>;
}

const ActionRankList: React.FC<ActionRankList> = ({ name, defaultParam }) => {
  const form = useFormContext();
  const rankType = form.watch(`${name}[${FORM_TYPE}]`);

  const [rankList, setRankList] = useState<SelectOption[]>([]);

  useEffect(() => {
    if (!rankType) {
      return;
    }
    setRankList(name === 'ximaFM' ? RankFMOptions : RankComicOptions);
  }, [rankType]);

  return (
    <>
      <FormItem
        form
        label="榜单"
        name={`${name}[${FORM_TYPE}]`}
        defaultValue={defaultParam ? defaultParam[FORM_TYPE] : null}
      >
        <YSelect options={RankCateOptions} />
      </FormItem>
      <FormItem
        form
        label="榜单类型"
        name={`${name}[${FORM_RANKTYPE}]`}
        defaultValue={defaultParam ? defaultParam[FORM_RANKTYPE] : null}
      >
        <YSelect options={rankList} />
      </FormItem>
      <FormItem
        form
        label="榜单列表"
        name={`${name}[${FORM_RANKID}]`}
        defaultValue={defaultParam ? defaultParam[FORM_RANKID] : null}
      >
        <YInput />
      </FormItem>
    </>
  );
};

export default React.memo(ActionRankList);
