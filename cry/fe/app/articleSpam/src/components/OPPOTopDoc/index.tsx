import React from 'react';
import { Button, Tag, Radio, Input, Checkbox, Modal, message } from 'antd';
import axios from 'axios';
import appConfig from '@/config/app.config';
import {OPP_NEGATIVE_REASON}from '@/config/constant';
import { getCookie } from '@/utils/cookie';

import './index.less';

interface AuditDocProps {
  index: number;
  doc: any;
  handleRemoveDoc: (id:string) => void;
}

interface IAuditDocState {
  score: number;
  reason: Array<any>;
  otherReason: string;
}

export default class AuditDoc extends React.PureComponent<AuditDocProps, IAuditDocState> {

    constructor(props: AuditDocProps) {
        super(props);
        this.state = {
            score: -1,
            reason: [],
            otherReason: ''
        };
    }
    onChangeArticleScore = (e:any) => {
        this.setState({
            score: e.target.value
        });
    }
    onChangeArticleReason = (e:any) => {
        this.setState({
            reason: e
        });
    }
    onResetArticle = (e:any) => {
        this.setState({
            score: -1,
            reason: [],
        });
    }
    onOtherReasonChange = (e:any) => {
        this.setState({
            otherReason: e.target.value
        })
    }
    async handleArticle() {
        const { doc } = this.props;
        const { score, reason, otherReason} = this.state;
        if (reason.includes('其他')) {
            let num = reason.indexOf('其他')
            reason[num] = reason[num] + ':' + otherReason
        }
        const params = {
            docid: doc.doc_id,
            score: score,
            operation: '',
            reason: reason.join(','),
            operator_email: getCookie('username'),
            appid: 'oppobrowser',
            },
            key = 'e7d86aef18345a5a00041e4bb506f99a',
            from = 'webui@article-spam',
            url = `/api/proxy/${appConfig.API_k8s_HOST}/prv/document/update`,
            data = {
              ob_quality_score: params.score
            }
        axios({
            method: 'post',
            url: url,
            data: data,
            params: {
                docid: params.docid,
                from: from,
                key: key,
            },
        }).then(result => {
            // console.log(result.data)
            if (result.data === true) {
                axios.get(`/api/proxy/${appConfig.API_TOOLS_HOST}/news-review/update-top-news`, {
                    params: params
                })
                .then(res => {
                    if(res.data.status === 'success') {
                        message.success('操作成功');
                        this.setState({
                            score: -1,
                            reason: [],
                            otherReason: ''
                        });
                        this.props.handleRemoveDoc(doc.doc_id)
                    }
                })
                .catch(function (error) {
                    message.error('保存失败，请重试');
                    console.log(error);
                });
            }
        }).catch(function (error) {
            message.error('cpp操作失败，请重试');
            console.log(error);
        })

    }
    onPassArticle = () => {
        const self = this;
        const { score} = this.state;
        if (score === -1) {
            return message.error('评分为必填项');
        }
        // Modal.confirm({
        //     title: '提示',
        //     content: '您确定要这样处理该文章吗？',
        //     onOk() {
        //         return self.handleArticle();
        //     }
        // });
        self.handleArticle();
    }
    render() {
        const { doc, index } = this.props;
        const { score, reason, otherReason } = this.state;

        return (
            <div className="audit-doc-wrapper">
                <div className="doc-title">
                    <span>{index+1}.&nbsp;&nbsp;</span>
                    <a href={`https://www.yidianzixun.com/article/${doc.doc_id}?appid=heytap`} target="_blank">{doc.title}</a>
                </div>
                <div className="doc-info">
                    {doc.media_id && <Tag color="#ffa500">自媒体</Tag>}
                    <span><strong>docid: </strong>{doc.doc_id}</span>
                    <span><strong>曝光量: </strong>{doc.cntView}</span>
                    <span><strong>入审核池时间: </strong>{doc.insert_time}</span>
                    <span><strong>大类: </strong>{doc.category}</span>
                    <span><strong>来源: </strong>{doc.source}</span>
                    <span><strong>账号id: </strong>{doc.media_id || ''}</span>
                    <span><strong>源评级: </strong>{doc.source_tier}</span>
                    <span><strong>发布日期: </strong>{doc.date}</span>
                    <span><strong>低俗值: </strong>{doc.sc_dirty}</span>
                    <span><strong>标题党属性: </strong>{doc.bait}</span>
                </div>
                <div className="doc-oper-wrapper">
                    <div>
                        <h4 className="opt-title">评分:</h4>
                        <div className="opt-wrapper">
                            <Radio.Group onChange={this.onChangeArticleScore} value={score}>
                                <Radio value={2}>2</Radio>
                                <Radio value={1}>1</Radio>
                                <Radio value={0}>0</Radio>
                            </Radio.Group>
                        </div>
                    </div>
                    <h4 style={{marginTop: '10px'}}>负向操作原因:</h4>
                    <div>
                        <Checkbox.Group onChange={this.onChangeArticleReason} value={reason}>
                            <div style={{marginBottom: '5px', display: "flex", flexWrap: 'wrap'}}>
                              {OPP_NEGATIVE_REASON.map((item:string) => (
                                <Checkbox value={item} key={item} style={{margin: 0,marginRight: '8px'}}>{item}</Checkbox>
                              ))}
                            </div>
                        </Checkbox.Group>
                        <div className="oper-btns-wrapper-oppo">
                            <Button type="primary" onClick={this.onPassArticle}>确定</Button>
                            <Button onClick={this.onResetArticle}>重置</Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}
