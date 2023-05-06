/**
 * 角标设置：角标文案、文案颜色、有无背景色、背景色值
 */

import React from 'react';
import { Radio, Divider } from 'antd';
import { RadioChangeEvent, RadioGroupProps } from 'antd/es/radio';
import { useFormContext } from 'react-hook-form';

import { FormItem, YRadio, YInput, YColor } from '@/components';
import { FORM_LABEL_IF, FORM_LABEL_BACK, FORM_LABEL_TEXT, FORM_LABEL_COLOR } from '@/config/card.config';
import { YesNoOptions, LabelOptions } from '@/config/card.config';
import { FormItem as FormItemType } from '@/types/comp';

interface PreLabel extends FormItemType {
  onChange: Required<RadioGroupProps>['onChange'];
}

const PreLabel: React.FC<PreLabel> = ({ onChange }) => {
  return (
    <div className="formitem">
      <label className="formitem-label">标签预设</label>
      <Radio.Group className="formitem-content" style={{ marginBottom: '24px' }} onChange={onChange}>
        {LabelOptions.map(({ key, label, labelColor, hasBack, backColor }) => {
          return (
            <Radio key={key} value={key}>
              <span
                className="labels-item"
                style={{
                  color: labelColor,
                  background: hasBack ? backColor : 'none',
                }}
              >
                {label}
              </span>
            </Radio>
          );
        })}
      </Radio.Group>
    </div>
  );
};

interface CardLabel {
  name: string;
}

const CardLabel: React.FC<CardLabel> = ({ name }) => {
  const form = useFormContext();

  const handleLabelChange = (event: RadioChangeEvent) => {
    const targetLabel = LabelOptions.find(label => label.key === event.target.value);

    if (!targetLabel) {
      return void 0;
    }
    const { label, labelColor, hasBack, backColor } = targetLabel;

    form.setValue(`${name}.${FORM_LABEL_TEXT}`, label);
    form.setValue(`${name}.${FORM_LABEL_COLOR}`, labelColor);
    form.setValue(`${name}.${FORM_LABEL_IF}`, hasBack);
    form.setValue(`${name}.${FORM_LABEL_BACK}`, backColor);
  };

  return (
    <>
      <h4>样式设置</h4>
      <PreLabel type="form" label="标签预设" onChange={handleLabelChange} />
      <FormItem form name={`${name}.${FORM_LABEL_TEXT}`} label="标签文案">
        <YInput />
      </FormItem>
      <FormItem form name={`${name}.${FORM_LABEL_COLOR}`} label="文案色值">
        <YColor />
      </FormItem>
      <FormItem form name={`${name}.${FORM_LABEL_IF}`} label="显示背景色">
        <YRadio options={YesNoOptions} />
      </FormItem>
      <FormItem form name={`${name}.${FORM_LABEL_BACK}`} label="背景色值">
        <YColor />
      </FormItem>
      <Divider />
    </>
  );
};

export default React.memo(CardLabel);
