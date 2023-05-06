import React, { useState } from 'react';
import { connect } from 'dva';
import {Dispatch} from '@/models/connect'
import { Modal, Row, Col, Input, Button, Checkbox, message } from 'antd';
import {isDocid, all} from '@/utils/dev_helper';
import DocItem from './DocItem';
const CheckboxGroup = Checkbox.Group;

interface ArticleModalProps {
  visible: boolean
  onCancel: (visible: boolean) => void
  id: string
  name: string
  dispatch: Dispatch
}

const ArticleModal: React.FC<ArticleModalProps> = ({visible, onCancel,dispatch, id, name}) => {
  const [docList, setDocList] = useState<DOC[]>([]);
  const [word, setWord] = useState<string>('');
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  // callbacks
  const handleSearchDocs = async () => {
    if(word){
      setSearchLoading(true);
      let response;
      if(isDocid(word)){
        response = await dispatch({type: 'doc/searchDocByDocids', payload: {docids: word}});
      }else{
        response = await dispatch({type: 'doc/searchDocByKeyword', payload: {keyword: word}});
      }
      const {status, reason, result} = response;
      if(status === 'failed'){
        message.info(`查询失败,请稍后重试! ${reason}`);
      } else {
        setDocList(result.map((item: any) => ({
          title: item.title,
          docid: item.docid,
          date: item.date
        })));
      }
      setSearchLoading(false);
    }
  }
  const handleAddContentByDocid = async () => {
    if(word){
      if(/^U\w+/.test(word.trim())) {
        message.error('文章还未过审核，无法添加');
        return;
      }
      setSearchLoading(true);
      await saveDocCallback(word);
      setSearchLoading(false);
    }
  }
  const onSaveDocToTopic = async () => {
    const docid = docList.filter((doc: DOC) => doc.checked).map((doc: DOC)=> doc.docid).join(",");
    if(docid){
      setSaveLoading(true);
      await saveDocCallback(docid);
      setSaveLoading(false);
    }
  }
  const saveDocCallback = async (docid: string) => {
    const {status} = await dispatch({
      type: 'doc/saveDocToTopic',
      payload: {
        params: {
          docid,
        },
        data: {
          talk_id: id,
          talk_name: name
        }
      }
    });
    if(status === 'success'){
      message.success('操作成功!');
    }else {
      message.error('操作失败, 请稍后重试!');
    }
    setTimeout(()=>{
      onCancel && onCancel(false);
    }, 1000);
    // console.log(response);
  };
  const onCheckAllChange = (e: any) => {
    const data = docList.map((item: any) => {
      item.checked = e.target.checked;
      return item;
    });
    setDocList([...data]);
  }
  const onCheckChange = (checked: boolean, index: number) => {
    docList[index].checked = checked;
    setDocList([...docList]);
  }
  const allChecked = (): boolean => {
    return all(docList, (doc: DOC) => doc.checked);
  }
  return (
    <>
      <Modal
        title = "添加文章"
        visible = {visible}
        onCancel = {() => onCancel(false)}
        onOk = {onSaveDocToTopic}
        width = {700}
        okText = "保存"
        cancelText = "取消"
        okButtonProps={{
          loading: saveLoading,
        }}
      >
        <div style={{maxHeight: '500px', overflowY: 'auto', paddingLeft: '3px'}}>
          <Row gutter={10}>
            <Col span={17}>
              <Input
                placeholder = "按docid和关键词搜索"
                value ={word}
                onChange ={(e) => setWord(e.target.value)}
                onPressEnter = {handleSearchDocs}
              />
            </Col>
            <Col span={3}>
              <Button type="primary" onClick={handleSearchDocs} loading={searchLoading}>搜索</Button>
            </Col>
            <Col span={4}>
              <Button type="primary" onClick={handleAddContentByDocid} loading={searchLoading}>一键添加</Button>
            </Col>
          </Row>
          {
            docList.length ?
            <div style={{margin: '20px 0px 30px'}}>
              <Row>
                <Checkbox
                  onChange={onCheckAllChange}
                  checked={allChecked()}
                >全选</Checkbox>
              </Row>
              <br/>
              {docList.map((doc: DOC, index: number) => (
                <DocItem
                  doc={doc}
                  index={index}
                  key={index}
                  onChange={(checked: boolean) => onCheckChange(checked, index)}
                />
              ))}
            </div> :
            <div style={{textAlign: 'center', margin: '30px 0px'}}>无内容,请搜索!</div>
          }
        </div>
      </Modal>
    </>
  );
};

export default connect(()=>({

}))(ArticleModal)
