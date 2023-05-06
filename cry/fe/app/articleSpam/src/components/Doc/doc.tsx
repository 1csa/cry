import React, { FC, useCallback } from 'react';
import { Tag, Button, Checkbox } from 'antd';
import { DOC_DETAIL, ARTICLE_BASE_URL } from '@/config/constant';
import Op_History_List from './op_history';
import Comment from './comment';

interface DocProps {
  doc: any;
  index: number;
  filter?: string[]; // 过滤 不需要显示的信息
  showSearch?: boolean; // 是否需要百度搜索
  showChecked?: boolean; // 显示checkbox款
  showHandle?: boolean; // 显示操作按钮
  showOp?: boolean; // 显示审核列表
  showComment?: boolean;
  onChange?: (docid: string, checked: boolean) => void, // 点击checkbox
  onClick?: (docid: string) => void, // 点击操作
}

const Doc: FC<DocProps> = (props: DocProps) => {
  const {
    doc,
    index,
    filter,
    showSearch,
    showChecked,
    showHandle,
    onClick,
    showOp,
    showComment,
    onChange
  } = props;
  const renderDocInfo = () => {
    var tempDoc = DOC_DETAIL;
    if(filter && filter.length){
      tempDoc = DOC_DETAIL.filter(item => !filter.includes(item.key))
    }
    return tempDoc.map((doc_detail, index)=>{
      const {render, key, value} = doc_detail;
      const renderText = !!render? render(doc[key], doc) : doc[key];
      return (
        !renderText ? null :
        <div key={value}>
          <strong>{value}: </strong>
          <span>{renderText}</span>
        </div>
      );
    });
  }
  const handleCheckChange = useCallback((e) => {
    onChange && onChange(doc.doc_id, e.target.checked);
  }, []);
  const handleClickCallback= useCallback(()=>{
    onClick && onClick(doc.doc_id);
  }, []);
  const renderDocTitle = () => {
    return (
      <>
        {showChecked && <Checkbox onChange={handleCheckChange}/>}
        <span> {index + 1}.&nbsp;</span>
        {showSearch && <Button type="primary" href={`https://www.baidu.com/s?wd=${doc.title}`} target="_blank" size="small">百度一下</Button>}
        &nbsp;
        <a href={`${ARTICLE_BASE_URL}/${doc.doc_id}`} target="_blank">{doc.title}</a>&nbsp;&nbsp;
        {(!!doc.similar_remain && doc.operation_state === 1)? <Tag color="red">还有{doc.similar_remain}篇相似文章未审核</Tag>:''}
        {showHandle && <Button size="small" type="primary" onClick={handleClickCallback}>操作</Button>}
      </>
    );
  }
  return (
    <>
      <div className="doc-title">{renderDocTitle()}</div>
      <div className="doc-info">
        {doc.media_id && <Tag color="#ffa500">自媒体</Tag>}
        {renderDocInfo()}
      </div>
      {showOp && <Op_History_List data={doc.op_history}/>}
      {showComment && <Comment dataSource={doc.recall_comments}/>}
    </>
  );
}

Doc.defaultProps = {
  showSearch: false,
  showChecked: false,
  showHandle: false,
  showOp: false,
  showComment: false,
}
export default Doc;
