import React, { useState, memo, useRef, useCallback, useLayoutEffect } from 'react';
import { FetchTable, OppoId, SubChannel } from './components';
import { Input, Form, Button, message, Card } from 'antd';
import axios from 'axios';
import appConfig from '@/config/app/app.config';

const Userinfo: React.FC = () => {
  const getUrlParam = (name:string) => {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return '';
  }
  const [ uid, setUid ] = useState<string>('');
  const [ userForm, setUserForm ] = useState<object>({});
  const [ userFormDisplay, setUserFormDisplay ] = useState<boolean>(false);
  const [ oppoForm, setOPPOForm ] = useState<object>({});
  const [ oppoFormDisplay, setOppoFormDisplay ] = useState<boolean>(false);
  const [ subChannelForm, setSubChannelForm ] = useState<Array<any>>([]);
  const [ subChannelDisplay, setSubChannelDisplay ] = useState<boolean>(false);
  // let defaultUid = getUrlParam('userid');
  // console.log(defaultUid);
  // setUid(defaultUid)

  const uidRef = useRef('');
  useLayoutEffect(()=>{
    uidRef.current = uid;
  }, [uid]);
  const getYidanInfo = (currentUid:string) => {
    return axios.get(`/api/proxy/${appConfig.API_HOST}/Website/mysql/user?userid=${currentUid}&fields=*`)
  }
  const getOppoInfo = (currentUid:string) => {
    return axios.get(`/api/proxy/${appConfig.API_OPPO_HOST}/Website/session/get-info-from-userid?userid=${currentUid}&appid=oppobrowser`)
  }
  const getChannelInfo = (currentUid:string) => {
    return axios.get(`/api/proxy/${appConfig.API_HOST}/Website/mysql/channel?userid=${currentUid}&fields=*`)
  }
  const handleQuery = useCallback(async ()=>{
    let currentUid = uidRef.current;

    axios.all([getYidanInfo(currentUid), getOppoInfo(currentUid), getChannelInfo(currentUid)])
    .then(axios.spread(function (yidian, oppo, channel) {
      if (yidian.data.status === 'success' && yidian.data.result) {
        setUserForm(yidian.data.result);
        setUserFormDisplay(true)
      } else {
        setUserForm({});
        setUserFormDisplay(false)
      }
      if (oppo.data.status === 'success' && oppo.data.user) {
        setOPPOForm(oppo.data.user);
        setOppoFormDisplay(true);
      } else {
        setOPPOForm({});
        setOppoFormDisplay(false);
      }
      if (channel.data.status === 'success' && channel.data.result && channel.data.result.length > 0) {
        setSubChannelForm(channel.data.result);
        setSubChannelDisplay(true);
      } else {
        setSubChannelForm([]);
        setSubChannelDisplay(false);
      }
      if (yidian.data.status !== 'success' && oppo.data.status !== 'success' && channel.data.result.length === 0) {
        message.error('查无此用户，请查看用户ID是否填写正确');
      }
    }));
  }, [useRef]);
  return (
    <>
      <div className="basicinfo">
        <Card title="用户详细信息查询" bordered={false}>
          <Form className="form" layout="inline" >
            <Form.Item label="uid">
              <Input
                placeholder="请输入用户userid"
                value={uid}
                onChange={(e)=>setUid(e.target.value)}
                onPressEnter={handleQuery}
                allowClear = {true}
              />
            </Form.Item>
            <Button type="primary" onClick={handleQuery} >查询</Button>
          </Form>
        </Card>
        {userFormDisplay && <Card title="用户基础信息" bordered={false} style={{marginTop: '10px'}}>
          <FetchTable userForm={userForm} />
        </Card>}
        {oppoFormDisplay && <Card title="OPPO用户信息" bordered={false} style={{marginTop: '10px'}}>
          <OppoId oppoForm={oppoForm} />
        </Card>}
        {subChannelDisplay && <Card title="用户订阅频道列表" bordered={false} style={{marginTop: '10px'}}>
          <SubChannel subChannelForm={subChannelForm} />
        </Card>}
      </div>
    </>
  )
};

export default memo(Userinfo);
