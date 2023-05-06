import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Dispatch, UserModelState } from '@/models/connect';
import { Form, Button, Input, Row, Col, message, DatePicker } from 'antd';
interface ISearch {
  form: any;
  dispatch: Dispatch;
  setPageLoading: (v: boolean) => void;
  toggleModal: (v: boolean, t?: string) => void;
  getFormData: (v: any) => void;
}

const dateFormatStart: string = 'YYYY-MM-DD 00:00:00';
const dateFormatEnd: string = 'YYYY-MM-DD 23:59:59';

const Search: React.FC<ISearch> = ({
  form,
  dispatch,
  setPageLoading,
  toggleModal,
  getFormData,
}) => {
  let [userids, setUid] = useState<string>('');
  let [nickname, setNickname] = useState<string>('');
  let [create_start, setStartTime] = useState<string>('');
  let [create_end, setEndTime] = useState<string>('');
  let [operator_name, setOperatorName] = useState<string>('');

  useEffect(() => {
    search();
  }, []);
  // 查询接口
  const search = async () => {
    let payload = {
      offset: 0,
      count: 50,
      userids,
      nickname,
      create_start,
      operator_name,
      create_end,
    };
    // 将查询参数传递给父组件
    getFormData(payload);
    let { code, reason } = await dispatch({
      type: 'certification/getUserCert',
      payload,
    });
    if (code !== 0) {
      message.info(`任务列表加载失败请稍后重试! ${reason}`);
    }
    // 关闭loading
    setPageLoading(false);
  };

  function resetForm() {
    setUid('');
    setNickname('');
    setStartTime('');
    setEndTime('');
    setOperatorName('');
    form.setFieldsValue({
      create_start: undefined,
      create_end: undefined,
    });
    // form.resetFields({});
  }
  // 添加按钮的时候打开弹窗，设置弹窗标题
  function addItem() {
    toggleModal(true, '添加达人');
  }
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };
  return (
    <Form layout="inline" {...formItemLayout}>
      <Row>
        <Col span={5}>
          <Form.Item label="uid">
            <Input
              placeholder="请输入uid"
              onChange={e => setUid(e.target.value)}
              allowClear={true}
              value={userids}
            />
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item label="昵称">
            <Input
              placeholder="请输入昵称"
              onChange={e => setNickname(e.target.value)}
              allowClear={true}
              value={nickname}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="开始时间">
            {form.getFieldDecorator(
              'create_start',
              {},
            )(
              <DatePicker
                style={{ width: '200px' }}
                format={dateFormatStart}
                onChange={(date, dateString) => setStartTime(dateString)}
              />,
            )}
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="结束时间">
            {form.getFieldDecorator(
              'create_end',
              {},
            )(
              <DatePicker
                style={{ width: '200px' }}
                format={dateFormatEnd}
                onChange={(date, dateString) => setEndTime(dateString)}
              />,
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row style={{ marginTop: '20px' }}>
        <Col span={5}>
          <Form.Item label="添加人">
            <Input
              placeholder="请输入添加人"
              onChange={e => setOperatorName(e.target.value)}
              allowClear={true}
              value={operator_name}
            />
          </Form.Item>
        </Col>
        <Col span={4} offset={4}>
          <Form.Item>
            <Button
              type="primary"
              icon="search"
              onClick={search}
              style={{
                backgroundColor: '#67C23A',
                borderColor: '#67C23A',
                color: '#fff',
                marginRight: '20px',
              }}
            >
              搜索
            </Button>
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item>
            <Button
              type="primary"
              icon="undo"
              onClick={resetForm}
              style={{
                backgroundColor: '#E6A23C',
                borderColor: '#E6A23C',
                color: '#fff',
                marginRight: '20px',
              }}
            >
              重置
            </Button>
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item>
            <Button type="primary" icon="user-add" onClick={addItem}>
              添加
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
const UserCertificationSearch = Form.create()(Search);

export default connect(({ certification: userCertification, user }: any) => ({
  userCertification,
  user,
}))(UserCertificationSearch);
