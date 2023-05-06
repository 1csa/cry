import React, { FC, useState } from 'react';
import { Button, Tag, Modal, message } from 'antd';
import Axios from 'axios';
import { DELETE_COMMENT } from '@/config/constant';
import { getCookie } from '@/utils/cookie';

// 审核记录
interface comment_item{
  id: string,
  comment: string,
}
interface ICommentProps{
  dataSource: comment_item[]
}
const Comment: FC<ICommentProps> = (props) => {
  const {
    dataSource
  } = props;
  const [data, setData] = useState(dataSource);
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '提示',
      content: '你确定要删除该负反馈评论',
      onOk(){
        Axios.get(DELETE_COMMENT, {
          params: {
            id,
            is_editor: true,
            reason: 'articleSpam删除',
          },
          headers: {
            "Cookie": getCookie('YD_PANDORA_UID')
          }
        }).then(res=>{
          message.info(`删除成功!`);
          setData(pre => pre.filter(item => item.id !== id));
        });
      }
    });
  }
  if(!data || !data.length){
    return null;
  }
  return (
    <div className="comment-container">
      {data.map((item, index) => (
        <div key={item.id} className="comment-item">
          <div>{index + 1}. <Tag color="#87d068">虚假</Tag></div>
          <div className="comment-content">{item.comment}</div>
          <Button type="primary" size="small" onClick={() => handleDelete(item.id)}>删除</Button>
        </div>
      ))}
    </div>
  );
}

export default Comment;
