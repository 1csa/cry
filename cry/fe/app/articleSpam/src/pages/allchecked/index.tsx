import React, { FC, useState, useCallback } from 'react';
import { Card, Affix, Form, Button, Spin, DatePicker } from 'antd';
import { SEARCH_TOP_NEWS, PAGE_SIZE, APP_ID_ALL } from '@/config/constant';
import Doc from '../../components/Doc/index';
import moment from 'moment';
import {
  ArticleSelect,
  TierSelect,
  EnInput,
  HandleResult,
  HandleScore,
  EnPagination,
} from '@/components/Search';
import { handleAuditDate } from '@/utils/util';
import { downLoadXlsx } from 'app-common/utils/util';
import { useGetAuditDoc } from '@/hooks/useGetAuditDoc';
import ENDatePicker from '@/components/Search/enDatePicker';
import TopDoc from '@/components/TopDoc';

const handleResult: string[] = ['hide', 'notserve', 'notrecommend', 'remove'];
const AllChecked: FC = () => {
  let start = moment().subtract(3, 'days');
  let end = moment();

  const [cat, setCat] = useState('all');
  const [flag, setFlag] = useState<string[]>([]);
  const [score, setScore] = useState(['all']);
  const [tier, setTier] = useState('all');
  const [author, setAuthor] = useState('');
  const [auditDate, setAuditDate] = useState<Array<any>>([start, end]);
  const [media_domain, setMedia_domain] = useState('');
  const [docid, setDocId] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [search, setSearch] = useState(false);
  const { loading, count, docs } = useGetAuditDoc(
    {
      docid,
      state: '1',
      category: cat === 'all' ? '' : cat,
      operations: flag.includes('all') ? '' : flag.toString(),
      scores: score.includes('all') ? '' : score.toString(),
      source_tier: tier === 'all' ? '' : tier,
      operator_email: author,
      start: handleAuditDate(auditDate[0]),
      end: handleAuditDate(auditDate[1]),
      offset: (pageIndex - 1) * PAGE_SIZE,
      sort: 'createAt',
      appid: APP_ID_ALL,
      media_domain,
    },
    [pageIndex, search],
  );

  const onSearch = () => {
    setPageIndex(1);
    setSearch(!search);
  };
  const onExport = () => {
    downLoadXlsx({
      filename: '全端内容召回',
      url: SEARCH_TOP_NEWS,
      params: {
        appid: APP_ID_ALL,
        offset: 0,
        count: 20000,
        operation_state: 1,
        sort: 'createAt',
        start: handleAuditDate(auditDate[0]),
        end: handleAuditDate(auditDate[1]),
      },
    });
  };

  const onAuditDateChange = (date: any, dateStrings: string[]) => {
    setAuditDate(date);
  };
  const onChangePage = (pageIndex: number) => {
    setPageIndex(pageIndex);
    window.scrollTo(0, 0);
  };
  const handleCatChange = useCallback((cat: string) => {
    setCat(cat);
  }, []);
  const handleResultChange = useCallback((flag: string[]) => {
    console.log(flag);
    setFlag(flag);
  }, []);
  const handleScoreChange = useCallback((score: string[]) => {
    setScore(score);
  }, []);
  const handleTierChange = useCallback((tier: string) => {
    setTier(tier);
  }, []);
  const handleAuthorChange = useCallback((author: string) => {
    setAuthor(author);
  }, []);
  const handleMediaChange = useCallback((media_domain: string) => {
    setMedia_domain(media_domain);
  }, []);
  const handleDocIdChange = useCallback((docid: string) => {
    setDocId(docid);
  }, []);
  return (
    <div className="main-content">
      <Card bordered={false} style={{ minHeight: 380 }}>
        <Affix offsetTop={0}>
          <div className="affix-header">
            <Form layout="inline">
              <ArticleSelect onChange={handleCatChange} />
              <HandleResult onChange={handleResultChange} filter={handleResult} />
              <HandleScore onChange={handleScoreChange} />
              <TierSelect onChange={handleTierChange} />
              <EnInput label="审核员账号" onChange={handleAuthorChange} />
              <EnInput label="账号领域" onChange={handleMediaChange} />
              <EnInput label="doc_id" onChange={handleDocIdChange} />
              <ENDatePicker
                label="审核时间"
                defaultValue={auditDate as any}
                onChange={onAuditDateChange as any}
              />
              <Form.Item>
                <Button type="primary" onClick={onSearch}>
                  搜索
                </Button>
                &nbsp;
                <Button type="danger" onClick={onExport}>
                  导出数据
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
                <TopDoc key={item.docid} index={index} doc={item} isHis={true} appid="all" />
              ))}
            </div>
          </Spin>
        </div>
      </Card>
    </div>
  );
};

export default AllChecked;
