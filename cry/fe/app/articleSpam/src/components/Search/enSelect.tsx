import React, { FC, ReactNode, memo, useEffect } from 'react';
import { KeyPair } from '@/config/constant';
import { Form, Select } from 'antd';
type keyPair = KeyPair<string | number, string | number>;

interface ISelectProps {
  label: string;
  option: Array<string | keyPair>;
  onChange?: (param: string) => void;
  mode?: 'multiple' | 'tags';
  defaultValue: string | string[];
  width?: number;
}
// 带label的Select组件
const Option = Select.Option;
const ENSelect: FC<ISelectProps> = memo(props => {
  const { label, option, onChange, mode, defaultValue, width } = props;
  useEffect(() => {
    // console.log("onSelect----");
  });
  // 预处理option 变换成key value
  const options: keyPair[] = option.map(item => {
    if (typeof item === 'string' || typeof item === 'number') {
      return { key: item, value: item };
    }
    return item;
  });
  const handleOnChange = (value: string) => {
    if (value === 'all') {
      value = '';
    }
    onChange && onChange(value);
  };
  const renderOption = (): ReactNode[] => {
    const temp = options.map(item => {
      return (
        <Option key={item.key} value={item.key}>
          {item.value}
        </Option>
      );
    });
    temp.unshift(
      <Option value="all" key="all">
        全部
      </Option>,
    );
    return temp;
  };
  return (
    <Form.Item label={label}>
      <Select
        onChange={handleOnChange}
        mode={mode}
        defaultValue={defaultValue as any}
        style={{ width: width }}
      >
        {renderOption()}
      </Select>
    </Form.Item>
  );
});

ENSelect.defaultProps = {
  width: 150,
};

export default ENSelect;
