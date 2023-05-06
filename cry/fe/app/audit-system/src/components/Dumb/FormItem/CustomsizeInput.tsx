/**
 * 基础输入框组件 可传入参数可以按照需求为类型扩展
 */
import React from 'react';
import { Form, Input, Select, InputNumber } from 'antd';

import { BaseFormModelType } from '@/types';

interface ICustomizeInput {
  inputProps: BaseFormModelType;
  onPreSelectChange: (k: string) => void;
}

const { Option } = Select;
const { TextArea } = Input;

const CustomizeInput: React.FC<ICustomizeInput> = ({ inputProps, onPreSelectChange }) => {
  // 下拉选项触发事件
  const handleSelectBeforeChange = (value: string) => {
    onPreSelectChange && onPreSelectChange(value);
  };

  // 输入框前缀的下拉选项 这个会切换labels所对应的name 也就是给接口的字段会变
  const selectBefore = () => {
    const firstValue = inputProps?.preSelect && inputProps?.preSelect[0];
    if (firstValue) {
      return (
        <Select defaultValue={firstValue.value as string} onChange={handleSelectBeforeChange}>
          {inputProps?.preSelect?.map(item => {
            return (
              <Option key={item.value} value={item.value}>
                {item.label}
              </Option>
            );
          })}
        </Select>
      );
    } else {
      return null;
    }
  };

  return (
    <>
      {inputProps.type === 'text' ? (
        <Form.Item label={inputProps?.label} name={inputProps?.name} rules={inputProps?.rules}>
          <Input
            allowClear
            style={{ width: inputProps?.width || 260 }}
            placeholder={inputProps?.placeholder || `请输入${inputProps?.label}`}
            disabled={inputProps?.disabled}
            addonBefore={selectBefore()}
          />
        </Form.Item>
      ) : null}
      {inputProps.type === 'textArea' ? (
        <Form.Item label={inputProps?.label} name={inputProps?.name} rules={inputProps?.rules}>
          <TextArea
            style={{ width: inputProps?.width || 260 }}
            placeholder={inputProps?.placeholder || `请输入${inputProps?.label}`}
            autoSize={{ minRows: 3, maxRows: 5 }}
          />
        </Form.Item>
      ) : null}
      {inputProps.type === 'inputNumber' ? (
        <Form.Item label={inputProps?.label} name={inputProps?.name} rules={inputProps?.rules}>
          <InputNumber
            disabled={inputProps?.disabled}
            min={inputProps?.inputNumber?.min}
            max={inputProps?.inputNumber?.max}
            onChange={inputProps?.inputNumber?.handleChange}
          />
        </Form.Item>
      ) : null}
    </>
  );
};

export default CustomizeInput;
