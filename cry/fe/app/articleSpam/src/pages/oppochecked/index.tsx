import React from 'react';
import { Form, Select, Input, DatePicker, Button, Card, Affix, Popover, Pagination, BackTop, message, Spin } from 'antd';
import moment from 'moment';
import OPPOCheckedDoc from '../../components/OPPOCheckedDoc/index';
import axios from 'axios';
import appConfig from '@/config/app.config';
import CategoryList from '@/data/category_list';
import { getCookie } from '@/utils/cookie';

const { Option } = Select;
const PageSize = 20;

interface INoRecPageState {
  getDataMode: string,
  cat: string, //文章大类
  tier: string, //源评级
  auditor: string, //审核员邮箱
  startDate: string, //开始时间
  endDate: string, //结束时间
  docList: Array<any>,
  count: number,
  pageIndex: number,
  searchDocid: string, //搜索docid
  score: Array<any>, //评分
  loading: boolean,
  ctype: string,
}

export default class NoRecPage extends React.PureComponent<any, INoRecPageState> {
  constructor(props) {
    super(props);
    let start = moment().subtract(3, "days").format('YYYY-MM-DD');
    let end = moment().format('YYYY-MM-DD')
    this.state = {
      getDataMode: 'load',
      cat: 'all',
      tier: 'all',
      auditor: '',
      startDate: start,
      endDate: end,
      docList: [],
      count: 0,
      pageIndex: 1,
      searchDocid: '',
      score: ['all'],
      loading: true,
      ctype: 'all'
    }
  }
  componentDidMount() {
    this.getDocList(1);
    window.ydFile.set('sk', 'wKy3i0rEtHuGwRo2w4yJtZyVq4');
    window.ydFile.set('approved_by', getCookie('username'));
  }
  onChangePage = (pageIndex) => {
    this.setState({
      loading: true,
    });
    this.getDocList(pageIndex);
    window.scrollTo(0, 0);
  }
  getDocList(pageIndex) {
    const { cat, tier, score, auditor, searchDocid, startDate, endDate, ctype} = this.state;
    let offset = (pageIndex-1)*PageSize,
        category = cat === 'all' ? '':cat,
        source_tier = tier === 'all' ? '':tier,
        score_string = score.includes('all') ? '':score.toString(),
        selectCtype = ctype === 'all' ? '':ctype;
    this.setState({
      docList: []
    });
    axios
      .get(`/api/proxy/${appConfig.API_TOOLS_HOST}/news-review/search-top-news`, {
        params: {
          docid: searchDocid,
          operation_state: '1',
          category: category,
          operations: '',
          scores: score_string,
          source_tier: source_tier,
          operator_email: auditor,
          start: startDate + " 00:00:00",
          end: endDate + " 23:59:59",
          offset: offset,
          count: PageSize,
          sort: 'createAt',
          appid: 'oppobrowser',
          ctype: selectCtype,
        },
      })
      .then(res => {
        if (res.data.status === 'success') {
          let docs = res.data.result
          docs.forEach(function(item){
            item.newscore = item.score
            if (item.reason.length === 0) {
              item.reason = ['']
            }else if (item.reason.length === 1) {
              item.reason = [item.reason]
            } else {
              item.reason = item.reason.split(',')
            }
            item.reason.forEach(function(rsn,index){
              if (rsn.indexOf('其他') > -1) {
                item.other_reason = rsn.split(':')[1]
                item.reason[index] = '其他'
              }
            })
          })
          // console.log(docs)
          this.setState({
            docList: docs,
            pageIndex: pageIndex,
            count: res.data.total,
            loading: false
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
      tier  
    });
  };
  onCtypeChange = (ctype: string) => {
    this.setState({
      ctype  
    });
  };
  onScoreChange = (score: Array<any>) => {
    this.setState({
      score
    });
  }
  onAuditorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      auditor: e.target.value
    })  
  }
  onAuditDateChange = (date:any, dateStrings: string[]) => {
    this.setState({
      startDate: dateStrings[0],
      endDate: dateStrings[1]
    });
  }
  onSearchAudited = () => {
    this.setState(
      {
        searchDocid: '',
        loading: true,
      },
      () => {
        this.getDocList(1);
      }
    );
  }
  onSearchByDocid = (docid: string) => {
    this.setState(
      {
        cat: 'all',
        tier: 'all',
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
      }
    );
  }
  exportData = () => {
    const { count} = this.state;
    if (count > 0 && count < 30000) {
      const { cat, tier, score, auditor, searchDocid, startDate, endDate, ctype} = this.state;
      let category = cat === 'all' ? '':cat,
          source_tier = tier === 'all' ? '':tier,
          score_string = score.includes('all') ? '':score.toString(),
          selectCtype = ctype === 'all' ? '':ctype;
      let data = {
        docid: '',
        operation_state: '1',
        category: category,
        operations: '',
        scores: score_string,
        source_tier: source_tier,
        operator_email: auditor,
        start: startDate + " 00:00:00",
        end: endDate + " 23:59:59",
        sort: 'createAt',
        appid: 'oppobrowser',
        ctype: selectCtype,
      }
      let params = Object.assign(data,{offset: 0, count: count}),
      struct = [{
        label: 'docid',
        value: 'doc_id'
      }, {
        label: '文章题目',
        value: 'title',
      }, {
        label: '曝光量',
        value: 'cntView',
      }, {
        label: '入审核池时间',
        value: 'insert_time',
      }, {
        label: '大类',
        value: 'category',
      }, {
        label: '账号名称',
        value: 'source',
      }, {
        label: '账号id',
        value: 'media_id',
      }, {
        label: '源评级',
        value: 'source_tier',
      }, {
        label: '发布时间',
        value: 'date',
      }, {
        label: '低俗值',
        value: 'sc_dirty',
      }, {
        label: '标题党属性',
        value: 'bait',
      }, {
        label: '评分',
        value: 'score',
      }, {
        label: '评估结论',
        value: 'reason',
      },{
        label: '审核人',
        value: 'operator_email',
      }, {
        label: '审核时间',
        value: 'reviewed_time',
      }]
      // console.log(params)
      let option = {
        method: 'GET',
        url: 'http://operationtoolservice.go2yd.int.yidian-inc.com/news-review/search-top-news',
        params: JSON.stringify(params),
        dir: 'result',
        struct: struct,
        filename: 'OPPOtop2000已审核文章', //文件名，不带后缀，默认是时间梭
        fileType: 'xlsx'
      }
      ydFile.start(option, function(result){
      
      })  
    } else {
      message.warning('导出的数据要大于0条，小于3万条');
    }
  }
  render() {
    const { cat, tier, score, docList, count, pageIndex, ctype } = this.state;
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
                <Form.Item label="评分">
                  <Select mode="multiple" style={{ width: 150 }} onChange={this.onScoreChange} value={score}>
                    <Option value="all">全部</Option>
                    <Option value={0}>0</Option>
                    <Option value={1}>1</Option>
                    <Option value={2}>2</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="源评级">
                  <Select
                    onChange={this.onTierChange}
                    style={{width: 150}}
                    value={tier}
                  >
                      <Option value="all">全部</Option>
                      <Option value="1">1</Option>
                      <Option value="2">2</Option>
                      <Option value="3">3</Option>
                      <Option value="4">4</Option>
                      <Option value="5">5</Option>
                      <Option value="6">6</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="内容类型">
                    <Select
                      onChange={this.onCtypeChange}
                      style={{width: 150}}
                      value={ctype}
                    >
                        <Option value="all">全部</Option>
                        <Option value="图文">图文</Option>
                        <Option value="视频">视频</Option>
                    </Select>
                </Form.Item>
                <Form.Item label="审核员账号">
                  <Input placeholder="请输入公司邮箱" onChange={this.onAuditorChange} style={{width: 180}} allowClear={true}/>
                </Form.Item>
                <Form.Item label="审核时间">
                  <DatePicker.RangePicker defaultValue={[moment().subtract(3, "days"), moment()]} format={'YYYY-MM-DD'} onChange={this.onAuditDateChange} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" onClick={this.onSearchAudited}>搜索</Button>
                  <Popover content='导出的数据要在一万条以内,否则可能导出失败'>
                    <Button type="danger" style={{ marginLeft: '15px' }} onClick={this.exportData}>导出数据</Button>
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
                {
                  docList && docList.map((item, index) => <OPPOCheckedDoc key={item.docid} index={index} doc={item}></OPPOCheckedDoc>)
                }
              </div>
            </Spin>
            <BackTop></BackTop>
          </Card>
        </div>
      </>
    );
  }
}
