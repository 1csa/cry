import React, { useEffect} from 'react';
import cn from 'classnames';
import { Input } from 'antd';
import { InputProps } from 'antd/es/input';

import { FormItem } from '@/types/comp';

import './index.less';

interface YInput extends FormItem, Omit<InputProps, 'type' | 'onBlur' | 'value' | 'onChange' | 'children' | 'defaultValue'> {
  flex?: boolean;
  onExtraChange?: (value: string) => void;
}

const YInput: React.FC<YInput> = ({ children, className, flex, value, onChange, onExtraChange, ...props }) => {
  const handleInputChange: Required<InputProps>['onChange'] = e => {
    onChange && onChange(e.target.value);
    onExtraChange && onExtraChange(e.target.value);
  };

  return (
    <div className={cn(className, 'yinput')} style={{ display: flex ? 'flex' : 'block' }}>
      <Input size="small" value={value} onChange={handleInputChange} {...props} />
      {children}
    </div>
  );
};

export default React.memo(YInput);
