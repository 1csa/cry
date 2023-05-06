// @ts-nocheck
import React, { useState, useEffect } from 'react';

import { Form, Select } from 'antd';

import { getTypeData } from '@/services/knnAutomation';

interface FactorProps {
  getFieldDecorator: any;
  defaultValue?: string;
}

const Factor: React.FC<FactorProps> = ({ getFieldDecorator, defaultValue = '' }) => {
  const [factor, setFactor] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFactor = async () => {
    setLoading(true);
    const res = await getTypeData();
    setLoading(false);
    if (res.success) {
      setFactor(res?.data?.machineFactor || []);
    }
  };

  useEffect(() => {
    fetchFactor();
  }, []);

  return (
    <Form.Item label="机器factor">
      {getFieldDecorator('machineFactor', {
        initialValue: defaultValue || factor[0] || '',
        rules: [{ required: true, message: '请选择机器factor' }],
      })(
        <Select placeholder="请选择机器factor" style={{ width: 230 }} loading={loading}>
          {factor.map((item: any) => (
            <Select.Option key={item} value={item}>
              {item}
            </Select.Option>
          ))}
        </Select>,
      )}
    </Form.Item>
  );
};

export default Factor;
