import React from 'react';
import { Input, Row, Col, Divider, message, Select } from 'antd';
import {TV_CHANNEL, MOVIE, AUDIO} from '../constant';
import Upload from '@/components/Common/Upload';
// const FormItem = Form.Item;
// import './index.less';
const { Option } = Select;
interface ItemProps {
  index: number,
  total: number,
  onMove?: (type: string, index: number) => void,
  onDelete?: (index: number) => void,
  data: any
  type: string
  onChange?: (index: number, key: string, value: string) => void
};
const Item: React.FC<ItemProps> = ({index,
  total,
  onMove,
  onDelete,
  data,
  type,
  onChange
})=>{
  const ACTION_TYPE = ['h5', 'native'];
  const moveByIndex = (type: string) => {
    if(index ===0 && type === 'up'){
      message.info('当前项已处于第一项,不能上移');
      return
    }
    if(index === total - 1 && type === 'down'){
      message.info('当前项已处于最后一项,不能下移');
      return
    }
    onMove && onMove(type, index);
  }
  const deleteByIndex = () => {
    onDelete && onDelete(index);
  }
  const onValueChange = (e: any) => {
    onChange && onChange(index, e.target.name, e.target.value)
  }
  const renderId = () => {
    let placeholder = '', key = '';
    if(type === TV_CHANNEL){
      placeholder = '请输入tv-channel-id';
      key = 'tv_channel_id';
    } else {
      placeholder = '请输入docid';
      key = 'docid'
    }
    return <Input
      placeholder = {placeholder}
      size = "small"
      value = {data[key]}
      onChange = {onValueChange}
      name = {key}
    />
  }
  const renderTitle = () => {
    let key = '';
    if(type === TV_CHANNEL){
      key = 'channel_name';
    } else {
      key = 'title'
    }
    return <Input
      placeholder = "请输入标题"
      size = "small"
      value = {data[key]}
      onChange = {onValueChange}
      name = {key}
    />
  }
  const renderImage = () => {
    let key = '';
    if(type === TV_CHANNEL){
      key = 'icon'
    } else {
      key = 'Image'
    }
    return <Upload
      value={data[key]}
      onChange={onFileChange}
    />
  }
  const onFileChange = (value: string) => {
    let key = 'Image';
    if(type === TV_CHANNEL){
      key = 'icon';
    }
    onChange && onChange(index, key, value);
  }
  const renderActionType = () => {
    if(type === AUDIO){
      return <Input
        placeholder = "请输入合作方id"
        size = "small"
        value = {data['albumid']}
        onChange = {onValueChange}
        name = 'albumid'
      />;
    }
    return <Select
      size="small"
      value={data['action_type']}
      style={{width: '100%'}}
      placeholder="请选择类型"
      onChange={(value: string) => onChange!(index, 'action_type', value)}
    >
      {ACTION_TYPE.map((type: string) => <Option value={type} key={type}>{type}</Option>)}
    </Select>
  }

  const renderOpenValue = () => {
    let key = 'open_value', placeholder = '';
    if(type === AUDIO){
      return;
    }
    if(type === TV_CHANNEL){
      placeholder = "参数为h5时填url，为native时填tv_channel_id";
    }

    if(type === MOVIE){
      placeholder = "参数为h5时填url，为native时填docid";
    }
    return <Input
      placeholder = {placeholder}
      size = "small"
      value = {data[key]}
      onChange = {onValueChange}
      name = {key}/>

  }
  return (
    <>
      <Row gutter={8} style={{flex: 1}}>
        <Col span={4}>
          {renderId()}
        </Col>
        <Col span={5}>
          {renderTitle()}
        </Col>
        <Col span={5}>
          {renderActionType()}
        </Col>
        <Col span={5}>
          {renderOpenValue()}
        </Col>
        <Col span={5}>
          {renderImage()}
        </Col>
      </Row>
      <div>
        <a onClick={() => moveByIndex('up')}>上移</a>
        <Divider type="vertical" dashed/>
        <a onClick={() => moveByIndex('down')}>下移</a>
        <Divider type="vertical" dashed/>
        <a onClick={() => deleteByIndex()}>删除</a>
      </div>
    </>
  );
}
export default Item;
