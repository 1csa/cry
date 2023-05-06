/**
 * 业务组件审核员选择组件 选择审核员传递审核员id查询
 */
import React, { useState } from 'react';
import { useDebounceFn } from 'ahooks';
import { Form, Select, message } from 'antd';

import { SelectOptionsType, BaseFormModelType } from '@/types';
import { queryPandoraAllUser } from '@/services/user';

const { Option } = Select;

interface IAuditUser {
  selectProps: BaseFormModelType;
  handleChange?: (value: any) => void;
}

const AuditUser: React.FC<IAuditUser> = ({ selectProps }) => {
  const [sourceData, setSourceData] = useState<any[]>([]);
  const { run } = useDebounceFn(
    (value: string) => {
      handleUserList(value);
    },
    {
      wait: 500,
    },
  );

  const handleSearch = (value: string) => {
    // 这样给useDebounceFn的方法里的 执行函数传递参数 run函数接受之后再给useDebounceFn的第一个函数的参数里获取
    run(value);
  };

  const handleUserList = (value: string) => {
    queryPandoraAllUser(value)
      .then(res => {
        const { errorno, data, desc } = res;
        if (errorno === 0) {
          setSourceData(data);
        } else {
          message.error(`用户接口请求失败， 原因：${desc}`);
        }
      })
      .catch(err => {
        console.log('err', err);
      });
  };

  return (
    <Form.Item label={selectProps?.label} name={selectProps?.name} rules={selectProps?.rules || []}>
      <Select
        allowClear={selectProps?.allowClear === false ? false : true}
        style={{ width: selectProps?.width || 200 }}
        placeholder={selectProps?.placeholder || `请选择${selectProps?.label}`}
        showSearch
        filterOption={false}
        onSearch={handleSearch}
        notFoundContent={null}
        options={sourceData || []}
        mode={selectProps?.mode}
      />
    </Form.Item>
  );
};

export default AuditUser;
