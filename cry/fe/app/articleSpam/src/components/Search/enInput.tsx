import React, { FC, memo, useEffect } from 'react';
import { Form, Input } from 'antd';

interface ISelectProps {
  label: string;
  onChange?: (param: string) => void;
  width?: number;
}
// 带label的Input组件
const ENInput: FC<ISelectProps> = memo((props) => {
  const {
    label,
    onChange,
    width
  } = props;
  useEffect(()=>{
    // console.log("onInput");
  });

  const handleOnChange = (e: any) => {
    // console.log('input:', e.target.value);
    onChange && onChange(e.target.value);
  }
  return (
    <Form.Item label={label}>
      <Input onChange={handleOnChange}/>
    </Form.Item>
  );
});

ENInput.defaultProps = {
  width: 150
}

export default ENInput;
