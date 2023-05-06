import React, { useState, useEffect, MouseEvent, useRef } from 'react';
import { connect } from 'dva';
import Imglist from './ImgList';
import {
  Row,
  Button,
  message,
  Spin,
  Tooltip,
  Tag,
  Descriptions,
  Modal,
  Popconfirm,
  Divider,
} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Dispatch, ConnectState, Callback } from '@/models/connect';
import { topNewsSelectors } from '@/selectors';
import { topNewsDispatches } from '@/dispatches';
import { TopItemProps, RecItemProps, RecProps } from '@/config/topNews';
import DocData from '../DocData';
import { formatNewsData } from '../../utils/dev_helper';
import { PlusSquareOutlined } from '@ant-design/icons';
import Surface from '../Surface';
import './index.less';

import { useParams } from 'react-router-dom';
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const ButtonGroup = Button.Group;
const DescriptionsItem = Descriptions.Item;

interface IRecItemProps {
  recItem: RecItemProps;
  recList: Array<RecItemProps>;
  loadingDoc: boolean;
  index: number;
  docid: string;
  topList: Array<TopItemProps>;
  updateCurrentTopItem: (currentTopItem: RecItemProps) => void;
  updateTopList: (topList: Array<TopItemProps>, success?: Callback, fail?: Callback) => void;
  updateRecList: (recList: Array<RecItemProps>, success?: Callback, fail?: Callback) => void;
  getData: (params: RecProps, success?: Callback, fail?: Callback) => void;
  delNewsbyDocid: (params: RecProps, success?: Callback, fail?: Callback) => void;
  deleteItem: (item: RecItemProps) => void;
}

const RecItem: React.FC<IRecItemProps> = ({
  recItem,
  recList,
  loadingDoc,
  index,
  docid,
  topList,
  updateCurrentTopItem,
  updateTopList,
  updateRecList,
  getData,
  delNewsbyDocid,
  deleteItem,
}) => {
  const { fromid } = useParams<{ fromid: string }>();
  const docidRef = useRef<HTMLLabelElement>(null);
  const [visible, setVisible] = useState<boolean>(false); // 是否展示置顶弹窗
  const [showSurface, setShowSurface] = useState<boolean>(false); // 是否展示封面图弹窗
  const [showDelpop, setShowDelpop] = useState<boolean>(false); //是否展示删除弹窗
  const [showMoreinfo, setShowMoreinfo] = useState<boolean>(false); //是否展示数据统计
  const [showImgOp, setShowImgOp] = useState<object>({}); // 鼠标移入是否展示编辑选项
  const [previewVisible, setPreviewVisible] = useState<boolean>(false); // 放大展示判断
  const [previewImg, setPreviewImg] = useState<string>(''); // 放大的图片url
  const [imgArr, setImgArr] = useState<Array<string>>([]); // imgurl数组
  const [uploadIndex, setUploadIndex] = useState<number>(-1); // upload 数组顺序
  const [fileList, setFileList] = useState<Array<any>>([]); //
  // 点击复制docid
  const handleCopyDocid = (): void => {
    const copyDocid = docidRef.current!.innerText;
    const oInput = document.createElement('input');
    oInput.value = copyDocid;
    document.body.appendChild(oInput);
    oInput.select();
    document.execCommand('Copy'); // 执行浏览器复制命令
    oInput.className = 'oInput';
    oInput.style.display = 'none';
    document.body.removeChild(oInput);
    message.info('复制成功');
  };

  const getUrl = () => {
    // console.log(APP_ENV);
    if (location.hostname.indexOf('venus.int') === -1) {
      return '/app/editor-push-news/push/editor?docid=';
    }
    return `http://venus.int.yidian-inc.com:5301/app/editor-push-news/push/editor?docid=`;
    // `http://pandora.yidian-inc.com/tools/editor_push_news?docid=${recItem.docid}`
  };
  // 点击后右侧iframe显示
  const handleClickTitle = (e: MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    updateCurrentTopItem(recItem);
  };

  // 添加到右侧置顶
  const handleAddTopItem = (): void => {
    let tempTopList = [...topList];

    let hasDocid = tempTopList.map(item => item.docid).indexOf(recItem.docid);
    if (hasDocid >= 0) {
      message.warning(`文章已存在在置顶列表中！`);
      return;
    }

    // 推荐置顶后 部分字段进行删除处理 好多字段意义不明 暂时这么搞
    let copyRecItem = { ...recItem };
    copyRecItem.editorEventLevel = 'eventL3';
    let copyRecItem1 = formatNewsData(copyRecItem);
    tempTopList.unshift(copyRecItem1);
    updateTopList(tempTopList, () => message.success('文章已加入置顶列表！'));
    setVisible(false);
  };

  const closeModal = () => {
    setShowSurface(false);
    getData({ fromid, recItem: recItem });
  };
  //删除
  const handleConfirm = (e: MouseEvent<HTMLAnchorElement>) => {
    let res = delNewsbyDocid({ fromid, recItem: recItem });
    setShowDelpop(false);
    deleteItem(recItem);
  };
  let arr = [];
  //更多数据
  const getMoreData = () => {
    setShowMoreinfo(!showMoreinfo);
    getData({ fromid, recItem: recItem });
  };
  return (
    <div className="rec-item">
      <div className="rec-item-left">
        <div className="rec-item-info">
          <div className="rec-item-info-detail">
            <Row style={{ marginBottom: 8 }}>
              <span>
                <span style={{ marginRight: 8 }}>{index + 1}</span>
                <a
                  href={`http://pandora.yidian-inc.com/article/${recItem.docid}?hl=1`}
                  style={{ marginRight: 8 }}
                  target="ifr-article"
                  onClick={handleClickTitle}
                >
                  {recItem.title_new || recItem.title}
                </a>
              </span>
            </Row>
            {recItem.docid}
            <div className="rec-img">
              <Imglist
                image={recItem.image}
                imageUrls={recItem.image_urls || (recItem.image ? [doc.image] : [])}
                docid={recItem.docid}
                index={index}
                doc={recItem}
              ></Imglist>
            </div>
            <Row style={{ marginBottom: 8 }}>
              <div>
                {recItem.ctype === 'joke' ? <div className="joke-tag"></div> : ''}
                {recItem.ctype && (
                  <Tag color="red" className="ctype">
                    {recItem.ctype}
                  </Tag>
                )}
                {/* { recItem.props && recItem.props.spam && <Tag color="blue" className="prop" title="软文">软</Tag>} */}
                {recItem.props && recItem.props.bait && (
                  <Tag color="blue" className="prop" title="标题党">
                    标
                  </Tag>
                )}
                {recItem.props && recItem.props.dirty && (
                  <Tag color="blue" className="prop" title="低俗">
                    俗
                  </Tag>
                )}
                {recItem.props && recItem.props.sick && (
                  <Tag color="blue" className="prop" title="重口味">
                    重
                  </Tag>
                )}
                {recItem.props && recItem.props.imgs_porny && (
                  <Tag color="blue" className="prop" title="色情图">
                    色情图
                  </Tag>
                )}
                {recItem.props && recItem.props.imgs_sexy && (
                  <Tag color="blue" className="prop" title="性感图">
                    性感图
                  </Tag>
                )}
                {recItem.props && recItem.props.imgs_female_sexy && (
                  <Tag color="blue" className="prop" title="女性性感图">
                    女性性感图
                  </Tag>
                )}
                {recItem.props && recItem.props.imgs_male_sexy && (
                  <Tag color="blue" className="prop" title="男性性感图">
                    男性性感图
                  </Tag>
                )}
                {recItem.props && recItem.props.imgs_intimacy && (
                  <Tag color="blue" className="prop" title="亲密关系图">
                    亲密关系图
                  </Tag>
                )}
                {recItem.props && recItem.props.imgs_disgusting && (
                  <Tag color="blue" className="prop" title="恶心图">
                    恶心图
                  </Tag>
                )}
                {recItem.props && recItem.props.imgs_unclarity && (
                  <Tag color="blue" className="prop" title="模糊图">
                    模糊图
                  </Tag>
                )}
                {recItem.props && recItem.props.sc_spam && (
                  <Tag color="blue" className="prop" title="文末广告">
                    文末广告
                  </Tag>
                )}
                {recItem.props && recItem.props.quality_score && (
                  <Tag color="blue" className="prop" title="oppo高曝复审">
                    oppo 高曝复审
                  </Tag>
                )}
                {recItem.props && recItem.props.tier && (
                  <Tag color="blue" className="tier">
                    {recItem.props.tier}
                  </Tag>
                )}
                {/^http:\/\/www.yidianzixun.com\/mp\/content/.test(recItem.url) && (
                  <Tag color="blue" className="wm">
                    一点号
                  </Tag>
                )}
                {recItem.video_album_meta && recItem.video_album_meta.douban_score && (
                  <Tag color="blue" className="prop" title="豆瓣评分">
                    {recItem.video_album_meta.douban_score}
                  </Tag>
                )}
                {recItem.video_album_meta && recItem.video_album_meta.year && (
                  <Tag color="blue" className="prop" title="年代">
                    {recItem.video_album_meta.year}
                  </Tag>
                )}
                {recItem.video_album_meta && recItem.video_album_meta.country && (
                  <Tag color="blue" className="prop" title="国家">
                    {recItem.video_album_meta.country}
                  </Tag>
                )}
                {recItem.video_album_meta && recItem.video_album_meta.category && (
                  <Tag color="blue" className="prop" title="影片类型">
                    {recItem.video_album_meta.category}
                  </Tag>
                )}
                {/* {recItem && 'is_paid' in recItem && (
                  <Tag color="blue" className="prop" title="是否收费视频">
                    {recItem.is_paid + ''}
                  </Tag>
                )} */}
                {recItem.data && recItem.data.doc_score !== null && (
                  <Tag color="purple">
                    {'综合评分 ' +
                      (recItem.data.doc_score === 0
                        ? 0
                        : Math.round(recItem.data.doc_score as number))}
                  </Tag>
                )}
                {/* <Tag color="purple" className="like">{ '收藏' + (recItem.like || 0) }</Tag>
        <Tag color="purple" className="comment">{ '评论' + (recItem.comment_count || 0) }</Tag> */}
                <br />
                {/* {recItem.ctype === 'quick_news' && renderQuickNewsActionLabel()} */}
              </div>
            </Row>
            <Row>
              <Tooltip title="点我复制" placement="bottom">
                <label ref={docidRef} onClick={handleCopyDocid} style={{ marginRight: 8 }}>
                  {recItem.docid}
                </label>
              </Tooltip>
              <label style={{ marginRight: 8 }}>{recItem.source}</label>
              <label style={{ marginRight: 8 }}>{recItem.date}</label>
            </Row>
          </div>
        </div>

        {/* 数据展示 */}
        {/* {
          recItem.data
          ? <DocData doc={recItem} />
          : null
        } */}
        {/* {
          showMoreinfo 
          ?
          <Spin spinning={loadingDoc} indicator={antIcon}>
                <DocData doc={recItem} />
          </Spin>
          :null
        } */}
        {showMoreinfo && loadingDoc && !recItem.props ? (
          <Spin indicator={antIcon}></Spin>
        ) : (
          <DocData doc={recItem} key={recItem.docid} />
        )}

        <div className="rec-item-op">
          <Row style={{ marginBottom: 8 }}>
            <ButtonGroup>
              <Button
                size="small"
                onClick={() => {
                  setVisible(true);
                }}
              >
                置顶TOP
              </Button>
              <Button
                size="small"
                onClick={() => {
                  setShowSurface(true);
                }}
              >
                封面图
              </Button>

              {recItem.docid && (
                <div>
                  <Button
                    type="primary"
                    size="small"
                    href={`http://pandora.yidian-inc.com/tools/newseditor?id=${recItem.docid}`}
                    target="_blank"
                  >
                    {' '}
                    编辑{' '}
                  </Button>
                  <Button
                    type="primary"
                    size="small"
                    href={`http://pandora.yidian-inc.com/tools/commentsoperate?docid=${recItem.docid}`}
                    target="_blank"
                  >
                    {' '}
                    评论{' '}
                  </Button>
                  <Button
                    type="primary"
                    size="small"
                    href={getUrl() + `${recItem.docid}`}
                    target="_blank"
                  >
                    {' '}
                    PUSH{' '}
                  </Button>
                  {/* 删除弹窗 */}

                  <Popconfirm
                    visible={showDelpop}
                    title="是否要删除该内容？"
                    okText="确定"
                    cancelText="取消"
                    onConfirm={handleConfirm}
                    onCancel={() => {
                      setShowDelpop(false);
                      console.log(visible);
                    }}
                  >
                    <Button
                      type="primary"
                      size="small"
                      href={`/app/editor-push-news/push/editor?docid=${recItem.docid}`}
                      target="_blank"
                      onClick={() => setShowDelpop(true)}
                      className="delBtn"
                    >
                      {' '}
                      删除{' '}
                    </Button>
                  </Popconfirm>

                  <Button
                    type="primary"
                    size="small"
                    // href={`http://pandora.yidian-inc.com/tools/editor_push_news?docid=${recItem.docid}`}
                    target="_blank"
                    onClick={getMoreData}
                    className="delBtn"
                  >
                    {' '}
                    数据统计{' '}
                  </Button>
                </div>
              )}
            </ButtonGroup>
          </Row>
        </div>
      </div>
      <Modal
        visible={visible}
        title="是否添加到置顶流？"
        okText="确定"
        cancelText="取消"
        onOk={handleAddTopItem}
        onCancel={() => {
          setVisible(false);
          console.log(visible);
        }}
      >
        <Descriptions title="">
          <DescriptionsItem label="docid" span={3}>
            {recItem.docid}
          </DescriptionsItem>
          <DescriptionsItem label="标题" span={3}>
            <a href={`http://www.yidianzixun.com/article/${recItem.docid}`} target="_blank">
              {recItem.title_new || recItem.title}
            </a>
          </DescriptionsItem>
        </Descriptions>
      </Modal>
      {showSurface && (
        <Modal
          visible={showSurface}
          footer={null}
          onCancel={() => setShowSurface(false)}
          width={600}
        >
          <Surface itemData={recItem} closeModal={closeModal} index={index} />
        </Modal>
      )}
    </div>
  );
};

const mapStateToProps = (state: ConnectState) => ({
  topList: topNewsSelectors.topList(state),
  recList: topNewsSelectors.recList(state),
  loadingDoc: topNewsSelectors.loadingDoc(state),
});

const mapDispatchesToProps = (dispatch: Dispatch) => ({
  updateCurrentTopItem: topNewsDispatches.updateCurrentTopItem(dispatch),
  updateTopList: topNewsDispatches.updateTopList(dispatch),
  updateRecList: topNewsDispatches.updateRecList(dispatch),
  getData: topNewsDispatches.getData(dispatch),
  delNewsbyDocid: topNewsDispatches.delNewsbyDocid(dispatch),
});

export default connect(mapStateToProps, mapDispatchesToProps)(RecItem);
