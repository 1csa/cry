import React from 'react';

import { FormItem, YInput, YRadio } from '@/components';
import {
  YesNoOptions,
  FORM_DOCID,
  FORM_ALBUMID,
  FORM_PLAYINALBUM,
  FORM_TRACKID,
  FORM_ORDERNO,
  FORM_ISTRANSIT,
  FORM_AUTOPLAY,
} from '@/config/action.config';

interface ActionAudio {
  appid?: string; // 暂定没有appid
  name: string;
  defaultParam?: Record<string, any>;
}

const ActionAudio: React.FC<ActionAudio> = ({ name, defaultParam }) => {
  return (
    <>
      <FormItem
        form
        label="Docid"
        name={`${name}[${FORM_DOCID}]`}
        defaultValue={defaultParam ? defaultParam[FORM_DOCID] : null}
      >
        <YInput />
      </FormItem>
      <FormItem
        form
        label="专辑ID"
        name={`${name}[${FORM_ALBUMID}]`}
        defaultValue={defaultParam ? defaultParam[FORM_ALBUMID] : null}
      >
        <YInput />
      </FormItem>
      <FormItem
        form
        label="是否定位播放"
        name={`${name}[${FORM_PLAYINALBUM}]`}
        defaultValue={defaultParam ? defaultParam[FORM_PLAYINALBUM] : null}
      >
        <YRadio options={YesNoOptions} />
      </FormItem>
      <FormItem
        form
        label="节目ID"
        name={`${name}[${FORM_TRACKID}]`}
        defaultValue={defaultParam ? defaultParam[FORM_TRACKID] : null}
      >
        <YInput />
      </FormItem>
      <FormItem
        form
        label="节目位置"
        name={`${name}[${FORM_ORDERNO}]`}
        defaultValue={defaultParam ? defaultParam[FORM_ORDERNO] : null}
      >
        <YInput />
      </FormItem>
      <FormItem
        form
        label="是否承接页"
        name={`${name}[${FORM_ISTRANSIT}]`}
        defaultValue={defaultParam ? defaultParam[FORM_ISTRANSIT] : null}
      >
        <YRadio options={YesNoOptions} />
      </FormItem>
      <FormItem
        form
        label="是否自动播放"
        name={`${name}[${FORM_AUTOPLAY}]`}
        defaultValue={defaultParam ? defaultParam[FORM_AUTOPLAY] : null}
      >
        <YRadio options={YesNoOptions} />
      </FormItem>
    </>
  );
};

export default React.memo(ActionAudio);
