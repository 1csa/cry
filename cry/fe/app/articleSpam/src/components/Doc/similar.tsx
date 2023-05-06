import React, { FC, useState } from 'react';
import { Icon, Spin, Button, Modal, message } from 'antd';
import "./index.less";
import { useGetSimilar } from '@/hooks/useGetSimilar';
import Doc from './doc';
import Score from './score';
import { FAKE_OPTION, HANDLE_OPTIONS, APP_ID_FAKE } from '@/config/constant';
import { useUpdateSimilar } from '@/hooks/useUpdateSimilar';
import { getCookie } from '@/utils/cookie';
// 相似文章

interface ISimilarProps{
  docid: string,
  doc?: any,
  count: number,
  filter?: string[];
}
const Similar: FC<ISimilarProps> = ({docid, count, filter, doc}) => {
  const [open, setOpen] = useState(false);
  const [ids, setIds] = useState<string[]>([]);
  const [show, setShow] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [reason, setReason] = useState('');
  const [operation, setOperation] = useState('');
  const [auditType, setAuditType] = useState(''); // 审批类型
  const [batch, setBatch] = useState(false); // 批量审核
  const [uploadLoading, updateDocs] = useUpdateSimilar({
    docids: auditType === 'one'? currentId: ids.join(),
    operation: auditType === 'one'? operation: (auditType === 'pass'? 'pass': 'remove'),
    reason: auditType === 'one'? reason: (auditType === 'pass'? '否': '是'),
    operator_email: getCookie('username'),
    appid: APP_ID_FAKE,
    main_docid: docid
  }, [auditType, batch]);
  const {loading, docs} = useGetSimilar({docid}, [
    docid,
    open,
    updateDocs, // 成功后需要更新doc列表
  ]);
  const handleOpenCallback = () => {
    setOpen(!open);
  }
  const handleClick = (docid: string) => {
    setShow(true);
    setCurrentId(docid);
  }
  const handleCheckChange = (docid: string, checked: boolean) => {
    if(checked){
      setIds(preIds => [...preIds, docid]);
    }else{
      setIds(preIds => preIds.filter(id => id !== docid));
    }
  }
  const handleReasonChange = (e: any) => {
    setReason(e.target.value);
  }
  const handleOperationChange = (e: any) => {
    setOperation(e.target.value);
  }
  const handleAudit = () => {
    if(!operation || !reason || !currentId){
      message.info(`请选择审核内容`);
    }
    setShow(false);
    setAuditType('one');
    setBatch(!batch);
  }
  const handleBatchPass = () => {
    setShow(false);
    setAuditType('pass');
    setBatch(!batch);
  }
  const handleBatchRemove = () => {
    setShow(false);
    setAuditType('remove');
    setBatch(!batch);
  }
  const renderContent = () => {
    return (
      <div className="similar-body" key="similar-article">
        <Spin spinning={loading || uploadLoading}>
          <div>
            <Button
              type="primary"
              size="small"
              disabled={!ids.length}
              onClick={handleBatchPass}
            >
              批量通过
            </Button>&nbsp;&nbsp;
            <Button
              type="danger"
              size="small"
              disabled={!ids.length}
              onClick={handleBatchRemove}
            >
              批量判断虚假且删除
            </Button>
          </div>
          {
            docs.map((doc, index)=>(
              <Doc
                doc={doc}
                index={index}
                filter={filter}
                key = {doc.doc_id}
                showChecked={true}
                onChange={handleCheckChange}
                showHandle={true}
                onClick={handleClick}
                showOp={true}
              />
            ))
          }
        </Spin>
      </div>
    );
  }
  return (
    <div className="similar-box">
      <div className="similar-header">
        <span><strong>相似文章 {count} 篇</strong></span>
        {
          !!count && <span onClick={handleOpenCallback}>
            <strong>
              <Icon type={open?'up' : 'down'}/>
              {open? ' 收起': ' 展开'}
            </strong>
          </span>
        }
      </div>
      {open && !!count && renderContent()}
      <Modal
        title="操作"
        visible={show}
        onCancel={() => setShow(false)}
        onOk={handleAudit}
        okText="确定"
      >
        <Score
          title="你觉得文章是否虚假?"
          options={FAKE_OPTION}
          onChange={handleReasonChange}
          value={reason}
        />
        <Score
          title="操作"
          options={HANDLE_OPTIONS}
          filter={['low', 'hide', 'notserve']}
          value={operation}
          onChange={handleOperationChange}
        />
      </Modal>
    </div>
  );
}

Similar.defaultProps = {
  count: 0
}

export default Similar;
