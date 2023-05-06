import React from 'react';
import { Button, Tag, Radio, Input, Checkbox, Modal, message, Rate } from 'antd';
import axios from 'axios';
import appConfig from '@/config/app.config';
import { getCookie } from '@/utils/cookie';
import ReviewPanel, { IHandler, IFormValue } from '@/components/ReviewPanel/OperationalGroup';
// import {Dispatch} from '@/models/connect'
import { saveLog } from '../../../../common/Logger.js';

import './index.less';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';

interface AuditDocProps {
  index: number;
  doc: any;
  handleRemoveDoc?: (id: string) => void;
  isHis?: boolean;
  appid: string;
  // dispatch: Dispatch;
}

interface IAuditDocState {
  score: number;
  reason: CheckboxValueType[];
  action: string;
  otherReason: string;
  topReason: Array<any>; // 优质原因
  topOtherReason: string; // 优质手动输入原因
}

export default class AuditDoc extends React.PureComponent<AuditDocProps, IAuditDocState> {
  private rpref = React.createRef<IHandler>();
  constructor(props: AuditDocProps) {
    super(props);
    this.state = {
      score: -1,
      reason: [],
      action: '',
      otherReason: '',
      topReason: [],
      topOtherReason: '',
    };
  }
  onChangeArticleScore = (e: any) => {
    this.setState({
      score: e.target.value,
    });
  };
  onChangeArticleReason = (e: any) => {
    this.setState({
      reason: e,
    });
  };
  onChangeTopReason = (e: any) => {
    this.setState({
      topReason: e,
    });
  };
  onChangeArticleAction = (e: any) => {
    this.setState({
      action: e.target.value,
    });
  };
  onResetArticle = (e: any) => {
    this.rpref?.current?.onReset();
    // this.setState({
    //   score: -1,
    //   reason: [],
    //   action: '',
    // });
  };
  onOtherReasonChange = (e: any) => {
    this.setState({
      otherReason: e.target.value,
    });
  };

  onTopOtherReasonChange = (e: any) => {
    this.setState({
      topOtherReason: e.target.value,
    });
  };
  async handleArticle(formValue: IFormValue) {
    const {
      reason,
      low_quality_reason,
      score,
      operation,
      high_quality_reason,
      attribute,
      otherV,
      scope,
    } = formValue;
    const { doc, appid, handleRemoveDoc } = this.props;
    if (Array.isArray(reason) && reason.includes('其他')) {
      let num = reason.indexOf('其他');
      reason[num] = reason[num] + ':' + otherV;
    }
    if (Array.isArray(low_quality_reason) && low_quality_reason.includes('其他')) {
      let num = low_quality_reason.indexOf('其他');
      low_quality_reason[num] = low_quality_reason[num] + ':' + otherV;
    }
    // if (score !== 3) {
    //   topReason.length = 0; // score不等于3 topReason 为空
    // }

    const params = {
      docid: doc.doc_id,
      score,
      operation,
      high_quality_reason: high_quality_reason?.toString(),
      low_quality_reason: low_quality_reason?.toString(),
      reason: reason?.toString(),
      attribute,
      appid,
      scope,
      operator_email: getCookie('username'),
      topViewAudit: operation,
    };
    // key = 'e7d86aef18345a5a00041e4bb506f99a',
    // from = 'webui@article-spam',
    // url = `/api/proxy/${appConfig.API_k8s_HOST}/prv/document/update`,
    // data = {
    //   topViewAudit: params.operation,
    // };
    console.log('params', params);
    axios
      .get(`/api/proxy/${appConfig.API_TOOLS_HOST}/news-review/update-top-news`, {
        params: params,
      })
      .then(res => {
        if (res.data.status === 'success') {
          message.success('操作成功');
          handleRemoveDoc && handleRemoveDoc(doc.doc_id);
          this.setState({
            score: -1,
            reason: [],
            action: '',
            otherReason: '',
          });
        }
      })
      .catch(function(error) {
        message.error('保存失败，请重试');
        console.log(error);
      })
      .finally(() => {
        saveLog({
          log_source: { tag: 'articleSpam' },
          action_method: 'update-top-news',
          target_data: { docid: doc.doc_id, detail: JSON.stringify(params) },
        });
      });
  }

  // 若优质原因为0个，则评分为3；
  // 若优质原因为1个，且账号源评级为1、2、3、4的评分为4；
  // 若优质原因为1个，且账号源评级为5、6的评分为5；
  // 若优质原因为大于等于2个，则评分为5；

  getCount = (data: CheckboxValueType[]) => {
    const { doc } = this.props;
    const len = data.length;
    if (len === 0) {
      return 3;
    } else if (len === 1) {
      if (doc?.source_tier) {
        if (+doc?.source_tier <= 4) {
          return 4;
        } else if (+doc?.source_tier == 5 || +doc?.source_tier == 6) {
          return 5;
        }
      }
    } else {
      return 5;
    }
  };
  onPassArticle = () => {
    const self = this;
    const formValue = this.rpref?.current?.onSubmit();
    if (formValue?.reason?.includes('其他') && !formValue?.otherV) {
      message.warning('选择其他之后请输入理由！');
      return false;
    }
    if (!formValue?.operation) {
      message.warning('请选择操作选项！');
      return false;
    }
    if (formValue?.operation === 'pass' && !formValue?.attribute) {
      message.warning('文章属性不可以为空！');
      return false;
    } else if (formValue?.operation === 'low' && !formValue?.reason?.length) {
      message.warning('标注项不可以为空！');
      return false;
    } else if (formValue?.operation === 'deep' && !formValue?.low_quality_reason?.length) {
      message.warning('负向操作原因不可以为空！');
      return false;
    } else if (formValue?.operation === 'removed' && !formValue?.low_quality_reason?.length) {
      message.warning('负向操作原因不可以为空！');
      return false;
    }
    const scoreObj = {
      pass: {
        score: this.getCount(formValue?.high_quality_reason ?? []),
        operation: 'pass',
      },
      low: {
        score: 2,
        operation: 'low',
      },
      deep: {
        score: 1,
        operation: 'low',
      },
      removed: {
        score: 0,
        operation: 'low',
      },
    };
    formValue.score = scoreObj[formValue.operation].score;
    formValue.operation = scoreObj[formValue.operation].operation;
    Modal.confirm({
      title: `提示 所打分数为：${formValue.score}分`,
      content: '您确定要这样处理该文章吗？',
      onOk() {
        return self.handleArticle(formValue);
      },
    });
  };

  getDefaultValue = (obj: any) => {
    const otherStr = '其他';
    // console.log('obj', obj);

    const initValue = {
      operation: '',
      reason: [],
      attribute: '',
      score: 3,
      low_quality_reason: [],
      high_quality_reason: [],
      otherV: '',
    };
    for (const key in initValue) {
      let element = obj[key];
      if (key === 'reason' || key === 'low_quality_reason') {
        element = element?.toString();
        if (element && typeof element === 'string') {
          const splitArr = element.split(',');
          if (splitArr.includes(otherStr)) {
            splitArr.pop();
            element = [...splitArr, '其他'];
          } else {
            element = splitArr;
          }
        }
      }
      initValue[key] = element;
    }

    if (initValue?.score === 2) {
      initValue.operation = 'low';
    } else if (initValue?.score === 1) {
      initValue.operation = 'deep';
    } else if (initValue?.score === 0) {
      initValue.operation = 'removed';
    } else {
      initValue.operation = 'pass';
    }
    initValue['otherV'] = obj['other_reason'];
    // console.log('initValue', initValue);
    return initValue;
  };

  render() {
    const { doc, index, isHis } = this.props;
    const { score, reason, action, otherReason, topReason, topOtherReason } = this.state;

    return (
      <div className="audit-doc-wrapper">
        <div className="doc-title">
          <span>{index + 1}.&nbsp;&nbsp;</span>
          <a href={`https://www.yidianzixun.com/article/${doc.doc_id}`} target="_blank">
            {doc.title}
          </a>
          {isHis ? (
            <span style={{ marginLeft: '20px' }}>
              <Tag color="#d452c4">评分</Tag>
              <Rate disabled value={doc?.score} />
            </span>
          ) : null}
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
          {isHis ? (
            <>
              <span>
                <strong>审核人: </strong>
                {doc.operator_email || '未知'}
              </span>
              <span>
                <strong>审核时间: </strong>
                {doc.reviewed_time}
              </span>
            </>
          ) : null}
          <span>
            <strong>账号领域: </strong>
            {doc.media_domain}
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
          <ReviewPanel
            key={doc.doc_id}
            defaultValue={this.getDefaultValue(doc)}
            ref={this.rpref}
            isHis={isHis || false}
          />
          <div>
            <div className="oper-btns-wrapper">
              {!isHis ? (
                <>
                  <Button type="primary" onClick={this.onPassArticle}>
                    确定
                  </Button>
                  <Button onClick={this.onResetArticle}>重置</Button>
                </>
              ) : (
                <Button type="primary" onClick={this.onPassArticle}>
                  重审
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
