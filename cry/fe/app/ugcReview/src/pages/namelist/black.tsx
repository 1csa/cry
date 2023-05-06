import React from 'react';
import {
  Form,
  Button,
  Card,
  Pagination,
  BackTop,
  Input,
  Row,
  Col,
  Table,
  Modal,
  message,
} from 'antd';
import axios from 'axios';
import appConfig from '@/config/app.config';
import { getCookie } from '@/utils/cookie';
import UploadFile from './components/UploadFile';

// import './index.less';
const { TextArea } = Input;
const { Column } = Table;

const notIn = (all: string[], arm: string[]) => {
  let arr: string[] = [];
  all.forEach(item => {
    if (!arm.includes(item)) {
      arr.push(item);
    }
  });
  return arr.join('\n');
};
interface IState {
  userList: Array<any>;
  count: number;
  pageIndex: number;
  pageSize: number;
  uid: string;
  loading: boolean;
  modalUserVisible: boolean;
  modalType: string;
  handleReason: string;
  handleUsername: string;
  handleUserid: string;
}
export default class UGCPage extends React.PureComponent<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      userList: [],
      count: 0,
      pageIndex: 1,
      pageSize: 20,
      uid: '',
      loading: false,
      modalUserVisible: false,
      modalType: '',
      handleReason: '',
      handleUsername: '',
      handleUserid: '',
    };
  }
  componentDidMount() {
    this.getUserList(1);
  }
  seachList = () => {
    this.getUserList(1);
  };
  refreshForm = () => {
    this.setState({
      uid: '',
    });
  };
  onPageChange = (pageNumber: number) => {
    this.getUserList(pageNumber);
  };
  getUserList(pageIndex: number) {
    const { pageSize, uid } = this.state;
    let data = {
      num_per_page: pageSize,
      page: pageIndex,
      type: 'black_list',
      userid: uid || '',
    };
    this.setState({
      loading: true,
    });
    // console.log(data)
    axios
      .get(`/api/proxy/${appConfig.API_HOST}/Website/ugc/get-ugc-users`, {
        params: data,
      })
      .then(res => {
        if (res.data.status === 'success') {
          res.data.result.users.forEach((item: any) => {
            item.key = item.userid;
          });
          this.setState({
            userList: res.data.result.users,
            pageIndex: pageIndex,
            count: res.data.result.total,
            loading: false,
          });
        }
      });
  }
  hideModal = () => {
    this.setState({
      handleReason: '',
      modalUserVisible: false,
      handleUserid: '',
      handleUsername: '',
    });
  };
  setUser = (name: string, id: string, modalType: string) => {
    this.setState({
      modalUserVisible: true,
      modalType: modalType,
      handleReason: '',
      handleUserid: id,
      handleUsername: name,
    });
  };
  handleUser = () => {
    const { handleReason, handleUserid, modalType } = this.state;
    let uids = handleUserid;
    if (modalType === 'add_black_list') {
      uids = handleUserid
        .split('\n')
        .map(uid => uid.trim())
        .filter(uid => uid)
        .join(',');
    }
    // console.log(uids)
    if (!handleReason) {
      message.error('原因不能为空');
    } else if (handleUserid.length === 0) {
      message.error('uid不能为空');
    } else {
      let data = {
        opt: modalType,
        userids: uids,
        reason: handleReason,
        operator: getCookie('uid'),
      };
      // console.log(data)
      axios
        .get(`/api/proxy/${appConfig.API_HOST}/Website/ugc/update-ugc-users-state`, {
          params: data,
        })
        .then(res => {
          if (res.data.status === 'success') {
            message.success('处理成功！');
            this.getUserList(this.state.pageIndex);
            this.setState({
              modalUserVisible: false,
            });
          } else {
            message.error('处理失败，请重试！');
          }
        });
    }
  };
  uploadUid = (result: any): void => {
    // 序列化为,字符串
    let oldVal = this.state.handleUserid.split('\n').join(',');
    let uploadUid = result.map((e: any) => e.userid) + '';
    // 没手动填写的话直接序列，有手动填写的话需要拼起来再序列
    let handleUserid = oldVal
      ? [...new Set(`${oldVal},${uploadUid}`.split(','))].join('\n')
      : uploadUid.split(',').join('\n');
    this.setState({
      handleUserid,
    });
  };
  clearUserids = (result: any): void => {
    let oldVal = this.state.handleUserid
      .split('\n')
      .join(',')
      .split(',');
    // 直接拿到的数据是数字型转字符
    let uploadUid = result.map((e: any) => e.userid + '');
    this.setState({
      handleUserid: notIn(oldVal, uploadUid),
    });
  };

  render() {
    const { uid, userList, count, pageSize, loading, handleReason, handleUserid } = this.state;
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
      <>
        <div className="main-content">
          <Card title="黑名单管理" bordered={false}>
            <Form className="ant-advanced-search-form" layout="inline" {...formItemLayout}>
              <Row>
                <Col span={8}>
                  <Form.Item label="uid">
                    <Input
                      placeholder="请输入uid"
                      style={{ width: 130 }}
                      onChange={e => this.setState({ uid: e.target.value })}
                      allowClear={true}
                      value={uid}
                    />
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Button
                    type="primary"
                    icon="search"
                    onClick={this.seachList}
                    style={{
                      backgroundColor: '#67C23A',
                      borderColor: '#67C23A',
                      color: '#fff',
                      marginRight: '20px',
                    }}
                  >
                    搜索
                  </Button>
                  <Button
                    type="primary"
                    icon="undo"
                    onClick={this.refreshForm}
                    style={{
                      backgroundColor: '#E6A23C',
                      borderColor: '#E6A23C',
                      color: '#fff',
                      marginRight: '20px',
                    }}
                  >
                    重置
                  </Button>
                  <Button
                    type="primary"
                    icon="user-add"
                    onClick={() => this.setUser('', '', 'add_black_list')}
                  >
                    添加
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>
          <Card>
            <Table dataSource={userList} pagination={false} bordered loading={loading}>
              <Column title="uid" dataIndex="userid" />
              <Column title="昵称" dataIndex="author.nickname" />
              <Column title="添加时间" dataIndex="operator_info.create_time" />
              <Column title="操作人" dataIndex="operator_info.operator" />
              <Column
                title="操作"
                dataIndex="operate"
                width="80px"
                render={(text, record: any) => (
                  <div>
                    <Button
                      type="danger"
                      onClick={() => this.setUser(record.author.nickname, record.key, 'set_normal')}
                    >
                      删除
                    </Button>
                  </div>
                )}
              />
            </Table>
            <Pagination
              defaultCurrent={1}
              pageSize={pageSize}
              total={count}
              showQuickJumper
              onChange={this.onPageChange}
              style={{ marginTop: '10px', textAlign: 'right' }}
            />
          </Card>
          <Modal
            title="提示"
            visible={this.state.modalUserVisible}
            onOk={this.handleUser}
            onCancel={this.hideModal}
            okText="确认"
            cancelText="取消"
          >
            {this.state.modalType === 'set_normal' ? (
              <p>
                确定要将【{this.state.handleUsername}(id: {this.state.handleUserid}
                )】从黑名单中删除吗？{' '}
              </p>
            ) : null}
            {this.state.modalType === 'add_black_list' ? (
              <div>
                <div
                  style={{
                    marginBottom: '10px',
                  }}
                >
                  <span>uid:</span>
                  <TextArea
                    rows={4}
                    placeholder="请输入userid,用回车分割"
                    onChange={e => this.setState({ handleUserid: e.target.value })}
                    value={handleUserid}
                  />
                </div>
                <UploadFile
                  name="xlxsFile"
                  buttonText="点击批量上传用户id"
                  onSuccess={result => {
                    this.uploadUid(result);
                  }}
                  handleRemove={result => {
                    this.clearUserids(result);
                  }}
                />
              </div>
            ) : null}
            备注：
            <Input
              placeholder="请输入备注信息"
              onChange={e => this.setState({ handleReason: e.target.value })}
              allowClear={true}
              value={handleReason}
            />
          </Modal>
          <BackTop></BackTop>
        </div>
      </>
    );
  }
}
