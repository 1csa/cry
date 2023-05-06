import React from 'react';
import cn from 'classnames';
import { Input } from 'antd';
import { TextAreaProps } from 'antd/es/input';

import { FormItem } from '@/types/comp';

type UnnecTextArea = "onChange" | "value" | "defaultValue" | "onBlur" | "children";

interface YTextarea extends FormItem, Omit<TextAreaProps, UnnecTextArea> {}

const YTextarea: React.FC<YTextarea> = ({ className, children, onChange, ...props }) => {
  return (
    <div className={cn(className, 'yinput')}>
      <Input.TextArea allowClear={true} autoSize={{ minRows: 2, maxRows: 4 }} onChange={onChange} {...props}/>
      {children}
    </div>
  );
};

export default React.memo(YTextarea);
