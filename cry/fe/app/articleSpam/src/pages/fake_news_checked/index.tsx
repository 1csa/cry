import React, { FC, useState, useCallback } from 'react';
import { Card, Affix, Form, Spin, Button } from 'antd';
import { EnPagination, ContentSelect, ArticleSelect, TierSelect, EnDatePicker, HandleResult } from '@/components/Search';
import ENSelect from '@/components/Search/enSelect';
import { FAKE_NEWS_ORIGINAL, APP_ID_FAKE, PAGE_SIZE, FAKE_DOC_FILTER, FAKE_OPTION, SEARCH_TOP_NEWS } from '@/config/constant';
import ENInput from '@/components/Search/enInput';
import moment from 'moment';
import { useGetAuditDoc } from '@/hooks/useGetAuditDoc';
import { handleAuditDate } from '@/utils/util';
import DocWrapper from '@/components/Doc';
import { downLoadXlsx } from 'app-common/utils/util';


const FakeNewsChecked: FC = () => {
  let start = moment().subtract(3, "days");
  let end = moment();

  const [type, setType] = useState(''); // 内容类型
  const [cat, setCat] = useState('');
  const [tier, setTier] = useState('');
  const [origin, setOrigin] = useState('');
  const [docId, setDocId] = useState('');
  // const [date, setDate] = useState<any[]>([]);
  const [auditDate, setAuditDate] = useState<any[]>([start, end]);
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<string[]>([]);
  const [search, setSearch] = useState(false);
  const [author, setAuthor] = useState("");
  // 获取数据
  const {loading, count, docs} = useGetAuditDoc({
    docid: docId,
    // docid: "V_07txolLQ",
    appid: APP_ID_FAKE,
    category: cat,
    state: 1,
    source_tier: tier,
    offset: (page - 1) * PAGE_SIZE,
    operator_email: author,
    operation: result.join(),
    start: handleAuditDate(auditDate[0]),
    end: handleAuditDate(auditDate[1]),
    ctype: type,
    from: origin,
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
  // const handleDateChange = useCallback((date: any[]) => {
  //   setDate(date);
  // }, []);
  const handleAuditChange = useCallback((date: any[]) => {
    if(!date.length){
      setAuditDate([start, end]);
    }else{
      setAuditDate(date);
    }
  }, []);
  const handleResultChange = useCallback((result: string[]) => {
    setResult(result);
  }, []);
  const handleAuthorChange = useCallback((author: string) => {
    setAuthor(author);
  }, []);
  const onSearch = () => {
    setPage(1);
    setSearch(!search);
  }
  const handlePageChange = (page: number) => {
    setPage(page);
  }

  const onExportData = () => {
    downLoadXlsx({
      filename: '虚假新闻',
      url: SEARCH_TOP_NEWS,
      params: {
        appid: APP_ID_FAKE,
        offset: 0,
        count: 10000,
        operation_state: 1,
        sort: 'createAt'
      }
    });
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
              <ENInput label="doc_id" onChange={handleDocIDChange}/>
              {/* <EnDatePicker
                label="发布时间"
                onChange={handleDateChange}
              /> */}
              <HandleResult
                mode="tags"
                filter={['low', 'hide', 'notserve']}
                onChange={handleResultChange}
              />
              <EnDatePicker
                label="审核时间"
                defaultValue={auditDate as any}
                onChange={handleAuditChange}
              />
              <ENInput label="审核人员账号" onChange={handleAuthorChange}/>
              <Form.Item>
                <Button type="primary" onClick={onSearch}>搜索</Button>&nbsp;&nbsp;
                <Button type="danger" onClick={onExportData}>导出数据</Button>
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
            {docs.map((item: any, index: number) => (
              <DocWrapper
                key={item.doc_id}
                index={index}
                doc={item}
                filter={FAKE_DOC_FILTER}
                handle_filter={['low', 'hide', 'notserve']}
                neg_reason_option={[]}
                top_reason_option={[]}
                score_title="虚假新闻:"
                score_option={FAKE_OPTION}
                showComment={true}
                showSimilar={true}
                showOp={true}
                showSearch={true}
                showCancel={false}
                okText="重审"
                hintText="你确定要重审这篇文章吗?"
                appid={APP_ID_FAKE}
              />
            ))}
          </Spin>
        </div>
      </Card>
    </div>
  );
}

export default FakeNewsChecked;
