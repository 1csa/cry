import React, { FC, useState, useCallback, useMemo} from 'react';
import { Button, message, Modal, Spin } from 'antd';
import { getCookie } from '@/utils/cookie';
import Axios, { Method, AxiosProxyConfig, AxiosRequestConfig } from 'axios';
import Score from './score';
// import Reason from './reason';
import EnCheckbox from 'app-common/components/encheckbox';
import { KeyPair, UPDATE_TOP_NEWS, UPDATE_CPP_NEWS, CPP_SCOPE, CPP_API_FROM, CPP_API_KEY, DELETE_CPP_NEWS, RECOVER_CPP_NEWS } from '@/config/constant';
interface IAuditProps {
  /**区分端 */
  appid?: string;
  doc: any;
  okText?: string;
  showCancel?: boolean;
  cancelText?: string;
  hintText?: string; // 审核框提示
  handleRemoveDoc?: (param: string) => void;
  score_title?: any;
  score_option?: Array<KeyPair<number|string, string>>;
  handle_filter?: string[];
  handle_option?: Array<KeyPair<string, string>>;
  top_reason_option?: Array<string | KeyPair<string, string>>;
  neg_reason_option?: Array<string | KeyPair<string, string>>;
}
// 特殊处理一下虚假新闻:
const handleFakeNews = (doc: any, score_title: string) => {
  if(score_title === '虚假新闻:'){
    return doc.reason;
  }
  return doc.score;
}
const AuditDoc: FC<IAuditProps> = (props) => {
  const {
    appid,
    doc,
    okText,
    showCancel,
    cancelText,
    handleRemoveDoc,
    hintText,
    score_title,
    score_option,
    handle_filter,
    handle_option,
    top_reason_option,
    neg_reason_option
  } = props;
  const [score, setScore] = useState(handleFakeNews(doc, score_title) || -1);
  const [action,setAction] = useState(doc.operation || '');
  const [topReason, setTopReason] = useState<string>(doc.high_quality_reason);
  const [reason,setReason] = useState<string>(doc.reason);
  const [loading, setLoading] = useState(false);
  const updateCpp = async (params: any) => {
    // operation的值为空或pass不需要更新
    if(!params.operation){
      return {data: true};
    }
    let url = UPDATE_CPP_NEWS;
    let method: Method = "post";
    let scope = CPP_SCOPE[params.operation];
    let param = {
      docid: params.docid,
      from: CPP_API_FROM,
      key: CPP_API_KEY,
    };
    if(params.operation === "remove"){ //
      url = DELETE_CPP_NEWS;
      method = "get";
    }else if(doc.operation === 'remove'){ // 恢复文章
      await Axios({
        url: RECOVER_CPP_NEWS,
        method: "get",
        params:  param
      });
    }
    let axiosParams: AxiosRequestConfig = {
      url,
      method,
      params: param,
      data: {
        scope,
        shenbian_high_quality: false
      }
    }
    return await Axios(axiosParams);
  }
  const updateArticle = async (params: any) => {
    return await Axios.get(UPDATE_TOP_NEWS, {
      params
    });
  }
  const onlyUpdateArticle = async (params: any) => {
    const {data} = await updateArticle(params);
    if(data.status === 'success'){
      doc.operation = params.operation;
      message.success('操作成功');
      handleRemoveDoc && handleRemoveDoc(doc['doc_id']);
    }else {
      message.error("保存失败, 请重试!");
    }
  }
  const handleArticle = async () => {
    setLoading(true);
    const params = {
      docid: doc.doc_id,
      score,
      operation: action,
      reason: reason,
      operator_email: getCookie('username'),
      appid,
      high_quality_reason: score !== 3? '' : topReason,
    };
    // 单独处理是否 为虚假
    if(score_title === '虚假新闻:'){
      params.reason = score == -1? '': score;
      params.score = -1;
      // delete params.score;
    }
    // action doc.operation 相等  action不存在 只更新思文api
    if(!handleRemoveDoc && (!action || action === doc.operation)){ // 已审核 列表 重审操作
      await onlyUpdateArticle(params); // 只更新 article 不更新cpp
    } else {
      const result = await updateCpp(params);
      if(result.data === true){
        await onlyUpdateArticle(params)
      }else{
        message.error("CPP 保存失败, 请重试");
      }
    }
    setLoading(false);
  }
  const onPassArticle = () => {
    if(score === -1 && action.length ===0){
      return message.error(`评分和操作为必填项`);
    }
    if(score === -1){ // 兼容虚假新闻
      return message.error(`评分或虚假新闻为必填项`);
    }
    Modal.confirm({
      title: '提示',
      content: hintText,
      onOk(){
        handleArticle();
      }
    });
  }
  const scoreProperty = useMemo(()=>({
    title: score_title,
    options: score_option,
    value: score,
  }), [score])
  const scoreCallback = useCallback((e: any) => setScore(e.target.value),[]);
  const passProperty = useMemo(()=>({
    title: "操作:",
    options: handle_option,
    value: action,
    filter: handle_filter
  }), [action])
  const passCallback = useCallback((e: any) => setAction(e.target.value),[]);
  const topProperty = useMemo(()=>{
    return {
      title: "优质原因:",
      option: top_reason_option as any,
      value: topReason
    }
  },[topReason]);
  const topCallback = useCallback((reason) => setTopReason(reason), []);
  const negProperty = useMemo(()=>({
    title:"负向操作原因:",
    option: neg_reason_option as any,
    value: reason
  }), [reason])
  const reasonCallback = useCallback((reason) => setReason(reason), []);

  return (
    <div className="doc-oper-wrapper">
      <Spin spinning={loading}>
        <Score
          {...scoreProperty}
          onChange={scoreCallback}
        />
        <Score
          {...passProperty}
          onChange={passCallback}
        />
        <EnCheckbox
          {...topProperty}
          onChange={topCallback}
        />
        <EnCheckbox
          {...negProperty}
          onChange={reasonCallback}
        />
        <div className="oper-btns-wrapper">
          <Button type="primary" onClick={onPassArticle} size="small">{okText}</Button>
          {showCancel?<Button size="small">{cancelText}</Button> : ''}
        </div>
      </Spin>
    </div>
  );
}

// appid 区分全端(all)、主端(yidian)、high
AuditDoc.defaultProps = {
  appid: 'all',
  okText: '确定',
  showCancel: true,
  cancelText: '重置',
  score_title: '评分:',
  hintText: '您确定要这样处理该文章吗？'
}

export default AuditDoc;
