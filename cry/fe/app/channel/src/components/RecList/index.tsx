import React, { useState, useEffect, ChangeEvent, useRef } from 'react';
import { connect } from 'dva';
import { useParams, useLocation } from 'react-router-dom';
import { Divider, Checkbox, message, Select, Spin, Button, Input, Row } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { Dispatch, ConnectState, Callback } from '@/models/connect';
import { topNewsSelectors } from '@/selectors';
import { topNewsDispatches } from '@/dispatches';
import { RecItemProps, RecNewsProps, RecProps, searchProps } from '@/config/topNews';
import {
  docListCheckBoxEnum,
  wemediaRankCheckBoxEnum,
  docListSortEnum,
  dateEnum,
} from '../../data';
import RecItem from '../RecItem';
import { isDocid } from '@/utils/dev_helper';

import './index.less';

const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;

interface IRecListProps {
  recNews: RecNewsProps | {};
  recList: Array<RecItemProps>;
  recListOrigin: Array<RecItemProps>;
  loadingrec: boolean;
  updateRecList: (recList: Array<RecItemProps>, success?: Callback, fail?: Callback) => void;
  getRecNewsByFromid: (params: RecProps, success?: Callback, fail?: Callback) => void;
  searchByKeyword: (params: searchProps, success?: Callback, fail?: Callback) => void;
  searchByKeywordAsDocId: (params: searchProps, success?: Callback, fail?: Callback) => void;
}

const RecList: React.FC<IRecListProps> = ({
  recNews,
  recList,
  recListOrigin,
  loadingrec,
  updateRecList,
  getRecNewsByFromid,
  searchByKeyword,
  searchByKeywordAsDocId,
}) => {
  const { fromid } = useParams<{ fromid: string }>();
  const location = useLocation<{ location: any }>();
  const [sortBy, setSortBy] = useState<string>('default'); //select排序对应的字符串
  const [init, setInit] = useState<boolean>(false); //select排序对应的字符串
  const [filterArr, setFilterArr] = useState<Array<RecItemProps>>([]); //过滤后的数组
  const [checkFirArr, setCheckFirArr] = useState<CheckboxValueType[]>([]); //checkbox的数组
  const [checkSecArr, setCheckSecArr] = useState<CheckboxValueType[]>([]); //checkbox的数组

  const [days, setDays] = useState<string>('1'); //推荐内容源的搜索时间 默认一天 单位（天）
  const [src, setSrc] = useState<string>(''); //推荐内容源的搜索源名称 默认空字符串 string
  const [keyword, setKeyword] = useState<string>(''); //推荐内容源的keyword 默认空字符串 string

  const [pageNum, setPageNum] = useState<number>(0);
  const wrapRef = useRef<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [statePage, setStatePage] = useState<string>();

  // const [addToRecList,setAddToRecList] = useState<Array<RecItemProps>>([])//滚动拼接数组

  useEffect(() => {
    setInit(true);
  }, []);

  useEffect(() => {
    setKeyword('');
    setSrc('');
  }, [fromid]);

  // todo 可能有bug 后续看了一下
  useEffect(() => {
    if (pageNum === 0) {
      setFilterArr(recList);
    } else {
      setFilterArr(filterArr.concat(recList));
    }
  }, [recList]);

  //监听滚动事件
  useEffect(() => {
    const Dom = wrapRef.current;
    Dom.addEventListener('scroll', loadMore);
    return () => {
      Dom.removeEventListener('scroll', loadMore);
    };
  });

  useEffect(() => {
    getList();
    // console.log("getlist2222")
  }, [pageNum]);

  useEffect(() => {
    setPageNum(0); // 请求完毕置为false
    setFilterArr([]);
  }, [location.state]);

  const getList = () => {
    setLoading(true); // 设为请求状态
    console.log('loadingrec', loadingrec);
    getRecNewsByFromid({ fromid, pageNum });
    // if(loadingrec === false){
    setLoading(false); // 请求完毕置为false
    console.log('请求完毕');
    // }
  };

  const loadMore = (e: any) => {
    const { offsetHeight, scrollTop, scrollHeight } = e.target;
    if (offsetHeight + scrollTop === scrollHeight) {
      if (loading) {
        console.log('在请求');
        return; // 判断是否在请求状态
      } else {
        setPageNum(pageNum + 1);
      }
    }
  };

  // 过滤checkbox
  const filterCheckbox = (fir: CheckboxValueType[], sec: CheckboxValueType[]) => {
    console.time('filter doc');
    let filterAry = fir.concat(sec);
    let copyList = recList.length > 0 ? recListOrigin : recListOrigin.slice(0);
    console.log('before run filterDoc', copyList.length);

    copyList =
      (Boolean(filterAry.length > 0) &&
        copyList.filter(v => {
          if (filterAry.includes('imageCollection') && v.ctype === 'picture_gallery') {
            return true;
          } else if (
            filterAry.includes('wemedia') &&
            /^http:\/\/www.yidianzixun.com\/mp\/content/.test(v.url)
          ) {
            return true;
          } else if (filterAry.includes('focusNews') && Boolean(v.focus)) {
            return true;
          } else if (filterAry.includes('videoNews') && v.content_type === 'video') {
            return true;
          } else if (filterAry.includes('picdoc') && v.ctype === 'news') {
            return true;
          } else if (filterAry.includes('videoMicro') && v.video_type === 'micro') {
            return true;
          } else if (
            filterAry.includes('videoMicroVertical') &&
            v.video_type === 'micro' &&
            Number(v.v_width as number) / (v.v_height || 1) < 1.6
          ) {
            return true;
          } else if (filterAry.includes('duanneirong') && v.ctype === 'duanneirong') {
            return true;
          } else if (filterAry.includes('wemedia_rank_2') && v.rank === 2) {
            return true;
          } else if (filterAry.includes('wemedia_rank_3') && v.rank === 3) {
            return true;
          } else if (filterAry.includes('wemedia_rank_4') && v.rank === 4) {
            return true;
          } else if (filterAry.includes('wemedia_rank_5') && v.rank === 5) {
            return true;
          } else if (filterAry.includes('wemedia_rank_6') && v.rank === 6) {
            return true;
          } else {
            return false;
          }
        })) ||
      recListOrigin;
    // console.log('after run filterDoc', copyList.length);
    // console.timeEnd('filter doc');
    updateRecList(copyList, () => message.success('成功过滤'));
  };

  // 点击checkbox过滤数据
  useEffect(() => {
    if (!init) {
      return;
    }
    filterCheckbox(checkFirArr, checkSecArr);
  }, [checkSecArr, checkFirArr]);

  // 文章排序对应处理
  useEffect(() => {
    if (!init) {
      return;
    }
    let copyList = [...recList];
    // console.log("copyList",copyList)
    switch (sortBy) {
      // 点击率
      case 'click-rate':
        copyList.sort((a, b) => {
          let aRate =
            (a.data?.all &&
              Math.floor((1000 * (a.data['all']['ClickDoc'] || 0)) / a.data['all']['RViewDoc']) /
                10) ||
            0;
          let bRate =
            (b.data?.all &&
              Math.floor((1000 * (b.data['all']['ClickDoc'] || 0)) / b.data['all']['RViewDoc']) /
                10) ||
            0;
          return aRate - bRate > 0 ? -1 : 1;
        });

        updateRecList(copyList, () => message.success('点击率排序'));
        return;
      case 'share-cnt':
        //分享率
        copyList.sort((a, b) => {
          return ((a.data?.all && a.data['all']['ShareDoc']) || 0) -
            ((b.data?.all && b.data['all']['ShareDoc']) || 0) >
            0
            ? -1
            : 1;
        });
        updateRecList(copyList, () => message.success('分享数排序'));
        return;
      case 'comments-cnt':
        // 评论
        copyList.sort((a, b) => {
          return ((a.data?.all && a.data['all']['AddComment']) || 0) -
            ((b.data?.all && b.data['all']['AddComment']) || 0) >
            0
            ? -1
            : 1;
        });
        updateRecList(copyList, () => message.success('评论率排序'));
        return;
      case 'doc-score':
        // 总数
        copyList.sort((a, b) => {
          return ((a.data && a.data.doc_score) || 0) - ((b.data && b.data.doc_score) || 0) > 0
            ? -1
            : 1;
        });
        updateRecList(copyList, () => message.success('综合排序'));
        return;
      case 'date':
        // 时间
        if (!keyword) {
          getRecNewsByFromid({ fromid, order: 'date' });
        } else {
          searchByKeyword(
            { keyword, days, order: 'date', src, fromid },
            () => message.success('搜索成功'),
            msg => message.error(msg),
          );
        }
        updateRecList(copyList, () => message.success('时间排序'));
        return;
      case 'default':
        // 默认
        if (!keyword) {
          getRecNewsByFromid({ fromid });
        } else {
          searchByKeyword(
            { keyword, days, order: '', src, fromid },
            () => message.success('搜索成功'),
            msg => message.error(msg),
          );
        }
        updateRecList(copyList, () => message.success('默认排序'));
        return;
      default:
        return;
    }
  }, [sortBy]);

  // 选择排序的映射
  const docListSortOptions = docListSortEnum.map(item => (
    <Option key={item.value} value={item.value}>
      {item.label}
    </Option>
  ));

  // 选择排序方式
  const handleSortby = (value: string) => {
    setSortBy(value);
  };

  // 点击选择checkout分类
  const handleCheckoutFir = (checkValues: CheckboxValueType[]) => {
    setCheckFirArr(checkValues);
  };
  // 点击选择checkout等级
  const handleCheckoutSec = (checkValues: CheckboxValueType[]) => {
    setCheckSecArr(checkValues);
  };
  // 点击删除时删除该项
  const deleteItem = (delItem: RecItemProps) => {
    const oldArr = JSON.parse(JSON.stringify(filterArr));
    const newFilterArr = oldArr.filter((item: RecItemProps) => {
      return item.itemid !== delItem.itemid;
    });
    setFilterArr(newFilterArr);
  };
  //子组件每一项
  const renderTempRow = () => {
    return filterArr.map((item, index) => (
      <RecItem
        recItem={item}
        index={index}
        key={
          item.docid +
          Math.random()
            .toFixed(3)
            .toString()
        }
        deleteItem={deleteItem}
      />
    ));
  };

  // 按时间搜索
  const rangeItems = dateEnum.map(v => {
    return (
      <Option key={v.value} value={v.value}>
        {v.label}
      </Option>
    );
  });

  // 时间搜索
  const handleDateChange = (value: string) => {
    setDays(value);
    // console.log("day",value)
  };
  // 源名称搜索
  const handleSrcInput = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    setSrc(value);
  };

  // keyword 搜索
  const handleKeywordInput = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    setKeyword(value);
  };

  const handleResetSearch = () => {
    if (!keyword) {
      message.error('请输入关键词或docid!');
      return;
    }
    if (isDocid(keyword)) {
      // message.error("不支持docid搜索")
      // return;
      searchByKeywordAsDocId(
        { keyword, days, order: '', src, fromid },
        () => message.success('搜索成功'),
        msg => message.error(msg),
      );
    } else {
      searchByKeyword(
        { keyword, days, order: '', src, fromid },
        () => message.success('搜索成功'),
        msg => message.error(msg),
      );
    }
  };

  return (
    <div className="main-recommend">
      <Divider style={{ margin: '8px 0 5px' }}>推荐内容源</Divider>
      <div className="content-recommend" ref={wrapRef}>
        <Row>
          <Select
            size="small"
            defaultValue="1"
            style={{ width: '100px' }}
            onChange={handleDateChange}
          >
            {rangeItems}
          </Select>
          <Input
            onChange={handleSrcInput}
            size="small"
            placeholder="源名称"
            className="src-text"
            style={{ width: '100px', marginLeft: '20px' }}
            value={src}
          />
        </Row>
        <Row style={{ margin: '10px 0' }}>
          <Input
            onPressEnter={() => handleResetSearch()}
            onChange={handleKeywordInput}
            size="small"
            placeholder="关键词/docid"
            className="keyword-text"
            style={{ width: '200px' }}
            value={keyword}
          />
          <Button
            onClick={() => handleResetSearch()}
            className="btn search-btn"
            type="ghost"
            size="small"
            style={{ marginLeft: '15px' }}
          >
            搜索
          </Button>
        </Row>

        <Select
          size="small"
          value={sortBy}
          style={{ width: 150, marginRight: 10, marginBottom: 10 }}
          onChange={(value: string) => handleSortby(value)}
        >
          {docListSortOptions}
        </Select>
        <CheckboxGroup
          options={docListCheckBoxEnum}
          value={checkFirArr}
          onChange={handleCheckoutFir}
        />
        <CheckboxGroup
          options={wemediaRankCheckBoxEnum}
          value={checkSecArr}
          onChange={handleCheckoutSec}
        />
        <div className="body-recommend">
          <Spin spinning={loadingrec} tip="加载中...">
            {renderTempRow()}
          </Spin>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: ConnectState) => ({
  recNews: topNewsSelectors.recNews(state),
  recList: topNewsSelectors.recList(state),
  loadingrec: topNewsSelectors.loadingrec(state),
  recListOrigin: topNewsSelectors.recListOrigin(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateRecList: topNewsDispatches.updateRecList(dispatch),
  getRecNewsByFromid: topNewsDispatches.getRecNewsByFromid(dispatch),
  searchByKeyword: topNewsDispatches.searchByKeyword(dispatch),
  searchByKeywordAsDocId: topNewsDispatches.searchByKeywordAsDocId(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(RecList);
