import React, { FC, useState, useEffect } from 'react';
import { Switch } from 'antd';

interface itemProps {
  value?: 1 | -1,
  onChange?: any,
  disabled?: boolean
}

const FormItemSwitch: FC<itemProps> = (props) => {
  const { value, onChange, disabled = false } = props

  const [startTime, setStartTime] = useState<string>('')
  
  useEffect(() => {
    console.log(value)
  }, [value])

  const handleSwitchChange = (v: boolean) => {
    console.log(v)
    const flag = v ? 1 : -1
    if (onChange) {
      onChange(flag)
    }
  }

  return (
    <>
      {
        value === 1 ? <Switch disabled={disabled} key="1" defaultChecked = {true} onChange={handleSwitchChange} /> :
        <Switch disabled={disabled} key="2" defaultChecked = {false} onChange={handleSwitchChange} />
      }
    </>
  );
}

export default FormItemSwitch;
