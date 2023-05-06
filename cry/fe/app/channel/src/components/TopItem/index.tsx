import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
  MouseEvent,
  ChangeEvent,
} from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'dva';
import { Dispatch, ConnectState, Callback } from '@/models/connect';
import { RecItemProps } from '@/config/topNews';
import { Formik, FormikBag } from 'formik';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import {
  Select as SelectFormik,
  Checkbox as CheckboxFormik,
  Form,
  FormItem,
  SubmitButton,
  ResetButton,
} from 'formik-antd';
import {
  Input,
  Checkbox,
  Button,
  Tag,
  Select,
  Row,
  Col,
  Tooltip,
  Popconfirm,
  message,
  Modal,
} from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { TopItemProps, DataObjProps } from '@/config/topNews';
import { tagMap, blockAppIdMap, hotEventLevelMap, hotEventLocationMap } from '@/data';
import { topNewsSelectors } from '@/selectors';
import { topNewsDispatches } from '@/dispatches';
import {
  getSubLocalChannels,
  getSyncedLocalChannels,
  saveSyncTopNews,
  syncSubChannelTopNews,
  getSubCategoryByCategory,
} from '@/services/topNews.service';
import ImgItem from '../ImgItem';
import DocData from '../DocData';

import './index.less';
import 'antd/dist/antd.css';
import Surface from '../Surface';

const InputGroup = Input.Group;
const ButtonGroup = Button.Group;
const { Option } = Select;
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 6, span: 16 },
};
const locationLayout = {
  wrapperCol: { offset: 1, span: 22 },
};

interface ITopItemProps {
  key: string;
  doc: TopItemProps;
  index: number;
  style: object;
  channelName: string;
  channelType: string;
  topList: Array<TopItemProps>;
  categoryList: Array<string>;
  todelList: Array<string>;
  checkAll: boolean;
  showCheckAll: boolean;
  updateTopItem: (index: number, topItem: TopItemProps) => void;
  updateTopList: (topList: Array<TopItemProps>, success?: Callback, fail?: Callback) => void;
  updateCurrentTopItem: (currentTopItem: TopItemProps) => void;
  updateDellist: (list: string[]) => void;
}

const TopItem: React.FC<ITopItemProps> = ({
  key,
  doc,
  index,
  style,
  channelName,
  channelType,
  topList,
  todelList,
  categoryList,
  checkAll,
  showCheckAll,
  updateDellist,
  updateTopItem,
  updateTopList,
  updateCurrentTopItem,
}) => {
  // edit channel
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [showSurface, setShowSurface] = useState<boolean>(false); // 是否展示封面图弹窗
  const [surfaceEditer, setSurfaceEditer] = useState<object>({});
  const editSurface = (obj: TopItemProps) => {
    obj.toptype = 'top';
    setSurfaceEditer(obj);
    setShowSurface(true);
  };
  // edit title
  const [title, setTitle] = useState<string>(doc.title_new || doc.title);
  const docidRef = useRef<HTMLLabelElement>(null);
  // hotevent visible
  const [hotEventVisible, setHotEventVisible] = useState<boolean>(false);
  // sync visible
  const [syncVisible, setSyncVisible] = useState<boolean>(false);
  // subcategory list
  const [subCategoryList, setSubCategoryList] = useState<Array<string>>([]);
  // location list
  const [locationList, setLocationList] = useState<Array<{ label: string; value: string }>>([]);
  // last selected location
  const [lastSelectedLocation, setLastSelectedLocation] = useState<Array<string>>([]);
  // selected location
  // const [selectedLocation, setSelectedLocation] = useState<Array<string>>([])
  // 是否选中 checkbox用
  const [checked, setChecked] = useState<boolean>(false);

  const { fromid } = useParams<{ fromid: string }>();
  const setBigState = doc.dtype === 2;

  useEffect(() => {
    renderLocationOptions();
  }, [locationList]);

  // render tag options
  const renderTagOptions = useCallback(
    (): ReactNode =>
      Object.entries(tagMap).map(([key, value]) => (
        <Option key={key} value={key}>
          {value}
        </Option>
      )),
    [],
  );

  // render block app id options
  const renderBlockAppIdOptions = useCallback(
    (): ReactNode =>
      Object.entries(blockAppIdMap).map(([key, value]) => (
        <Option key={key} value={key}>
          {value}
        </Option>
      )),
    [],
  );

  // render hot event level options
  const renderHotEventLevelOptions = useCallback(
    (): ReactNode =>
      Object.entries(hotEventLevelMap).map(([key, value]) => (
        <Option key={key} value={key}>
          {value}
        </Option>
      )),
    [],
  );

  // render hot event location options
  const renderHotEventLocationOptions = useCallback(
    (): ReactNode =>
      Object.entries(hotEventLocationMap).map(([key, value]) => (
        <Option key={key} value={key}>
          {value}
        </Option>
      )),
    [],
  );

  // render hot event cat options
  const renderHotEventCategoryOptions = useCallback(
    (): ReactNode =>
      categoryList.map((item: string) => (
        <Option key={encodeURIComponent(item)} value={item}>
          {item}
        </Option>
      )),
    [categoryList],
  );

  // render hot event subcat options
  const renderHotEventSubCategoryOptions = useCallback(
    (): ReactNode =>
      subCategoryList.map((item: string) => (
        <Option key={encodeURIComponent(item)} value={item}>
          {item}
        </Option>
      )),
    [subCategoryList],
  );

  // render location options
  const renderLocationOptions = (): ReactNode =>
    locationList.map((item: any) => (
      <Col span={6} key={item.channel_id}>
        <Checkbox value={item.channel_id}>{item.channel_name}</Checkbox>
      </Col>
    ));

  // click title jump to iframe and update current top item
  const handleClickTitle = (e: MouseEvent<HTMLAnchorElement>): void => {
    // jumpToIFrame(e, `http://pandora.yidian-inc.com/article/${doc.docid}?hl=1`, doc.docid)
    e.preventDefault();
    updateCurrentTopItem(doc);
  };

  // copy docid
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

  // sort 指定当前内容在哪个顺序  例如输入1 强制变成第一个
  const handleResetOrder = (e: any): void => {
    const idx = e.target.value || '';
    if (idx) {
      updateOrder(index, Number(idx) - 1);
      e.target.value = '';
      e.target.blur();
    }
  };

  // update order
  const updateOrder = (pre: number, cur: number): void => {
    if (pre === cur) return;
    let tempTopList = [...topList];
    const doc = tempTopList[pre];
    tempTopList.splice(pre, 1);
    tempTopList.splice(cur, 0, doc);
    updateTopList(tempTopList);
  };

  // update input
  // such as count group fromid
  // todo update title_new use handleUpdateInputValue is not very well
  const handleUpdateInputValue = (key: string, e: ChangeEvent<HTMLInputElement>): void => {
    const tempDoc = { ...doc };
    switch (key) {
      case 'count':
        tempDoc[key] = parseInt((e as ChangeEvent<HTMLInputElement>).target.value) || 0;
        break;
      case 'group':
        tempDoc[key] = (e as ChangeEvent<HTMLInputElement>).target.value || '';
        break;
      case 'fromid':
        tempDoc[key] = (e as ChangeEvent<HTMLInputElement>).target.value || '';
        break;
      default:
        break;
    }
    updateTopItem(index, tempDoc);
  };

  // update checkbox
  // such as feedback_forbidden
  const handleUpdateCheckboxValue = (key: string, e: CheckboxChangeEvent): void => {
    const tempDoc = { ...doc };
    tempDoc[key] = e.target.checked || false;
    updateTopItem(index, tempDoc);
  };

  // update select
  // such as tag block_appids
  const handleUpdateSelectValue = (key: string, val: string | Array<string>): void => {
    const tempDoc = { ...doc };
    tempDoc[key] = val;
    updateTopItem(index, tempDoc);
  };

  // update title
  const handleUpdateTitle = (): void => {
    const tempDoc = { ...doc };
    tempDoc['title_new'] = title;
    updateTopItem(index, tempDoc);
    setIsEdit(false);
  };

  // update dtype 设置大图 dytpe字段
  const handleUpdateDType = (setBigState: boolean): void => {
    const tempDoc = { ...doc };
    setBigState ? delete tempDoc['dtype'] : (tempDoc['dtype'] = 2);
    updateTopItem(index, tempDoc);
  };

  // open sync modal
  const openSyncModal = async (docid: string) => {
    const { status: status1, data: data1, reason: reason1 } = await getSubLocalChannels({
      currentChannel: channelName,
    });
    if (status1 === 'success') {
      setLocationList(data1);
    } else {
      message.error(`获取下属地区失败 ${reason1}`);
    }
    const { status: status2, data: data2, reason: reason2 } = await getSyncedLocalChannels({
      fromid,
      docid,
    });
    if (status2 === 'success') {
      setLastSelectedLocation(data2);
      // setSelectedLocation(data2)
    } else {
      message.error(`获取 ${docid} 的历史同步地区失败 ${reason2}`);
    }
    setSyncVisible(true);
  };

  // update sync channel
  const handleUpdateSyncChannel = async (
    values: { selectedLocation: Array<string> },
    actions: any,
  ) => {
    actions.setSubmitting(false);
    const { selectedLocation } = values;
    const [syncChannelIds, cancelSyncChannelIds] = getDifferenceBetweenSyncChannel(
      lastSelectedLocation,
      selectedLocation,
    );
    const promiseArr = [
      saveSyncTopNews({ fromid, syncNewsDocid: doc.docid, list: selectedLocation }),
      syncSubChannelTopNews({ syncChannelIds, cancelSyncChannelIds, syncNews: doc }),
    ];
    const [resp1, resp2] = await Promise.all(promiseArr);
    if (resp1.status === 'success' && resp2.status === 'success') {
      message.success('同步成功');
      setSyncVisible(false);
    } else {
      message.error(`同步失败 ${resp1.reason} ${resp2.reason}`);
    }
  };

  // get difference between last selected location and now
  const getDifferenceBetweenSyncChannel = (
    last: Array<string>,
    now: Array<string>,
  ): [Array<string>, Array<string>] => {
    const syncChannelIds = now.filter(item => last.indexOf(item) === -1);
    const cancelSyncChannelIds = last.filter(item => now.indexOf(item) === -1);
    return [syncChannelIds, cancelSyncChannelIds];
  };

  /**
   * get subcategory by category 设置二级大类热点
   */
  const getSubCategoryList = useCallback(async (cate: Array<string> | string) => {
    // 判断是否为多选 数组为多选
    if (Array.isArray(cate)) {
      const promiseArr = cate.map(item => getSubCategoryByCategory({ cate: item }));
      const data = await Promise.all(promiseArr);
      // boolean  status是数组 判断每一项是否都是success
      const status = data.map(item => item.status === 'success').every(item => item === true);
      if (status) {
        let dataArr: Array<string> = []; //大类中的小类数组 array
        data.map(item => {
          dataArr = dataArr.concat(item.data);
        });
        setSubCategoryList(dataArr);
      } else {
        message.error('获取小类失败，请刷新重试');
      }
    } else {
      const { status, data, reason } = await getSubCategoryByCategory({ cate });
      if (status === 'success') {
        //删除时请求接口 array格式保证不报错
        if (Array.isArray(data)) {
          setSubCategoryList(data);
        } else {
          setSubCategoryList([]);
        }
      } else {
        message.error(reason);
      }
    }
  }, []);

  /**
   * change category 二级热点多选时用
   */
  const handleChangeCategory = (
    cate: Array<string> | string,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void,
  ) => {
    setFieldValue('subcat', []);
    let newCate: string | Array<string>;
    if (Array.isArray(cate)) {
      if (cate.length > 2) {
        newCate = cate.slice(1);
        message.info('只支持大类选择两个');
      } else {
        newCate = cate;
      }
    } else {
      newCate = cate;
    }
    getSubCategoryList(newCate);
    // setFieldValue 强制渲染大类数据 下面在改回来！！ 可能有bug
    setFieldValue('cat', newCate);
  };

  /**
   *
   * @param value
   * @returns 热点大类校验
   */
  const validateType = (value: string | []) => {
    let error = '';
    if (!value) {
      error = '请填写大类（必填项）';
    }
    // } else if (value.length <= 0) {
    //   error = '请填写大类（必填项）'
    // }
    if (Array.isArray(value) && value.length <= 0) {
      error = '请填写大类（必填项）';
    }
    return error;
  };

  /**
   * 关闭窗口
   */
  const closeModal = () => {
    setShowSurface(false);
  };
  /**
   *
   * @param value
   * @returns 热点位置校验
   */
  const validatePlace = (value: any) => {
    let error = '';
    if (!value) {
      error = '请填写位置（必填项）';
    }
    return error;
  };
  const getUrl = () => {
    if (location.hostname.indexOf('venus.int') === -1) {
      return '/app/editor-push-news/push/editor?docid=';
    }
    return `http://venus.int.yidian-inc.com:5301/app/editor-push-news/push/editor?docid=`;
    // `http://pandora.yidian-inc.com/tools/editor_push_news?docid=${recItem.docid}`
  };
  // update hot event
  const handleUpdateHotEvent = (values: { [key: string]: any }, actions: any): void => {
    actions.setSubmitting(false);
    const tempDoc = { ...doc };

    // 热点等级设置为0 清除editorEventLevel属性
    if (!values.editorEventLevel) {
      delete tempDoc.editorEventLevel;
    }

    for (let key in values) {
      tempDoc[key] = values[key];

      if (key === 'editorEventLevel' && values[key]) {
        if (['eventL1', 'eventL2'].includes(values[key])) {
          tempDoc.audience_type = 1;
        } else {
          delete tempDoc.audience_type;
        }
      }
    }

    tempDoc.last_update_ts = +new Date();
    updateTopItem(index, tempDoc);
    setHotEventVisible(false);
  };

  // remove 移除置顶
  const handleRemove = (): void => {
    const tempTopList = [...topList];
    tempTopList.splice(index, 1);
    updateTopList(tempTopList, () => message.success(`文章已从置顶列表删除成功！`));
  };

  // 选中当前的list
  const handleTopitemChecked = (e: CheckboxChangeEvent) => {
    const checked = e.target.checked;
    if (checked) {
      updateDellist([...todelList, doc.docid]);
      setChecked(checked);
    } else {
      updateDellist(todelList.filter(delitem => delitem !== doc.docid));
      setChecked(checked);
    }
  };

  // 热点设置按钮样式
  const hotLevelMap = (editorEventLevel: string | undefined) => {
    switch (true) {
      case editorEventLevel === 'eventL3':
        return '三级热点';
      case editorEventLevel === 'eventL2':
        return '二级热点';
      case editorEventLevel === 'eventL1':
        return '一级热点';
      default:
        return '未设置热点';
    }
  };

  // 根据全选按钮更新状态
  useEffect(() => {
    if (checkAll) {
      setChecked(true);
    } else {
      setChecked(false);
    }
  }, [checkAll]);
  const renderPic = (item: Array<string>) => {
    if (item && item[0]) {
      return <img src={`https://i1.go2yd.com/image.php?url=${item[0]}&type=thumbnail_60x60`}></img>;
    }
    return <span></span>;
  };

  // 把时间戳转为小时分钟
  const formateFirstAddTopTime = useCallback(() => {
    let time = doc.firstAddTopTime || 0
    if (!time) {
      return ''
    }
    let timeNum = (+new Date() - time)/1000 // 毫秒转成秒
    let h =  timeNum / 60 / 60
    h = parseInt(h + '')
    let m = (timeNum - h * 60 * 60) / 60
    m = parseInt(m + '')
    let result = `${h}小时${m}分钟`

    return result
  }, [doc.firstAddTopTime])

  return (
    <div className="top-item" key={key} style={style}>
      <div className="top-item-left">
        <div className="top-item-info">
          <div className="top-item-info-detail">
            <div className="top-item-info-detail-top">
              <div className="top-item-info-detail-left">
                {showCheckAll && (
                  <Checkbox
                    style={{ marginRight: 8 }}
                    onChange={handleTopitemChecked}
                    checked={checked}
                  />
                )}
                <span>
                  <span style={{ marginRight: 8 }}>{index + 1}</span>
                  <a
                    href={`http://pandora.yidian-inc.com/article/${doc.docid}?hl=1`}
                    style={{ marginRight: 8 }}
                    target="ifr-article"
                    onClick={handleClickTitle}
                  >
                    {doc.title_new || doc.title}
                  </a>
                  <span className="top-item-info-detail-title-length">
                    {doc.title_new ? doc.title_new.length : doc.title ? doc.title.length : 0}
                  </span>
                  <EditOutlined onClick={() => setIsEdit(true)} />
                </span>
                {isEdit && (
                  <>
                    <Input
                      size="small"
                      defaultValue={title}
                      onChange={e =>
                        setTitle(
                          decodeURIComponent(
                            encodeURIComponent(e.target.value).replace(/%E2%80%8B/g, ''),
                          ) || '',
                        )
                      }
                    />
                    <Button type="primary" size="small" onClick={handleUpdateTitle}>
                      修改标题
                    </Button>
                  </>
                )}
              </div>
              <div className="top-item-info-detail-right">
                {renderPic(doc.image_urls || (doc.image ? [doc.image] : []))}
              </div>
            </div>
            {/* <ImgItem
              imageUrls={doc.image_urls || (doc.image ? [doc.image] : [])}
              image={doc.image}
              docid={doc.docid}
              index={index}
              doc={doc}
            /> */}
            <Row style={{ marginBottom: 8 }}>
              <Tag color="red" style={{ marginRight: 8 }}>
                {tagMap[doc.tag] || '热'}
              </Tag>
              {
                doc.firstAddTopTime && <span className='firstAddTopTime'>{formateFirstAddTopTime()}</span>
              }
              <Tooltip title="点我复制" placement="bottom">
                <label ref={docidRef} onClick={handleCopyDocid} style={{ marginRight: 8 }}>
                  {doc.docid}
                </label>
              </Tooltip>
              <label style={{ marginRight: 8 }}>{doc.source}</label>
              <label style={{ marginRight: 8 }}>{doc.date}</label>
            </Row>
          </div>
        </div>
        <DocData doc={doc} />
        <div className="top-item-op">
          <Row style={{ marginBottom: 8 }}>
            <InputGroup compact style={{ display: 'inline-block' }}>
              <Input
                className="top-item-op-input"
                size="small"
                placeholder="排序"
                onPressEnter={handleResetOrder}
              />
              <Input
                className="top-item-op-input"
                size="small"
                defaultValue={doc.count || ''}
                onChange={e => handleUpdateInputValue('count', e)}
                placeholder="强置顶"
              />
              <Input
                className="top-item-op-input"
                size="small"
                defaultValue={doc.group || ''}
                onChange={e => handleUpdateInputValue('group', e)}
                placeholder="轮播"
              />
              <Input
                className="top-item-op-input"
                size="small"
                defaultValue={doc.fromid || ''}
                onChange={e => handleUpdateInputValue('fromid', e)}
                placeholder="频道 id"
              />
              <Select
                className="top-item-op-select"
                size="small"
                defaultValue={doc.tag}
                onChange={(val: string) => handleUpdateSelectValue('tag', val)}
                placeholder="角标"
              >
                {renderTagOptions()}
              </Select>
            </InputGroup>
          </Row>
          <Row style={{ marginBottom: 8 }}>
            <ButtonGroup>
              <Popconfirm
                title="确定要从置顶列表中移除吗？"
                onConfirm={handleRemove}
                // onCancel={ }
                okText="确定"
                cancelText="取消"
              >
                <Button size="small">移除置顶</Button>
              </Popconfirm>
              {setBigState ? (
                <Button
                  size="small"
                  onClick={() => handleUpdateDType(setBigState)}
                  style={{ background: 'rgba(255, 153, 153, 1)' }}
                >
                  取消大图
                </Button>
              ) : (
                <Button size="small" onClick={() => handleUpdateDType(setBigState)}>
                  设大图
                </Button>
              )}
              {/* <Button
                size="small"
                onClick={() => {
                  editSurface(doc);
                }}
              >
                封面图
              </Button> */}
              {channelType === 'local' && (
                <Button size="small" onClick={() => openSyncModal(doc.docid)}>
                  {' '}
                  同步{' '}
                </Button>
              )}
              {fromid === 'homepage' && (
                <Button
                  className={doc.editorEventLevel && 'red'}
                  size="small"
                  type="primary"
                  onClick={() => setHotEventVisible(true)}
                >
                  {hotLevelMap(doc.editorEventLevel)}
                </Button>
              )}
              <Checkbox
                checked={doc.feedback_forbidden || false}
                onChange={e => handleUpdateCheckboxValue('feedback_forbidden', e)}
                style={{ marginLeft: '16px' }}
              >
                禁止负反馈
              </Checkbox>
            </ButtonGroup>
          </Row>
          <Row style={{ marginBottom: 8 }}>
            <Select
              className="top-item-op-select-long"
              mode="multiple"
              size="small"
              defaultValue={doc.block_appids || []}
              onChange={(val: Array<string>) => handleUpdateSelectValue('block_appids', val)}
              placeholder="要屏蔽的 appId"
            >
              {renderBlockAppIdOptions()}
            </Select>
            <ButtonGroup>
              {doc.docid && (
                <div>
                  <Button
                    type="primary"
                    size="small"
                    href={`http://pandora.yidian-inc.com/tools/newseditor?id=${doc.docid}`}
                    target="_blank"
                  >
                    {' '}
                    编辑{' '}
                  </Button>
                  <Button
                    type="primary"
                    size="small"
                    href={`http://pandora.yidian-inc.com/tools/commentsoperate?docid=${doc.docid}`}
                    target="_blank"
                  >
                    {' '}
                    评论{' '}
                  </Button>
                  <Button
                    type="primary"
                    size="small"
                    href={getUrl() + `${doc.docid}`}
                    target="_blank"
                  >
                    {' '}
                    PUSH{' '}
                  </Button>
                </div>
              )}
            </ButtonGroup>
          </Row>
        </div>
      </div>
      {showSurface && (
        <Modal
          visible={showSurface}
          footer={null}
          onCancel={() => setShowSurface(false)}
          width={600}
        >
          <Surface
            itemData={(surfaceEditer as unknown) as RecItemProps}
            closeModal={closeModal}
            index={index}
          />
        </Modal>
      )}
      <Modal
        title="同步新闻到下属地区"
        visible={syncVisible}
        onCancel={() => setSyncVisible(false)}
        footer={null}
      >
        <Formik
          initialValues={{ selectedLocation: lastSelectedLocation }}
          onSubmit={(values, actions) => handleUpdateSyncChannel(values, actions)}
        >
          {() => (
            <Form {...locationLayout}>
              <FormItem
                name="selectedLocation"
                // label="地区"
              >
                <CheckboxFormik.Group name="selectedLocation">
                  <Row>{renderLocationOptions()}</Row>
                </CheckboxFormik.Group>
              </FormItem>
              <FormItem name="op">
                <SubmitButton>保存</SubmitButton>
                <ResetButton style={{ marginLeft: '16px' }}>重置</ResetButton>
              </FormItem>
            </Form>
          )}
        </Formik>
      </Modal>
      <Modal
        title="设置热点等级"
        visible={hotEventVisible}
        onCancel={() => setHotEventVisible(false)}
        footer={null}
      >
        <Formik
          initialValues={{
            editorEventLevel: doc.editorEventLevel || '',
            location: doc.location || '',
            cat: doc.cat || '',
            subcat: doc.subcat || [],
          }}
          onSubmit={(values, actions) => handleUpdateHotEvent(values, actions)}
        >
          {({ values, setFieldValue, setValues }) => (
            <Form {...layout}>
              <FormItem name="editorEventLevel" label="热点等级">
                <SelectFormik name="editorEventLevel" placeholder="请选择热点等级" allowClear>
                  {renderHotEventLevelOptions()}
                </SelectFormik>
              </FormItem>

              {['eventL1', 'eventL2'].includes(values.editorEventLevel) ? (
                <FormItem name="location" label="位置" validate={validatePlace}>
                  <SelectFormik name="location" placeholder="请选择位置" allowClear>
                    {renderHotEventLocationOptions()}
                  </SelectFormik>
                </FormItem>
              ) : null}

              {['eventL2'].includes(values.editorEventLevel) ? (
                <>
                  <FormItem name="cat" label="大类" validate={validateType}>
                    <SelectFormik
                      name="cat"
                      placeholder="请选择大类"
                      mode="multiple" // 二级大类是否为多选 不是注释掉这行
                      onChange={val => handleChangeCategory(val, setFieldValue)}
                      allowClear
                    >
                      {renderHotEventCategoryOptions()}
                    </SelectFormik>
                  </FormItem>

                  <FormItem name="subcat" label="小类">
                    <SelectFormik
                      name="subcat"
                      placeholder="请选择小类，支持多选"
                      mode="multiple"
                      allowClear
                    >
                      {renderHotEventSubCategoryOptions()}
                    </SelectFormik>
                  </FormItem>
                </>
              ) : null}

              <FormItem {...tailLayout} name="op">
                <SubmitButton>保存</SubmitButton>
                <Button
                  style={{ marginLeft: '16px' }}
                  onClick={() =>
                    setValues({
                      editorEventLevel: '',
                      location: '',
                      cat: '',
                      subcat: [],
                    })
                  }
                >
                  重置
                </Button>
              </FormItem>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state: ConnectState) => ({
  channelName: topNewsSelectors.channelName(state),
  channelType: topNewsSelectors.channelType(state),
  topList: topNewsSelectors.topList(state),
  categoryList: topNewsSelectors.categoryList(state),
});

const mapDispatchesToProps = (dispatch: Dispatch) => ({
  updateTopItem: topNewsDispatches.updateTopItem(dispatch),
  updateTopList: topNewsDispatches.updateTopList(dispatch),
  updateCurrentTopItem: topNewsDispatches.updateCurrentTopItem(dispatch),
});

export default connect(mapStateToProps, mapDispatchesToProps)(TopItem);
