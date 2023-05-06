import React, { useState } from 'react';
import { Row, Col, Input, Button, DatePicker, Select } from 'antd';
import {FROM_ID} from '@/services/common'
const { RangePicker } = DatePicker;
const { Option } = Select;

interface SearchProps {
  children?: React.ReactNode
  onSearch?: (data: SEARCH_CONDITION) => void
  onTopicClick?: (show: boolean) => void
  noNeed?: boolean // 不需要 状态 创建时间 创建人
}

interface SEARCH_ITEM {
  width?: number,
  text?: string,
  children: React.ReactNode
}

function Search_Item({
  width = 250,
  text,
  children
}: SEARCH_ITEM){
  return (
    <Row gutter={15} style={{width: width, display: 'inline-block'}}>
      <Col span={9} style={{textAlign: 'right'}}>{text}:</Col>
      <Col span={15}>{children}</Col>
    </Row>
  );
}

const Search: React.FC<SearchProps> = ({onSearch, onTopicClick, noNeed}) => {
  const [condition, setCondition] = useState<SEARCH_CONDITION>({})
  const onConditionChange = (key: string, value: any) => {
    condition[key] = value;
    setCondition({...condition});
  }
  const onButtonSearch = ()  => {
    onSearch && onSearch(condition);
  }
  const onAddTopicClick = () => {
    onTopicClick && onTopicClick(true);
  }
  return (
    <>
      <Row>
        <Search_Item text="话题ID">
          <Input placeholder="请输入话题ID" onChange={(e) => onConditionChange('id', e.target.value)}/>
        </Search_Item>
        <Search_Item text="话题名称">
          <Input placeholder="请输入话题名称" onChange={(e) => onConditionChange('name', e.target.value)}/>
        </Search_Item>
        {noNeed? null :
          <Search_Item text="创建人">
            <Input placeholder="请输入创建人" onChange={(e) => onConditionChange('creator', e.target.value)}/>
          </Search_Item>
        }
        <Search_Item text="排序">
          <Select
            style={{width: '100%'}}
            onChange={(value: string) => onConditionChange('order', value)}
          >
            <Option value="ASCE">升序</Option>
            <Option value="DESC">降序</Option>
          </Select>
        </Search_Item>
        {noNeed? null :
          <Search_Item text="状态">
            <Select
              style={{width: '100%'}}
              onChange={(value: string) => onConditionChange('status', value)}
            >
              <Option value="0">全部</Option>
              <Option value="1">上线</Option>
              <Option value="2">下线</Option>
            </Select>
          </Search_Item>
        }
        {/* <Search_Item text="城市">
          <Input placeholder="输入城市" onChange={(e) => onConditionChange('city', e.target.value)}/>
        </Search_Item> */}
        {noNeed? null :
          <Search_Item text="创建时间">
            <RangePicker style={{width: 250}} onChange={(_, dateStrings: [string, string]) => {
              onConditionChange('createAt', dateStrings);
            }}/>
          </Search_Item>
        }
        <br/>
        <Button type="primary" icon="search" onClick={onButtonSearch} style={{marginLeft: 30}}>
          搜索
        </Button>
        <Button icon="download" style={{marginLeft: 10}}>导出到本地</Button>
        <Button type="primary" icon="plus" style={{marginLeft: 10}} onClick={onAddTopicClick}>新增话题</Button>
        <a href='http://pandora.yidian-inc.com/unitool/channelslide?show=table' target="__blank" style={{marginLeft: 10}} title="需申请channelslide工具权限">{`设置轮播图, 频道id:${FROM_ID}`}</a>
      </Row>
    </>
  );
}

export default Search;
