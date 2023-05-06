import React, { useState, ReactNode, ChangeEvent, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'dva';
import axios from 'axios';
import {
  Divider,
  Row,
  Col,
  Input,
  Checkbox,
  Button,
  Modal,
  Descriptions,
  message,
  Spin,
  Tag,
} from 'antd';
import { AutoSizer, List as VList, ListProps } from 'react-virtualized';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { Dispatch, ConnectState, Callback } from '@/models/connect';
import TopItem from '../TopItem';
import { topNewsSelectors, authSelectors } from '@/selectors';
import { topNewsDispatches } from '@/dispatches';
import { TopNewsProps, TopMapProps, TopItemProps, SearchResultProps } from '@/config/topNews';
import TopItemList from './topItemList'
import { AuthConfig } from '@/config/common'

import { compare, saveKibana } from '../../utils/dev_helper';
import DocData from '../DocData';
import { getTopNewsByFromid } from './../../services/topNews.service'
import './index.less';
import { fourChannelKeyValueObj } from './config'

interface hotEventOperations {
  docid: string;
  type: string; // 'add , modify',
  source: {
    editorEventLevel: string; // eventL1,eventL2,eventL3,'',
    location: string;
    cat: Array<string>;
    subcat: Array<string>;
  };
  dest: {
    editorEventLevel: string; // eventL1,eventL2,eventL3,'',
    location: string;
    cat: Array<string>;
    subcat: Array<string>;
  };
}

interface ITopListProps {
  auth: Array<number>;
  channelType: string;
  topNews: TopNewsProps | {};
  lastTopNews: TopNewsProps | {}; // 上次保存数据 用于比较和下次保存的数据
  operationLog: Array<TopItemProps>; // 修改后的数据单个数据
  preTopNews: TopNewsProps | {}; // 获取的开始数据没有任何变化
  topList: Array<TopItemProps>;
  topListMap: TopMapProps;
  searchResult: SearchResultProps;
  mulitSearchResult: Array<SearchResultProps>;
  loading: boolean; // loading图boolean
  search: (searchText: string, fromid: string, success?: Callback, fail?: Callback) => void;
  mulitSearch: (searchText: string, fromid: string, success?: Callback, fail?: Callback) => void;
  updateTopNews: (topNews: TopNewsProps, success?: Callback, fail?: Callback) => void;
  updateTopItem: (index: number, topItem: TopItemProps) => void;
  updateTopList: (topList: Array<TopItemProps>, success?: Callback, fail?: Callback) => void;
  updateLoading: (state: boolean) => void;
  saveTopNews: (
    topInfo: TopNewsProps,
    success?: Callback,
    fail?: Callback,
    operationLog?: Array<TopItemProps>,
  ) => void;
  updateLastTopNews: (lastTopNews: TopNewsProps, success?: Callback, fail?: Callback) => void; // 上一次保存的数据
}

const ROWHEIGHT: number = 270;
const DescriptionsItem = Descriptions.Item;

const TopList: React.FC<ITopListProps> = ({
  auth,
  channelType,
  topNews,
  operationLog,
  preTopNews,
  lastTopNews,
  topList,
  topListMap,
  searchResult,
  mulitSearchResult,
  loading,
  search,
  mulitSearch,
  updateLoading,
  updateTopNews,
  updateTopList,
  saveTopNews,
  updateLastTopNews,
}) => {
  const [searchText, setSearchText] = useState<string>(''); // search text
  const [lifeSpanText, setLifeSpanText] = useState<string | undefined>(''); // lifespan input框输入的值
  const [lifeSpan, setLifeSpan] = useState<string | number | undefined>(''); // lifespan 更新到服务的值
  const [visible, setVisible] = useState<boolean>(false); // search modal visible
  const [sLVisible, setSLVisible] = useState<boolean>(false); // spanlife的弹窗
  const [todelList, setTodelList] = useState<string[]>([]); // 待删除置顶列表
  const [checkAll, setCheckAll] = useState<boolean>(false); // 控制全选按钮是否选中true false
  const [indeterminate, setIndeterminate] = useState<boolean>(false); // 控制全选按钮样式

  const [repeatDocIdResult, setRepeatDocIdResult] = useState<any[]>([]); // 查找重复docId的结果
  const [repeatDocIdVisible, setRepeatDocIdVisible] = useState<boolean>(false); // 查找重复docId弹框展示

  const [showCheckAll, setShowCheckAll] = useState<boolean>(false); //  是否展示批量删除
  const [isFull, setFull] = useState<boolean>(false); //loading是否全屏

  const [submitButtonDisable, setSubmitButtonDisable] = useState<boolean>(false);

  const { fromid } = useParams<{ fromid: string }>();

  // console.log(topNews)
  // react-virtualized 与 图片懒加载好像冲突了
  // useEffect(() => {
  //   const topItemElements = [].slice.call(document.querySelectorAll('.top-item'))
  //   const lazyImageObserver = new IntersectionObserver((entries, observer) => {
  //     entries.forEach((entry, index) => {
  //       // entry.boundingClientRect 可以拿到 dom 的各种尺寸
  //       if (entry.isIntersecting) {
  //         // top item 组件层级
  //         // 可能有的文章没有图片 需要判断 curImage 是否存在
  //         let curImage = entry.target.childNodes[0]?.childNodes[1]?.childNodes[0]
  //         if (curImage) {
  //           curImage.src = curImage.dataset.src
  //           lazyImageObserver.unobserve(curImage)
  //         }
  //       }
  //     })
  //   })
  //   topItemElements.forEach(lazyImage => lazyImageObserver.observe(lazyImage))
  // }, [topList])

  // calc height
  const calcHeight = (): number => {
    return document.querySelector<HTMLElement>('.main-toplist-body')?.offsetHeight || ROWHEIGHT;
  };

  // scroll todo image lazy load
  // const _onScroll = ({ clientHeight, scrollHeight, scrollTop }) => {
  //   console.log(clientHeight, scrollHeight, scrollTop)
  // }

  /**
   *
   * @param param0
   * @returns 懒加载列表
   */
  const _rowRenderer: Required<ListProps>['rowRenderer'] = ({
    index,
    isScrolling,
    key,
    style,
  }): ReactNode => {
    const row = topList[index];
    return (
      <TopItem
        key={row.docid}
        doc={row}
        index={index}
        style={style}
        todelList={todelList}
        checkAll={checkAll}
        updateDellist={setTodelList}
        showCheckAll={showCheckAll}
      />
    );
  };

  const renderTempRow = useCallback(() => {
    // console.log(topList)
    // return topList.map((row, index) => (
    //   <TopItem
    //     key={row.docid}
    //     doc={row}
    //     index={index}
    //     style={{}}
    //     todelList={todelList}
    //     checkAll={checkAll}
    //     updateDellist={setTodelList}
    //     showCheckAll={showCheckAll}
    //   />
    // ));
  }, [topList, todelList, checkAll, showCheckAll]);

  /**
   *
   * @returns 搜索请求数据
   */
  const handleSearch = async () => {
    if (!searchText) {
      return message.error('请输入有效的 docid 或者 url');
    } else {
      if (searchText.indexOf(',') > -1) {
        if (searchText.split(',').length > 5) {
          message.warn('单词不能超过5，请重新输入');
          return;
        }
        await mulitSearch(searchText, fromid, message.success, message.error);
        setVisible(true);
      } else {
        await search(searchText, fromid, message.success, message.error);
        setVisible(true);
      }
    }
  };

  /**
   * 更新lifespan数据
   * @param e
   */
  const handleUpdateLifespan = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.trim();
    setLifeSpanText(value);
  };

  // 更新spanlife
  useEffect(() => {
    if (!lifeSpanText) {
      return;
    }
    if (Number(lifeSpanText) <= 0 || isNaN(Number(lifeSpanText))) {
      return message.error('请输入大于0的有效的数字');
    }
    const tempTopNews = { ...topNews };
    tempTopNews.lifespan = Number(lifeSpanText);
    updateTopNews(tempTopNews as TopNewsProps, () => message.success('成功设置置顶时间'));
  }, [lifeSpan]);

  // 处理置顶有效期初始值
  useEffect(() => {
    setLifeSpan((topNews as TopNewsProps).lifespan?.toString());
  }, [(topNews as TopNewsProps).lifespan]);

  /**
   *
   * @returns 搜索并添加到置顶
   */
  const handleAddTopItem = (): void => {
    let tempTopList = [...topList];

    if (topListMap[searchResult.docid!]) {
      message.warning(`文章已存在在置顶列表中！`);
      return;
    }
    searchResult.editorEventLevel = 'eventL3';

    if (searchResult && searchResult.docid) {
      tempTopList.unshift(searchResult as TopItemProps);
    } else if (mulitSearchResult && mulitSearchResult.length > 0) {
      tempTopList = (mulitSearchResult as Array<TopItemProps>).concat(tempTopList);
    } else {
      message.warning(`无数据无法进行操作！`);
      return;
    }

    // } else {
    // tempTopList.push(searchResult as TopItemProps);
    // }
    updateTopList(tempTopList, () => message.success('文章已加入置顶列表！'));
    setVisible(false);
  };

  /**
   * 保存按钮 提交数据到kibana
   * 正常不传flag默认 false, 重复弹框的确定按钮传true
   */
  const handleSave:(flag?: boolean) => void = async (flag?: boolean) => {
    if (AuthConfig[fromid]) { // 需要进行权限验证
      if (!auth.includes(AuthConfig[fromid])) { // 需要验证 但是没有这个权限 就不执行后续代码了
        message.warn('没有该频道的保存权限，请申请对应权限')
        return false
      }
    }
    // 把loading前置  避免多次提交
    setFull(true);
    updateLoading(true);
    let mainFromIdArr = ['homepage', 'promotion', 't2433342', 'e2741221']
    let mainFromIdObj = {}
    if (!flag && mainFromIdArr.includes(fromid)) {
      const res1 = await getTopNewsByFromid({fromid: 'homepage'}) // 首页
      const res2 = await getTopNewsByFromid({fromid: 'promotion'}) // 推广专用
      const res3 = await getTopNewsByFromid({fromid: 't2433342'}) // 第五条指令
      const res4 = await getTopNewsByFromid({fromid: 'e2741221'}) // 第六条热点位
      // 就判断 docId 就行，其他不管
      let docIdsArr1 = res1.data['top_news'].map((item: TopItemProps) => {
        return item['docid']
      })
      let docIdsArr2 = res2.data['top_news'].map((item: TopItemProps) => {
        return item['docid']
      })
      let docIdsArr3 = res3.data['top_news'].map((item: TopItemProps) => {
        return item['docid']
      })
      let docIdsArr4 = res4.data['top_news'].map((item: TopItemProps) => {
        return item['docid']
      })
      mainFromIdObj['homepage'] = docIdsArr1
      mainFromIdObj['promotion'] = docIdsArr2
      mainFromIdObj['t2433342'] = docIdsArr3
      mainFromIdObj['e2741221'] = docIdsArr4
      let index = mainFromIdArr.indexOf(fromid)
      mainFromIdArr.splice(index, 1) // 去除本身，就查其他三个
      let topNewsDocIdArr = topNews['top_news'].map((item: TopItemProps) => {
        return item['docid']
      })
      let resultArr: any[] = []
      for (let i = 0; i < topNewsDocIdArr.length; i++) {
        let target = topNewsDocIdArr[i]
        mainFromIdArr.forEach(key => {
          let arrTemp = mainFromIdObj[key]
          if (arrTemp.includes(target)) {
            resultArr.push({
              docId: target,
              channelFromId: key
            })
          }
        })
        if (resultArr.length) {
          console.log(resultArr)
          setRepeatDocIdResult(resultArr)
          setRepeatDocIdVisible(true)
          return false
        }
      }
    }
    if (flag) { setRepeatDocIdVisible(false) }
    // 上次保存后的数据
    const preData = (lastTopNews as TopNewsProps).top_news;
    // 当前更改后的数据
    const nowData = (topNews as TopNewsProps).top_news;
    // 当前保存后docid的顺序
    const docidList = nowData.map(item => item.docid);
    console.log(preData, 'preData');
    console.log(operationLog, 'operationLog');
    // 数据比较 取出不同key和value    docid可能存在 不影响其他逻辑
    const sendLogList = compare(preData, operationLog);
    console.log(sendLogList, 'sendLogList');

    const modify = new Map();
    preData.forEach(i => {
      modify.set(i.docid, i);
    });
    const hotEventOperations: Array<hotEventOperations> = [];
    //  新老数据比较   operationLog 中不包含新增的
    //  热点事件操作日志 规则，type: 'modify,add'
    //  1、新增 数据且设置了热点等级的
    //  2、修改  等级，位置，大、小类发生改变
    nowData.forEach((item: any) => {
      const oldData = modify.get(item.docid);
      if (oldData) {
        if (
          !(
            (oldData.cat || []).toString() === (item.cat || []).toString() &&
            oldData.editorEventLevel === item.editorEventLevel &&
            oldData.location === item.location &&
            (oldData.subcat || []).toString() === (item.subcat || []).toString()
          )
        ) {
          hotEventOperations.push({
            docid: oldData.docid,
            type: 'modify',
            source: {
              editorEventLevel: oldData.editorEventLevel,
              location: oldData.location,
              cat: oldData.cat,
              subcat: oldData.subcat,
            },
            dest: {
              editorEventLevel: item.editorEventLevel,
              location: item.location,
              cat: item.cat,
              subcat: item.subcat,
            },
          });
        }
      } else if (item.editorEventLevel) {
        hotEventOperations.push({
          docid: item.docid,
          type: 'add',
          source: {
            editorEventLevel: '',
            location: '',
            cat: [],
            subcat: [],
          },
          dest: {
            editorEventLevel: item.editorEventLevel,
            location: item.location,
            cat: item.cat,
            subcat: item.subcat,
          },
        });
      }
    });
    if (hotEventOperations.length > 0) {
      let arr = location.href.split('/')
      const channelid = arr[arr.length - 1]
      const docids = hotEventOperations.map(item => item.docid);
      saveKibana({
        detail: hotEventOperations,
        docidList: docids,
        actionMethod: 'hotEventOperations',
        channelid
      });
    }

    // start 为了添加初始设置置顶的时间，所以加了这个处理
    let haveAddTimeTopNews = JSON.parse(JSON.stringify(topNews))
    haveAddTimeTopNews.top_news?.forEach((item: any) => {
      if (!item['firstAddTopTime']) {
        item['firstAddTopTime'] = +new Date()
      }
    })
    // end

    await saveTopNews(
      haveAddTimeTopNews as TopNewsProps,
      // topNews as TopNewsProps,
      () => {
        setFull(false);
        updateLoading(false);
        message.success('保存成功');
      },
      err => {
        setFull(false);
        updateLoading(false);
        message.error(`保存失败 ${err}`);
      },
      operationLog,
      // preTopNews as TopNewsProps,
    );
    let arr = location.href.split('/')
    const channelid = arr[arr.length - 1]
    saveKibana({ detail: sendLogList, docidList: docidList, actionMethod: 'saveTopNews', channelid });
    // 保存上次保存后的数据用于比较并上传kibana
    await updateLastTopNews(
      haveAddTimeTopNews as TopNewsProps,
      // topNews as TopNewsProps,
      () => {
        setFull(false);
        updateLoading(false);
        message.success('保存成功');
      },
      err => {
        setFull(false);
        updateLoading(false);
        message.error(`保存失败 ${err}`);
      },
    );
  };

  /**
   * 批量删除
   */
  const handleRemove = (): void => {
    const newTopList = topList.filter(topitem => todelList.includes(topitem.docid) === false);
    updateTopList(newTopList);
  };

  /**
   * 全选功能
   * @param e
   */
  const handleCheckAll = (e: CheckboxChangeEvent): void => {
    const checked = e.target.checked;
    setCheckAll(checked);
    if (Boolean(checked)) {
      let ary: Array<any> = [];
      topList.map(item => {
        ary.push(item.docid);
      });
      setTodelList(ary);
      setIndeterminate(true);
      setCheckAll(true);
    } else {
      setTodelList([]);
      setIndeterminate(false);
      setCheckAll(false);
    }
  };

  /**
   * 点击左侧菜单更新数据
   * 清除 input里lifespan值 防止误更新
   */
  useEffect(() => {
    return () => {
      setTodelList([]);
      setLifeSpanText('');
    };
  }, [fromid]);

  // 当时todellist改变时样式改变
  useEffect(() => {
    // 全选中 并且有数据
    if (todelList.length === topList.length && topList.length > 0 && todelList.length > 0) {
      setIndeterminate(false);
      setCheckAll(true);
      // 没有全选 有数据
    } else if (topList.length > 0 && todelList.length > 0) {
      setIndeterminate(true);
      // setCheckAll(false);
      //没有数据
    } else {
      setCheckAll(false);
      setIndeterminate(false);
    }
  }, [todelList]);

  useEffect(() => {
    initSubmitButtonIsDisable()
  }, [])

  const initSubmitButtonIsDisable = async () => {
    try {
      const res = await axios.get('/api/proxy/http://apollo-configcenter.ha.in.yidian.com:8108/configfiles/json/2022-0921-0946-yyl/default/application')
      const resData = res.data
      if (resData['isOpenDisableStatus']) {
        const useObj = JSON.parse(resData['isOpenDisableStatus'])
        const status = useObj['status']
        if (status === 'on') {
          setSubmitButtonDisable(true)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const disableButtonTips = () => {
    message.warning('特殊情况，暂时无法保存，有问题请联系 闫亚龙、张舒')
  }

  return (
    <div className="main-toplist">
      <Divider style={{ margin: '8px 0 5px' }}>置顶内容</Divider>
      <div className="main-toplist-content">
        <Row className="main-toplist-header">
          <Input
            size="small"
            placeholder="docid"
            style={{ width: 220 }}
            value={searchText}
            onChange={e => setSearchText(e.target.value.trim())}
            onPressEnter={handleSearch}
          />
          <Button type="primary" size="small" onClick={handleSearch}>
            添加内容
          </Button>
        </Row>
        <Row className="main-toplist-header">
          <span style={{ color: '#f00' }}>*</span>多个docid 间以 “,” 间隔,如A,B,C
        </Row>
        <Row className="main-toplist-header">
          <Tag style={{ fontSize: '16px', lineHeight: '22px' }}>{lifeSpan}</Tag>
          <Button
            type="primary"
            size="small"
            style={{ marginLeft: 6 }}
            onClick={() => {
              setSLVisible(true);
            }}
            disabled={!auth.includes(199)}
          >
            设置置顶有效期(小时)
          </Button>
        </Row>
        <Row className="main-toplist-header">
          {showCheckAll && (
            <Checkbox onChange={handleCheckAll} checked={checkAll} indeterminate={indeterminate}>
              全选
            </Checkbox>
          )}
          <Button
            size="small"
            onClick={() => {
              if (showCheckAll) {
                handleRemove();
              } else {
                setShowCheckAll(true);
              }
            }}
          >
            {showCheckAll ? '批量删除' : '选择批量删除'}
          </Button>
          {showCheckAll && (
            <Button
              size="small"
              onClick={() => {
                setShowCheckAll(false);
              }}
            >
              取消批量删除
            </Button>
          )}
        </Row>
        <div className="main-toplist-body">
          {Boolean(isFull) ? (
            <div>
              <div className="full">
                <div className="loadingBg"></div>
                <Spin spinning={loading} tip="保存中...">
                  {/* <AutoSizer>
                {({ width, height }) => (
                  <VList
                    height={calcHeight()}
                    overscanRowCount={2}
                    // onScroll={ _onScroll }
                    rowCount={topList.length}
                    rowHeight={ROWHEIGHT} // 这个 rowHeight 应该是根据 dom 计算出来的
                    rowRenderer={_rowRenderer}
                    width={width}
                  />
                )}
              </AutoSizer> */}
                </Spin>
              </div>
              {/* {renderTempRow()} */}
              <TopItemList 
                topList={topList}
                todelList={todelList}
                checkAll={checkAll}
                showCheckAll={showCheckAll}
                setTodelList={setTodelList}
              />
            </div>
          ) : (
            <Spin spinning={loading} tip="加载中...">
              {' '}
              {/* {renderTempRow()} */}
              <TopItemList 
                topList={topList}
                todelList={todelList}
                checkAll={checkAll}
                showCheckAll={showCheckAll}
                setTodelList={setTodelList}
              />
            </Spin>
          )}
        </div>
      </div>
      <div className="save"> 
        {
          submitButtonDisable ?
          <Button size="small" onClick={disableButtonTips}>
            保存
          </Button>
          :
          <Button size="small" type="primary" onClick={() => { handleSave() }}>
            保存
          </Button>
        }
       
      </div>
      <Modal
        visible={visible}
        title="是否添加到置顶流？"
        okText="确定"
        cancelText="取消"
        onOk={handleAddTopItem}
        onCancel={() => setVisible(false)}
      >
        {resultRender(searchResult, mulitSearchResult)}
      </Modal>
      <Modal
        visible={repeatDocIdVisible}
        title="重复提醒!"
        okText="继续保存"
        cancelText="返回修改"
        onOk={ () => { handleSave(true) } }
        onCancel={() => setRepeatDocIdVisible(false)}
      >
        <div className='repeatDocIdCtn'>
          以下文章在
          {
            repeatDocIdResult.map(item => {
              return `【${fourChannelKeyValueObj[item['channelFromId']]}】`
            })
          }
          重复置顶，请确认!
        </div>
        {
          repeatDocIdResult.map((item, i) => {
            return (
            <div className='repeatDocIdCtn' key={i}>
              <div>docId: {item['docId']}</div>
              <div>重复对应频道: {fourChannelKeyValueObj[item['channelFromId']]}</div>
            </div>)
          })
        }
      </Modal>
      <Modal
        visible={sLVisible}
        title="请输入需要设置的置顶时间"
        okText="确定"
        cancelText="取消"
        onOk={() => {
          if (!lifeSpanText || Number(lifeSpanText) <= 0 || isNaN(Number(lifeSpanText))) {
            return message.error('请输入大于0的有效的数字');
          }
          setLifeSpan(lifeSpanText);
          setSLVisible(false);
        }}
        onCancel={() => {
          setSLVisible(false);
        }}
      >
        <Input size="small" style={{ width: 80 }} onChange={handleUpdateLifespan} />
        <span style={{ marginLeft: '20px' }}>单位（小时）</span>
      </Modal>
    </div>
  );
};

const resultRender = (
  searchResult: SearchResultProps,
  mulitSearchResult: Array<SearchResultProps>,
) => {
  if (mulitSearchResult && mulitSearchResult.length > 1) {
    return (
      <div>
        <div>搜索结果</div>
        {mulitSearchResult.map((item, index) => {
          return (
            <Descriptions key={item.docid}>
              <DescriptionsItem label={index + 1 + '.docid'} span={3}>
                {item.docid}
              </DescriptionsItem>
              <DescriptionsItem label="标题" span={3}>
                <a href={`http://www.yidianzixun.com/article/${item.docid}`} target="_blank">
                  {item.title}
                </a>
              </DescriptionsItem>
              <DescriptionsItem label="" span={3}>
                <div style={{ background: '#eeeeee', padding: '5px 10px' }}>
                  {item && <DocData doc={item as TopItemProps} />}
                </div>
              </DescriptionsItem>
            </Descriptions>
          );
        })}
      </div>
    );
  } else if (searchResult && searchResult.docid) {
    return (
      <div>
        <Descriptions title="搜索结果">
          <DescriptionsItem label="docid" span={3}>
            {searchResult.docid}
          </DescriptionsItem>
          <DescriptionsItem label="标题" span={3}>
            <a href={`http://www.yidianzixun.com/article/${searchResult.docid}`} target="_blank">
              {searchResult.title}
            </a>
          </DescriptionsItem>
        </Descriptions>
        <DescriptionsItem label="" span={3}>
          <div style={{ background: '#eeeeee', padding: '5px 10px' }}>
            {searchResult && (
              <DocData doc={searchResult as TopItemProps} key={searchResult.docid} />
            )}
          </div>
        </DescriptionsItem>
      </div>
    );
  } else {
    return (
      <div className="center">
        <Spin tip="加载中..."></Spin>
      </div>
    );
  }
};
const mapStateToProps = (state: ConnectState) => ({
  auth: authSelectors.auth(state),
  channelType: topNewsSelectors.channelType(state),
  topNews: topNewsSelectors.topNews(state),
  operationLog: topNewsSelectors.operationLog(state),
  preTopNews: topNewsSelectors.preTopNews(state),
  lastTopNews: topNewsSelectors.lastTopNews(state),
  loading: topNewsSelectors.loading(state),
  topList: topNewsSelectors.topList(state),
  topListMap: topNewsSelectors.topListMap(state),
  searchResult: topNewsSelectors.searchResult(state),
  mulitSearchResult: topNewsSelectors.mulitSearchResult(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  search: topNewsDispatches.search(dispatch),
  mulitSearch: topNewsDispatches.mulitSearch(dispatch),
  updateTopNews: topNewsDispatches.updateTopNews(dispatch),
  updateTopItem: topNewsDispatches.updateTopItem(dispatch),
  updateLoading: topNewsDispatches.updateLoading(dispatch),
  updateTopList: topNewsDispatches.updateTopList(dispatch),
  saveTopNews: topNewsDispatches.saveTopNews(dispatch),
  updateLastTopNews: topNewsDispatches.updateLastTopNews(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(TopList);
