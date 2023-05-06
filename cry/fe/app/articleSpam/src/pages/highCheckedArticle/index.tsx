import React, { FC, useState, useCallback } from 'react';
import { Affix, Form, Card, Button, Spin, DatePicker } from 'antd';
import moment from 'moment';
import {
  ArticleSelect,
  ContentSelect,
  TierSelect,
  EnInput,
  EnPagination,
} from '@/components/Search';
import { useGetAuditDoc } from '@/hooks/useGetAuditDoc';
import {
  PAGE_SIZE,
  SCORE_OPTIONS,
  HIGH_VIEW_NEG_REASON,
  SEARCH_TOP_NEWS,
  APP_ID_HIGH_VIEW,
} from '@/config/constant';
import Doc from '@/components/Doc';
import NegSelect from '@/components/Search/negSelect';
import { handleAuditDate } from '@/utils/util';
import { downLoadXlsx } from 'app-common/utils/util';
import TopDoc from '@/components/TopDoc';

const filterTier = ['1', '2'];

const FILTER_SCORE = SCORE_OPTIONS.filter(item => ![3, 0].includes(item.key));
const HighChecked: FC = () => {
  let start = moment().subtract(3, 'days');
  let end = moment();
  const [auditDate, setAuditDate] = useState<Array<any>>([start, end]);
  const [cat, setCat] = useState('');
  const [ctype, setCtype] = useState('');
  const [tier, setTier] = useState('');
  const [author, setAuthor] = useState('');
  const [docid, setDocid] = useState('');
  const [reason, setReason] = useState<string[]>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [search, setSearch] = useState(false);
  const { loading, count, docs } = useGetAuditDoc(
    {
      docid,
      appid: APP_ID_HIGH_VIEW,
      category: cat,
      source_tier: tier,
      offset: (pageIndex - 1) * PAGE_SIZE,
      operator_email: author,
      ctype,
      start: handleAuditDate(auditDate[0]),
      end: handleAuditDate(auditDate[1]),
      reason: reason.join(),
      state: '1',
    },
    [pageIndex, search],
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
  const handleAuthorChange = useCallback((author: string) => {
    setAuthor(author);
  }, []);
  const handleDocIdChange = useCallback((docid: string) => {
    setDocid(docid);
  }, []);
  const onAuditDateChange = (date: any, dateStrings: string[]) => {
    setAuditDate(date);
  };
  const handleNegChange = useCallback((reason: string[]) => {
    setReason(reason);
  }, []);
  const handlePageChange = (pageIndex: number) => {
    setPageIndex(pageIndex);
  };
  const onSearch = () => {
    setPageIndex(1);
    setSearch(!search);
  };
  const onExportData = () => {
    downLoadXlsx({
      filename: '高曝光内容',
      url: SEARCH_TOP_NEWS,
      params: {
        appid: APP_ID_HIGH_VIEW,
        offset: 0,
        count: 10000,
        operation_state: 1,
        sort: 'createAt',
      },
    });
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
              <NegSelect options={HIGH_VIEW_NEG_REASON} onChange={handleNegChange} />
              <EnInput label="审核员账号" onChange={handleAuthorChange} />
              <EnInput label="doc_id" onChange={handleDocIdChange} />
              <Form.Item label="审核时间">
                <DatePicker.RangePicker
                  defaultValue={auditDate}
                  format={'YYYY-MM-DD HH:mm:ss'}
                  showTime
                  onChange={onAuditDateChange}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={onSearch}>
                  搜索
                </Button>
                &nbsp;
                <Button type="danger" onClick={onExportData}>
                  下载数据
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
                //   hintText="你确定要重审这篇文章吗?"
                //   okText="重审"
                //   showCancel={false}
                // />
                <TopDoc key={item.docid} index={index} doc={item} isHis={true} appid="high_view" />
              ))}
            </div>
          </Spin>
        </div>
      </Card>
    </div>
  );
};

export default HighChecked;
