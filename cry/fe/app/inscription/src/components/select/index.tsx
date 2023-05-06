import React from 'react';
import cn from 'classnames';

import { Select } from 'antd';
import { SelectProps, SelectValue } from 'antd/es/select';
import { FormItem, SelectOption } from '@/types/comp';

import './index.less';

type SelectOmit = 'onChange' | 'onBlur' | 'children' | 'value' | 'options' | 'defaultValue';

interface YSelectProps extends FormItem<SelectValue>, Omit<SelectProps<SelectValue>, SelectOmit> {
  valueName?: string;
  labelName?: string;
  options: SelectOption[];
  flex?: boolean;

  onExtraChange?: (value: any) => void;
}

const YSelect: React.FC<YSelectProps> = ({
  valueName = 'value', labelName = 'label', className, children, options, flex, onChange, onExtraChange, ...selectProps
}) => {
  const handleValueChange = (value: SelectValue) => {
    onChange && onChange(value);
    onExtraChange && onExtraChange(value);
  };

  return (
    <div className={cn(className, 'yselect')} style={{ display: flex ? 'flex' : 'block' }}>
      <Select className="yselect-select" size="small" onChange={handleValueChange} {...selectProps}>
        {options.map(option => (
          <Select.Option key={option[valueName]} value={option[valueName]} {...option}>
            {option[labelName]}
          </Select.Option>
        ))}
      </Select>
      {children}
    </div>
  );
};

export default React.memo(YSelect);
