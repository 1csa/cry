import React from 'react';
import cn from 'classnames';
import { Radio } from 'antd';
import { RadioProps } from 'antd/es/radio';

import { FormItem, RadioOption } from '@/types/comp';

interface YRadioProps extends FormItem {
  options: RadioOption[];
  valueName?: string;
  labelName?: string;
  onExtraChange?: (value: any) => void;
}

// 如果不是嵌套的value就能捕捉到value的change
const YRadio: React.FC<YRadioProps> = ({
  className, children, labelName = 'label', valueName = 'value', options, onChange, onExtraChange, value, ...radioProps
}) => {
  const handleRadioChange: Required<RadioProps>['onChange'] = e => {
    const targetValue = e.target.value;

    onChange && onChange(targetValue);
    onExtraChange && onExtraChange(targetValue);
  };

  return (
    <div className={cn(className, 'yradio')}>
      <Radio.Group value={value} onChange={handleRadioChange} {...radioProps}>
        {options.map(item => (
          <Radio value={item[valueName]} key={item[valueName] + ''}>
            {item[labelName]}
          </Radio>
        ))}
      </Radio.Group>
      {children}
    </div>
  );
};

export default React.memo(YRadio);
