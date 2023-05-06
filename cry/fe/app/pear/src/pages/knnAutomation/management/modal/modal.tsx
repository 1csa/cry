import React, { useState } from 'react';
import { Modal, Form, Tag, Input, Select, Tooltip, Icon, message } from 'antd';
import { fetchFactorNumUpdate } from '@/services/knnAutomation';
import UserPermissions from '@/utils/user_whitelist';
import { FormItemLayouts } from '@/config/list.config';
const { Option } = Select;

interface LoosenModalProps {
  user: string;
  form: any;
  row: any;
  successCallback: () => void;
}

const LoosenModal: React.FC<LoosenModalProps> = ({ row, form, successCallback, user }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [value, setValue] = useState<any>({});
  const [title, setTitle] = useState<string>('');
  const { getFieldDecorator } = form;

  interface dataProps {
    type?: string;
    factor?: string;
    author?: string;
    num?: number;
  }
  const arr = [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const toggleLoosen = () => {
    setVisible(!visible);
  };

  const update = async (data: any) => {
    const res = await fetchFactorNumUpdate(data);
    if (res.success && typeof successCallback === 'function') {
      message.success('扩/缩容成功');
      toggleLoosen();
      successCallback();
    }
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    form.validateFields((err: any, values: any) => {
      if (!err) {
        let data: dataProps = {
          type: value?.type,
          factor: value?.factor,
          author: localStorage.getItem('user')?.split('@')[0],
          num: values.num,
        };
        if (value.machineNum === 0) {
          message.warning('机器数量为零时，不能扩/缩容');
        } else if (value.machineNum + values.num <= 0) {
          message.warning('机器数量不能为负数/缩容不能到零');
        } else {
          update(data);
        }
      }
    });
  };
  return (
    <>
      {UserPermissions(user.currentUser.name) ? (
        <Tag
          color="#108ee9"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setValue({ ...row });
            setTitle('扩/缩容');
            setVisible(true);
          }}
        >
          扩/缩容
        </Tag>
      ) : (
        ''
      )}

      <Modal title={value.type + title} visible={visible} destroyOnClose onCancel={toggleLoosen} onOk={handleSubmit}>
        <Form {...FormItemLayouts} labelAlign="right">
          <Form.Item label="type:" style={{ marginBottom: 0 }}>
            {getFieldDecorator('type')(<p>{value.type}</p>)}
          </Form.Item>
          <Form.Item label="factor:" style={{ marginBottom: 0 }}>
            {getFieldDecorator('factor')(<p>{value.factor}</p>)}
          </Form.Item>
          <Form.Item label="当前机器数量为:" style={{ marginBottom: 0 }}>
            {getFieldDecorator('machineNum')(<p>{value.machineNum}</p>)}
          </Form.Item>
          <Form.Item label={title + '数量'} style={{ marginBottom: 0 }}>
            {getFieldDecorator('num', {
              initialValue: 2,
            })(
              <Select style={{ width: 70, marginRight: 10 }}>
                {arr.map(item => (
                  <Option key={item} value={item}>
                    {item}
                  </Option>
                ))}
              </Select>,
            )}
            {getFieldDecorator('提示')(
              <Tooltip placement="top" title="负数为缩容，正数为扩容">
                <Icon type="question-circle-o" />
              </Tooltip>,
            )}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Form.create()(LoosenModal);
