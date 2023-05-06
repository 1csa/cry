import React from 'react';

import { Form, Select } from 'antd';
import { SearchApp, SearchScene } from '@/config/list.config';

const { Option } = Select;
interface SearchProps {
  form?: any;
  onChange: any;
  values:string;
  metaLine:boolean

}

const Search: React.FC<SearchProps> = ({ form, onChange ,values,metaLine}) => {
  const { getFieldDecorator, validateFields } = form;
  const onChangeValue = () => {
    validateFields.then((data: any) => {
      setTimeout(() => {
        console.log(data, 'data');
        onChange(data);
      }, 1000);
    });
  };
  return (
    <>
      <Form.Item label={metaLine?'':'端'}>
        {getFieldDecorator('appIdGroup', {
          initialValue: values?'':'oppobrowser',
        })(
          <Select style={{ width: 130 }}  allowClear={true}>
            {SearchApp.map(item => (
              <Option value={item.value} key={item.key}>
                {item.value}
              </Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      <Form.Item label={metaLine?"":'场景'}>
        {getFieldDecorator('scene', {
          initialValue:values?'':'strict',
        })(
          <Select style={{ width: 130 }}  allowClear={true}>
            {SearchScene.map(item => (
              <Option value={item.value} key={item.key}>
                {item.value}
              </Option>
            ))}
          </Select>,
        )}
      </Form.Item>
    </>
  );
};
export default Search;
