import React from 'react';
import { Form, Select, Input, DatePicker, Button, Card, Affix, Popover, Pagination, BackTop, message, Spin } from 'antd';
import RecDoc from '../../components/RecDoc/index';
import axios from 'axios';
import appConfig from '@/config/app.config';
import CategoryList from '@/data/category_list';
import NegativeList from '@/data/negative_list';
import { getCookie } from '@/utils/cookie';

const { Option } = Select;
const PageSize = 20;

interface INoRecPageState {
  getDataMode: string,
  cat: string,
  tier: string,
  negCommentClass: string,
  flag: string,
  newsLabel: string,
  auditor: string,
  startDate: string,
  endDate: string,
  docList: Array<any>,
  count: number,
  pageIndex: number,
  loading: boolean,
}

export default class NoRecPage extends React.PureComponent<any, INoRecPageState> {
  constructor(props) {
    super(props);
    this.state = {
      getDataMode: 'load',
      cat: 'all',
      negCommentClass: 'all',
      tier: 'all',
      flag: 'all',
      newsLabel: 'all',
      auditor: '',
      startDate: '',
      endDate: '',
      docList: [],
      count: 0,
      pageIndex: 1,
      loading: true,
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
    if (this.state.getDataMode === 'load') {
      this.getDocList(pageIndex);
    } else {
      this.getAuditDocListBySearch(pageIndex);
    }
    window.scrollTo(0, 0);
  }
  getDocDetail(docs: any) {
    const docids = docs.map(item => item.docid);
    return axios
      .get(`/api/proxy/http://tool-collection.ha.in.yidian.com:7080/docenter/yidian/ids/${docids}/fields/source,cat_class,source_tier,_id`, {
        params: {
    
        },
      })
      .then(resDetail => {
        return new Promise<Array<any>>((resolve, reject) => {
          if (resDetail.data.status === 'success') {
            const docDetail = {};
            resDetail.data.result.forEach(item => {
              if (item._id) {
                docDetail[item._id] = item;
              }
            });
            docs = docs.map(item => {
              const detail = docDetail[item.docid];
              if (detail) {
                return { ...item, ...detail };
              } else {
                return item;
              }
            });
            resolve(docs);
          } else {
            reject();
          }
        });
      });
  }
  getDocList(pageIndex) {
    axios.get(`/api/proxy/${appConfig.API_HOST}/service/comment/review`, {
      params: {
        action: 'getDocAudited',
        start: (pageIndex - 1) * PageSize,
        end: pageIndex * PageSize
      }
    }).then(res => {
      if (res.data.status === 'success' && res.data.result.docs.length > 0) {
        this.getDocDetail(res.data.result.docs).then(docs => {
          this.setState({
            docList: docs,
            pageIndex: pageIndex,
            count: res.data.result.count,
            loading: false,
          });
        });
      }else{
        this.setState({
          docList: [],
          pageIndex: 1,
          count: 0,
          getDataMode: 'search',  
          loading: false,
        });  
      }
    })
  }
  getAuditDocListBySearch(pageIndex:number) {
    const { cat, negCommentClass, tier, flag, auditor, startDate, endDate, newsLabel} = this.state;
    let oParams:any = {
      action: 'getPendingDocByDivision',
      cat: cat,
      negCommentClass: negCommentClass,
      isAudited: true,
      flag: flag,
      start: (pageIndex - 1) * PageSize,
      end: pageIndex * PageSize
    };
    if(auditor) {
      oParams.auditor = auditor;
    }
    if(startDate && endDate) {
      oParams.startDate = startDate;
      oParams.endDate = endDate;
    }
    if(tier !== 'all'){
      oParams.tier = tier;
    }
    if(newsLabel !== 'all'){
      oParams.newsLabel = newsLabel;
    }
    axios
      .get(`/api/proxy/${appConfig.API_HOST}/service/comment/review`, {
        params: oParams,
      })
      .then(res => {
        if (res.data.status === 'success' && res.data.result.docs.length > 0) {
          this.getDocDetail(res.data.result.docs).then(docs => {
            this.setState({
              docList: docs,
              pageIndex: pageIndex,
              count: res.data.result.count,
              getDataMode: 'search',  
              loading: false,
            });
          });  
        }else{
          this.setState({
            docList: [],
            pageIndex: 1,
            count: 0,
            getDataMode: 'search',  
            loading: false,
          });  
        }
      });
  }
  handleRemoveDoc = (docid:string) => {
    let { docList } = this.state;
    docList = docList.filter(item => item.docid !== docid);
    this.setState({
      docList
    });
  }
  onCatChange = (cat: string) => {
    this.setState({
      cat,
    });
  };
  onNegChange = (negCommentClass: string) => {
    this.setState({
      negCommentClass,
    });
  };
  onTierChange = (tier: string) => {
    this.setState({
      tier  
    });
  }
  onLabelChange = (newsLabel: string) => {
    this.setState({
      newsLabel
    });
  }
  onFlagChange = (flag: string) => {
    this.setState({
      flag
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
    this.setState({
      loading: true,
    });  
    this.getAuditDocListBySearch(1);
  }
  onSearchByDocid = (docid: string) => {
    this.setState({
      loading: true,
    });  
    axios
      .get(`/api/proxy/${appConfig.API_HOST}/service/comment/review`, {
        params: {
          action: 'getPendingDocByDocid',
          docid: docid,
        },
      })
      .then(res => {
        if (res.data.status === 'success' && res.data.result.length > 0 && res.data.result[0].docid) {
          this.getDocDetail(res.data.result).then(docs => {
            this.setState({
              docList: docs,
              pageIndex: 1,
              count: 1,
              loading: false,
            });
          });
        }else{
          this.setState({
            docList: [],
            pageIndex: 1,
            count: 0,
            getDataMode: 'search',  
            loading: false,
          });  
        }
      });
  }
  exportData = () => {
    const { count, cat, negCommentClass, tier, flag, auditor, startDate, endDate, newsLabel} = this.state;
    if (count > 0 && count < 10000) {
      let oParams:any = {
        action: 'getPendingDocByDivision',
        cat: cat,
        negCommentClass: negCommentClass,
        isAudited: true,
        flag: flag
      };
      if(auditor) {
        oParams.auditor = auditor;
      }
      if(startDate && endDate) {
        oParams.startDate = startDate;
        oParams.endDate = endDate;
      }
      if(tier !== 'all'){
        oParams.tier = tier;
      }
      if(newsLabel !== 'all'){
        oParams.newsLabel = newsLabel;
      }
      let params = Object.assign(oParams,{start: 0, end: count}),
      struct = [{
        label: 'docid',
        value: 'docid'
      }, {
        label: '大类',
        value: 'cat',
      }, {
        label: 'title',
        value: 'title',
      }, {
        label: 'doc_url',
        value: 'docid',   
        filter: {
          argument: 'row, key',
          content: "if (!row[key]) return; let doc_url = 'https://www.yidianzixun.com/article/' + row[key]; return doc_url;"
        },
      }, {
        label: '发布时间',
        value: 'date',
      }, {
        label: '编辑审核文章类型',
        value: 'newsLabel',
      }, {
        label: '用户评论',
        value: 'comments',
        filter: {
          argument: 'row, key',
          content: "if (!row[key]) return; let commentLabels = []; row[key].forEach(item => {commentLabels.push(item.label);}); return commentLabels.join(',');"
        }
      }]
      // console.log(oParams)
      let option = {
        method: 'GET',
        url: 'http://10.120.46.4:8041/service/comment/review',
        params: JSON.stringify(params),
        dir: 'result-docs',
        struct: struct,
        filename: '评论召回已审核文章', //文件名，不带后缀，默认是时间梭
        fileType: 'xlsx'
      }
      ydFile.start(option, function(result){
      
      })  
    } else {
      message.warning('导出的数据要大于0条，小于1万条');
    }
  }
  render() {
    const { cat, negCommentClass, tier, flag, newsLabel, docList, count, pageIndex } = this.state;
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
                <Form.Item label="用户负反馈类型">
                    <Select
                      onChange={this.onNegChange}
                      style={{ width: 150 }}
                      value={negCommentClass}
                    >
                      <Option value="all">全部</Option>
                      {NegativeList.map(item => (
                        <Option value={item}>{item}</Option>
                      ))}
                    </Select>
                </Form.Item>
                <Form.Item label="处理结果">
                  <Select style={{ width: 150 }} onChange={this.onFlagChange} value={flag}>
                    <Option value="all">全部</Option>
                    <Option value="pass">通过</Option>
                    <Option value="hide">不展示</Option>
                    <Option value="notserve">不服务</Option>
                    <Option value="notrecommend">不推荐</Option>
                    <Option value="remove">删除</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="审核负反馈类型">
                  <Select style={{ width: 150 }} onChange={this.onLabelChange} value={newsLabel}>
                    <Option value="all">全部</Option>
                    <Option value="文不对题">文不对题</Option>
                    <Option value="标题党">标题党</Option>
                    <Option value="浮夸虚假">浮夸虚假</Option>
                    <Option value="旧闻、过时">旧闻、过时</Option>
                    <Option value="软文广告">软文广告</Option>
                    <Option value="色情">色情</Option>
                    <Option value="低俗">低俗</Option>
                    <Option value="信息有误">信息有误</Option>
                    <Option value="文章不全">文章不全</Option>
                    <Option value="格式混乱">格式混乱</Option>
                    <Option value="内容混乱">内容混乱</Option>
                    <Option value="政治敏感">政治敏感</Option>
                    <Option value="垃圾文">垃圾文</Option>
                    <Option value="白水文">白水文</Option>
                    <Option value="其他">其他</Option>
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
                <Form.Item label="审核员账号">
                  <Input placeholder="请输入公司邮箱" onChange={this.onAuditorChange} style={{width: 240}} allowClear={true}/>
                </Form.Item>
                <Form.Item label="审核时间">
                  <DatePicker.RangePicker format={'YYYY-MM-DD'} onChange={this.onAuditDateChange} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" onClick={this.onSearchAudited}>搜索</Button>
                  <Popover content='导出的数据要在一万条以内,否则可能导出失败，此接口较慢，请耐心等待'>
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
                  docList && docList.map((item, index) => <RecDoc key={item.docid} index={index} doc={item} handleRemoveDoc={this.handleRemoveDoc}></RecDoc>)
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
