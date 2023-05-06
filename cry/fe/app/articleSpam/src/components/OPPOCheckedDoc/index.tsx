import React from 'react';
import { Button, Tag, Radio, Modal, Input, Checkbox, message } from 'antd';
import axios from 'axios';

import appConfig from '@/config/app.config';
import { getCookie } from '@/utils/cookie';

import './index.less';
import { OPP_NEGATIVE_REASON } from '@/config/constant';

interface RecDocProps {
  doc: any;
  index: number;
}

export default class RecDoc extends React.PureComponent<RecDocProps> {
  constructor(props: RecDocProps) {
    super(props);
  }
  async handleArticle() {
    const { doc } = this.props;
    if (doc.reason.includes('其他')) {
      let num = doc.reason.indexOf('其他');
      doc.reason[num] = doc.reason[num] + ':' + doc.other_reason;
    }
    let params = {
      docid: doc.doc_id,
      score: doc.newscore,
      operation: '',
      reason: doc.reason.join(','),
      operator_email: getCookie('username'),
      appid: 'oppobrowser',
    };
    if (doc.score === doc.newscore) {
      try {
        let res: any;
        res = await this.updateArticle(params);
        if (res.data.status === 'success') {
          message.success('操作成功');
        } else {
          message.error('操作失败，请重试');
        }
      } catch (err) {
        console.log(err);
        message.error('操作失败，请重试');
      }
    } else {
      try {
        let res: any, res2: any;
        res = await this.updateCpp(params);
        res2 = await this.updateArticle(params);
        if (res.data === true && res2.data.status === 'success') {
          message.success('操作成功');
        } else {
          message.error('操作失败，请重试');
        }
      } catch (err) {
        console.log(err);
        message.error('操作失败，请重试');
      }
    }
  }
  updateCpp = data => {
    let key = 'e7d86aef18345a5a00041e4bb506f99a',
      from = 'webui@article-spam',
      url = `/api/proxy/${appConfig.API_k8s_HOST}/prv/document/update`;
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: url,
        data: {
          ob_quality_score: data.score,
        },
        params: {
          docid: data.docid,
          from: from,
          key: key,
        },
      })
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  };
  updateArticle = data => {
    return new Promise((resolve, reject) => {
      axios
        .get(`/api/proxy/${appConfig.API_TOOLS_HOST}/news-review/update-top-news`, {
          params: data,
        })
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  };
  onPassArticle = () => {
    const self = this;
    const { doc } = this.props;
    if (doc.score === -1) {
      return message.error('评分和操作为必填项');
    }
    self.handleArticle();
    // Modal.confirm({
    //   title: '提示',
    //   content: '您确定要这样重新审核文章吗？',
    //   onOk() {
    //     return self.handleArticle();
    //   },
    // });
  };
  onChangeArticleScore = (e: any) => {
    this.props.doc.newscore = e.target.value;
  };
  onChangeArticleReason = (e: any) => {
    this.props.doc.reason = e;
  };
  onOtherReasonChange = (e: any) => {
    this.props.doc.other_reason = e.target.value;
  };
  render() {
    const { doc, index } = this.props;
    return (
      <div className="audit-doc-wrapper">
        <div className="doc-title">
          <span>{index + 1}.&nbsp;&nbsp;</span>
          <a
            href={`https://www.yidianzixun.com/article/${doc.doc_id}?appid=heytap`}
            target="_blank"
          >
            {doc.title}
          </a>
        </div>
        <div className="doc-info">
          {doc.media_id && <Tag color="#ffa500">自媒体</Tag>}
          <span>
            <strong>docid: </strong>
            {doc.doc_id}
          </span>
          <span>
            <strong>曝光量: </strong>
            {doc.cntView}
          </span>
          <span>
            <strong>入审核池时间: </strong>
            {doc.insert_time}
          </span>
          <span>
            <strong>大类: </strong>
            {doc.category}
          </span>
          <span>
            <strong>来源: </strong>
            {doc.source}
          </span>
          <span>
            <strong>账号id: </strong>
            {doc.media_id || ''}
          </span>
          <span>
            <strong>源评级: </strong>
            {doc.source_tier}
          </span>
          <span>
            <strong>发布日期: </strong>
            {doc.date}
          </span>
          <span>
            <strong>低俗值: </strong>
            {doc.sc_dirty}
          </span>
          <span>
            <strong>标题党属性: </strong>
            {doc.bait}
          </span>
          <span>
            <strong>审核人: </strong>
            {doc.operator_email || '未知'}
          </span>
          <span>
            <strong>审核时间: </strong>
            {doc.reviewed_time}
          </span>
        </div>
        <div className="doc-oper-wrapper">
          <div>
            <h4 className="opt-title">评分:</h4>
            <div className="opt-wrapper">
              <Radio.Group onChange={this.onChangeArticleScore} defaultValue={doc.score}>
                <Radio value={2}>2</Radio>
                <Radio value={1}>1</Radio>
                <Radio value={0}>0</Radio>
              </Radio.Group>
            </div>
          </div>
          <h4 style={{ marginTop: '10px' }}>负向操作原因:</h4>
          <div>
            <Checkbox.Group onChange={this.onChangeArticleReason} defaultValue={doc.reason}>
              <div style={{ marginBottom: '5px' }}>
                {OPP_NEGATIVE_REASON.map((item: string) => (
                  <Checkbox value={item} key={item} style={{ margin: 0, marginRight: '8px' }}>
                    {item}
                  </Checkbox>
                ))}
              </div>
            </Checkbox.Group>
            <div className="oper-btns-wrapper-oppo">
              <Button type="primary" onClick={this.onPassArticle}>
                重审
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
