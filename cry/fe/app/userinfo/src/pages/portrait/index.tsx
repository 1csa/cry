import React, { useState, memo, useRef, useCallback, useLayoutEffect } from 'react';
import { Age, Gender, Category, Channel } from './components';
import { Input, Form, Button, message, Card, Spin, BackTop } from 'antd';
import axios from 'axios';
import appConfig from '@/config/app/app.config';

const Portraitinfo: React.FC = () => {
  const [ loading, setLoading ] = useState<boolean>(false);
  const [ version, setVersion ] = useState<string>('');
  const [ uid, setUid ] = useState<string>('');
  const [ ageInfo, setAgeInfo ] = useState<object>({});
  const [ genderInfo, setGenderInfo ] = useState<object>({});
  const [ categoryInfo, setCategoryInfo ] = useState<Array<any>>([]);
  const [ subCategoryInfo, setSubCategoryInfo ] = useState<Array<any>>([]);
  const [ favoriteChannelInfo, setFavoriteChannelInfo ] = useState<Array<any>>([]);
  const [ subChannelInfo, setSubChannelInfo ] = useState<Array<any>>([]);

  const uidRef = useRef('');
  useLayoutEffect(()=>{
    uidRef.current = uid;
  }, [uid]);
  const objToArr = (ob:object) => {
    let arr = [], keys = Object.keys(ob);
    for(let i in ob){
      arr.push(ob[i])
    }
    arr.forEach((item, index)=>{
      item.keyname = keys[index]
      item.key  = keys[index]
      item.groups = []
      if (item.group && item.group.UPS_V02) {
        for(let i in item.group) {
          item.groups.push(item.group[i])
        }
      }
    })
    return arr
  }
  const handleQuery = useCallback(async ()=>{
    setLoading(true)
    let currentUid = uidRef.current;
    axios.get(`/api/proxy/http://userprofile-serving.ha.in.yidian.com:8048/featurestore/up4market?userid=${currentUid}`)
    .then(res =>{
      if(res.data) {
        setLoading(false)
        setVersion(res.data.version)
        if (res.data.age) {
          setAgeInfo(res.data.age)
        }
        if (res.data.gender) {
          setGenderInfo(res.data.gender)
        }
        if (res.data.category) {
          let categoryArr = objToArr(res.data.category)
          setCategoryInfo(categoryArr)
        }
        if (res.data.subcategory) {
          let subCategoryArr = objToArr(res.data.subcategory)
          setSubCategoryInfo(subCategoryArr)
        }
        if (res.data.favoriteChannel) {
          let favoriteChannelArr = objToArr(res.data.favoriteChannel)
          setFavoriteChannelInfo(favoriteChannelArr)
        }
        if (res.data.subscribeChannel) {
          let subChannelArr = objToArr(res.data.subscribeChannel)
          setSubChannelInfo(subChannelArr)
        }
      } else {
        message.error('查询失败，请重试！')
        setLoading(false)
      }
    })
  }, [useRef]);
  return (
    <>
      <div className="basicinfo">
        <Card title="用户画像查询" bordered={false}>
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
            {version && <span style={{marginLeft: '10px'}}>(版本：{version})</span>}
          </Form>
        </Card>
        <Spin spinning={loading}>
          {ageInfo && ageInfo.A_0_24 && <Card title="年龄分布" bordered={false} style={{marginTop: '10px',width: '60%', display: 'inline-block',marginRight: '1%'}}>
            <Age ageInfo={ageInfo} />
          </Card>}
          {genderInfo && genderInfo.female && <Card title="性别分布" bordered={false} style={{marginTop: '10px',width: '39%', display: 'inline-block'}}>
            <Gender genderInfo={genderInfo} />
          </Card>}
          {categoryInfo && categoryInfo.length > 0 && <Card title="大类分布" bordered={false} style={{marginTop: '10px'}}>
            <Category categoryInfo={categoryInfo} />
          </Card>}
          {subCategoryInfo && subCategoryInfo.length > 0 && <Card title="小类分布" bordered={false} style={{marginTop: '10px'}}>
            <Category categoryInfo={subCategoryInfo} />
          </Card>}
          {favoriteChannelInfo && favoriteChannelInfo.length > 0 && <Card title="喜欢频道" bordered={false} style={{marginTop: '10px'}}>
            <Channel channelForm={favoriteChannelInfo} />
          </Card>}
          {subChannelInfo && subChannelInfo.length > 0 && <Card title="订阅频道" bordered={false} style={{marginTop: '10px'}}>
            <Channel channelForm={subChannelInfo} />
          </Card>}
        </Spin>
        <BackTop></BackTop>
      </div>
    </>
  )
};

export default memo(Portraitinfo);
