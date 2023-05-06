import React, { FC, useCallback, useState, useEffect, useRef } from 'react';
import { Card, Table, message, Button, Modal, Input, Form } from 'antd';
import request from '@/utils/request';
import axios from 'axios';
import AddCoverForm from '@/components/userCover/addForm';
import { LogInfo } from '@/config/constant';
import { getIsDev } from '@/utils/get_dev';
import { exportData } from '@/utils/export_data';
import { saveKibana, saveStaticLog } from '@/utils/log';

const isDev = getIsDev();
const { Search } = Input;
interface AddCoverFormProps {
  form: { getFieldDecorator: any; validateFields: any; resetFields: any; setFieldsValue: any };
  location: { query: any; params: any };
}
const UserCover: FC<AddCoverFormProps> = (props: AddCoverFormProps) => {
  const column = [
    {
      title: '编号',
      dataIndex: 'groupId',
      key: 'groupId',
      width: 90,
    },
    {
      title: '图文过滤规则',
      dataIndex: 'ruleId',
      key: 'ruleId',
      width: 150,
    },
    {
      title: '视频过滤规则',
      dataIndex: 'videoId',
      key: 'videoId',
      width: 150,
    },
    {
      title: '环境',
      dataIndex: 'env',
      key: 'env',
      width: 120,
      filters: [
        {
          text: 'all',
          value: 'all',
        },
        {
          text: 'app',
          value: 'app',
        },
        {
          text: 'mibrowser',
          value: 'mibrowser',
        },
        {
          text: 'oppobrowser',
          value: 'oppobrowser',
        },
        {
          text: '3rd-small',
          value: '3rd-small',
        },
      ],
      onFilter: (value: any, record: { env: string | any[] }) => record.env.indexOf(value) === 0,
    },
    {
      title: '操作系统',
      align: 'center',
      dataIndex: 'os',
      key: 'os',
      width: 100,
    },
    {
      title: 'appId',
      dataIndex: 'appId.splitdata',
      width: 150,
      key: 'appId',
    },
    {
      title: '城市',
      dataIndex: 'city.splitdata',
      key: 'city',
      width: 120,
      // },{
      //   title: '商圈',
      //   dataIndex: 'businessArea.splitdata',
    },
    {
      title: 'bucket',
      dataIndex: 'bucket.splitdata',
      width: 120,
      key: 'bucket',
    },
    {
      title: '是否在 -3 场景生效',
      dataIndex: 'minus3',
      align: 'center',
      width: 150,
      key: 'minus3',
      render: (text: any) => (text ? '是' : '否'),
    },
    {
      title: '渠道号',
      dataIndex: 'userRiseCS.splitdata',
      key: 'userRiseCS',
      width: 120,
    },
    {
      title: '品牌',
      dataIndex: 'distribution',
      key: 'distribution',
      width: 90,
      render: (text: any) => {
        if (text && text.length > 0 && typeof text !== 'string') {
          text = text.join(',');
        } else {
          text = '无';
        }
        return text;
      },
    },
    {
      title: '用户维度',
      dataIndex: 'userType',
      key: 'userType',
      align: 'center',
      width: 90,
    },
    {
      title: '用户分层',
      dataIndex: 'userLabel',
      key: 'userLabel',
      align: 'center',
      width: 90,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      align: 'center',
      width: 90,
    },
    {
      title: '是否在核心城市生效',
      dataIndex: 'cityCore',
      align: 'center',
      width: 180,
      key: 'cityCore',
      render: (text: any) => (text ? '是' : '否'),
    },
    {
      title: '设备型号',
      dataIndex: 'brand.splitdata',
      key: 'brand',
      width: 200,
    },
    {
      title: '操作',
      fixed: 'right',
      width: 100,
      key: 'caozuo',
      render: (record: any) => (
        <span>
          <Button
            type="primary"
            size="small"
            icon="edit"
            onClick={() => editUserCover(record)}
            style={{ marginBottom: '5px' }}
          >
            编辑
          </Button>
          <Button
            type="danger"
            size="small"
            icon="delete"
            onClick={() => deleteUserCoverPop(record)}
          >
            删除
          </Button>
        </span>
      ),
    },
  ];

  const defaultFormValue = {
    groupId: '-1',
    env: 'all',
    os: 'all',
    appId: {
      include: true,
      content: ['all'],
    },
    refresh_mode: [],
    // service: "",
    userType: 'all',
    gender: 'all',
    brand: {
      include: true,
      content: 'all',
    },
    city: {
      include: true,
      content: 'all',
    },
    businessArea: {
      include: true,
      content: 'all',
    },
    bucket: {
      include: true,
      content: 'all',
    },
    minus3: false,
    dirtyLike: '',
    ruleId: '无',
    videoId: '无',
    userRiseCS: {
      include: true,
      content: ['all'],
    },
    distribution: ['all'],
    cityCore: false,
    age_group: null,
  };
  const [result, setResult] = useState<any[]>([]);
  const [appidlist, setAppidlist] = useState<any[]>([]);
  // const [getGroups, setGetGroups] = useState<any[]>([]);
  // const [usercslist, setUsercslist] = useState<any[]>();
  const [citylist, setCitylist] = useState<any[]>();
  const [newsrulelist, setNewsrulelist] = useState<any[]>([]);
  const [videorulelist, setVideorulelist] = useState<any[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const [appidpopvisible, setAppidpopvisible] = useState<Boolean>(false);
  const [adddrawervisible, setAdddrawervisible] = useState<Boolean>(false);
  const [defaultform, setDefaultform] = useState<Object>(defaultFormValue);
  const [disabledId, setDisabledId] = useState<Boolean>(false);
  const [disabledInput, setDisabledInput] = useState<Boolean>(false);
  const { getFieldDecorator, validateFields, resetFields, setFieldsValue } = props.form;
  const appidRef = useRef<any>();

  useEffect(() => {
    // getUserCoverConditions();
    getAppidList();
    // getAllUserRiseCS();
    getAllNewsRuleList();
    getAllVideoRuleList();
    getAllCityList();
    // 搞不懂为什么要默认调用搜索接口
    // searchUserCover();
    // 规则校验平台跳转需要默认请求搜索接口
    props.location.query.groupId ? searchUserCover() : getUserCoverConditions();
  }, []);
  useEffect(() => {
    handleData();
  }, [result]);

  const getAppidList = async () => {
    const ret = await request.get(`/api/filtertools/getAllAppid?isdev=${isDev}`);
    if (ret.code === 0) {
      setAppidlist(ret.data.appid);
    } else {
      message.error(`获取appid列表失败,${'原因: ' + ret.message ? ret.message : ''}`);
    }
  };

  // const getAllUserRiseCS = async () => {
  //   const ret = await request.get('/api/filtertools/getAllUserRiseCS?debug=');
  //   if (ret.code === 0) {
  //     setUsercslist(ret.data);
  //   } else {
  //     message.error(`获取渠道列表失败,${'原因: '+ ret.message ? ret.message : ''}`);
  //   }
  // }

  const getAllCityList = async () => {
    const ret = await request.get('/api/filtertools/getCityList');
    if (ret.code === 0) {
      setCitylist(ret.result);
    } else {
      message.error(`获取城市列表失败,${'原因: ' + ret.message ? ret.message : ''}`);
    }
  };

  const getAllNewsRuleList = async () => {
    const ret = await request.get(`/api/filtertools/getAllNewsRulesName?isdev=${isDev}`);
    //因需求着急 暂时写到1000
    const res = await request.get(`/api/filtertools/getAllNewsRules?isdev=${isDev}&pageSize=1000`);
    if (ret.code === 0 && res.code === 0) {
      let filterNews: any[] = [];
      // 通过newsDelStatus字段筛选被删除数据
      const filterNewsList = res.result.data.filter((item: any) => item.newsDelStatus !== true);
      if (filterNewsList.length > 0) {
        filterNewsList.forEach((item: any) => {
          // 通过被删除数据name字段筛选数据
          filterNews.push({
            name: item.name,
            idName:`${item.ruleId}-${item.name}`,
            _id: item._id,
          });
        });
        setNewsrulelist(filterNews);
      } else {
        setNewsrulelist(ret.data);
      }
    } else {
      message.error(`获取图文规则列表失败,${'原因: ' + ret.message ? ret.message : ''}`);
    }
  };
  const getAllVideoRuleList = async () => {
    //因需求着急 暂时写到1000
    const res = await request.get(`/api/filtertools/getAllVideoRules?isdev=${isDev}&pageSize=1000`);
    const ret = await request.get(`/api/filtertools/getAllVideoRulesName?isdev=${isDev}`);
    if (ret.code === 0 && res.code === 0) {
      let filterVideo: any[] = [];
      const filterVideoList = res.result.data.filter((item: any) => item.videoDelStatus !== true);
      // 判断避免没有删除字段 筛选后数据为空
      if (filterVideoList.length > 0) {
        filterVideoList.forEach((item: any) => {
          filterVideo.push({
            name: item.name,
            idName:`${item.ruleId}-${item.name}`,
            _id: item._id,
          });
        });
        setVideorulelist(filterVideo);
      } else {
        setVideorulelist(ret.data);
      }
    } else {
      message.error(`获取图文规则列表失败,${'原因: ' + ret.message ? ret.message : ''}`);
    }
  };
  const handleData = () => {
    if (result && result.length > 0) {
      result.map(
        (item: { [x: string]: { content: string; splitdata: string; include: boolean } }) => {
          const itemkeys = Object.keys(item);
          itemkeys.map(item2 => {
            let itemType = item[item2] instanceof Object;
            if (itemType && Object.keys(item[item2]).includes('include') && item[item2].include) {
              item[item2].splitdata = '包含：' + item[item2].content;
            } else if (itemType && Object.keys(item[item2]).includes('include')) {
              item[item2].splitdata = '不包含：' + item[item2].content;
            }
          });
        },
      );
    }
  };
  const getUserCoverConditions = async () => {
    const ret = await request.get(`/api/filtertools/getUserCover?isdev=${isDev}`);
    if (ret.code === 0) {
      // 通过deleteStatus字段筛选展示数据
      const filterResult = ret.result.filter(item => item.deleteStatus !== true);
      setResult(filterResult);
      setLoading(false);
    } else {
      message.error(`统计数据获取失败${',原因: ' + ret.message ? ret.message : ''},请刷新重试`);
      setResult([]);
      setLoading(false);
    }
  };
  const addAppid = async () => {
    if (appidRef && appidRef.current && appidRef.current.state.value) {
      let appid = appidRef.current.state.value;
      const ret = await request.post(`/api/filtertools/addAppid?isdev=${isDev}`, {
        data: {
          appid: appid,
        },
      });
      if (ret.code === 0) {
        appidlist.push(appid);
        setAppidlist(appidlist);
        message.success('添加成功');
        setAppidpopvisible(false);
      } else {
        message.error(ret.message);
      }
    } else {
      message.error('请填写appid');
    }
  };
  const deleteUserCoverPop = (data: any) => {
    Modal.confirm({
      title: 'Confirm',
      content: `确定删除标号为${data.groupId}的数据吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        deleteUserCover(data);
      },
    });
  };

  const deleteUserCover = async (data: any) => {
    const ret = await request.post(`/api/filtertools/deleteUserCover?isdev=${isDev}`, {
      data: {
        groupId: data.groupId,
        userName: localStorage.getItem('userName'),
      },
    });
    const act = 'delete',
      value = data;
    value.location = window.location.href;
    value.debug = isDev ? 1 : 0;
    if (ret.code === 0) {
      const { log_domain, log_secret, usercover_key } = LogInfo;
      saveStaticLog(log_domain, log_secret, [
        {
          action: act,
          key: usercover_key,
          value: value ? JSON.stringify(value) : '',
          fromid: '',
          comment: '',
        },
      ]);
      saveKibana(act, usercover_key, value);

      let newresult: any[] = [];
      newresult = newresult.concat(result);
      newresult.splice(
        newresult.findIndex(item => item.groupId === data.groupId),
        1,
      );
      setResult(newresult);
      message.success('删除成功');
    } else {
      message.error('删除失败，请重试');
    }
  };
  const editUserCover = (data: any) => {
    if (data.minus3 === undefined) {
      data.minus3 = false;
    }
    setDefaultform(data);
    setAdddrawervisible(true);
  };
  const addData = () => {
    setAdddrawervisible(true);
    setDefaultform(defaultFormValue);
  };

  const searchUserCover = async () => {
    setLoading(true);
    let getGroup = props.location.query.groupId;
    let reqData = {};
    let port = 'searchUserCover';
    getGroup && getGroup.length > 0 && setDisabledInput(true);
    validateFields((err: any, values: any) => {
      setFieldsValue({ searchValue: values.searchValue });
      setFieldsValue({ searchId: values.searchId });
      if (disabledId && !disabledInput) {
        port = 'searchUserCover';
        reqData = {
          keywords: values.searchValue,
        };
      } else if (!disabledId && disabledInput) {
        port = 'searchUserCoverById';
        reqData = {
          id: values.searchId,
        };
      } else if (getGroup) {
        port = 'searchUserCoverById';
        reqData = {
          id: getGroup,
        };
      } else {
        port = 'searchUserCover';
        reqData = {
          keywords: values.searchValue,
        };
      }
      request
        .post(`/api/filtertools/${port}?isdev=${isDev}`, {
          data: reqData,
        })
        .then(res => {
          if (res.code === 0) {
            const newData = res.data.filter((item: any) => !item.deleteStatus);
            if (newData.length > 0) {
              setResult(newData);
              message.success('搜索成功');
            } else {
              setResult(newData);
              message.warning('暂无数据');
            }
            setLoading(false);
            // 搜索后删除groupId 避免继续搜索会强行使用getGroup作为参数
            if (getGroup) {
              delete props.location.query.groupId;
            }
          } else {
            setResult([]);
            message.error('搜索失败，请重试');
          }
          // 无论搜索结果 所有值赋空
          setFieldsValue({ searchValue: '' });
          setFieldsValue({ searchId: '' });
          // 解除搜索框禁用
          setDisabledId(false);
          setDisabledInput(false);
        });
    });
  };

  const onExportData = () => {
    exportData('过滤策略覆盖用户设置表', result, column);
  };

  const disabledIdFn = (e: any) => {
    let value = e.target.value;
    if (value.length > 0) {
      setDisabledId(true);
    } else {
      setDisabledId(false);
    }
  };

  const disabledInputFn = (e: any) => {
    let value = e.target.value ? e.target.value : e;
    if (value.length > 0) {
      setDisabledInput(true);
    } else {
      setDisabledInput(false);
    }
  };

  return (
    <>
      <div className="main-content">
        <Card bordered={false} style={{ minHeight: 380 }}>
          <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
            <Button
              type="primary"
              style={{ marginRight: '10px' }}
              icon="file-add"
              onClick={addData}
              loading={loading}
            >
              添加数据
            </Button>
            <Button
              icon="appstore"
              style={{ marginRight: '10px' }}
              onClick={() => setAppidpopvisible(true)}
            >
              添加appid
            </Button>
            <Button
              type="primary"
              icon="cloud-download"
              style={{ marginRight: '10px', background: '#48D1CC', borderColor: '#48D1CC' }}
              onClick={onExportData}
            >
              导出数据
            </Button>
            <Form style={{ display: 'flex', alignItems: 'center', marginBottom: -3 }}>
              <Form.Item style={{ marginBottom: 0 }}>
                {getFieldDecorator('searchId', {
                  initialValue: '',
                })(
                  <Input
                    placeholder="编号(id)查询"
                    style={{ width: 120, marginRight: 10 }}
                    onInput={disabledInputFn}
                    disabled={disabledId}
                  />,
                )}
              </Form.Item>
              <Form.Item style={{ marginBottom: 0 }}>
                {getFieldDecorator('searchValue', {
                  initialValue: '',
                })(
                  <Input
                    placeholder="视频/图文规则名称查询"
                    style={{ width: 180, marginRight: 10 }}
                    onInput={disabledIdFn}
                    disabled={disabledInput}
                  />,
                )}
              </Form.Item>
              <Button type="primary" icon="search" onClick={() => searchUserCover()}>
                搜索
              </Button>
            </Form>
            <div style={{ marginLeft: 80 }}>过滤策略覆盖用户设置表: 共{result.length}条数据</div>
          </div>
          <Table
            columns={column}
            loading={loading}
            dataSource={result}
            rowKey="_id"
            scroll={{ x: 1800 }}
          />
          <Modal
            title="添加appid"
            visible={appidpopvisible}
            onOk={addAppid}
            onCancel={() => setAppidpopvisible(false)}
          >
            <Input placeholder="请填写正确的appid" ref={appidRef} />
          </Modal>
          <AddCoverForm
            adddrawervisible={adddrawervisible}
            setAdddrawervisible={setAdddrawervisible}
            setResult={setResult}
            result={result}
            appidlist={appidlist}
            newsrulelist={newsrulelist}
            videorulelist={videorulelist}
            defaultform={defaultform}
            citylist={citylist}
            isDev={isDev}
            setAppidpopvisible={setAppidpopvisible}
            // usercslist={usercslist}
          />
        </Card>
      </div>
    </>
  );
};
const CheckDemo = Form.create({ name: 'Check_other' })(UserCover);
export default CheckDemo;
