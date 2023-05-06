import React, { FC, useState, useCallback, useRef } from 'react';
import { Card, Affix, Form, Spin, Button, Modal, Input, message } from 'antd';
import { EnPagination, ContentSelect, ArticleSelect, TierSelect, EnDatePicker, EnInput } from '@/components/Search';
import ENSelect from '@/components/Search/enSelect';
import { FAKE_NEWS_ORIGINAL, APP_ID_FAKE, PAGE_SIZE, FAKE_OPTION, FAKE_DOC_FILTER,ADD_FAKE_NEWS } from '@/config/constant';
import { useGetAuditDoc } from '@/hooks/useGetAuditDoc';
// import { handleAuditDate } from '@/utils/util';
import moment from 'moment';
import DocWrapper from '@/components/Doc';
import Axios from 'axios';

const FakeNews: FC = () => {
  let start = moment().subtract(3, "days");
  let end = moment();
  const [type, setType] = useState(''); // 内容类型
  const [cat, setCat] = useState('');
  const [tier, setTier] = useState('');
  const [origin, setOrigin] = useState('');
  const [docId, setDocId] = useState('');
  // const [date, setDate] = useState<any[]>([start, end]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const fakeNewsRef = useRef<any>();
  const [addLoading, setAddLoading] = useState(false);
  const {loading, count, docs, setCount, setDocs} = useGetAuditDoc({
    docid: docId,
    // docid: "V_07txolLQ",
    appid: APP_ID_FAKE,
    category: cat,
    source_tier: tier,
    // date_start: handleAuditDate(date[0]),
    // date_end: handleAuditDate(date[1]),
    offset: (page - 1) * PAGE_SIZE,
    ctype: type,
    from: origin,
    sort: 'createTime'
  }, [page, search]);
  const handleTypeChange = useCallback((type: string) => {
    setType(type);
  }, []);
  const handleCatChange = useCallback((cat: string) => {
    setCat(cat);
  }, []);
  const handleTierChange = useCallback((tier: string) => {
    setTier(tier);
  }, []);
  const handleOriginChange = useCallback((origin: string) => {
    setOrigin(origin);
  }, []);
  const handleDocIDChange = useCallback((docId: string) => {
    setDocId(docId);
  }, []);
  const onSearch = () => {
    setPage(1);
    setSearch(!search);
  }
  const handleRemoveDoc = (docid: string) => {
    setCount((count) => count -1)
    setDocs((docs => docs.filter(item => item['doc_id'] !== docid)));
  }
  const handlePageChange = (page: number) => {
    setPage(page);
  }
  const handleImportFakeNews = async () => {
    if(fakeNewsRef && fakeNewsRef.current){
      setAddLoading(true);
      // let value = fakeNewsRef.current.textAreaRef.value;
      let value = fakeNewsRef.current.state.value;
      if(!!value){
        value = value.replace(/，| /g, ",").split(",").filter((item: any) => !!item);
        const {data} = await Axios.get(ADD_FAKE_NEWS,{params: {docids: value.join()}});
        if(data.code === 0 || data.status === "success"){
          message.success(`添加成功`);
          setShowModal(false);
          setSearch(!search);
        }else{
          const reason = data.reason;
          message.error(`操作失败,${reason?"原因:"+reason: ''}`);
        }
      }else{
        message.info(`信息不能为空`);
      }
      setAddLoading(false);
    }
  }
  return (
    <div className="main-content">
      <Card bordered={false} style={{minHeight: 380}}>
        <Affix offsetTop={0}>
          <div className="affix-header">
            <Form layout="inline">
              <ContentSelect onChange={handleTypeChange}/>
              <ArticleSelect onChange={handleCatChange}/>
              <TierSelect onChange={handleTierChange}/>
              <ENSelect
                label="来源"
                option={FAKE_NEWS_ORIGINAL}
                defaultValue={['all']}
                onChange={handleOriginChange}
              />
              <EnInput label="doc_id" onChange={handleDocIDChange}/>
              {/* <EnDatePicker
                label="发布时间"
                onChange={handleDateChange}
              /> */}
              <Form.Item>
                <Button type="primary" onClick={onSearch}>搜索</Button>&nbsp;&nbsp;
                <Button type="danger" onClick={() => setShowModal(true)}>导入虚假文章</Button>
              </Form.Item>
            </Form>
            <EnPagination
              current={page}
              total={count}
              onChange={handlePageChange}
            />
          </div>
        </Affix>
        <div>
          <Spin spinning={loading}>
            <div className="doc-list">
              {docs.map((item: any, index: number) => (
                <DocWrapper
                  key={item.doc_id}
                  index={index}
                  doc={item}
                  filter={FAKE_DOC_FILTER}
                  handleRemoveDoc={handleRemoveDoc}
                  handle_filter={['low', 'hide', 'notserve']}
                  neg_reason_option={[]}
                  top_reason_option={[]}
                  score_title="虚假新闻:"
                  score_option={FAKE_OPTION}
                  showComment= {true}
                  showSimilar= {true}
                  showSearch = {true}
                  appid={APP_ID_FAKE}
                />
              ))}
            </div>
          </Spin>
        </div>
      </Card>
      <Modal
        title="导入虚假文章"
        onCancel={() => setShowModal(false)}
        onOk={() => handleImportFakeNews()}
        visible={showModal}
      >
        <Spin spinning={addLoading}>
          <Input.TextArea
            placeholder="请输入docid,逗号分隔"
            rows={4}
            ref={fakeNewsRef}
          />
        </Spin>
      </Modal>
    </div>
  );
}

export default FakeNews;
