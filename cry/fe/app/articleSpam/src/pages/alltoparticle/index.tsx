import React, { FC, useState, useCallback } from 'react';
import { Card, Affix, Form, Button, Spin } from 'antd';
import { PAGE_SIZE, APP_ID_ALL } from '@/config/constant';
import Doc from '../../components/Doc/index';
import {
  ArticleSelect,
  TierSelect,
  ContentSelect,
  EnInput,
  SortSelect,
  EnPagination,
} from '@/components/Search';
import { useGetAuditDoc } from '@/hooks/useGetAuditDoc';
import TopDoc from '@/components/TopDoc/index';

const filterSort = ['cntClick'];

const AllTopArticle: FC = props => {
  const [cat, setCat] = useState('all');
  const [tier, setTier] = useState('all');
  const [ctype, setCtype] = useState('all');
  const [media_domain, setMedia_domain] = useState('');
  const [sort, setSort] = useState('all');
  const [docid, setDocId] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [search, setSearch] = useState(false);
  const { loading, count, docs, setCount, setDocs } = useGetAuditDoc(
    {
      docid,
      state: '0',
      category: cat === 'all' ? '' : cat,
      source_tier: tier === 'all' ? '' : tier,
      operator_email: '',
      start: '',
      end: '',
      offset: (pageIndex - 1) * PAGE_SIZE,
      sort: sort === 'all' ? '' : sort,
      ctype: ctype === 'all' ? '' : ctype,
      appid: APP_ID_ALL,
      media_domain,
    },
    [search, sort, pageIndex],
  );

  const onSearch = () => {
    setPageIndex(1);
    setSearch(!search);
  };
  const handleRemoveDoc = (docid: string) => {
    setCount(count => count - 1);
    setDocs(docs => docs.filter(item => item['doc_id'] !== docid));
  };
  const onChangePage = (pageIndex: number) => {
    setPageIndex(pageIndex);
  };
  const handleCatChange = useCallback((cat: string) => {
    setCat(cat);
  }, []);
  const handleTierChange = useCallback((tier: string) => {
    setTier(tier);
  }, []);
  const handleTypeChange = useCallback((ctype: string) => {
    setCtype(ctype);
  }, []);
  const handleMediaChange = useCallback((media_domain: string) => {
    setMedia_domain(media_domain);
  }, []);
  const handleDocIdChange = useCallback((docid: string) => {
    setDocId(docid);
  }, []);
  const handleSortChange = useCallback((sort: string) => {
    setPageIndex(1);
    setSort(sort);
  }, []);
  return (
    <div className="main-content">
      <Card bordered={false} style={{ minHeight: 380 }}>
        <Affix offsetTop={0}>
          <div className="affix-header ">
            <Form layout="inline">
              <ArticleSelect onChange={handleCatChange} />
              <TierSelect onChange={handleTierChange} />
              <ContentSelect onChange={handleTypeChange} />
              <EnInput label="账号领域" onChange={handleMediaChange} />
              <EnInput label="doc_id" onChange={handleDocIdChange} />
              <SortSelect onChange={handleSortChange} filter={filterSort} />
              <Form.Item>
                <Button type="primary" onClick={onSearch}>
                  搜索
                </Button>
              </Form.Item>
            </Form>
            <EnPagination current={pageIndex} total={count} onChange={onChangePage} />
          </div>
        </Affix>
        <div>
          <Spin spinning={loading}>
            <div className="doc-list">
              {docs.map((item: any, index: number) => (
                // <Doc
                //   key={item.doc_id}
                //   index={index}
                //   doc={item}
                //   handleRemoveDoc={handleRemoveDoc}
                //   handle_filter={['hide', 'notserve', 'notrecommend', 'remove']}
                // />
                <TopDoc
                  key={item.doc_id}
                  index={index}
                  doc={item}
                  handleRemoveDoc={handleRemoveDoc}
                  appid="all"
                ></TopDoc>
              ))}
            </div>
          </Spin>
        </div>
      </Card>
    </div>
  );
};

export default AllTopArticle;
