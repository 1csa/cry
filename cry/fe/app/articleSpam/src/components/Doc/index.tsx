import React, { FC } from 'react';
import { KeyPair, SCORE_OPTIONS, HANDLE_OPTIONS, TOP_REASON_OPTIONS, NEG_REASON_OPTIONS } from '@/config/constant';
import './index.less';
import Doc from './doc';
import AuditDoc from './audit';
import Similar from './similar';
interface IndexProps {
  doc: any;
  index: number;
  appid?: string;
  okText?: string;
  showCancel?: boolean;
  className?: string;
  hintText?: string;
  showSearch?: boolean;
  filter?: string[];
  showOp?: boolean; // 显示审核记录
  showComment?: boolean, // 显示评论列表
  showSimilar?: boolean,
  handleRemoveDoc?: (param: string) => void;
  score_option?: Array<KeyPair<number|string, string>>;
  handle_option?: Array<KeyPair<string, string>>;
  top_reason_option?: Array<string | KeyPair<string, string>>;
  neg_reason_option?: Array<string | KeyPair<string, string>>;
  [key: string]: any
}
const Index: FC<IndexProps> = (props) => {
  const {
    className,
    doc,
    index,
    showSearch,
    filter,
    showOp,
    showComment,
    showSimilar,
    ...restProp
  } = props;
  return (
    <div className={className}>
      <Doc
        doc={doc}
        index={index}
        showSearch={showSearch}
        filter={filter}
        showComment={showComment}
        showOp={showOp}
      />
      <AuditDoc doc={doc} {...restProp}/>
      {showSimilar && <Similar
        docid={doc.doc_id}
        doc={doc}
        count={doc.similar_docids.length}
        filter={filter}
      />}
    </div>
  );
}

Index.defaultProps = {
  className: "audit-doc-wrapper",
  score_option: SCORE_OPTIONS,
  handle_option: HANDLE_OPTIONS,
  top_reason_option: TOP_REASON_OPTIONS,
  neg_reason_option: NEG_REASON_OPTIONS,
  showOp: false, // 显示审核记录
  showComment: false, // 显示平铺
  showSimilar: false, // 相似文章
}

export default Index;
