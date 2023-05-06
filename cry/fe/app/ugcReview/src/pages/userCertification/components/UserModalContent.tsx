import React, { useEffect, useState } from 'react';

import { Form, Input, Row, Col, Select, Modal } from 'antd';
import { connect } from 'dva';
import { Dispatch, UserModelState } from '@/models/connect';
import any from './UserModalContent';
const { Option } = Select;
interface IUserModal {
  visible: boolean;
  handleOk: (i: any) => void;
  handleCancel: () => void;
  title: string;
  dispatch: Dispatch;
  modalContent: any;
}

const UserModal: React.FC<IUserModal> = ({
  visible,
  handleOk,
  handleCancel,
  title,
  dispatch,
  modalContent,
}) => {
  let [userids, setUid] = useState<string>('');
  let [cert_message, setMessage] = useState<string>('');
  let [tag, setTag] = useState<string>('');
  let [titleName, setTitle] = useState<string>('');
  let [city, setCity] = useState<string>('');
  let [cityList, setCityList] = useState<any>([]);
  let [categoriesList, setCategoriesList] = useState<any>([]);
  // 每次点击修改变动
  useEffect(() => {
    setUid(modalContent.userids ? `${modalContent.userids}` : '');
    setMessage(modalContent.cert_message);
    setTag(modalContent.tag);
    setTitle(modalContent.title);
    setCity(modalContent.city);
  }, [modalContent]);
  // 初始化调用
  useEffect(() => {
    onCancel();
  }, []);

  useEffect(() => {
    Promise.all([getCityList(), getCategories()]).then(([city, Ctype]) => {
      setCityList(city);
      setCategoriesList(Ctype);
    });
  }, []);
  // 获取城市
  function getCityList() {
    return new Promise(async (resolve, reject) => {
      let { code, status, result } = await dispatch({
        type: 'certification/getCityList',
      });
      if (code === 0) {
        if (status === 'success') {
          resolve(result);
        }
      } else {
        reject();
      }
    });
  }
  // 获取本地大类
  function getCategories() {
    return new Promise(async (resolve, reject) => {
      let { code, status, result } = await dispatch({
        type: 'certification/getCategories',
      });
      if (code === 0) {
        if (status === 'success') {
          resolve(result);
        }
      } else {
        reject();
      }
    });
  }
  // 渲染jsx
  function renderCity() {
    return cityList.map((e: any) => {
      return <Option key={e.name}>{e.name}</Option>;
    });
  }
  function renderCategories() {
    return categoriesList.map((e: string) => {
      return <Option key={e}>{e}</Option>;
    });
  }
  // 触发父组件方法传递参数
  function onOk() {
    handleOk({
      userids,
      cert_message,
      tag,
      title: titleName,
      city,
    });
    // onClear();
  }
  function onClear() {
    setUid('');
    setMessage('');
    // 下拉列表有数据的时候再清空，否则会清掉placeholder
    tag && setTag('');
    titleName && setTitle('');
    city && setCity('');
  }
  // 取消的时候清空数据并且关闭弹窗
  function onCancel() {
    handleCancel();
    onClear();
  }
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 },
    },
  };
  return (
    <Modal
      title={title}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      destroyOnClose
      maskClosable={false}
    >
      <Form layout="inline" {...formItemLayout} id="certModalForm">
        <Row>
          <Col>
            <Form.Item label="uid">
              <Input
                placeholder="可多个请以英文,分割"
                style={{ width: '240px' }}
                onChange={e => setUid(e.target.value)}
                allowClear={title === '修改达人'}
                value={userids}
                disabled={title === '修改达人'}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Item label="备注">
              <Input
                placeholder="请输入备注"
                style={{ width: '240px' }}
                onChange={e => setMessage(e.target.value)}
                allowClear={true}
                value={cert_message}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Item label="标签">
              <Select
                onChange={(value: string) => setTag(value)}
                style={{ width: '240px' }}
                allowClear={true}
                placeholder="请选择标签"
                value={tag}
              >
                {renderCategories()}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Item label="称号">
              <Select
                onChange={(value: string) => setTitle(value)}
                style={{ width: '240px' }}
                allowClear={true}
                placeholder="请选择称号"
                value={titleName}
              >
                <Option value="精英">精英</Option>
                <Option value="大咖">大咖</Option>
                <Option value="领袖">领袖</Option>
                <Option value="明星">明星</Option>
                <Option value="机构媒体">机构媒体</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Item label="城市">
              <Select
                onChange={(value: string) => setCity(value)}
                style={{ width: '240px' }}
                allowClear={true}
                placeholder="请选择城市"
                value={city}
              >
                {renderCity()}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default connect(({ certification: userCertification, user }: any) => ({
  userCertification,
  user,
}))(UserModal);
