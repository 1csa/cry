import React, { useState, useEffect } from 'react';
import { Form, Button, Input, Select } from 'antd';
import { ConnectState, Dispatch, UserModelState } from '@/models/connect';
import {
  hotTypes
} from '../../../config/constant';
import { connect } from 'dva';

import './config.less';

interface configItem {
  source_id: number,
  platform_type_id: number,
  category_id: number,
  count_all: number,
  score: number,
  domain_id: number,
  hot_type: number
}

interface configItemProps {
  siteList: any,
  form?: any,
  dispatch: Dispatch,
  index: number,
  item: configItem,
  type: string,
  deleteItem: any,
  selectSiteType: any,
  selectContentType: any,
  selectCategory: any,
  changeContentScore: any,
  changeCountAll: any,
  selectHotType: any,
  taskType: number,
  platForm: number
}


const configItem: React.FC<configItemProps> = ({ 
  siteList, 
  form, 
  dispatch, 
  index, 
  item, 
  type, 
  deleteItem, 
  selectSiteType, 
  selectContentType, 
  changeContentScore, 
  changeCountAll,
  selectHotType,
  selectCategory,
  taskType,
  platForm
}) => {
 
  const [ contentList, setContentList ] = useState<any>([]);
  const [ categoryList, setCategoryList ] = useState<any>([]);
  const [ inputDisabled, setInputDisabled ] = useState<any>(false);
  const { getFieldDecorator } = form;

  const selectSite = async (value: number) => {
    selectSiteType(value, index);
    getContentList(value);
    changeHotType(item.hot_type ? item.hot_type : 2);
    changeCountAll(item.count_all ? item.count_all : undefined, index);
    changeContentScore(item.score ? item.score : 70, index);
    
    changeCategory(item.category_id ? item.category_id : 1);
    form.setFieldsValue({
      category_id: item.category_id ? item.category_id : 1,
      score: item.score ? item.score : 70,
      count_all: item.count_all ? item.count_all : undefined
    });
  }

  const getContentList = async (value: number) => {
    const { code, message, data = {} } = await dispatch({
      type: 'putTaskList/getContentTypeList',
      payload: {
        'source_id': value
      }
    });
    if (code === 0 || message === 'success') {
      selectContentType(data ? data.types.length > 0 ? data.types[0].type_id : 1 : 1, index);
      setContentList([...(data.types || [])]);
      form.setFieldsValue({
        platform_type_id: data ? data.types.length > 0 ? data.types[0].type_id : 1 : 1
      })
    } else {
      setContentList([...[]]);
    }
  } 

  const changeContentType = (value: number) => {
    selectContentType(value, index);
  }

  const changeHotType = (value: number) => {
    selectHotType(value, index);
  }

  const changeContentScoreInput = (e: any) => {
    e.persist();
    changeContentScore(parseInt(e.target.value), index);
  }

  const changeCountAllInput = (e: any) => {
    e.persist();
    changeCountAll(parseInt(e.target.value), index);
  }

  const changeCategory = (value: number) => {
    selectCategory(value, index);
  }

  const getCategoryList = async () => {
    const { code, message, data = {} } = await dispatch({
      type: 'putTaskList/getCategoryList'
    });
    if (code === 0 || message === 'success') {
      let arr = [...data.category];
      arr.push({category_id: 0, category_name: '全部'});
      setCategoryList([...(arr || [])]);
    } else {
      setContentList([...[]]);
    }
  }
  useEffect(() => {
    type === 'scan' ? setInputDisabled(true) : setInputDisabled(false);
    selectSite(item.source_id);
    getContentList(item.source_id);
    getCategoryList();
  }, [])

  return (
    <div className="item-form">
      <Form.Item label={`配置${index}`}></Form.Item>
      <Form.Item label="站点" className="form-item">
      {getFieldDecorator('source_id', { 
        initialValue: item.source_id,
        rules: [{
          required: true,
          message: '请选择站点'
        }]
      })(
        <Select placeholder="请选择站点" onChange={selectSite} style={{ width: 100 }} disabled={inputDisabled}>
        {
          siteList.map((el: any, index:number) => {
            return <Select.Option value={el.source_id} key={index}>{el.source_name}</Select.Option>
          })
        }
        </Select>
      )}
      </Form.Item>
      <Form.Item label="内容类型" className="form-item">
      {getFieldDecorator('platform_type_id', { 
        initialValue: item.platform_type_id,
        rules: [{
          required: true,
          message: '请选择内容类型'
        }] 
      })(
        <Select placeholder="全部" style={{ width: 100 }} disabled={inputDisabled} onChange={changeContentType}>
        {
          contentList.map((el: any, index:number) => {
            return <Select.Option value={el.type_id} key={index}>{el.type_name}</Select.Option>
          })
        }
        </Select>
      )}
      </Form.Item>
      {taskType === 1 ? (
        <Form.Item label="大类" className="form-item">
        {getFieldDecorator('category_id', { 
          initialValue: item.category_id
        })(
          <Select placeholder="全部" style={{ width: 100 }} 
          disabled={ inputDisabled ? true : platForm === 1 ? true : false }
          onChange={changeCategory}
          >
          {
            categoryList.map((el: any, index:number) => {
              return <Select.Option value={el.category_id} key={index}>{el.category_name}</Select.Option>
            })
          }
          </Select>
        )}
        </Form.Item>
      ): (<></>)}
      
      {taskType === 1 ? (
        <>
          {platForm === 1 ? (
            <Form.Item label="内容评分大于" className="form-item-long">
            {getFieldDecorator('score', { 
              initialValue: item.score, 
              rules: [{
                required: true,
                min: 0,
                max: 100,
                message: '必填项评分需大于0小于100'
              }]
            })(
              <Input style={{ width: 100 }} disabled={inputDisabled} onChange={changeContentScoreInput}/>
            )}
            </Form.Item>
          ):(
            <Form.Item label="热门类型" className="form-item-long">
            {getFieldDecorator('hot_type', { 
              initialValue: item.hot_type,
              rules: [{
                required: true,
                message: '请选择热门类型'
              }]
            })(
              <Select placeholder="全部" style={{ width: 100 }} onChange={changeHotType} disabled={inputDisabled}>
              {
                hotTypes.map((el: any, index:number) => {
                  return <Select.Option value={el.value} key={index}>{el.label}</Select.Option>
                })
              }
              </Select>
            )}
            </Form.Item>
          )}
          <Form.Item label="量级(篇/天)" className="form-item-long">
          {getFieldDecorator('count_all', { 
            initialValue: item.count_all,
            rules: [{
              required: true,
              min: 1,
              max: 50000,
              message: '请输入量级'
            }]
          })(
            <Input style={{ width: 100 }} disabled={inputDisabled} onChange={changeCountAllInput}/>
          )}</Form.Item>
        </>
      ):(
        <>
          <Form.Item label="领域" className="form-item">
          {getFieldDecorator('domain_id', { initialValue: item.domain_id })(
            <Select placeholder="全部" style={{ width: 100 }} disabled>
            {
              categoryList.map((el: any, index:number) => {
                return <Select.Option value={el.category_id} key={index}>{el.category_name}</Select.Option>
              })
            }
            </Select>
          )}
          </Form.Item>
          <Form.Item label="账号评分大于" className="form-item-long">
          {getFieldDecorator('score', { 
            initialValue: item.score,
            rules: [{
              required: true,
              min: 0,
              max: 100,
              message: '请输入账号评分'
            }]
          })(
            <Input style={{ width: 100 }} disabled={inputDisabled} onChange={changeContentScoreInput}/>
          )}
          </Form.Item>
        </>
      )}
      <Form.Item>
        <Button type="primary" style={{ marginLeft: 10 }} disabled={inputDisabled} onClick={() => deleteItem(index)}>删除</Button>
      </Form.Item>
    </div>
  )
}

export default connect(({ user }: ConnectState) => ({
  user
}))(Form.create()(configItem));