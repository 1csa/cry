import React, { useState } from 'react';
import {
  Card,
  Divider,
  Table,
  Button,
  Modal,
  Input,
  Row,
  Col,
  Select
} from 'antd';

const { Option } = Select;

// import './index.less';
const KEYWORD_TYPE: Array<string> = ['广告','色情','涉政','辱骂','其他'];
interface KeywordProps {}
interface KeywordModelProps {
  visible: boolean,
  onCancel: () => void
}
const Keyword: React.FC<KeywordProps> = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const columns = [{
    title: '关键词',
    dataIndex: 'name',
    key: 'name',
  },{
    title: '类型',
    dataIndex: 'age',
    key: 'age',
  },{
    title: '添加时间',
    dataIndex: 'time',
    key: 'time',
  },{
    title: '添加人员',
    dataIndex: 'address',
    key: 'address',
  }, {
    title: '操作',
    dataIndex: 'Action',
    key: 'Action',
    render: (text, record)=> {
      return <a>删除</a>
    }
  }];
  return (
    <>
      <div className="main-content">
        <Divider orientation="left">通用过滤条件</Divider>
        <div>
          <Button type="primary" onClick={() => setVisible(true)}>新增</Button>
        </div>
        <Table columns={columns}/>
        <KeywordModel visible={visible} onCancel={()=>setVisible(false)}/>
      </div>
    </>
  );
}

const KeywordModel: React.FC<KeywordModelProps> = ({
  visible,
  onCancel
}) => {
  const [account, setAccount] = useState<string>('');
  const onSaveAccount = () => {
    console.log(account, '=====');
  }
  const onAccountChange = (e) => {
    const account = e.target.value
    setAccount(account);
  }
  return (
    <Modal
      title="新增账号"
      visible={visible}
      onCancel={() => onCancel()}
      cancelText="取消"
      okText="保存"
      onOk={onSaveAccount}
    >
      <Row>
        <Col span={3}>关键词: </Col>
        <Col span={21}>
          <Input
            onChange={onAccountChange}
            value={account}
          />
        </Col>
      </Row>
      <Row style={{marginTop: '20px'}}>
        <Col span={3}>类型: </Col>
        <Col span={21}>
          <Select style={{width: 120}}>
            {KEYWORD_TYPE.map(
              (item,index) => <Option value={item} key={index}>{item}</Option>
            )}
          </Select>
        </Col>
      </Row>
    </Modal>
  );
}

export default Keyword;
