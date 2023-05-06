import React from 'react';
import {
  Form,
  Select,
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
import Link from 'umi/link';

const { Option } = Select;
const { Column } = Table;

interface IState {
  userList: Array<any>;
  count: number;
  pageIndex: number;
  pageSize: number;
  uid: string;
  type: string;
  author: string;
  source: string;
  sourceList: Array<any>;
  order: string;
  nickname: string;
  loading: boolean;
  modalUserVisible: boolean;
  modalType: string;
  handleReason: string;
  handleUsername: string;
  handleUserid: string;
  formData: object;
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
      type: 'all',
      author: 'all',
      source: 'all',
      sourceList: [],
      order: 'update_time',
      nickname: '',
      loading: false,
      modalUserVisible: false,
      modalType: '',
      handleReason: '',
      handleUsername: '',
      handleUserid: '',
      formData: {},
    };
  }
  componentDidMount() {
    this.resetUid();
    axios
      .get(`/api/proxy/${appConfig.API_HOST}/Website/ugc/get-ugc-appids`)
      .then(res => {
        if (res.data.status === 'success') {
          this.setState({
            sourceList: res.data.result.user_appids,
          });
          this.getUserList(1);
        }
      })
      .catch(err => {
        console.log('get appids error');
      });
  }
  resetUid = () => {
    sessionStorage.setItem('uid', '');
  };
  seachList = () => {
    this.getUserList(1);
  };
  refreshForm = () => {
    this.setState({
      uid: '',
      type: 'all',
      source: 'all',
      author: 'all',
      order: 'update_time',
    });
  };
  onPageChange = (pageNumber: number) => {
    this.getUserList(pageNumber);
  };
  getUserList = (pageIndex: number) => {
    const { pageSize, uid, type, author, source, order, nickname } = this.state;
    let data = {
      num_per_page: pageSize,
      page: pageIndex,
      type: type === 'all' ? '' : type,
      userid: uid || '',
      author_type: author === 'all' ? '' : author,
      user_appid: source === 'all' ? '' : source,
      order: order === 'all' ? 'update_time' : order,
      nickname: nickname || '',
    };
    this.setState({
      loading: true,
      formData: data,
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
          let useridArr = res.data.result.users;
          // 请求达人接口
          let requestArr = useridArr.map((e: any) => {
            // @ts-ignore
            return new Promise((resolve, reject) => {
              axios
                .get(`/api/proxy/${appConfig.CERT_HOST}/cert/get-cert`, {
                  params: {
                    offset: -1,
                    count: -1,
                    userids: `${e.userid}`,
                    nickname: '',
                    create_start: '',
                    operator_name: '',
                    create_end: '',
                  },
                })
                .then(res => {
                  if (res.data.status === 'success') {
                    resolve(res.data.result[0] || { userid: '' });
                  }
                });
            });
          });
          axios.all(requestArr).then(
            axios.spread((...response) => {
              // 请求回数据之后，和就数据合并，判断将数据显示
              res.data.result.users.forEach((e: any) => {
                response.length &&
                  response.forEach((ele: any) => {
                    if (`${e.userid}` === `${ele.userid}`) {
                      e.title = ele.title ? ele.title : '普通';
                    } else {
                      e.title = '普通';
                    }
                  });
              });
              this.setState({
                userList: res.data.result.users,
                pageIndex: pageIndex,
                count: res.data.result.total,
                loading: false,
              });
            }),
          );
        }
      });
  };
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
    if (!handleReason) {
      message.error('原因不能为空');
    } else {
      let data = {
        opt: modalType,
        userids: handleUserid,
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
  toComment = (key: string) => {
    let url = 'http://pandora.yidian-inc.com/tools/crow#!/search/userid/' + key + '/all';
    window.open(url);
  };
  render() {
    const {
      uid,
      type,
      author,
      source,
      order,
      nickname,
      sourceList,
      userList,
      count,
      pageSize,
      loading,
      handleReason,
    } = this.state;
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
          <Card title="用户管理" bordered={false}>
            <Form className="ant-advanced-search-form" layout="inline" {...formItemLayout}>
              <Row>
                <Col span={6}>
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
                <Col span={6}>
                  <Form.Item label="账号类型">
                    <Select
                      onChange={(val: string) => this.setState({ author: val })}
                      style={{ width: 130 }}
                      value={author}
                    >
                      <Option value="all" key="authorall">
                        全部
                      </Option>
                      <Option value="vest" key="vest">
                        马甲号
                      </Option>
                      <Option value="normal" key="normal">
                        真实用户
                      </Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="账号来源">
                    <Select
                      onChange={(val: string) => this.setState({ source: val })}
                      style={{ width: 130 }}
                      value={source}
                    >
                      <Option value="all" key="sourceall">
                        全部
                      </Option>
                      {sourceList.map(appid => (
                        <Option key={appid} value={appid}>
                          {appid}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={6}>
                  <Form.Item label="状态">
                    <Select
                      onChange={(val: string) => this.setState({ type: val })}
                      style={{ width: 130 }}
                      value={type}
                    >
                      <Option value="all" key="stateall">
                        全部
                      </Option>
                      <Option value="normal" key="need_review">
                        正常
                      </Option>
                      <Option value="white_list" key="review_passed">
                        白名单
                      </Option>
                      <Option value="black_list" key="review_refused">
                        黑名单
                      </Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="排序">
                    <Select
                      onChange={(val: string) => this.setState({ order: val })}
                      style={{ width: 130 }}
                      value={order}
                    >
                      <Option value="update_time" key="ctypeall">
                        默认
                      </Option>
                      <Option value="ugc_count" key="joke">
                        发布总数
                      </Option>
                      <Option value="joke_cnt" key="duanneirong">
                        段子总数
                      </Option>
                      <Option value="duanneirong_cnt" key="video">
                        短内容总数
                      </Option>
                      <Option value="video_cnt" key="video">
                        视频总数
                      </Option>
                      <Option value="passed_cnt" key="video">
                        过审总数
                      </Option>
                    </Select>
                  </Form.Item>
                </Col>
                {/* <Col span={6}>
                  <Form.Item label="用户昵称">
                    <Input
                      placeholder="请输入用户名"
                      style={{ width: 130 }}
                      onChange={e => this.setState({ nickname: e.target.value })}
                      allowClear={true}
                      value={nickname}
                    />
                  </Form.Item>
                </Col> */}
                <Col span={6}>
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
                </Col>
              </Row>
            </Form>
          </Card>
          <Card>
            <Table
              dataSource={userList}
              pagination={false}
              bordered
              loading={loading}
              rowKey={record => record.id}
            >
              <Column title="用户名" dataIndex="author.nickname" />
              <Column title="userid" dataIndex="userid" />
              <Column
                title="内容过审总量"
                dataIndex="passed_cnt"
                render={(text, record: any) => (
                  <Link to={`/`}>
                    <span
                      onClick={() => {
                        sessionStorage.setItem('uid', record.userid);
                      }}
                    >
                      {text}
                    </span>
                  </Link>
                )}
              />
              <Column
                title="账号类型"
                dataIndex="author.author_type"
                render={text => (
                  <div>{text === 'vest' ? <span>马甲号</span> : <span>普通用户</span>}</div>
                )}
              />
              <Column title="账号来源" dataIndex="author.appid" />
              <Column
                title="账号状态"
                dataIndex="type"
                render={text => (
                  <div>
                    {text === 'normal' ? <span>正常</span> : null}
                    {text === 'white_list' ? <span>白名单</span> : null}
                    {text === 'black_list' ? <span>黑名单</span> : null}
                  </div>
                )}
              />
              <Column title="达人认证" dataIndex="title" />
              <Column
                title="操作"
                dataIndex="operate"
                width="80px"
                render={(text, record: any) => (
                  <div>
                    {record.type === 'normal' || record.type === 'white_list' ? (
                      <Button
                        type="danger"
                        style={{ marginBottom: '10px' }}
                        onClick={() =>
                          this.setUser(record.author.nickname, record.key, 'add_black_list')
                        }
                      >
                        加入黑名单
                      </Button>
                    ) : null}
                    {record.type === 'black_list' ? (
                      <Button
                        type="danger"
                        style={{
                          marginBottom: '10px',
                          backgroundColor: '#67C23A',
                          borderColor: '#67C23A',
                          color: '#fff',
                        }}
                        onClick={() =>
                          this.setUser(record.author.nickname, record.key, 'set_normal')
                        }
                      >
                        取消黑名单
                      </Button>
                    ) : null}
                    <Button type="primary" onClick={() => this.toComment(record.key)}>
                      评论
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
            <p>
              {this.state.modalType === 'add_black_list'
                ? '确认将这个用户加入黑名单：'
                : '确认将这个用户取消黑名单：'}{' '}
              {this.state.handleUsername}(id: {this.state.handleUserid})
            </p>
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
