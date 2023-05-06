import React, { memo } from 'react';
import { Radio } from 'antd';
import { RadioProps, RadioGroupProps } from 'antd/es/radio/interface';

interface YRadioButtonProps extends RadioGroupProps {
  radioOptions: RadioProps[];
}

const YRadioButton: React.FC<YRadioButtonProps> =({radioOptions=[], ...props})=> {
  return (
    <Radio.Group onChange={props.onChange} buttonStyle="solid" {...props}>{
      radioOptions.map(optItem=><Radio.Button key={optItem.name} value={optItem.value}>{optItem.name}</Radio.Button>)
    }</Radio.Group>
  );
}

export default memo(YRadioButton)
