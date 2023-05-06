/**
 * 基础输入框组件 可传入参数可以按照需求为类型扩展
 */
import React from 'react';
import { Form, Cascader } from 'antd';
import { CascaderValueType } from 'antd/es/cascader/index.d';

import { BaseFormModelType } from '@/types';

interface ICustomizeCascader extends BaseFormModelType {
  cascaderProps: any;
  handleChange?: (value: any) => void;
}

const CustomizeInput: React.FC<Partial<ICustomizeCascader>> = ({ cascaderProps, handleChange }) => {
  const onChange = (value: CascaderValueType) => {
    // 处理父组件的回调 有onchange的数据才会调用
    handleChange && handleChange(value);
  };

  return (
    <>
      <Form.Item label={cascaderProps?.label} name={cascaderProps?.name} rules={cascaderProps?.rules}>
        <Cascader
          allowClear={cascaderProps?.allowClear === false ? false : true}
          style={{ width: cascaderProps?.width || 200 }}
          placeholder={cascaderProps?.placeholder || `请选择${cascaderProps?.label}`}
          fieldNames={cascaderProps?.fieldNames ? cascaderProps?.fieldNames : null}
          options={cascaderProps?.sourceData}
          // loadData={loadData}
          onChange={cascaderProps?.onChange ? onChange : () => {}}
        />
      </Form.Item>
    </>
  );
};

export default CustomizeInput;
