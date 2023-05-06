import React from 'react';
import { Form, Select, Button, Card, Affix, Pagination, BackTop, Input, Spin, message } from 'antd';
import TopDoc from '../../components/TopDoc/index';
import axios from 'axios';
import appConfig from '@/config/app.config';
import CategoryList from '@/data/category_list';

import '../index.less';

const { Option } = Select;
const PageSize = 20;

interface IState {
  getDataMode: 'load' | 'search';
  docList: Array<any>;
  count: number;
  pageIndex: number;
  cat: string; //文章大类
  sort: string; // 排序
  tier: string; //源评级
  searchDocid: string; //搜索的docid
  ctype: string; //文章ctype
  loading: boolean;
  media_domain: string; // 自媒体领域
}

export default class AuditPage extends React.PureComponent<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      getDataMode: 'load',
      cat: 'all',
      tier: 'all',
      docList: [],
      count: 0,
      sort: 'createAt',
      pageIndex: 1,
      searchDocid: '',
      ctype: 'all',
      loading: true,
      media_domain: '',
    };
  }
  componentDidMount() {
    this.getAuditDocList(1);
  }
  onChangePage = (pageIndex: number) => {
    this.setState({
      loading: true,
    });
    this.getAuditDocList(pageIndex);
    window.scrollTo(0, 0);
  };
  getAuditDocList(pageIndex: number) {
    const { cat, tier, sort, searchDocid, ctype, media_domain } = this.state;
    let offset = (pageIndex - 1) * PageSize,
      category = cat === 'all' ? '' : cat,
      source_tier = tier === 'all' ? '' : tier,
      doc_ctype = ctype === 'all' ? '' : ctype;

    axios
      .get(`/api/proxy/${appConfig.API_TOOLS_HOST}/news-review/search-top-news`, {
        params: {
          docid: searchDocid,
          operation_state: '0',
          category: category,
          operation: '',
          score: '-1',
          source_tier: source_tier,
          operator_email: '',
          start: '',
          end: '',
          offset: offset,
          count: PageSize,
          sort: sort,
          ctype: doc_ctype,
          appid: 'yidian',
          media_domain,
        },
      })
      .then(res => {
        if (res.data.status === 'success') {
          this.setState({
            docList: res.data.result,
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
  handleRemoveDoc = (docid: string) => {
    let { docList, count } = this.state;
    docList = docList.filter(item => item.doc_id !== docid);
    this.setState({
      docList,
      count: count - 1,
    });
  };
  onSearchByDocid = (docid: string) => {
    this.setState(
      {
        cat: 'all',
        tier: 'all',
        docList: [],
        count: 0,
        pageIndex: 1,
        searchDocid: docid,
        loading: true,
      },
      () => {
        this.getAuditDocList(1);
      },
    );
  };
  onSearchAudit = () => {
    this.setState(
      {
        searchDocid: '',
        loading: true,
      },
      () => {
        this.getAuditDocList(1);
      },
    );
  };
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
  onCtypeChange = (ctype: string) => {
    this.setState({
      ctype,
    });
  };
  onSortChange = (sort: string) => {
    this.setState({ sort, loading: true }, () => {
      this.getAuditDocList(1);
    });
  };
  onDomainChange = (e: any) => {
    this.setState({
      media_domain: e.target.value,
    });
  };
  render() {
    const { cat, tier, docList, count, sort, pageIndex, ctype, media_domain } = this.state;
    return (
      <>
        <div className="main-content">
          <Card bordered={false} style={{ minHeight: 380 }}>
            <Affix offsetTop={0}>
              <div
                style={{ background: '#fff', padding: '15px 0', borderBottom: '1px solid #ddd' }}
              >
                <Form layout="inline" style={{ display: 'inline-block' }}>
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
                  <Form.Item label="内容类型">
                    <Select onChange={this.onCtypeChange} style={{ width: 150 }} value={ctype}>
                      <Option value="all">全部</Option>
                      <Option value="图文">图文</Option>
                      <Option value="视频">视频</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="账号领域">
                    <Input value={media_domain} onChange={this.onDomainChange}></Input>
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" onClick={this.onSearchAudit}>
                      搜索
                    </Button>
                  </Form.Item>
                </Form>
                <div style={{ display: 'inline-block', lineHeight: '14px' }}>
                  <Input.Search
                    style={{ width: 300 }}
                    placeholder="按docid搜索反馈文章"
                    onSearch={this.onSearchByDocid}
                    enterButton
                  />
                </div>
                <div style={{ marginTop: '15px' }}>
                  <Form layout="inline">
                    <Form.Item label="排序">
                      <Select onChange={this.onSortChange} style={{ width: 150 }} value={sort}>
                        <Option value="source_tier">源评级</Option>
                        <Option value="createTime">入审核池时间</Option>
                        <Option value="createAt">发布时间</Option>
                      </Select>
                    </Form.Item>
                  </Form>
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
                    <TopDoc
                      key={item.docid}
                      index={index}
                      doc={item}
                      handleRemoveDoc={this.handleRemoveDoc}
                      appid="yidian"
                    ></TopDoc>
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
