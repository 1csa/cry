import React from 'react';
import { Button, Tag, Radio, Modal, message } from 'antd';
import axios from 'axios';
import { saveLog } from '../../../../common/Logger.js';
import appConfig from '@/config/app.config';
import { getCookie } from '@/utils/cookie';

import CommentDoc from '../CommentDoc/index';
import './index.less';

interface RecDocProps {
  doc: any;
  index: number;
  handleRemoveDoc: (id: string) => void;
}

interface IAuditDocState {
    comments: Array<any>,
    label: string
}

export default class RecDoc extends React.PureComponent<RecDocProps, IAuditDocState> {
  constructor(props: RecDocProps) {
    super(props);
    this.state = { 
        comments: this.props.doc.comments || [],
        label: ''
    };
  }
  onChangeArticleType = (e:any) => {
    this.setState({
        label: e.target.value
    });
  }
  handleDeleteComment = (id:string) => {
    let { comments } = this.state;
    comments = comments.filter(item => item.id !== id);
    this.setState({
        comments
    });
        
  }
  handleArticle(action: string) {
    const { doc } = this.props;
    const { label } = this.state;
    axios
      .get(`/api/proxy/${appConfig.API_HOST}/service/comment/review`, {
        params: {
          action: action,
          docid: doc.docid,
          newsLabel: label,
          auditor: getCookie('username') || ''
        },
      })
      .then(res => {
        if (res.data.status === 'success') {
          this.props.handleRemoveDoc(doc.docid);
          saveLog({
            log_source: { tag: 'articleSpam' },
            action_method: action,
            target_data: { docid: doc.docid },
          });
        } else {
          message.error(`${action}操作失败，请重试`);
        }
      })
      .catch(err => {
        message.error(`${action}操作失败，请重试`);
      });
  }
  deleteArticle() {
    const { doc } = this.props;
    const { label } = this.state;

    axios
      .get(`/api/proxy/${appConfig.API_HOST}/service/comment/review`, {
        params: {
          action: 'removeDoc',
          docid: doc.docid,
          newsLabel: label,
          auditor: getCookie('username') || '',
        },
      })
      .then(res => {
        if (res.data.status === 'success') {
          this.props.handleRemoveDoc(doc.docid);
          saveLog({
            log_source: { tag: 'articleSpam' },
            action_method: 'removeDoc',
            target_data: { docid: doc.docid },
          });
        } else {
          message.error(`删除文章操作失败，请重试`);
        }
      });
  }
  onPassArticle = () => {
    const self = this;
    Modal.confirm({
      title: '提示',
      content: '您确定要通过该文章吗？',
      onOk() {
        return self.handleArticle('checkDoc');
      },
    });
  };
  onHideArticle = () => {
    const self = this;
    Modal.confirm({
      title: '提示',
      content: '您确定要不展示该文章吗？(收藏 和 分享 中保留)',
      onOk() {
        return self.handleArticle('hide');
      },
    });
  };
  onNoserveArticle = () => {
    const self = this;
    Modal.confirm({
      title: '提示',
      content: '您确定要不服务该文章吗？(收藏 分享 和 源订阅 中保留)',
      onOk() {
        return self.handleArticle('notserve');
      },
    });
  };
  onNorecArticle = () => {
    const self = this;
    Modal.confirm({
      title: '提示',
      content: '您确定要不推荐该文章吗？(收藏 分享 源订阅 及 自荐频道／搜索 中保留)',
      onOk() {
        return self.handleArticle('notrecommend');
      },
    });
  };
  onDeleteArticle = () => {
    const self = this;
    Modal.confirm({
      title: '提示',
      content: '您确定要删除该文章吗？',
      onOk() {
        return self.deleteArticle();
      },
    });
  };
  render() {
    const { doc, index } = this.props;
    const { comments, label } = this.state;
    return (
      <div className="audit-doc-wrapper">
        <div className="doc-title">
          <span>{index + 1}.&nbsp;&nbsp;</span>
          <Button type="primary" href={`https://www.baidu.com/s?wd=${doc.title}`} target="_blank">
            百度一下
          </Button>
          <a href={`https://www.yidianzixun.com/article/${doc.docid}`} target="_blank">
            {doc.title}
          </a>
        </div>
        <div className="doc-info">
          {doc.wemedia && <Tag color="#2db7f5">自媒体</Tag>}
          {doc.stky && <Tag color="red">置顶</Tag>}
          {doc.sel && <Tag color="orange">加精</Tag>}
          <span>
            <strong>大类: </strong>
            {doc.cat && doc.cat.join(',')}
          </span>
          <span>
            <strong>文章源: </strong>
            {doc.source}
          </span>
          <span>
            <strong>源评级: </strong>
            {doc.source_tier}
          </span>
          <span>
            <strong>发布日期: </strong>
            {doc.date}
          </span>
          <span><strong>docid: </strong>{doc.docid}</span>
        </div>
        <div className="audit-info">
          <span>
            <strong>审核人: </strong>
            {doc.auditor || '未知'}
          </span>
          <span>
            <strong>审核时间: </strong>
            {doc.label_date || doc.audit_finished_time}
          </span>
          <span>
            <strong>审核状态: </strong>
            {doc.flag}
          </span>
          <span>
            <strong>审核负反馈类型: </strong>
            {doc.newsLabel || '无'}
          </span>
        </div>
        <div className="doc-comments">
          {comments.map((item: any, index: number) => (
              <CommentDoc
                key={item.id}
                index={index}
                docid={doc.docid}
                comment={item}
                hasDelete={true}
                handleDeleteComment={this.handleDeleteComment}
              ></CommentDoc>
            ))}
        </div>
        <div className="doc-oper">
          <h4>你觉得的文章类型?</h4>
          <Radio.Group onChange={this.onChangeArticleType} value={label}>
            <div style={{ marginBottom: '5px' }}>
              <Radio value={'垃圾解说'}>垃圾解说</Radio>
              <Radio value={'水文'}>水文</Radio>
              <Radio value={'垃圾文'}>垃圾文</Radio>
              <Radio value={'旧闻、过时'}>旧闻、过时</Radio>
              <Radio value={'软文广告'}>软文广告</Radio>
            </div>
            <div style={{ marginBottom: '5px' }}>
              <Radio value={'虚假'}>虚假</Radio>
              <Radio value={'插广告'}>插广告</Radio>
              <Radio value={'标题党'}>标题党</Radio>
              <Radio value={'文不对题'}>文不对题</Radio>
              <Radio value={'错别字'}>错别字</Radio>
            </div>
            <div>
              <Radio value={'色情'}>色情</Radio>
              <Radio value={'色情漫画'}>色情漫画</Radio>
              <Radio value={'准色情'}>准色情</Radio>
            </div>
          </Radio.Group>
          <div className="oper-btns">
            {doc.flag !== 'pass' && (
              <Button type="primary" onClick={this.onPassArticle}>
                通过
              </Button>
            )}
            {doc.flag !== 'hide' && (
              <Button
                disabled={!label}
                style={{ backgroundColor: '#ee82ee', color: '#fff' }}
                onClick={this.onHideArticle}
              >
                不展示
              </Button>
            )}
            {doc.flag !== 'notserve' && (
              <Button
                disabled={!label}
                style={{ backgroundColor: '#ff8c00', color: '#fff' }}
                onClick={this.onNoserveArticle}
              >
                不服务
              </Button>
            )}
            {doc.flag !== 'notrecommend' && (
              <Button
                disabled={!label}
                style={{ backgroundColor: '#d2691e', color: '#fff' }}
                onClick={this.onNorecArticle}
              >
                不推荐
              </Button>
            )}
            {doc.flag !== 'remove' && <Button onClick={this.onDeleteArticle}  disabled={!label}>删除</Button>}
          </div>
        </div>
      </div>
    );
  }
}
