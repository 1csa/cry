import React from 'react';
import { Form, Switch } from 'antd';

import { BaseFormModelType } from '@/types';

interface ICustomizeSwitch {
  switchProps: BaseFormModelType;
  handleChange: (checked: boolean) => void;
}

const CustomizeSwitch: React.FC<ICustomizeSwitch> = ({ switchProps, handleChange }) => {
  const onChange = (checked: boolean) => {
    // 处理父组件的switch change事件 跟 select差不多
    handleChange && handleChange(checked);
  };

  return (
    <Form.Item name={switchProps?.name} label={switchProps?.label} rules={switchProps?.rules} valuePropName="checked">
      <Switch
        checkedChildren={switchProps?.switchProps?.checkedChildren}
        unCheckedChildren={switchProps?.switchProps?.unCheckedChildren}
        onChange={switchProps?.onChange ? onChange : () => {}}
      />
    </Form.Item>
  );
};

export default CustomizeSwitch;
