import React, { FC, useState, useCallback } from 'react';
import { Affix, Form, Card, Button, Spin } from 'antd';
import {
  ArticleSelect,
  ContentSelect,
  TierSelect,
  SortSelect,
  EnInput,
  EnPagination,
} from '@/components/Search';
import { useGetAuditDoc } from '@/hooks/useGetAuditDoc';
import {
  PAGE_SIZE,
  SCORE_OPTIONS,
  HIGH_VIEW_NEG_REASON,
  APP_ID_HIGH_VIEW,
} from '@/config/constant';
import Doc from '@/components/Doc';
import TopDoc from '@/components/TopDoc/index';
const filterTier = ['1', '2'];

const FILTER_SCORE = SCORE_OPTIONS.filter(item => ![3, 0].includes(item.key));

const High: FC = () => {
  const [cat, setCat] = useState('');
  const [ctype, setCtype] = useState('');
  const [tier, setTier] = useState('');
  const [sort, setSort] = useState('');
  const [docid, setDocid] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [search, setSearch] = useState(false);
  const { loading, count, docs, setCount, setDocs } = useGetAuditDoc(
    {
      docid,
      appid: APP_ID_HIGH_VIEW,
      category: cat,
      source_tier: tier,
      offset: (pageIndex - 1) * PAGE_SIZE,
      sort,
      ctype,
    },
    [pageIndex, search, sort],
  );
  const handleCatChange = useCallback((cat: string) => {
    setCat(cat);
  }, []);
  const handleTypeChange = useCallback((ctype: string) => {
    setCtype(ctype);
  }, []);
  const handleTierChange = useCallback((tier: string) => {
    setTier(tier);
  }, []);
  const handleSortChange = useCallback((sort: string) => {
    setPageIndex(1);
    setSort(sort);
  }, []);
  const handleDocIdChange = useCallback((docid: string) => {
    setDocid(docid);
  }, []);
  const handlePageChange = (pageIndex: number) => {
    setPageIndex(pageIndex);
  };
  const onSearch = () => {
    setPageIndex(1);
    setSearch(!search);
  };
  const handleRemoveDoc = (docid: string) => {
    setCount(count => count - 1);
    setDocs(docs => docs.filter(item => item['doc_id'] !== docid));
  };
  return (
    <div className="main-content">
      <Card bordered={false} style={{ minHeight: 380 }}>
        <Affix offsetTop={0}>
          <div className="affix-header">
            <Form layout="inline">
              <ArticleSelect onChange={handleCatChange} />
              <TierSelect onChange={handleTierChange} filter={filterTier} />
              <ContentSelect onChange={handleTypeChange} />
              <SortSelect onChange={handleSortChange} />
              <EnInput label="doc_id" onChange={handleDocIdChange} />
              <Form.Item>
                <Button type="primary" onClick={onSearch}>
                  搜索
                </Button>
              </Form.Item>
            </Form>
            <EnPagination current={pageIndex} total={count as number} onChange={handlePageChange} />
          </div>
        </Affix>
        <div>
          <Spin spinning={loading}>
            <div className="doc-list">
              {docs.map((item, index: number) => (
                // <Doc
                //   key={item.doc_id}
                //   index={index}
                //   doc={item}
                //   appid={APP_ID_HIGH_VIEW}
                //   handle_option={[]}
                //   top_reason_option = {[]}
                //   score_option={FILTER_SCORE}
                //   neg_reason_option={HIGH_VIEW_NEG_REASON}
                //   handleRemoveDoc={handleRemoveDoc}
                // />
                <TopDoc
                  key={item.doc_id}
                  index={index}
                  doc={item}
                  handleRemoveDoc={handleRemoveDoc}
                  appid="high_view"
                ></TopDoc>
              ))}
            </div>
          </Spin>
        </div>
      </Card>
    </div>
  );
};

export default High;
