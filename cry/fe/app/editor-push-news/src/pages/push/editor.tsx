import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'dva';
import { message, Radio, Popconfirm, Button, Table, Modal, Icon, Form as AForm, Select, Tag } from 'antd';
import { Formik } from 'formik';
import { Form } from 'formik-antd';
import axios from 'axios';

import { FormikPushContent } from '@/components/pushContent';
import { PushStrat } from '@/components/PushStrat';
import { PushUser } from '@/components/PushUser';
import { PushArrival } from '@/components/PushArrival';
import { PushClient } from '@/components/PushClient';
import { CateColModal } from '@/components/CatesForm';
import { TagFormModal } from '@/components/TagForm';
import { PushQuota } from '@/components/PushQuota';
import { templistSelector, pushkeySelector, editorauthSelector } from '@/selectors/account';
import { localtagsSelector } from '@/selectors/editorpush';
import { checkDuplicate, submitPush, submitSectionPush, harmonyOSPushHistory, getOppoPushIsOver } from '@/services/editorpushService';
import { DuplicateCheckProps } from '@/config/pushForm/push';
import { Biz, PushData, Temp, TempConfig, TempValue } from '@/config/editorpush/push';
import { duplicate_columns, default_temp, default_biz, default_temp_config, default_temp_value } from '@/config/editorpush/push.config';
import { parseselect, isEmpty } from '@/utils';
import { EditorProvider } from '@/hooks';
import { business_map, user_tags_map, user_tags_map_reverse } from '@/data';
import { SubmitModal } from './components/SubmitModal';
import './index.less';
let oppoPayFlag: any

interface defaultContent {
  title: string;
  summary: string;
  doc_id: string;
}

let timer: any = ''
let modelFlag: number = 0

const EditorPush: React.FC = () => {
  const dispatch = useDispatch();
  const submitRef = useRef<HTMLButtonElement>(null);

  const templist = useSelector(templistSelector);
  const pushkey = useSelector(pushkeySelector);
  const localTags = useSelector(localtagsSelector);
  const [clientBtn, setClientBtn] = useState<boolean>(false); // 客户端按钮
  const [biz, setBiz] = useState<Biz>(default_biz); // 业务线
  const [temp, setTemp] = useState<Temp>(default_temp); // 模版
  const [tempConfig, setTempConfig] = useState<TempConfig>(default_temp_config); // 模版配置
  const [tempValue, setTempValue] = useState<TempValue>(default_temp_value); //   默认模版值
  const [showDups, setShowDups] = useState<boolean>(false); // 展示重复性校验
  const [dups, setDups] = useState<DuplicateCheckProps[]>([]); // 重复推送内容，仅针对局部突发和局部个性化
  const [defaultContent, setDefaultContent] = useState<defaultContent>({ doc_id: '', summary: '', title: '' }); // 推送内容默认值 为了切换模版保留docid等用的
  const [visible, setVisible] = useState<boolean>(false);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [modalValue, setModalValue] = useState(default_temp_value);
  const [submitButtonDisable, setSubmitButtonDisable] = useState<boolean>(false);

  // 开启客户端按钮
  const handleClient = () => {
    setClientBtn(clientBtn => !clientBtn);
  };
 //分四个oppo渠道推送
  // const channel_stauts = (data:any,values:any)=>{
  //    let cateId = ['z1','z2','z3','z4','z5','z6','z7','z8','z10','z11','z12','z13','z14','z15','z16','z17','z18','z19','z20','z21','z22','z23','z24','z25','z26','z32','z33','z34']
  //    let obj = {}
  //    let twoObject = {}
  //     if (data === '001') {
  //       obj = {push_channel_id:'oppochannelid1'}
  //       twoObject = Object.assign(obj,values)
  //       console.log(twoObject,'twoObject1');
  //       // setModalValue(twoObject);
  //     }
  //     if (data === '002' && cateId.indexOf(values.cate) >= 0) {
  //       obj = {push_channel_id:'oppochannelid2'}
  //       twoObject = Object.assign(obj,values)
  //       console.log(twoObject,'twoObject2');
  //       // setModalValue(twoObject);
  //     }
  //      if (data === '002' && values.cate === 'z27') {
  //       obj = {push_channel_id:'oppochannelid3'}
  //        twoObject = Object.assign(obj,values)
  //       console.log(twoObject,'twoObject3');
  //       // setModalValue(twoObject);
  //     }
  //      if (data === '002'  && cateId.indexOf(values.cate) < 0 && values.cate !== 'z27' || data === '004' || data==='003') {
  //       obj = {push_channel_id:'oppochannelid4'}
  //       twoObject = Object.assign(obj,values)
  //       console.log(twoObject,'twoObject4');
  //       // setModalValue(twoObject);
  //     }
  //     return twoObject
  // }

  const handleShowSubmitModal = (values: Partial<PushData>) => {
    // const value  =  channel_stauts(templateId,values)
    setModalValue(values);
    setVisible(true);
  };

  /**
   * @returns 进行重复推送校验
   * @param values 推送的所有参数
   * @param errors 报错
   */
  const checkDuplicatePush = async (values: Partial<PushData>, errors?: Record<string, any>) => {
    const { doc_id: docid = '', title = '', summary = '', open_sectional = false, section = {} } = values;
    if (open_sectional) {
      if (!submitRef.current) {
        throw new Error('未获取到提交按钮');
      }
      submitRef.current.click();
    } else {
      if (!submitRef.current) {
        throw new Error('未获取到提交按钮');
      }
      submitRef.current.click();
    }
  };
 
  const submitEdiorPush = async (values: Partial<PushData>, errors: Record<string, any>, setValues: (values: Partial<PushData>) => void) => {
    // console.log(values)
    // return false
    //  const values  =  channel_stauts(templateId,values)
    setBtnLoading(true)
    const pushdata = { ...values, key: pushkey };
    const { open_sectional } = values;
    const tags = pushdata.tags;
    const userTags = Object.keys(user_tags_map);
    const userTagsVals = Object.keys(user_tags_map_reverse);
    
    Array.isArray(tags) &&
      tags.forEach(tag => {
        // @ts-ignore
        if (userTags.includes(tag) && !tags.includes(user_tags_map[tag])) {
          // @ts-ignore
          tags.push(user_tags_map[tag]);
        }

        const idx = userTagsVals.indexOf(tag);
        if (!userTags.includes(tag) && idx !== -1) {
          tags.splice(idx, 1);
        }
      });

    console.log(pushdata, 'push参数-----------');
    try {
      if (!pushkey) {
        throw new Error('未获取到当前用户的pushkey');
      }
      if (isEmpty(errors) === false) {
        throw new Error(Object.values(errors!).join(','));
      }

      if (open_sectional) {
        // 开启分段式分发
        const pushRes = await submitSectionPush(pushdata, false);
        
        if (pushRes.status == 'success') {
          message.success(`提交成功, ${pushRes.data}`, 5);
          setValues(tempValue);
          setVisible(false);
          setBtnLoading(false)
          // 推送成功才触发鸿蒙推送
          if (temp === '001') {
            let res = await harmonyOSPushHistory(pushdata)
            // console.log(res)
            // location.href='/app/editor-push-news/push/editor' // 鸿蒙推送成功后 刷新下页面
          }
          if (location.href.indexOf('docid=') > -1) {
            history.pushState('', '', "/app/editor-push-news/push/editor")
          }
          dispatch({
            type: 'editorpush/updateSectionDocInfo',
            payload: {
              docinfo: {
                docid1: '',
                title1: '',
                summary1: '',
                error1: '',
                docid2: '',
                title2: '',
                summary2: '',
                error2: '',
                docid3: '',
                title3: '',
                summary3: '',
                error3: '',
              },
            },
          });
        } else {
          if (pushRes.message.indexOf(10004) !== -1) {
            message.error('没有推送权限，若需要进行消息推送，请开通权限');
            setVisible(false);
            setBtnLoading(false)
            return;
          }
          throw new Error(pushRes.message);
        }
      } else {
        // 正常推送没有开启分段式
        // title summary doc_id
        const pushRes = await submitPush(pushdata);
        if (pushRes.status == 'success') {
          message.success('提交成功');
          setValues(tempValue);
          setVisible(false);
          setBtnLoading(false)
          // 推送成功才触发鸿蒙推送
          if (temp === '001') {
            let res = await harmonyOSPushHistory(pushdata)
            // console.log(res)
            // location.href='/app/editor-push-news/push/editor' // 鸿蒙推送成功后 刷新下页面
          }
          if (location.href.indexOf('docid=') > -1) {
            history.pushState('', '', "/app/editor-push-news/push/editor")
          }
          dispatch({
            type: 'editorpush/updateDocInfo',
            payload: { docinfo: { docid: '', title: '', summary: '', error: '' } },
          });
          dispatch({
            type: 'editorpush/updateImage',
            payload: {
              articleInfo: {
                image_urls: [],
                image: '',
                serving_status: false,
                summary: '',
                title: '',
                ncat: '',
                nsubcat: '',
                rec_tags: {},
              },
            },
          });
        } else {
          if (pushRes.message.indexOf(10004) !== -1) {
            message.error('没有推送权限，若需要进行消息推送，请开通权限');
            setVisible(false);
            setBtnLoading(false)
            return;
          }
          throw new Error(pushRes.message);
        }
      }
    } catch (err) {
      setVisible(false);
      setBtnLoading(false)
      message.error(err.toString());
    }
  };

  const handleRepushConfirm = () => {
    if (!submitRef.current) {
      throw new Error('未获取到提交按钮');
    }

    submitRef.current.click();
  };

  const startListenExaTag = (num: number) => { // 定时
    // 定时器里 获取不到 state变化后的值，所以就把num当参数传进来了
    timer = setInterval (() => {
      let flag
      let date = new Date()
      let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      let min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      let dateStr = `${hour}:${min}`
      if (
        // (dateStr >= '00:00' && dateStr < '05:00') ||
        (dateStr >= '05:00' && dateStr < '06:30') ||
        // (dateStr >= '06:30' && dateStr < '09:00') ||
        (dateStr >= '09:00' && dateStr < '11:00') ||
        // (dateStr >= '11:00' && dateStr < '11:30') ||
        (dateStr >= '11:30' && dateStr < '13:00') ||
        // (dateStr >= '13:00' && dateStr < '17:00') ||
        (dateStr >= '17:00' && dateStr < '18:30') ||
        // (dateStr >= '18:30' && dateStr < '21:00') ||
        (dateStr >= '21:00' && dateStr < '23:00')
        // (dateStr >= '23:00' && dateStr < '23:59')
      ) {
        flag = 2
      } else {
        flag = 3
      }
      if (flag !== num) {
        Modal.info({
          title: '通知',
          content: (
            <div>
              <p>默认排除标签发生改变，请手动刷新页面!</p>
            </div>
          ),
          onOk() {},
        });
        clearInterval(timer)
      }
    }, 2000)
  }

  const initExtTagFlag = () => {
    // n 变化 代表 到时间节点了， 需要刷新状态
    let n
    let date = new Date()
    let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    let min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    let dateStr = `${hour}:${min}`
    if (
        (dateStr >= '00:00' && dateStr < '05:00') ||
        // (dateStr >= '05:00' && dateStr < '06:30') ||
        (dateStr >= '06:30' && dateStr < '09:00') ||
        // (dateStr >= '09:00' && dateStr < '11:00') ||
        (dateStr >= '11:00' && dateStr < '11:30') ||
        // (dateStr >= '11:30' && dateStr < '13:00') ||
        (dateStr >= '13:00' && dateStr < '17:00') ||
        // (dateStr >= '17:00' && dateStr < '18:30') ||
        (dateStr >= '18:30' && dateStr < '21:00') ||
        // (dateStr >= '21:00' && dateStr < '23:00') ||
        (dateStr >= '23:00' && dateStr <= '23:59')
      ) {
      n = 3
    } else {
      n = 2
    }
    startListenExaTag(n)
  }

  const initSubmitButtonDisable = async () => {
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

  useEffect(() => {
    // 获取用户层级列表
    dispatch({
      type: 'editorpush/fetchUserLayerList',
      payload: {},
    });

    // 获取同步平台列表
    dispatch({
      type: 'editorpush/fetchAsyncPlatformList',
      payload: {},
    });

    // 获取推送分类
    dispatch({
      type: 'editorpush/fetchCateList',
      payload: {},
    });

    // 获取历史数据用于判断docid是否已经推送过
    dispatch({
      type: 'editorpush/fetchPushHistory',
      payload: { formscreen: {} },
    });
    initExtTagFlag()
    initSubmitButtonDisable()
  }, []);

  // 选择业务线的同时变化可选模版列表
  useEffect(() => {
    // 获取当前账户下的模版列表
    dispatch({
      type: 'accountEnum/getAccountTemps',
      payload: { biz },
    });
  }, [biz]);

  // 模版列表改变去更换默认temp, 默认temp为所属业务线下userid类型或者第一项
  useEffect(() => {
    const defaultTempItem = templist.find(tempitem => tempitem.values.pushType === 'userids');

    if (isEmpty(templist)) {
      return setTemp(undefined);
    }

    if (isEmpty(defaultTempItem) === false) {
      return setTemp(defaultTempItem?.temp_id);
    }
    setTemp(templist[0].temp_id);
  }, [JSON.stringify(templist)]); // templist的selector有个过滤 导致每次都是地址不同的对象 换成字符串就不会走了

  // 模版变化的同时去更新配置项和默认值
  useEffect(() => {
    initTempFn(temp)
  }, [temp]);

  const initTempFn = async (temp: any) => {
    const selectedTemp = templist.find(tempitem => tempitem.temp_id === temp);

    let targetTempConfig = default_temp_config;
    let targetTempValue = default_temp_value;

    if (isEmpty(selectedTemp) === false) {
      targetTempConfig = selectedTemp!.forms;
      targetTempValue = selectedTemp!.values;
    }
    // 如果保存了模版docid等值就更新
    if (defaultContent.doc_id) {
      targetTempValue.doc_id = defaultContent.doc_id;
    }
    if (defaultContent.title) {
      targetTempValue.title = defaultContent.title;
    }
    if (defaultContent.summary) {
      targetTempValue.summary = defaultContent.summary;
    }
    const isOpenOppoPushButton = await getOppoPushIsOver() 
    setTempConfig(targetTempConfig);

    if(isOpenOppoPushButton) {
      if (temp === '001') {
        setTempValue(Object.assign({}, targetTempValue, { oppo_pay: '1', excludeTags: ['e2465900', 'e2465918', 'e3138922', 'e3144742']}));
      }
      if (temp === '002') {
        setTempValue(Object.assign({}, targetTempValue, { oppo_pay: '1', excludeTags: ['e2465900', 'e2465918', 'e3138922', 'e3144742']}));
      }
      if (temp === '003') {
        setTempValue(Object.assign({}, targetTempValue, { oppo_pay: '0', excludeTags: ['e2465900', 'e2465918', 'e2465915', 'e3138922', 'e3144742']}));
      }
      if (temp === '004') {
        setTempValue(targetTempValue);
      }
    } else {
      setTempValue(targetTempValue);
    }

    if (!isOpenOppoPushButton) { // 配额没用完的时候才开始这个定时
      oppoPayFlag = setInterval(async () => {
        const subIsOpenOppoPushButton = await getOppoPushIsOver() 
        if (subIsOpenOppoPushButton && modelFlag === 0) {
          Modal.warning({
            title: 'oppo免费配额已耗尽，请刷新页面',
          });
          modelFlag = 1
          clearInterval(oppoPayFlag)
        }
      }, 10 * 1000)
    } else {
      if (oppoPayFlag) clearInterval(oppoPayFlag)
    }
  }

  // 在切换模版的时候保存docid等值 报错是因为类型定义是docid 但是表单里是doc_id
  const handleChangeTemp = (temp: Temp, values: Partial<PushData>) => {
    setDefaultContent({ doc_id: values.doc_id || '', summary: values.summary || '', title: values.title || '' });
    setTemp(temp);
    dispatch({
      type: 'template/setCurrentTemplate',
      payload: { currentTemplate: temp },
    });
  };

  // @ts-ignore
  const testSubmit = (pushdata, errors, setValues) => {
    const userTags = Object.keys(user_tags_map);
    const userTagsVals = Object.keys(user_tags_map_reverse);
    const tags = pushdata.tags;

    Array.isArray(tags) &&
      tags.forEach((tag: string) => {
        if (userTags.includes(tag) && !tags.includes(user_tags_map[tag])) {
          tags.push(user_tags_map[tag]);
        }

        const idx = userTagsVals.indexOf(tag);
        if (!userTags.includes(tag) && idx !== -1) {
          tags.splice(idx, 1);
        }
      });

    setValues(tempValue);
    console.log(pushdata, 'push参数-----------');
    try {
      if (isEmpty(errors) === false) {
        throw new Error(Object.values(errors!).join(','));
      }
      message.success('测试：提交成功');
    } catch (err) {
      setVisible(false);
      message.error(err.toString());
    }
    alert(tags && JSON.stringify(tags));
  };

  // console.log(tempValue) 

  return (
    <div className="editorpush">
      <EditorProvider value={{ temp, biz, config: tempConfig, value: tempValue }}>
        <Formik initialValues={tempValue} enableReinitialize onSubmit={() => {}}>
          {({ values, errors, setValues }) => {
            return (
              <>
                <button style={{ display: 'none' }} ref={submitRef} onClick={() => submitEdiorPush(values, errors, setValues)} />
                <div className="editorpush-header">
                  <div className="editorpush-header-operation">
                    <label>常用操作</label>
                    <div>
                      <CateColModal />
                      <TagFormModal />
                      <PushQuota />
                    </div>
                  </div>

                  {/* 测试环境专用按钮 */}
                  {/* <Button type="danger" onClick={() => testSubmit(values, errors, setValues)}>
                    测试测试，点这个按钮就行，看看弹窗里是否关联上了标签
                  </Button> */}

                  {/* <Popconfirm title={renderPushConfirmTitle(values)} onConfirm={() => checkDuplicatePush(values)} style={{ width: '300px' }}>
                    <Button size="small" type="primary">
                      提 交
                    </Button>
                  </Popconfirm> */}
                  {
                    submitButtonDisable ?
                    <Button size="small" onClick={() => { message.warning('特殊情况，暂时无法提交，有问题请联系 闫亚龙')}}>
                      提 交
                    </Button> :
                    <Button size="small" type="primary" onClick={() => handleShowSubmitModal(values)}>
                      提 交
                    </Button>
                  }
                </div>
                <div className="editorpush-body">
                  <Form
                    colon={false}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    labelAlign="left"
                    layout="vertical"
                    hideRequiredMark={false}
                    className="formall"
                  >
                    <section>
                      <AForm.Item className="form-item" label="推送业务线">
                        <Select value={biz} onChange={setBiz}>
                          {parseselect(business_map)}
                        </Select>
                      </AForm.Item>
                      <AForm.Item className="form-item" label="推送模版">
                        <Radio.Group
                          buttonStyle="solid"
                          value={temp}
                          onChange={e => {
                            handleChangeTemp(e.target.value, values);
                          }}
                        >
                          {templist.map(temp => (
                            <Radio.Button key={temp.temp_id} value={temp.temp_id}>
                              {temp.temp_name}
                            </Radio.Button>
                          ))}
                        </Radio.Group>
                      </AForm.Item>
                    </section>

                    <section className="section">
                      <div className="tag">推送内容</div>
                      <FormikPushContent />
                    </section>

                    {tempConfig?.strat?.length > 0 && (
                      <section className="section">
                        <div className="tag">推送配置</div>
                        <PushStrat config={tempConfig?.strat} />
                      </section>
                    )}

                    {tempConfig?.user?.length > 0 && (
                      <section className="section">
                        <div className="tag">推送用户</div>
                        <PushUser config={tempConfig?.user} />
                      </section>
                    )}

                    {tempConfig?.arrival?.length > 0 && (
                      <section className="section">
                        <div className="tag">推送到达</div>
                        <PushArrival config={tempConfig?.arrival} />
                      </section>
                    )}

                    <section className="section last">
                      <div className="tag" onClick={handleClient}>
                        客户端到达配置&nbsp;
                        <Icon type={clientBtn ? 'up' : 'down'} />
                      </div>
                      {clientBtn && <PushClient config={tempConfig?.client} />}
                    </section>
                  </Form>
                </div>
              </>
            );
          }}
        </Formik>
      </EditorProvider>
      <Modal
        width={1000}
        title={
          <>
            <Icon type="warning" theme="twoTone" twoToneColor="#ff0000" />
            <span style={{ marginLeft: '5px', color: 'red' }}>重复推送</span>
          </>
        }
        visible={showDups}
        onCancel={() => setShowDups(false)} // 仅关闭，因为没有人工查看的按钮，这里的内容在每次被打开都是更新的
        onOk={handleRepushConfirm}
        okText="强制推送"
        cancelText="修改推送配置"
      >
        <Table columns={duplicate_columns} dataSource={dups} />
      </Modal>
      <SubmitModal btnLoading={btnLoading} visible={visible} values={modalValue} onSubmit={() => checkDuplicatePush(tempValue)} onClose={() => setVisible(false)} />
    </div>
  );
};

export default React.memo(EditorPush);
