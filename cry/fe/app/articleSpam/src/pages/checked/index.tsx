import React from 'react';
import {
  Form,
  Select,
  Input,
  DatePicker,
  Button,
  Card,
  Affix,
  Popover,
  Pagination,
  BackTop,
  message,
  Spin,
} from 'antd';
import moment from 'moment';
import CheckedDoc from '../../components/CheckedDoc/index';
import axios from 'axios';
import appConfig from '@/config/app.config';
import CategoryList from '@/data/category_list';
import { getCookie } from '@/utils/cookie';
import TopDoc from '@/components/TopDoc/index';
import { downLoadXlsx } from 'app-common/utils/util';
import { SEARCH_TOP_NEWS } from '@/config/constant';

const { Option } = Select;
const PageSize = 20;

interface INoRecPageState {
  getDataMode: string;
  cat: string; //文章大类
  tier: string; //源评级
  flag: Array<any>; //处理结果
  auditor: string; //审核员邮箱
  startDate: string; //开始时间
  endDate: string; //结束时间
  docList: Array<any>;
  count: number;
  pageIndex: number;
  searchDocid: string; //搜索docid
  score: Array<any>; //评分
  loading: boolean;
  media_domain: string;
}

export default class NoRecPage extends React.PureComponent<any, INoRecPageState> {
  constructor(props) {
    super(props);
    let start = moment()
      .subtract(3, 'days')
      .format('YYYY-MM-DD HH:mm');
    let end = moment().format('YYYY-MM-DD HH:mm');
    this.state = {
      getDataMode: 'load',
      cat: 'all',
      tier: 'all',
      flag: ['all'],
      auditor: '',
      startDate: start,
      endDate: end,
      docList: [],
      count: 0,
      pageIndex: 1,
      searchDocid: '',
      score: ['all'],
      loading: true,
      media_domain: '',
    };
  }
  componentDidMount() {
    this.getDocList(1);
    window.ydFile.set('sk', 'wKy3i0rEtHuGwRo2w4yJtZyVq4');
    window.ydFile.set('approved_by', getCookie('username'));
  }
  onChangePage = pageIndex => {
    this.setState({
      loading: true,
    });
    this.getDocList(pageIndex);
    window.scrollTo(0, 0);
  };
  getDocList(pageIndex) {
    const {
      cat,
      flag,
      tier,
      score,
      auditor,
      searchDocid,
      startDate,
      endDate,
      media_domain,
    } = this.state;
    let offset = (pageIndex - 1) * PageSize,
      category = cat === 'all' ? '' : cat,
      operation = flag.includes('all') ? '' : flag.toString(),
      source_tier = tier === 'all' ? '' : tier,
      score_string = score.includes('all') ? '' : score.toString();
    this.setState({
      docList: [],
    });
    axios
      .get(`/api/proxy/${appConfig.API_TOOLS_HOST}/news-review/search-top-news`, {
        params: {
          docid: searchDocid,
          operation_state: '1',
          category: category,
          operations: operation,
          scores: score_string,
          source_tier: source_tier,
          operator_email: auditor,
          start: startDate + ':00',
          end: endDate + ':59',
          offset: offset,
          count: PageSize,
          sort: 'createAt',
          appid: 'yidian',
          media_domain,
        },
      })
      .then(res => {
        if (res.data.status === 'success') {
          let docs = res.data.result;
          docs.forEach(function(item) {
            item.action = item.operation;
            if (item.reason.length === 0) {
              item.reason = [''];
            } else if (item.reason.length === 1) {
              item.reason = [item.reason];
            } else {
              item.reason = item.reason.split(',');
            }
            item.reason.forEach(function(rsn, index) {
              if (rsn.indexOf('其他') > -1) {
                item.other_reason = rsn.split(':')[1];
                item.reason[index] = '其他';
              }
            });
            if (item.low_quality_reason.length === 0) {
              item.low_quality_reason = [''];
            } else if (item.low_quality_reason.length === 1) {
              item.low_quality_reason = [item.low_quality_reason];
            } else {
              item.low_quality_reason = item.low_quality_reason.split(',');
            }
            item.low_quality_reason.forEach(function(rsn, index) {
              if (rsn.indexOf('其他') > -1) {
                item.other_reason = rsn.split(':')[1];
                item.low_quality_reason[index] = '其他';
              }
            });
            if (item.high_quality_reason && item.high_quality_reason.length) {
              let topReason = item.high_quality_reason.split(':');
              item['high_quality_reason'] = topReason[0];
              item['top_reason'] = topReason[1];
            }
          });
          // console.log(docs)
          this.setState({
            docList: docs,
            pageIndex: pageIndex,
            count: res.data.total,
            loading: false,
          });
        } else {
          message.error('请求失败，请重试！');
          this.setState({
            loading: false,
          });
        }
      });
  }
  onCatChange = (cat: string) => {
    this.setState({
      cat,
    });
  };
  onTierChange = (tier: string) => {
    this.setState({
      tier,
    });
  };
  onFlagChange = (flag: Array<any>) => {
    this.setState({
      flag,
    });
  };
  onScoreChange = (score: Array<any>) => {
    this.setState({
      score,
    });
  };
  onAuditorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      auditor: e.target.value,
    });
  };
  onAuditDateChange = (date: any, dateStrings: string[]) => {
    this.setState({
      startDate: dateStrings[0],
      endDate: dateStrings[1],
    });
  };
  onSearchAudited = () => {
    this.setState(
      {
        searchDocid: '',
        loading: true,
      },
      () => {
        this.getDocList(1);
      },
    );
  };
  onSearchByDocid = (docid: string) => {
    this.setState(
      {
        cat: 'all',
        tier: 'all',
        flag: ['all'],
        auditor: '',
        docList: [],
        count: 0,
        pageIndex: 1,
        score: ['all'],
        searchDocid: docid,
        loading: true,
      },
      () => {
        this.getDocList(1);
      },
    );
  };
  exportData = () => {
    const { count } = this.state;
    if (count < 10000) {
      const { cat, flag, tier, score, auditor, searchDocid, startDate, endDate } = this.state;
      let category = cat === 'all' ? '' : cat,
        operation = flag.includes('all') ? '' : flag.toString(),
        source_tier = tier === 'all' ? '' : tier,
        score_string = score.includes('all') ? '' : score.toString();
      let data = {
        docid: '',
        operation_state: '1',
        category: category,
        operations: operation,
        scores: score_string,
        source_tier: source_tier,
        operator_email: auditor,
        start: startDate + ':00',
        end: endDate + ':59',
        sort: 'createAt',
        appid: 'yidian',
      };
      let params = Object.assign(data, { offset: 0, count: count >= 5000 ? 5000 : count }),
        struct = [
          {
            label: 'docid',
            value: 'doc_id',
          },
          {
            label: '文章题目',
            value: 'title',
          },
          {
            label: '入审核池时间',
            value: 'insert_time',
          },
          {
            label: '大类',
            value: 'category',
          },
          {
            label: '账号名称',
            value: 'source',
          },
          {
            label: '账号id',
            value: 'media_id',
          },
          {
            label: '源评级',
            value: 'source_tier',
          },
          {
            label: '发布时间',
            value: 'date',
          },
          {
            label: '低俗值',
            value: 'sc_dirty',
          },
          {
            label: '标题党属性',
            value: 'bait',
          },
          {
            label: '评分',
            value: 'score',
          },
          {
            label: '评估结论',
            value: 'reason',
          },
          {
            label: '账号领域',
            value: 'media_domain',
          },
          {
            label: '曝光量',
            value: 'cntView',
          },
          {
            label: '点击率',
            value: 'ctr',
          },
          {
            label: '点击量',
            value: 'cntClick',
          },
          {
            label: '篇均停留时长',
            value: 'dwellAvg',
          },
          {
            label: '是否编辑置顶',
            value: 'sc_stky',
          },
          {
            label: '具体操作',
            value: 'operation',
            filter: [
              { label: '通过', value: 'checkDoc' },
              { label: '不展示', value: 'hide' },
              { label: '不服务', value: 'notserve' },
              { label: '不推荐', value: 'notrecommend' },
              { label: '删除', value: 'removed' },
              { label: '通过', value: 'pass' },
              { label: '不可上首页', value: 'low' },
            ],
          },
          {
            label: '审核人',
            value: 'operator_email',
          },
          {
            label: '审核时间',
            value: 'reviewed_time',
          },
          {
            label: '优质原因',
            value: 'high_quality_reason',
          },
          {
            label: '文章属性',
            value: 'attribute',
            filter: [
              { label: '新闻', value: 'news' },
              { label: '专业', value: 'profession' },
              { label: '休闲/泛内容', value: 'leisure' },
              { label: '虚构', value: 'fiction' },
            ],
          },
          {
            label: '标注项',
            value: 'reason',
          },
          {
            label: '低质原因',
            value: 'low_quality_reason',
          },
        ];
      // console.log(params)
      let option = {
        method: 'GET',
        url: 'http://operationtoolservice.go2yd.int.yidian-inc.com/news-review/search-top-news',
        params: JSON.stringify(params),
        dir: 'result',
        struct: struct,
        filename: 'top2000已审核文章', //文件名，不带后缀，默认是时间梭
        fileType: 'xlsx',
      };
      ydFile.start(option, function(result) {});
    } else {
      message.warning('导出的数据要大于0条，小于1万条');
    }
  };
  onDomainChange = (e: any) => {
    this.setState({
      media_domain: e.target.value,
    });
  };
  render() {
    const { cat, tier, flag, score, docList, count, pageIndex, media_domain } = this.state;
    return (
      <>
        <div className="main-content-with-page-header">
          <Card bordered={false} style={{ minHeight: 500 }}>
            <Affix offsetTop={0}>
              <div
                style={{ background: '#fff', padding: '15px 0', borderBottom: '1px solid #ddd' }}
              >
                <Form layout="inline">
                  <Form.Item label="文章大类">
                    <Select onChange={this.onCatChange} style={{ width: 150 }} value={cat}>
                      <Option value="all">全部</Option>
                      {CategoryList.map(item => (
                        <Option value={item}>{item}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item label="处理结果">
                    <Select
                      mode="multiple"
                      style={{ width: 150 }}
                      onChange={this.onFlagChange}
                      value={flag}
                    >
                      <Option value="all">全部</Option>
                      {/* <Option value="checkDoc">通过</Option>
                    <Option value="hide">不展示</Option>
                    <Option value="notserve">不服务</Option>
                    <Option value="notrecommend">不推荐</Option>
                    <Option value="remove">删除</Option> */}
                      <Option value="pass">通过</Option>
                      <Option value="low">不通过</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="评分">
                    <Select
                      mode="multiple"
                      style={{ width: 150 }}
                      onChange={this.onScoreChange}
                      value={score}
                    >
                      <Option value="all">全部</Option>
                      <Option value={0}>0</Option>
                      <Option value={1}>1</Option>
                      <Option value={2}>2</Option>
                      <Option value={3}>3</Option>
                      <Option value={4}>4</Option>
                      <Option value={5}>5</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="源评级">
                    <Select onChange={this.onTierChange} style={{ width: 150 }} value={tier}>
                      <Option value="all">全部</Option>
                      <Option value="1">1</Option>
                      <Option value="2">2</Option>
                      <Option value="3">3</Option>
                      <Option value="4">4</Option>
                      <Option value="5,6">5-6</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="审核员账号">
                    <Input
                      placeholder="请输入公司邮箱"
                      onChange={this.onAuditorChange}
                      style={{ width: 180 }}
                      allowClear={true}
                    />
                  </Form.Item>
                  <Form.Item label="审核时间">
                    <DatePicker.RangePicker
                      defaultValue={[moment().subtract(3, 'days'), moment()]}
                      format={'YYYY-MM-DD HH:mm'}
                      onChange={this.onAuditDateChange}
                      showTime
                    />
                  </Form.Item>
                  <Form.Item label="账号领域">
                    <Input value={media_domain} onChange={this.onDomainChange}></Input>
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" onClick={this.onSearchAudited}>
                      搜索
                    </Button>
                    <Popover content="导出的数据要在一万条以内,否则可能导出失败">
                      <Button
                        type="danger"
                        style={{ marginLeft: '15px' }}
                        onClick={this.exportData}
                      >
                        导出数据
                      </Button>
                    </Popover>
                  </Form.Item>
                </Form>
                <div style={{ marginTop: '15px' }}>
                  <Input.Search
                    style={{ width: 300 }}
                    placeholder="按docid搜索反馈文章"
                    onSearch={this.onSearchByDocid}
                    enterButton
                  />
                </div>
                <Pagination
                  style={{ background: '#fff', padding: '15px 0', borderBottom: '1px solid #ddd' }}
                  current={pageIndex}
                  defaultCurrent={1}
                  pageSize={PageSize}
                  total={count}
                  showTotal={total => `共${total}条`}
                  onChange={this.onChangePage}
                />
              </div>
            </Affix>
            <Spin spinning={this.state.loading}>
              <div className="doc-list">
                {docList &&
                  docList.map((item: any, index: number) => (
                    <TopDoc key={item.docid} index={index} doc={item} isHis={true} appid="yidian" />
                  ))}
              </div>
            </Spin>
            <BackTop></BackTop>
          </Card>
        </div>
      </>
    );
  }
}
