import React from 'react';
import { Button, Tag, Radio, Modal, Input, Checkbox, message } from 'antd';
import axios from 'axios';
import appConfig from '@/config/app.config';
import { getCookie } from '@/utils/cookie';
import ReviewPanel from '@/components/ReviewPanel/OperationalGroup';
import './index.less';

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
    if (doc.high_quality_reason && doc.high_quality_reason.includes('其他')) {
      let topReason = doc.high_quality_reason.split(',');
      let num = topReason.indexOf('其他');
      topReason[num] = topReason[num] + ':' + doc.top_reason;
      let other = topReason.splice(num, 1);
      topReason.push(...other);
      doc.high_quality_reason = topReason.join();
    }
    let params = {
      docid: doc.doc_id,
      score: doc.score,
      operation: doc.action,
      reason: doc.reason.join(','),
      operator_email: getCookie('username'),
      appid: 'yidian',
      high_quality_reason: doc.high_quality_reason,
    };
    let clear_params = {
      token: '136e7682',
      id: doc.doc_id,
      scopes: doc.operation,
    };
    let set_params = {
      token: '136e7682',
      id: doc.doc_id,
      scopes: doc.action,
    };
    if (doc.action === doc.operation) {
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
    // if (doc.action === doc.operation) {
    //   try {
    //     let res: any;
    //     res = await this.updateArticle(params)
    //     if (res.data.status === 'success') {
    //       message.success('操作成功');
    //     } else {
    //       message.error('操作失败，请重试')
    //     }
    //   } catch (err) {
    //     console.log(err)
    //     message.error('操作失败，请重试')
    //   }
    // } else if (doc.operation === 'checkDoc' && doc.action !== 'checkDoc') {
    //   try {
    //     let res: any, res2: any;
    //     res = await this.setScope(set_params)
    //     res2 = await this.updateArticle(params)
    //     if (res.data.status === 'success' && res2.data.status === 'success') {
    //       message.success('操作成功');
    //     } else {
    //       message.error('操作失败，请重试')
    //     }
    //   } catch (err) {
    //     console.log(err)
    //     message.error('操作失败，请重试')
    //   }
    // } else if (doc.operation !== 'checkDoc' && doc.action === 'checkDoc') {
    //   try {
    //     let res: any, res2: any;
    //     res = await this.clearScope(clear_params)
    //     res2 = await this.updateArticle(params)
    //     if (res.data.status === 'success' && res2.data.status === 'success') {
    //       message.success('操作成功');
    //     } else {
    //       message.error('操作失败，请重试')
    //     }
    //   } catch (err) {
    //     console.log(err)
    //     message.error('操作失败，请重试')
    //   }
    // } else {
    //   try {
    //     let res0: any, res: any, res2: any;
    //     res0 = await this.clearScope(clear_params)
    //     res = await this.setScope(set_params)
    //     res2 = await this.updateArticle(params)
    //     if (res.data.status === 'success' && res2.data.status === 'success' && res0.data.status === 'success') {
    //       message.success('操作成功');
    //     } else {
    //       message.error('操作失败，请重试')
    //     }
    //   } catch (err) {
    //     console.log(err)
    //     message.error('操作失败，请重试')
    //   }
    // }
  }
  clearScope = data => {
    return new Promise((resolve, reject) => {
      axios
        .get('/api/proxy/http://lc1.haproxy.yidian.com:7001/scope/clear', {
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
  setScope = data => {
    return new Promise((resolve, reject) => {
      axios
        .get('/api/proxy/http://lc1.haproxy.yidian.com:7001/scope/set', {
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
  updateCpp = data => {
    let key = 'e7d86aef18345a5a00041e4bb506f99a',
      from = 'webui@article-spam',
      url = `/api/proxy/${appConfig.API_k8s_HOST}/prv/document/update`;
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: url,
        data: {
          topViewAudit: data.operation,
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
    Modal.confirm({
      title: '提示',
      content: '您确定要这样重新审核文章吗？',
      onOk() {
        return self.handleArticle();
      },
    });
  };
  onChangeArticleScore = (e: any) => {
    this.props.doc.score = e.target.value;
  };
  onChangeArticleReason = (e: any) => {
    this.props.doc.reason = e;
  };
  onChangeTopReason = (e: any) => {
    // console.log(e, '====');
    this.props.doc.high_quality_reason = e.join();
  };
  onChangeArticleAction = (e: any) => {
    this.props.doc.action = e.target.value;
  };
  onOtherReasonChange = (e: any) => {
    this.props.doc.other_reason = e.target.value;
  };
  onTopReasonChange = (e: any) => {
    this.props.doc.top_reason = e.target.value;
  };
  render() {
    const { doc, index } = this.props;
    return (
      <div className="audit-doc-wrapper">
        <div className="doc-title">
          <span>{index + 1}.&nbsp;&nbsp;</span>
          <a href={`https://www.yidianzixun.com/article/${doc.doc_id}`} target="_blank">
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
            {(+doc.sc_dirty).toFixed(3)}
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
          <span>
            <strong>账号领域: </strong>
            {doc.media_domain}
          </span>
          <span>
            <strong>曝光量: </strong>
            {doc.cntView}
          </span>
          <span>
            <strong>点击率: </strong>
            {doc.ctr}
          </span>
          <span>
            <strong>点击量: </strong>
            {doc.cntClick}
          </span>
          <span>
            <strong>篇均停留时长: </strong>
            {doc.dwellAvg}
          </span>
          <span>
            <strong>是否编辑置顶: </strong>
            {doc.sc_stky == 1 ? '置顶' : '非置顶'}
          </span>
        </div>
        <div className="doc-oper-wrapper">
          <div>
            <h4 className="opt-title">评分:</h4>
            <div className="opt-wrapper">
              <Radio.Group onChange={this.onChangeArticleScore} defaultValue={doc.score}>
                <Radio value={3}>3(优质)</Radio>
                <Radio value={2}>2(正常)</Radio>
                <Radio value={1}>1(低质)</Radio>
                <Radio value={0}>0(明确低质需删除)</Radio>
              </Radio.Group>
            </div>
          </div>
          {/* <ReviewPanel defaultValue={{ operation: doc.operation }} /> */}
          <div>
            <h4 className="opt-title">操作:</h4>
            <div className="opt-wrapper">
              <Radio.Group onChange={this.onChangeArticleAction} defaultValue={doc.operation}>
                <Radio value={'pass'}>通过</Radio>
                <Radio value={'low'}>不可上首页</Radio>
                <Radio value={'checkDoc'} disabled>
                  通过（旧版）
                </Radio>
                <Radio value={'hide'} disabled>
                  不展示（旧版）
                </Radio>
                <Radio value={'notserve'} disabled>
                  不服务（旧版）
                </Radio>
                <Radio value={'notrecommend'} disabled>
                  不推荐（旧版）
                </Radio>
                <Radio value={'removed'} disabled>
                  删除（旧版）
                </Radio>
              </Radio.Group>
            </div>
          </div>
          <h4>优质原因:</h4>
          <div>
            <Checkbox.Group
              defaultValue={doc.high_quality_reason}
              onChange={this.onChangeTopReason}
            >
              <Checkbox value={'标题吸引'}>标题吸引</Checkbox>
              <Checkbox value={'封面清晰'}>封面清晰</Checkbox>
              <Checkbox value={'有深度'}>有深度</Checkbox>
              <Checkbox value={'及时有效'}>及时有效</Checkbox>
              <Checkbox value={'其他'}>其他</Checkbox>
              <Input
                placeholder="请输入其他原因"
                onChange={this.onTopReasonChange}
                style={{ width: 240 }}
                defaultValue={doc.top_reason}
              />
            </Checkbox.Group>
          </div>
          <h4>负向操作原因:</h4>
          <div>
            <Checkbox.Group onChange={this.onChangeArticleReason} defaultValue={doc.reason}>
              <div style={{ marginBottom: '5px' }}>
                <Checkbox value={'标题夸张耸动'}>标题夸张耸动</Checkbox>
                <Checkbox value={'题文不符'}>题文不符</Checkbox>
                <Checkbox value={'标题低俗'}>标题低俗</Checkbox>
                <Checkbox value={'封面图低俗'}>封面图低俗</Checkbox>
                <Checkbox value={'内容低俗'}>内容低俗</Checkbox>
                <Checkbox value={'内容低质无价值，水文'}>内容低质无价值，水文</Checkbox>
              </div>
              <div style={{ marginBottom: '5px' }}>
                <Checkbox value={'旧闻，过时'}>旧闻，过时</Checkbox>
                <Checkbox value={'内容虚假，真实性存疑'}>内容虚假，真实性存疑</Checkbox>
                <Checkbox value={'排版混乱，可读性差'}>排版混乱，可读性差</Checkbox>
                <Checkbox value={'文中夹杂广告'}>文中夹杂广告</Checkbox>
                <Checkbox value={'标题低质'}>标题低质</Checkbox>
                <Checkbox value={'封面图模糊'}>封面图模糊</Checkbox>
              </div>
              <div style={{ marginBottom: '5px' }}>
                <Checkbox value={'封面图低质'}>封面图低质</Checkbox>
                <Checkbox value={'画面模糊'}>画面模糊</Checkbox>
                <Checkbox value={'恶意缩放'}>恶意缩放</Checkbox>
                <Checkbox value={'画面拉伸'}>画面拉伸</Checkbox>
                <Checkbox value={'恶意变声'}>恶意变声</Checkbox>
                <Checkbox value={'恶意添加滤镜'}>恶意添加滤镜</Checkbox>
                <Checkbox value={'画面倾斜'}>画面倾斜</Checkbox>
                <Checkbox value={'恶意添加边框'}>恶意添加边框</Checkbox>
              </div>
              <div style={{ marginBottom: '5px' }}>
                <Checkbox value={'黑屏/花屏'}>黑屏/花屏</Checkbox>
                <Checkbox value={'水印夸张'}>水印夸张</Checkbox>
                <Checkbox value={'音画不同步'}>音画不同步</Checkbox>
                <Checkbox value={'画面卡顿'}>画面卡顿</Checkbox>
                <Checkbox value={'重口味'}>重口味</Checkbox>
                <Checkbox value={'其他'}>其他</Checkbox>
                <Input
                  placeholder="请输入其他原因"
                  onChange={this.onOtherReasonChange}
                  style={{ width: 240 }}
                  defaultValue={doc.other_reason}
                />{' '}
              </div>
            </Checkbox.Group>
            <div className="oper-btns-wrapper">
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
