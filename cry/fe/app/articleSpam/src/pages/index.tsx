import React from 'react';
import { Form, Select, Button, Card, Affix, Pagination, BackTop, Input, Spin } from 'antd';
import AuditDoc from '../components/AuditDoc/index';
import axios from 'axios';
import appConfig from '@/config/app.config';
import CategoryList from '@/data/category_list';
import NegativeList from '@/data/negative_list';

import './index.less';

const { Option } = Select;
const PageSize = 20;

interface IState {
  getDataMode: 'load' | 'search';
  docList: Array<any>;
  count: number;
  pageIndex: number;
  cat: string;
  negCommentClass: string;
  tier: string;
  loading: boolean;
}

export default class AuditPage extends React.PureComponent<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      getDataMode: 'load',
      cat: 'all',
      negCommentClass: 'all',
      tier: 'all',
      docList: [],
      count: 0,
      pageIndex: 1,
      loading: true,
    };
  }
  componentDidMount() {
    this.getAuditDocList(1);
  }
  onChangePage = (pageIndex: number) => {
    this.setState({
      loading: true,
    });
    if (this.state.getDataMode === 'load') {
      this.getAuditDocList(pageIndex);
    } else {
      this.getAuditDocListBySearch(pageIndex);
    }
    window.scrollTo(0, 0);
  };
  getDocDetail(docs: any) {
    const docids = docs.map(item => item.docid);
    return axios
      .get(
        `/api/proxy/http://tool-collection.ha.in.yidian.com:7080/docenter/yidian/ids/${docids}/fields/source,cat_class,source_tier,_id`,
        {
          params: {},
        },
      )
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
  getAuditDocList(pageIndex: number) {
    axios
      .get(`/api/proxy/${appConfig.API_HOST}/service/comment/review`, {
        params: {
          action: 'getDocToBeAudited',
          start: (pageIndex - 1) * PageSize,
          end: pageIndex * PageSize,
        },
      })
      .then(res => {
        if (res.data.status === 'success') {
          this.getDocDetail(res.data.result.docs).then(docs => {
            this.setState({
              docList: docs,
              pageIndex: pageIndex,
              count: res.data.result.count,
              loading: false,
            });
          });
        }
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  }
  getAuditDocListBySearch(pageIndex: number) {
    const { cat, negCommentClass, tier } = this.state;
    let oParams: any = {
      action: 'getPendingDocByDivision',
      cat: cat,
      negCommentClass: negCommentClass,
      isAudited: false,
      flag: 'all',
      start: (pageIndex - 1) * PageSize,
      end: pageIndex * PageSize,
    };
    if (tier !== 'all') {
      oParams.tier = tier;
    }
    axios
      .get(`/api/proxy/${appConfig.API_HOST}/service/comment/review`, {
        params: oParams,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(res => {
        if (res.data.status === 'success') {
          if (res.data.result && res.data.result.docs && res.data.result.count > 0) {
            this.getDocDetail(res.data.result.docs).then(docs => {
              this.setState({
                docList: docs,
                pageIndex: pageIndex,
                count: res.data.result.count,
                getDataMode: 'search',
                loading: false,
              });
            });
          } else {
            this.setState({
              docList: [],
              pageIndex: pageIndex,
              count: 0,
              getDataMode: 'search',
              loading: false,
            });
          }
        }
      });
  }
  handleRemoveDoc = (docid: string) => {
    let { docList } = this.state;
    docList = docList.filter(item => item.docid !== docid);
    this.setState({
      docList,
    });
  };
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
        if (res.data.status === 'success') {
          if (res.data.result && res.data.result.length > 0) {
            this.getDocDetail(res.data.result).then(docs => {
              this.setState({
                docList: docs,
                pageIndex: 1,
                count: 1,
                loading: false,
              });
            });
          } else {
            this.setState({
              docList: [],
              pageIndex: 1,
              count: 0,
              loading: false,
            });
          }
        }
      });
  };
  onSearchAudit = () => {
    this.setState({
      loading: true,
    });
    this.getAuditDocListBySearch(1);
  };
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
      tier,
    });
  };
  render() {
    const { cat, negCommentClass, tier, docList, count, pageIndex } = this.state;
    return (
      <>
        <div className="main-content">
          <Card bordered={false} style={{ minHeight: 380 }}>
            <Affix offsetTop={0}>
              <div
                style={{ background: '#fff', padding: '15px 0', borderBottom: '1px solid #ddd' }}
              >
                <Form layout="inline">
                  <Form.Item label="文章大类">
                    <Select onChange={this.onCatChange} style={{ width: 150 }} value={cat}>
                      <Option value="all">全部</Option>
                      {CategoryList.map(item => (
                        <Option key={item} value={item}>
                          {item}
                        </Option>
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
                        <Option key={item} value={item}>
                          {item}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item label="源评级">
                    <Select onChange={this.onTierChange} style={{ width: 150 }} value={tier}>
                      <Option value="all">全部</Option>
                      <Option value="1">1</Option>
                      <Option value="2">2</Option>
                      <Option value="3">3</Option>
                      <Option value="4">4</Option>
                      <Option value="5">5</Option>
                      <Option value="6">6</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" onClick={this.onSearchAudit}>
                      搜索
                    </Button>
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
                  style={{ marginTop: '15px' }}
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
                    <AuditDoc
                      key={item.docid}
                      index={index}
                      doc={item}
                      handleRemoveDoc={this.handleRemoveDoc}
                    ></AuditDoc>
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
