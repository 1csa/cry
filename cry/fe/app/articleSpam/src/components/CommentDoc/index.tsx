import React from 'react';
import { Button, Tag, Radio, Modal } from 'antd';
import axios from 'axios';
import { saveLog } from '../../../../common/Logger.js';
import appConfig from '@/config/app.config';
import { getCookie } from '@/utils/cookie';

import './index.less';

interface ICommentDocProps {
    index: number,
    docid: string,
    comment: any,
    hasDelete: boolean,
    handleDeleteComment?: (id: string) => void
}

interface ICommentDocState {
    label: string,
    showLabel: boolean
}

export default class CommentDoc extends React.PureComponent<ICommentDocProps, ICommentDocState> {
    constructor(props: ICommentDocProps) {
        super(props);
        this.state = {
            label: '',
            showLabel: false
        };
    }
    onDeleteComment = () => {
        const { comment } = this.props;
        const self = this;
        Modal.confirm({
            title: '提示',
            content: '你确定要删除该负反馈评论',
            onOk() {
                return axios.get(`/api/proxy/http://m.yidian-inc.com/comment/interact/delete_comment`, {
                    params: {
                        id: comment.id
                    }
                }).then(res => {
                    if (res.data.status === 'success') {
                        self.props.handleDeleteComment && self.props.handleDeleteComment(comment.id);
                        saveLog({
                            log_source: { tag: 'articleSpam' },
                            action_method: 'comment_del',
                            target_data: { id: comment.id }
                        });
                    }
                });
            }
        })
    }
    onClickTag = () => {
        this.setState({
            showLabel: !this.state.showLabel ? true : false
        });
    }
    onChangeCommentLabel = (e: any) => {
        const { comment, docid } = this.props;
        axios.get(`/api/proxy/${appConfig.API_HOST}/service/comment/review`, {
            params: {
                action: 'commentsLabel',
                docid: docid,
                label: e.target.value || '',
                comment: comment.text,
                auditor: getCookie('username') || '' 
            }    
        }).then(res => {
            if(res.data.status === 'success') {
                this.setState({
                    label: e.target.value || ''
                });
                saveLog({
                    log_source: { tag: 'articleSpam' },
                    action_method: 'commentsLabel',
                    target_data: { id: comment.id, docid: docid, detail: JSON.stringify({
                        label: e.target.value || '',
                        comment: comment.text    
                    })}
                });    
            }
        });
    }
    render() {
        const { index, comment, hasDelete = false } = this.props;
        const { label, showLabel } = this.state;

        return (
            <div className="comment-box">
                <div>
                    <span>{index + 1}. </span>
                    <Tag color="orange" onClick={this.onClickTag}>{comment.label}</Tag>
                    <span>{comment.text}</span>
                    {hasDelete && <Button type="danger" size="small" onClick={this.onDeleteComment}>删除</Button>}
                </div>
                <div>
                    {
                        showLabel ? (<Radio.Group onChange={this.onChangeCommentLabel} value={label}>
                            <Radio value={'正常'}>正常</Radio>
                            <Radio value={'文不对题类'}>文不对题类</Radio>
                            <Radio value={'文章中信息有误'}>文章中信息有误</Radio>
                            <Radio value={'旧闻'}>旧闻</Radio>
                            <Radio value={'虚假信息'}>虚假信息</Radio>
                            <Radio value={'骂人'}>骂人</Radio>
                            <Radio value={'色情低俗类'}>色情低俗类</Radio>
                            <Radio value={'其他问题'}>其他问题</Radio>
                        </Radio.Group>) : null
                    }
                </div>
            </div>
        );
    }
}