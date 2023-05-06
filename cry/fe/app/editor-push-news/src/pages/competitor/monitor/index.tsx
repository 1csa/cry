/**
 * TODO: 关于lastCrawlerRef.current的更新逻辑比较混乱
 */

import React, { useState, useEffect, useRef } from 'react';
import ClipBoard from 'clipboard';
import moment, { Moment } from 'moment';
import { useHistory } from 'react-router';
import { useDispatch } from 'dva';
import { Card, message, Modal, Radio, Icon, notification, Divider, Alert, Spin } from 'antd';
import { WindowScroller, List } from 'react-virtualized';

import { comp_hotpot_map } from '@/data';
import { parseradio, isEmpty, isUndefined } from '@/utils';

import { SearchProps, MonitorScreen, CompetitorMonitorProps, DiffCrawlMonitorItem } from '@/config/competitor/competitor';
import { Monitor_Time_Format, defaultMonitorItem, defaultSearch } from '@/config/competitor/competitor.config';
import { getCompetitorMonitorList, saveHotSpot, getMonitorNewer, getMonitorDiff } from '@/services/competitorService';
import { sendLog } from '@/services/sendLog';
import { ScreenForm } from './screen';
import { ListItem } from './item';
import { NotiTotal, NotiDescription, NotiMessage } from './noti';
import './index.less';

const CompetitorMonitor: React.FC = () => {
  const [hotspot, setHotspot] = useState<string>('');
  const [showHotpot, setShowHotpot] = useState<boolean>(false);
  const [currentData, setCurrentData] = useState<CompetitorMonitorProps>(defaultMonitorItem);
  const [monitorSearch, setMonitorSearch] = useState<SearchProps>(defaultSearch);
  const [manualScrollTop, setManualScrollTop] = useState<number>(-1);
  const [fetchLoading, setFetchLoading] = useState<boolean>(false);

  const history = useHistory();
  const dispatch = useDispatch();
  const cardRef = useRef<HTMLDivElement>(null);

  const monitorListRef = useRef<CompetitorMonitorProps[]>([]); // 整个push列表data
  const lastCrawlerRef = useRef<number>(-1); // push监控最后一条信息的id
  const unopCrawerRef = useRef<number[]>([]); // push图库中的列表的id
  const listTimerRef = useRef<NodeJS.Timeout>();
  const diffTimerRef = useRef<NodeJS.Timeout>();

  // 初始加载列表
  useEffect(() => {
    if (!monitorSearch) {
      return;
    }
    fetchAndSetLastCrawler(monitorSearch);
  }, []);

  // 设定获取新push的通知
  useEffect(() => {
    listTimerRef.current = setInterval(() => {
      fetchNewCrawlList().then(
        newList => updateNewerList(newList),
        err => message.error(err.toString()),
      );
    }, 1 * 60 * 1000);

    return () => {
      if (!listTimerRef.current) {
        clearInterval(listTimerRef.current);
      }
    };
  }, []);

  // 设定更新状态的通知
  useEffect(() => {
    diffTimerRef.current = setInterval(() => {
      fetchDiffCrwalList().then(
        diffList => updateUnopList(diffList),
        err => message.error(err.toString()),
      );
    }, 1 * 60 * 1000);

    return () => {
      if (!diffTimerRef.current) {
        clearInterval(diffTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setHotspot(currentData?.hotspot ? currentData.hotspot : '');
  }, [currentData?.hotspot]);

  // 筛选确认
  const handleScreenConfirm = async (values: SearchProps) => {
    sendLog({
      page: "push_competitor_monitor",
      action_id: "search",
    });
    setMonitorSearch(values);
    fetchAndSetList(values);
  };

  // 复制文本
  const handleCopyText = (text: string) => {
    const clipButton = document.createElement('button');
    const clipboard = new ClipBoard(clipButton, {
      text: () => text,
    });

    clipboard.on('success', function() {
      message.success('复制成功');
    });
    clipboard.on('error', function() {
      message.error('复制失败');
    });

    clipButton.click();
    clipboard.destroy(); // 可能执行顺序会不太对
  };

  // 快速推送
  const handleFastPush = (docid?: string) => {
    if (!docid) {
      return message.error('该条push尚未入库，请核实后点击');
    }

    history.push('/push/editor');
    dispatch({
      type: 'editorpush/fetchDocInfo',
      payload: { docid: docid },
    });
  };

  // 清除滚动
  const handleClearScrollIndex = () => {
    setManualScrollTop(-1);
  };

  // open hotspot modal
  const handleOpenModal = (data: CompetitorMonitorProps): void => {
    setCurrentData(data);
    setShowHotpot(true);
  };

  // save hot spot
  const saveHotspot = async () => {
    const { id, mid = '' } = currentData;
    const { status } = await saveHotSpot(id, mid, hotspot);
    if (status === 'success') {
      message.success('设置热点成功!');
      setShowHotpot(false);
      monitorListRef.current = monitorListRef.current.map((item: CompetitorMonitorProps) => {
        if (item.id === id) {
          item.hotspot = hotspot;
        }
        return item;
      });
    } else {
      message.error('设置热点失败!');
    }
  };

  const updateNewerList = async (newList: CompetitorMonitorProps[]) => {
    const total = newList.length;

    if (total === 0) {
      return;
    }

    notification.open({
      key: 'total_noti',
      duration: 5,
      message: <NotiTotal total={total} />,
      style: { width: 520, marginLeft: -132 },
      onClick: handleClickNotiAll, // 可以改成updateNoti
    });

    for (let { push_title, push_abstract, app_name, date, id } of newList.slice(-5)) {
      await notification.open({
        duration: 5,
        message: <NotiMessage title={push_title} />,
        description: <NotiDescription summary={push_abstract} app={app_name} date={date} />,
        style: { width: 520, marginLeft: -132 },
        onClick: () => handleClickNoti(id),
      });
    }

    lastCrawlerRef.current = newList.slice(-1)[0]?.id;
  };

  const updateUnopList = (diffList: DiffCrawlMonitorItem[]) => {
    if (monitorListRef.current.length === 0) {
      return;
    }

    const sucList = diffList.filter(item => item.pub_status === 1).map(item => item.id);
    monitorListRef.current = monitorListRef.current.map(item => (sucList.includes(item.id) ? { ...item, pub_status: 1 } : item));
  };

  // 这里也是拉新的列表
  const handleClickNoti = async (id: number) => {
    if (isEmpty(id)) {
      return message.error('当前爬取内容没有id');
    }
    setFetchLoading(true);

    const newSearch = genNewScreenWithTime();

    try {
      const newList = await fetchMonitorList(newSearch);
      const index = newList.findIndex(item => item.id === id);
      const upopList = newList.filter(item => item.pub_status === 0).map(Item => Item.id); // 入库中的列表list的id

      unopCrawerRef.current = upopList;
      lastCrawlerRef.current = newList[0]?.id;
      monitorListRef.current = newList;

      setMonitorSearch(newSearch);
      if (index >= 0) {
        setManualScrollTop(index * 100);
      } else {
        setManualScrollTop(100);
        throw new Error('新列表中未获取到对应的爬取项');
      }
    } catch (err) {
      message.error(err.toString() || '获取新的监控列表失败');
    } finally {
      setTimeout(() => setFetchLoading(false), 500);
    }
  };

  const handleClickNotiAll = () => {
    const newSearch = genNewScreenWithTime();

    setMonitorSearch(newSearch);
    fetchAndSetLastCrawler(newSearch);
  };

  // 更新筛选的时间 以一天的间隔
  const genNewScreenWithTime = () => {
    const newStart = moment().subtract(1, 'days');
    const newEnd = moment();

    return { ...monitorSearch, date: [newStart, newEnd] as [Moment, Moment] };
  };

  // 从搜索条件中提取筛选条件
  const genScreenWithSearch = (search: SearchProps) => {
    const { date, pub_status, ...form } = search;
    const screen: MonitorScreen = JSON.parse(JSON.stringify(form));

    screen.start_date = moment(date![0]).format(Monitor_Time_Format);
    screen.end_date = moment(date![1]).format(Monitor_Time_Format);

    if (isUndefined(pub_status) === false && +pub_status >= 0) {
      screen.pub_status = pub_status;
    }

    return screen;
  };

  // 获取整个监控数据列表
  const fetchAndSetLastCrawler = (search: SearchProps) => {
    setFetchLoading(true);

    fetchMonitorList(search)
      .then(
        data => {
          const upopList = data.filter(item => item.pub_status === 0).map(Item => Item.id);

          unopCrawerRef.current = upopList;
          monitorListRef.current = data;
          lastCrawlerRef.current = data[0]?.id;
        },
        err => message.error(err.toString()),
      )
      .finally(() => setTimeout(() => setFetchLoading(false), 500));
  };

  const fetchAndSetList = (search: SearchProps) => {
    setFetchLoading(true);

    fetchMonitorList(search)
      .then(
        data => (monitorListRef.current = data),
        err => message.error(err.toString()),
      )
      .finally(() => setTimeout(() => setFetchLoading(false), 500));
  };

  const fetchMonitorList = async (search: SearchProps): Promise<CompetitorMonitorProps[]> => {
    const screen = genScreenWithSearch(search);

    const { code, data, msg = '获取监控列表失败' } = await getCompetitorMonitorList(screen);

    if (code === 200) {
      return data;
    } else {
      throw new Error(msg);
    }
  };

  const fetchNewCrawlList = async (): Promise<CompetitorMonitorProps[]> => {
    if (lastCrawlerRef.current < 0) {
      return [];
    }

    const { code, data, msg = '获取新的爬取数据失败' } = await getMonitorNewer(lastCrawlerRef.current);

    if (code === 200) {
      return data;
    } else {
      throw new Error(msg);
    }
  };

  const fetchDiffCrwalList = async (): Promise<DiffCrawlMonitorItem[]> => {
    if (isEmpty(unopCrawerRef.current)) {
      return [];
    }

    const { code, data, msg = '获取文章更新据失败' } = await getMonitorDiff(unopCrawerRef.current);

    if (code === 200) {
      return data;
    } else {
      throw new Error(msg);
    }
  };

  return (
    <div className="competitor">
      <section className="competitor-header">
        <Icon type="bar-chart" />
        <span>竞品Push监控</span>
      </section>
      <Card className="competitor-content">
        <ScreenForm screen={monitorSearch} onConfirm={handleScreenConfirm} />
        <Divider />
        <div className="monitor-list" ref={cardRef}>
          {fetchLoading ? (
            <Spin />
          ) : (
            <WindowScroller scrollElement={cardRef.current ? cardRef.current : undefined} onScroll={handleClearScrollIndex}>
              {({ height, width, scrollTop, onChildScroll }) => (
                <>
                  {scrollTop === 0 ? <Alert type="info" message={<span>共搜索到 {monitorListRef.current.length} 条结果</span>} /> : null}
                  <List
                    autoHeight
                    width={width}
                    height={height}
                    scrollTop={manualScrollTop >= 0 ? manualScrollTop : scrollTop} // 修改scrollTop实现定位
                    overscanRowCount={2}
                    rowCount={monitorListRef.current.length}
                    rowHeight={100}
                    noRowsRenderer={() => <span>暂无数据</span>}
                    rowRenderer={props => (
                      <ListItem
                        {...props}
                        monitorList={monitorListRef.current}
                        onCopyText={handleCopyText}
                        onFastPush={handleFastPush}
                        onSetHotpop={handleOpenModal}
                      />
                    )}
                    scrollToAlignment="start"
                    onScroll={onChildScroll}
                  />
                </>
              )}
            </WindowScroller>
          )}
        </div>
        <Modal title="设置热点类型" visible={showHotpot} width={600} onOk={saveHotspot} onCancel={() => setShowHotpot(false)}>
          <Radio.Group value={hotspot} onChange={e => setHotspot(e.target.value)}>
            {parseradio(comp_hotpot_map)}
          </Radio.Group>
        </Modal>
      </Card>
    </div>
  );
};

export default CompetitorMonitor;
