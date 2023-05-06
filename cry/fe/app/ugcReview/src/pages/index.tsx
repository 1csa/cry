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
  DatePicker,
  Table,
  Modal,
  message,
  Drawer,
  Alert,
} from 'antd';
import moment from 'moment';
import axios from 'axios';
import appConfig from '@/config/app.config';
import { getCookie } from '@/utils/cookie';

import './index.less';
const { Option } = Select;
const { Column } = Table;
const { confirm } = Modal;
const dateFmt = 'YYYY-MM-DD HH:mm:ss';
const dateFmtEnd = 'YYYY-MM-DD HH:mm:ss';

interface IState {
  docList: Array<any>;
  count: number;
  pageIndex: number;
  pageSize: number;
  content: string;
  uid: string;
  state: string;
  author: string;
  docid: string;
  source: string;
  sourceList: Array<any>;
  beginTime: string;
  endTime: string;
  ctype: string;
  loading: boolean;
  selectedRowKeys: Array<any>;
  modalVisible: boolean;
  modalUserVisible: boolean;
  modalType: string;
  handleDocids: Array<any>;
  handleIds: Array<any>;
  handleReason: string;
  handleUsername: string;
  handleUserid: string;
  formData: object;
  drawerVisible: boolean;
  drawerImg: string;
  angle: string;
  articleUserid: string;
  userIdsDocids: Array<any>;
}
class UGCPage extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      docList: [],
      selectedRowKeys: [],
      count: 0,
      pageIndex: 1,
      pageSize: 20,
      content: '',
      uid: '',
      state: 'all',
      author: 'all',
      docid: '',
      source: 'all',
      sourceList: [],
      beginTime: '',
      endTime: '',
      ctype: 'all',
      loading: false,
      modalVisible: false,
      modalUserVisible: false,
      modalType: '',
      handleDocids: [],
      handleIds: [],
      handleReason: '',
      handleUsername: '',
      handleUserid: '',
      formData: {},
      drawerVisible: false,
      drawerImg: '',
      angle: 'rotate(0deg)',
      articleUserid: '',
      userIdsDocids: [],
    };
  }
  componentDidMount() {
    this.getLocaltionParms();
    axios
      .get(`/api/proxy/${appConfig.API_HOST}/Website/ugc/get-ugc-appids`)
      .then(res => {
        if (res.data.status === 'success') {
          this.setState({
            sourceList: res.data.result.doc_appids,
          });
          this.getDocList(1);
        }
      })
      .catch(err => {
        console.log('get appids error');
      });
    // @ts-ignore
    window.ydFile.set('sk', 'wKy3i0rEtHuGwRo2w4yJtZyVq4');
    // @ts-ignore
    window.ydFile.set('approved_by', getCookie('username'));
  }
  getNoticeParams(docid: string, articleUserid: string | undefined, type: number) {
    let { modalType } = this.state;
    let message = '';
    let actionName = '';
    let actionParam = '';
    if (modalType === 'jiajing') {
      actionName = '查看内容';
      actionParam = docid;
      message =
        '恭喜亲爱的边友！您发布的内容得到了其他用户的认可，已被管理员加精，将推荐给更多身边的朋友，希望您继续努力，多多发布更加优质的内容哦~';
    } else if (modalType === 'remove') {
      actionName = '查看详情';
      actionParam = 'T_00IxuFcu';
      message =
        '亲爱的边友，您好，由于您发布的内容违反了《身边社区文明管理条例》，现已做删除处理，请您认真阅读《条例》，注意言论，与身边共建和谐美好社区，谢谢合作，祝您生活愉快！';
    }
    let notices = {
      type,
      userid: Number(articleUserid),
      message,
      action: 'article',
      actionName,
      actionParam,
      key: '0cffdbc0a2bbbbdeeagffadss3e664ae',
      nickname: '身边官号',
      appid: 'local',
    };
    return notices;
  }
  sendMessage(params: any, docid?: string) {
    // 下发通知接口
    axios
      .get(`/api/proxy/${appConfig.API_SERVER_A1}/Website/message/send-message`, {
        params,
      })
      .then(response => {
        if (response.data.status === 'success') {
          message.success(`文章${docid}下发通知成功！`);
        } else {
          message.error(`文章${docid}下发通知失败！`);
        }
      })
      .catch(error => {
        console.log('err', error);
        message.error(`文章${docid}下发通知失败！`);
      });
  }
  getLocaltionParms = () => {
    let uid = sessionStorage.uid;
    this.setState({
      uid,
    });
  };
  seachList = () => {
    this.getDocList(1);
  };
  resetUid = () => {
    sessionStorage.setItem('uid', '');
  };
  refreshForm = () => {
    this.resetUid();
    this.setState({
      content: '',
      uid: '',
      state: 'all',
      author: 'all',
      docid: '',
      source: 'all',
      beginTime: '',
      endTime: '',
      ctype: 'all',
    });
    this.props.form.setFieldsValue({
      beginTime: undefined,
      endTime: undefined,
    });
  };
  onPageChange = (pageNumber: number) => {
    window.scrollTo(0, 0);
    this.getDocList(pageNumber);
  };
  onSelectChange = (selectedRowKeys: any, selectedRows: any) => {
    // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    this.setState({
      selectedRowKeys,
      userIdsDocids: selectedRows.map((e: any) => {
        return {
          userid: Number(e.author.userid),
          docid: e.docid,
        };
      }),
    });
  };
  getDocList(pageIndex: number) {
    const {
      pageSize,
      content,
      uid,
      state,
      author,
      docid,
      source,
      beginTime,
      endTime,
      ctype,
    } = this.state;
    let data = {
      num_per_page: pageSize,
      page: pageIndex,
      keyword: content || '',
      author: uid || '',
      state: state === 'all' ? '' : state,
      author_type: author === 'all' ? '' : author,
      docid: docid || '',
      doc_appid: source === 'all' ? '' : source,
      pub_start_time: beginTime ? moment(beginTime).format(dateFmt) : '',
      pub_end_time: endTime ? moment(endTime).format(dateFmtEnd) : '',
      ctype: ctype === 'all' ? '' : ctype,
    };
    this.setState({
      loading: true,
      formData: data,
    });
    // console.log(data)
    axios
      .get(`/api/proxy/${appConfig.API_HOST}/Website/ugc/get-ugc-docs`, {
        params: data,
      })
      .then(res => {
        if (res.data.status === 'success') {
          res.data.result.docs.forEach((item: any) => {
            // item.key = index
            item.key = item.id;
          });
          this.setState({
            docList: res.data.result.docs,
            pageIndex: pageIndex,
            count: res.data.result.total,
            loading: false,
            selectedRowKeys: [],
          });
        }
      });
  }
  deleteList = () => {
    let docids: any = [],
      { docList, selectedRowKeys } = this.state;
    docList.forEach(item => {
      if (selectedRowKeys.includes(item.id)) {
        docids.push(item.docid);
      }
    });
    this.setState({
      handleDocids: docids,
      handleIds: this.state.selectedRowKeys,
      modalType: 'remove',
      modalVisible: true,
    });
  };
  deleteOne = (docid: string, id: number, articleUserid: string) => {
    this.setState({
      handleDocids: [docid],
      // docid,
      handleIds: [id],
      modalType: 'remove',
      modalVisible: true,
      articleUserid,
    });
  };
  recoverList = () => {
    let docids: any = [],
      { docList, selectedRowKeys } = this.state;
    docList.forEach(item => {
      if (selectedRowKeys.includes(item.id)) {
        docids.push(item.docid);
      }
    });
    this.setState({
      handleDocids: docids,
      handleIds: this.state.selectedRowKeys,
      modalType: 'recover',
      modalVisible: true,
    });
  };
  recoverOne = (docid: string, id: number) => {
    this.setState({
      handleDocids: [docid],
      handleIds: [id],
      modalType: 'recover',
      modalVisible: true,
    });
  };
  hideModal = () => {
    this.setState({
      modalVisible: false,
      handleReason: '',
      modalUserVisible: false,
      handleUserid: '',
      handleUsername: '',
    });
  };
  handleUgcDocs = () => {
    const {
      modalType,
      handleReason,
      handleIds,
      handleDocids,
      articleUserid,
      docid,
      handleUserid,
      userIdsDocids,
    } = this.state;
    if (!handleReason) {
      message.error('原因不能为空');
    } else {
      let data = {
        opt: modalType,
        ids: handleIds.join(','),
        reason: handleReason,
        operator: getCookie('uid'),
      };
      axios
        .get(`/api/proxy/${appConfig.API_HOST}/Website/ugc/update-ugc-docs-state`, {
          params: data,
        })
        .then(res => {
          if (res.data.status === 'success') {
            message.success('处理成功！');
            let docs = this.state.docList;
            docs.forEach(item => {
              if (handleDocids.includes(item.docid) && modalType === 'remove') {
                item.state = 6;
              } else if (handleDocids.includes(item.docid) && modalType === 'recover') {
                item.state = 5;
              }
            });
            this.setState({
              docList: docs,
              modalVisible: false,
            });
            // 下发通知接口
            if (this.state.modalType === 'remove') {
              if (userIdsDocids.length > 1) {
                let arr = userIdsDocids.map((e: any) => {
                  return new Promise((resolve, reject) => {
                    this.sendMessage(this.getNoticeParams(e.docid, e.userid, 19), e.docid);
                  });
                });
                axios
                  .all(arr)
                  .then(axios.spread((...response) => {}))
                  .catch(err => {
                    console.log('err', err);
                  });
              } else {
                this.sendMessage(this.getNoticeParams(docid, articleUserid, 19), handleDocids[0]);
              }
            }
          } else {
            message.error('处理失败，请重试！');
          }
        });
    }
  };
  setUser = (name: string, id: string) => {
    this.setState({
      modalUserVisible: true,
      handleReason: '',
      handleUserid: id,
      handleUsername: name,
    });
  };
  handleUser = () => {
    const { handleReason, handleUserid } = this.state;
    if (!handleReason) {
      message.error('原因不能为空');
    } else {
      let data = {
        opt: 'add_black_list',
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
            this.getDocList(this.state.pageIndex);
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
    let url = 'http://pandora.yidian-inc.com/tools/commentsoperate?docid=' + key;
    window.open(url);
  };
  toDocView = (key: string) => {
    let url = 'https://www.yidianzixun.com/article/' + key;
    window.open(url);
  };
  // handleClearScope = (docid) => {
  //   return axios({
  //     method: 'get',
  //     url: '/api/proxy/http://lc1.haproxy.yidian.com:7001/scope/clear',
  //     params: {
  //       id: docid,
  //       token: '136e7682',
  //       scopes: 'removed,hide,notserve,notrecommend,notfront,notpush'
  //     },
  //   })
  // }
  handleCPP = (docid: string, type: boolean, scope: number, userid?: string) => {
    let docs = this.state.docList;
    axios({
      method: 'post',
      url: `/api/proxy/${appConfig.CPP_HOST}/prv/document/update`,
      data: {
        shenbian_high_quality: type,
        fixed_scope: scope,
      },
      params: {
        docid: docid,
        from: 'webui@ugc-review',
        key: '42147522ceabe88358020d72bbba01ea',
      },
    }).then(res => {
      // 如果是加精，需要调接口通知用户
      if (type || this.state.modalType === 'jiajing') {
        // 下发通知接口
        this.sendMessage(this.getNoticeParams(docid, userid, 20), docid);
      }
      if (res.data) {
        if (type || scope === 65536) {
          window &&
            // @ts-ignore
            window.Logger &&
            window.Logger.saveLog({
              //添加日志，区分是从此工具不服务还是newseditor
              log_source: { tag: 'news_editor' },
              target_data: {
                docid: docid,
                detail: JSON.stringify({ action: 'not_serve' }),
              },
              action_method: 'set_article_show_status_by_ugctool',
            });
        }
        message.success('处理成功！');
        docs.forEach(item => {
          if (item.docid === docid) {
            item.shenbian_high_quality = type;
            item.scope = scope === 65536 ? 'notserve' : scope;
          }
        });
        this.setState({
          docList: docs,
        });
        Modal.destroyAll();
      } else {
        message.error('处理失败，请重试！');
      }
    });
  };
  addScope = (docid: string) => {
    let docs = this.state.docList,
      self = this,
      scope = 65536;

    confirm({
      title: `确定对此文章（${docid}）仅自己可见吗？`,
      onOk() {
        self.handleCPP(docid, false, scope);
      },
      onCancel() {},
    });
  };
  removeScope = (docid: string) => {
    let self = this,
      scope = 0;
    confirm({
      title: `确定对此文章（${docid}）取消仅自己可见吗？`,
      onOk() {
        self.handleCPP(docid, false, scope);
      },
      onCancel() {},
    });
  };
  addShenbian = (docid: string, userid: string) => {
    let self = this,
      scope = 0;
    this.setState({
      modalType: 'jiajing',
    });
    confirm({
      title: `确定对此文章（${docid}）进行加精吗？`,
      content: '请悉知：加精的同时会给用户发送相关消息通知！',
      onOk() {
        self.handleCPP(docid, true, scope, userid);
      },
      onCancel() {},
    });
  };
  removeShenbian = (docid: string) => {
    let self = this,
      scope = 0;
    this.setState({
      modalType: 'cancelJiajing',
    });
    confirm({
      title: `确定对此文章（${docid}）取消加精吗？`,
      onOk() {
        self.handleCPP(docid, false, scope);
      },
      onCancel() {},
    });
  };
  showDrawer = (img: string) => {
    this.setState({
      drawerVisible: true,
      drawerImg: img,
    });
  };
  rotateImg = () => {
    let { angle } = this.state;
    let newangle = Number(angle.split('deg')[0].split('(')[1]) + 90;
    this.setState({
      angle: `rotate(${newangle}deg)`,
    });
  };
  colseDrawer = () => {
    this.setState({
      drawerVisible: false,
      drawerImg: '',
      angle: 'rotate(0deg)',
    });
  };
  exportData = () => {
    const { count, formData } = this.state;
    if (count > 20000) {
      return message.error('导出的数据不能超过2万条');
    }
    let opt = Object.assign(formData, {
      page: 1,
      num_per_page: count,
    });
    // console.log(opt)
    let struct = [
      {
        label: 'docid',
        value: 'docid',
      },
      {
        label: '内容',
        value: 'content',
      },
      {
        label: '视频内容',
        value: 'description',
      },
      {
        label: '附件（图）',
        value: 'image_urls',
        handle: function(row: any, key: any) {
          if (!row[key]) return;
          return Object.keys(row[key]).join('\n');
        },
      },
      {
        label: '附件（视频）',
        value: 'video_urls',
        handle: function(row: any, key: any) {
          if (!row[key]) return;
          let video: any = [];
          row[key].length &&
            row[key].forEach(function(item: any) {
              video.push(item.url);
            });
          return video.join(',');
        },
      },
      {
        label: '内容类型（ctype）',
        value: 'ctype',
        filter: [
          { label: '段子', value: 'joke' },
          { label: '短内容', value: 'duanneirong' },
          { label: '视频', value: 'video' },
        ],
      },
      {
        label: '发布人',
        value: 'author-nickname',
      },
      {
        label: '账号类型',
        value: 'author-type',
        filter: [
          { label: '马甲号', value: 'vest' },
          { label: '真实用户', value: 'normal' },
        ],
      },
      {
        label: '发布时间',
        value: 'date',
      },
      {
        label: '来源（appid）',
        value: 'appid',
        filter: [
          { label: '主app', value: 'yidian' },
          { label: '本地化', value: 'local' },
          { label: '运营工具', value: 'web_tool' },
        ],
      },
      {
        label: '状态',
        value: 'state',
        filter: [
          { label: '审核中', value: '1' },
          { label: '审核中', value: '2' },
          { label: '审核中', value: '3' },
          { label: '审核通过', value: '4' },
          { label: '审核拒绝', value: '5' },
          { label: '平台删除', value: '6' },
        ],
      },
    ];
    let option = {
      method: 'GET',
      url: 'http://a4.go2yd.com/Website/ugc/get-ugc-docs',
      params: JSON.stringify(opt),
      dir: 'result-docs',
      struct: struct,
      filename: 'UGC内容管理表',
      fileType: 'xlsx',
      batchConfig: {
        totalKey: 'num_per_page',
        pageKey: 'page',
        perPageCount: 1000,
      },
    };
    // @ts-ignore
    ydFile.start(option, function(result) {});
  };
  render() {
    const {
      content,
      uid,
      state,
      author,
      docid,
      source,
      ctype,
      sourceList,
      beginTime,
      endTime,
      docList,
      count,
      pageSize,
      loading,
      selectedRowKeys,
      handleReason,
    } = this.state;
    const { getFieldDecorator } = this.props.form;
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
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: (record: any) => ({
        disabled: record.state !== 5 && record.state !== 6,
      }),
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <>
        <div className="main-content">
          <Card title="内容管理" bordered={false}>
            <Form className="ant-advanced-search-form" layout="inline" {...formItemLayout}>
              <Row>
                <Col span={6}>
                  <Form.Item label="内容">
                    <Input
                      placeholder="请输入内容"
                      style={{ width: 130 }}
                      onChange={e => this.setState({ content: e.target.value })}
                      allowClear={true}
                      value={content}
                    />
                  </Form.Item>
                </Col>
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
                  <Form.Item label="状态">
                    <Select
                      onChange={(val: string) => this.setState({ state: val })}
                      style={{ width: 130 }}
                      value={state}
                    >
                      <Option value="all" key="stateall">
                        全部
                      </Option>
                      <Option value="need_review" key="need_review">
                        审核中
                      </Option>
                      <Option value="review_passed" key="review_passed">
                        审核通过
                      </Option>
                      <Option value="review_refused" key="review_refused">
                        审核拒绝
                      </Option>
                      <Option value="removed" key="removed">
                        删除
                      </Option>
                    </Select>
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
              </Row>
              <Row>
                <Col span={6}>
                  <Form.Item label="docid">
                    <Input
                      placeholder="请输入docid"
                      style={{ width: 130 }}
                      onChange={e => this.setState({ docid: e.target.value })}
                      allowClear={true}
                      value={docid}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="来源">
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
                <Col span={6}>
                  <Form.Item label="开始时间">
                    {getFieldDecorator(
                      'beginTime',
                      {},
                    )(
                      <DatePicker
                        showTime
                        placeholder="选择时间"
                        style={{ width: 130 }}
                        onChange={(val: string) => this.setState({ beginTime: val })}
                      />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="结束时间">
                    {getFieldDecorator(
                      'endTime',
                      {},
                    )(
                      <DatePicker
                        showTime
                        placeholder="选择时间"
                        style={{ width: 130 }}
                        onChange={(val: string) => this.setState({ endTime: val })}
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={6}>
                  <Form.Item label="内容类型">
                    <Select
                      onChange={(val: string) => this.setState({ ctype: val })}
                      style={{ width: 130 }}
                      value={ctype}
                    >
                      <Option value="all" key="ctypeall">
                        全部
                      </Option>
                      <Option value="joke" key="joke">
                        段子
                      </Option>
                      <Option value="duanneirong" key="duanneirong">
                        短内容
                      </Option>
                      <Option value="video" key="video">
                        视频
                      </Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={18}>
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
                  <Button type="primary" icon="export" onClick={this.exportData}>
                    导出
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>
          <Card>
            <Button type="danger" disabled={!hasSelected} icon="delete" onClick={this.deleteList}>
              批量删除
            </Button>
            <Button
              type="primary"
              disabled={!hasSelected}
              icon="backward"
              onClick={this.recoverList}
              style={{ marginLeft: '20px', marginBottom: '10px' }}
            >
              批量恢复
            </Button>

            <Table
              dataSource={docList}
              pagination={false}
              bordered
              loading={loading}
              rowSelection={rowSelection}
            >
              <Column
                title="docid"
                dataIndex="docid"
                render={docid => (
                  <div>
                    <a onClick={() => this.toDocView(docid)}>{docid}</a>
                  </div>
                )}
              />
              <Column
                title="内容"
                dataIndex="content"
                width="200px"
                render={(text, record: any) => (
                  <div>
                    {record.ctype === 'video' ? <p>{record.description}</p> : <p>{text}</p>}
                  </div>
                )}
              />
              <Column
                title="附件"
                dataIndex="file"
                width="180px"
                render={(text, record: any) => (
                  <div>
                    {record.ctype !== 'video' &&
                      record.image_urls &&
                      Object.keys(record.image_urls).map((file, index) => (
                        <img
                          src={file}
                          width="70"
                          style={{ display: 'inline-block' }}
                          key={index}
                          onClick={() => this.showDrawer(file)}
                        />
                      ))}
                    {record.ctype === 'video' &&
                      record.video_urls &&
                      record.video_urls.length > 0 &&
                      record.video_urls.map((file: any, index: number) => (
                        <p key={index}>
                          <a href={file.url} target="_blank">
                            视频{index + 1}
                          </a>
                        </p>
                      ))}
                  </div>
                )}
              />
              <Column
                title="内容类型"
                dataIndex="ctype"
                render={text => (
                  <div>
                    {text === 'video' ? <p>视频</p> : null}
                    {text === 'joke' ? <p>段子</p> : null}
                    {text === 'duanneirong' ? <p>短内容</p> : null}
                  </div>
                )}
              />
              <Column title="所属话题" width="150px" dataIndex="talk_name" />
              <Column
                title="发布人"
                dataIndex="author.nickname"
                width="100px"
                render={(text, record: any) => (
                  <div>
                    <p>
                      {text}(id: {record.author.userid})
                    </p>
                    <Button
                      type="danger"
                      size="small"
                      onClick={() => this.setUser(text, record.author.userid)}
                    >
                      加黑名单
                    </Button>
                  </div>
                )}
              />
              <Column
                title="账号类型"
                dataIndex="author.author_type"
                render={text => <div>{text === 'vest' ? <p>马甲号</p> : <p>普通用户</p>}</div>}
              />
              <Column title="发布时间" dataIndex="date" />
              <Column title="来源appid" dataIndex="appid" />
              <Column
                title="状态"
                dataIndex="state"
                render={(text, record: any) => (
                  <div>
                    {text === 4 ? <p>审核拒绝(审核员：{record.operator})</p> : null}
                    {text === 5 &&
                    (record.shenbian_high_quality === undefined || !record.shenbian_high_quality) &&
                    (record.scope === undefined || record.scope !== 'notserve') ? (
                      <p>审核通过(审核员：{record.operator})</p>
                    ) : null}
                    {text === 5 && record.shenbian_high_quality ? (
                      <p>加精(审核员：{record.operator})</p>
                    ) : null}
                    {text === 5 && record.scope && record.scope === 'notserve' ? (
                      <p>仅自己可见(审核员：{record.operator})</p>
                    ) : null}
                    {text === 6 ? <p>平台删除(审核员：{record.operator})</p> : null}
                    {[1, 2, 3].includes(text) ? <p>审核中</p> : null}
                  </div>
                )}
              />
              <Column
                title="操作"
                dataIndex="operate"
                width="80px"
                render={(text, record: any) => (
                  <div>
                    {record.state === 5 &&
                    (record.shenbian_high_quality === undefined || !record.shenbian_high_quality) &&
                    (record.scope === undefined || record.scope !== 'notserve') ? (
                      <Button
                        type="danger"
                        size="small"
                        onClick={() =>
                          this.deleteOne(record.docid, record.id, record.author.userid)
                        }
                        style={{ marginBottom: '5px' }}
                      >
                        删除
                      </Button>
                    ) : null}
                    {record.state === 6 &&
                    (record.shenbian_high_quality === undefined || !record.shenbian_high_quality) &&
                    (record.scope === undefined || record.scope !== 'notserve') ? (
                      <Button
                        type="danger"
                        size="small"
                        onClick={() => this.recoverOne(record.docid, record.id)}
                        style={{ marginBottom: '5px' }}
                      >
                        恢复
                      </Button>
                    ) : null}

                    {record.state === 5 &&
                    (record.scope === undefined || record.scope !== 'notserve') &&
                    (record.shenbian_high_quality === undefined ||
                      !record.shenbian_high_quality) ? (
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => this.addScope(record.docid)}
                        style={{
                          marginBottom: '5px',
                          backgroundColor: '#666666',
                          borderColor: '#666666',
                        }}
                      >
                        仅自己可见
                      </Button>
                    ) : null}
                    {record.state === 5 && record.scope && record.scope === 'notserve' ? (
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => this.removeScope(record.docid)}
                        style={{
                          marginBottom: '5px',
                          backgroundColor: '#666666',
                          borderColor: '#666666',
                        }}
                      >
                        取消仅自己可见
                      </Button>
                    ) : null}

                    {record.state === 5 &&
                    (record.shenbian_high_quality === undefined || !record.shenbian_high_quality) &&
                    (record.scope === undefined || record.scope !== 'notserve') ? (
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => this.addShenbian(record.docid, record.author.userid)}
                        style={{
                          marginBottom: '5px',
                          backgroundColor: '#Fd7d36',
                          borderColor: '#Fd7d36',
                        }}
                      >
                        加精
                      </Button>
                    ) : null}
                    {record.state === 5 && record.shenbian_high_quality ? (
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => this.removeShenbian(record.docid)}
                        style={{
                          marginBottom: '5px',
                          backgroundColor: '#Fd7d36',
                          borderColor: '#Fd7d36',
                        }}
                      >
                        取消加精
                      </Button>
                    ) : null}

                    <Button
                      type="primary"
                      size="small"
                      onClick={() => this.toComment(record.docid)}
                    >
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
          {/* 删除和恢复的弹窗 */}
          <Modal
            title="提示"
            visible={this.state.modalVisible}
            onOk={this.handleUgcDocs}
            onCancel={this.hideModal}
            okText="确认"
            cancelText="取消"
          >
            <p>
              {this.state.modalType === 'remove' ? '确认删除这些文章：' : '确认恢复这些文章：'}
              {this.state.handleDocids.join(',')}
              <br />
              {this.state.modalType === 'remove'
                ? '请悉知：删除的同时会给用户发送相关消息通知！'
                : ''}
            </p>
            备注：
            <Input
              placeholder="请输入备注信息"
              onChange={e => this.setState({ handleReason: e.target.value })}
              allowClear={true}
              value={handleReason}
            />
          </Modal>
          {/* 加入黑名单提示 */}
          <Modal
            title="提示"
            visible={this.state.modalUserVisible}
            onOk={this.handleUser}
            onCancel={this.hideModal}
            okText="确认"
            cancelText="取消"
          >
            <p>
              确认将这个用户加入黑名单： {this.state.handleUsername} (id:{this.state.handleUserid})
            </p>
            <Input
              placeholder="请输入备注信息"
              onChange={e => this.setState({ handleReason: e.target.value })}
              allowClear={true}
              value={handleReason}
            />
          </Modal>
          <Drawer
            width={900}
            placement="right"
            onClose={this.colseDrawer}
            visible={this.state.drawerVisible}
          >
            <Button onClick={this.rotateImg}>旋转90度</Button>
            <img
              src={this.state.drawerImg}
              width="100%"
              height="100%"
              style={{ transform: this.state.angle, marginTop: '10px' }}
            />
          </Drawer>
          <BackTop></BackTop>
        </div>
      </>
    );
  }
}
export default Form.create()(UGCPage);
