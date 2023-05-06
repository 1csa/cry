import React, { useState, useEffect, useRef } from 'react';
import Player from 'xgplayer';

import {
  Card,
  Checkbox,
  Table,
  Button,
  Drawer,
  Image,
  Badge,
  Carousel,
  message,
  Tag,
  Space,
} from 'antd';
import { PaginationProps } from 'antd/es/pagination';

import { isJSON } from '@/utils/dev_helper';
import { getHeader, getList, screenShot } from '@/services/user';

import './index.less';

const errorImage =
  'data:image/png;base64,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';

interface DetailProp {
  visible?: boolean;
  onClose: () => void;
  data: any;
}

const Detail: React.FC<DetailProp> = ({ visible = true, onClose, data }) => {
  const { video, imageList } = data;
  const isVideo = video;
  const [images, setImages] = useState(imageList || []);

  // const [videoPlayer, setVideoPlayer] = useState<any>(null);
  // const observerRate = () => {
  //   var ele = document.querySelector('video[mediatype="video"]')!;
  //   ele?.addEventListener('ratechange', (event: any) => {
  //     localStorage.setItem('palyRate', event?.target?.playbackRate || 1);
  //   });
  // };

  // 初始化视频实例
  const initVideo = () => {
    // const videoPlayer =
    new Player({
      id: 'wrapper',
      url: isVideo ? video : '',
      width: 640,
      // download: true,
      // playbackRate: [1, 1.5, 2, 3, 5],
      // defaultPlaybackRate: 1,
      videoInit: true, // 初始化显示视频首帧（默认false,该配置在移动端无效)
      // fluid: true, // 设置为流式布局，可使播放器宽度跟随父元素的宽度大小变化，且高度按照配置项中的高度和宽度的比例来变化
      // fitVideoSize: 'fixHeight', // 'fixWidth' | 'fixHeight' | 'auto';
    });
    // setVideoPlayer(videoPlayer);
    // videoPlayer.once('complete', observerRate);
  };

  useEffect(() => {
    if (isVideo) {
      initVideo();
      setScreenShot();
    }
  }, []);

  // 抽帧需要用原来的视频地址 videoUrl，可以播放的地址是经过转换的
  const setScreenShot = () => {
    const sourceUrl = video;

    if (!sourceUrl) {
      // message.warning(`视频url不存在！`);
      return false;
    }

    // 截取方式 从最后一个mp4往前截取，如果url中存在_h265_的话，就截取到倒数第二个_;如果不存在_h265_的话，就截取到倒数第一个_
    const getVideoKey = (url: string) => {
      const normalUrl = url
        .substring(0, url.indexOf('_', url.indexOf('.', url.lastIndexOf('/'))) & 0x7fffffff)
        .replace(/(?:https?:\/\/)[^/]+?\w+\//, '');

      if (url.includes('malasong/')) {
        return normalUrl.replace('_bd.mp4', '');
      } else {
        return normalUrl;
      }
    };

    // 抽帧 有key的话用key后面的没有的话按照正则匹配
    const params = {
      keys: sourceUrl.includes('?key=') ? [sourceUrl.split('?key=')[1]] : [getVideoKey(sourceUrl)],
      task_id: 'blizzardVideoScreen',
    };

    if (params.keys.length) {
      screenShot(params)
        .then(res => {
          const { status, data } = res;
          if (status === 'success') {
            // 按照最后一帧拼接全部抽帧图片
            const SPLIT_STR = '.mp4/';
            // 截取图片url和最后一帧图片名【图片名是以帧数命名的】
            // image_loop字段，值为3时说明此视频的抽帧为一秒一帧，
            // 取抽帧时需要步长*3，若没有此字段，则为3秒一帧
            const { image_loop } = data[params.keys[0]];
            const [imgUrl, count] = data[params.keys[0]].images?.split(SPLIT_STR);
            const FPS: number = image_loop || 3;
            const PADDING_LEN: number = 3;
            // 截取图片后缀jpg jpeg等
            let [imgsLen, pname] = count.split('.');
            // let imgs: Array<FPSProps> = [];
            let imgs: Array<string> = [];
            let str: string = '';
            for (let i = 1; i <= imgsLen; i++) {
              if (i % FPS === 0) {
                // 只有100一下的才需要拼接 要处理为001、002的固定格式
                str = `${i}`.length < PADDING_LEN ? `${i}`.padStart(PADDING_LEN, '0') : `${i}`;
                const imgSrc = `${imgUrl}${SPLIT_STR}${str}.${pname}`;
                // const imageAntiFrandResult = imgAntiFrandResult(imgSrc, antiFrandResult);
                // imgs.push({
                //   imgSrc,
                //   // secTime: moment.utc(i * 1000).format('HH:mm:ss'),
                //   time: i,
                //   // antiFrandResult: imageAntiFrandResult,
                // });
                imgs.push(imgSrc);
              }
            }
            setImages(imgs);
          } else {
            message.error('视频抽帧失败');
          }
        })
        .catch(err => {
          console.log('err', err);
          message.error('视频抽帧出错', err);
        });
    } else {
      message.error(`视频url: ${sourceUrl} 不符合抽帧条件!`, 5);
    }
  };

  return (
    <Drawer
      title="详情"
      visible={visible}
      closable={false}
      width={800}
      onClose={onClose}
      className="define-drawer"
    >
      {isVideo && <div id="wrapper" style={{ marginBottom: 20 }}></div>}
      {images?.length && (
        <Image.PreviewGroup>
          {images.map((url: string, index: number) => (
            <div key={index} className="image-wrapper">
              <Image width={200} src={url} fallback={errorImage} />
            </div>
          ))}
        </Image.PreviewGroup>
      )}
    </Drawer>
  );
};

const HomePage = () => {
  const [data, setData] = useState([]);

  const defaultCurrent = 1;
  const defaultPageSize = 10;

  const orderKeyRef = useRef([]);
  const [orderIds, setOrderIds] = useState<string[]>([]);
  const checkboxChange = (checkedValues: any) => {
    setOrderIds(checkedValues);
    orderKeyRef.current = checkedValues;
    const { current = defaultCurrent, pageSize = defaultPageSize } = pagination;
    fetchList(current, pageSize);
  };

  // table cell 的渲染
  const renderTableCell = (key: string, text: any, record: any) => {
    const isHashTag = key === 'hashTag';
    if (!isHashTag) return text;
    const hashTag = isJSON(text) ? JSON.parse(text) : text;
    if (Array.isArray(hashTag)) {
      return hashTag.map((item: string, index: number) => (
        <Tag key={index} color="cyan" style={{ marginBottom: 5 }}>
          {item}
        </Tag>
      ));
    } else {
      return text;
    }
  };

  useEffect(() => {
    const newCloumns = columns.map((item: any) => {
      const { key, value } = item;

      const isCheckbox = typeof item.title !== 'string';
      const checked = orderIds.includes(key);
      const index = checked ? orderIds.findIndex(item => item === key) + 1 : 0;

      return isCheckbox
        ? {
            ...item,
            title: (
              <>
                <Checkbox value={key}>{value}</Checkbox>
                {checked && <Badge count={index} />}
              </>
            ),
          }
        : item;
    });
    setColumns(newCloumns);
    setPagination(pagination);
  }, [orderIds]);

  const contentStyle = {
    width: 200,
    height: 80,
    background: '#eee',
  };

  const defaultColumns = [
    {
      title: '详情',
      key: 'detail',
      render: (record: any) => {
        // console.log(record);
        return (
          <>
            {record.imageList?.length && (
              <div style={contentStyle} onClick={() => toggleVisible(record)}>
                <Carousel autoplay style={{ width: '100%', height: '100%' }}>
                  {record.imageList.map((url: string, index: number) => {
                    return (
                      <Image
                        key={index}
                        src={url}
                        width={200}
                        height={80}
                        preview={false}
                        fallback={errorImage}
                      />
                    );
                  })}
                </Carousel>
              </div>
            )}
            {record.video && (
              <Button type="link" onClick={() => toggleVisible(record)}>
                视频
              </Button>
            )}
          </>
        );
      },
    },
  ];

  const [columns, setColumns] = useState(defaultColumns);

  const onChange = (current: number, pageSize: number) => {
    setPagination({
      ...pagination,
      current,
      pageSize,
    });
    fetchList(current, pageSize);
  };

  const showTotal = (total: number) => `共计 ${total} 条`;

  const [pagination, setPagination] = useState<PaginationProps>({
    current: defaultCurrent,
    pageSize: defaultPageSize,
    total: 0,
    onChange,
    showTotal,
  });

  const [visible, setVisible] = useState<boolean>(false);
  const [recordData, setRecordData] = useState<any>({});
  const toggleVisible = (record: any) => {
    setVisible(!visible);
    setRecordData(record);
  };

  const fetchHeader = async () => {
    const { code, data, message } = await getHeader();
    if (code !== '0') {
      message.error(message || '表头数据获取失败！');
      return;
    }
    const columns = data.map((item: any) => {
      const { key, value, order } = item;
      const canOrder = order === 0;
      return canOrder
        ? {
            title: (
              <>
                <Checkbox value={key}>{value}</Checkbox>
                {typeof orderIds.findIndex(item => item === value) === 'number' ? (
                  <Badge count={orderIds.findIndex(item => item === value) + 1} />
                ) : null}
              </>
            ),
            dataIndex: key,
            key: key,
            width: 200,
            value,
            render: (text: any, record: any) => renderTableCell(key, text, record),
          }
        : {
            title: value,
            dataIndex: key,
            key,
            value,
            width: key !== 'hashTag' ? 200 : 300,
            render: (text: any, record: any) => renderTableCell(key, text, record),
          };
    });

    const columnsResult = columns.filter((item: any) => item.key !== 'image_list');

    // @ts-ignore
    setColumns([...columnsResult, ...defaultColumns]);
  };

  const [loading, setLoading] = useState(false);
  const fetchList = async (page: number, size: number) => {
    setLoading(true);
    const { code, data, message: msg } = await getList({
      currentPage: page,
      pageSize: size,
      orderKey: orderKeyRef.current.join(','),
    });
    setLoading(false);
    if (code !== '0') {
      message.error(msg || '表格数据获取失败！');
      return;
    }

    const { current, size: pageSize, total, records } = data;

    setPagination({
      ...pagination,
      current,
      pageSize,
      total,
    });

    const list =
      records?.map((item: any, key: number) => {
        const { ctype, video, imageList } = item;
        if (ctype === 'news') {
          const images = isJSON(imageList)
            ? JSON.parse(imageList)?.map((item: any) => item.url)
            : [];
          item.imageList = images;
          delete item.video;
        } else if (ctype === 'video') {
          item.video = isJSON(video) ? JSON.parse(video)[0] : '';
          // item.video = 'http://v1.go2yd.com/video/91e8ed0ddae08555d9182df2f7cb0686.mp4_bd.mp4';
          delete item.imageList;
        }
        return {
          ...item,
          key,
        };
      }) || [];
    setData(list);
  };

  useEffect(() => {
    fetchHeader();
    const { current = defaultCurrent, pageSize = defaultPageSize } = pagination;
    fetchList(current, pageSize);
  }, []);

  return (
    <div className="main-content">
      <Card bordered={false} style={{ minHeight: 380 }}>
        <Checkbox.Group onChange={checkboxChange}>
          <Table columns={columns} dataSource={data} pagination={pagination} loading={loading} />
        </Checkbox.Group>
      </Card>
      {visible && <Detail data={recordData} visible={visible} onClose={() => toggleVisible({})} />}
    </div>
  );
};

export default HomePage;
