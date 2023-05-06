import React, { useState, useEffect } from 'react';
import { Button, List, message } from 'antd';
import {connect} from 'dva';
import { Dispatch } from '@/models/connect';
import { SpreadState } from './models/index';
import './index.less';
import Item from './component/item';
import {TV_CHANNEL, MOVIE, AUDIO} from './constant';

interface tvChannelProps {
  tv_channel_id: string,
  channel_name: string,
  icon: string,
  action_type: string,
  open_value: string
}

interface movieProps {
  docid: string,
  title: string,
  Image: string,
  action_type: string,
  open_value: string
}

interface audioProps {
  docid: string,
  title: string,
  Image: string,
  albumid: string
}
interface IndexProps {
  dispatch: Dispatch,
  spreadState: SpreadState
}
const Index: React.FC<IndexProps> = ({dispatch, spreadState}) => {
  const [tvChannel, setTvChannel] = useState<tvChannelProps[]>([]);
  const [movie, setMovie] = useState<movieProps[]>([]);
  const [audio, setAudio] = useState<audioProps[]>([]);
  useEffect(() => {
    if(spreadState['isDirty']){
      getSpreadConfig();
    }
  }, [spreadState['isDirty']]);
  const getSpreadConfig = async () => {
    const {result, status} = await dispatch({type: 'spread/fetchSpread'});
    if(status === 'success'){
      let tvChannelTemp = result['channel'] && result['channel'].map((item: any) => {
        return {
          tv_channel_id: item['tv_channel_id'],
          channel_name: item['channel_name'],
          icon: item['icon'],
          action_type: item['actionParams']['action_type'],
          open_value: item['actionParams']['open_value']
        }
      });
      let movieTemp = result['movie'] && result['movie'].map((item: any) => {
        return {
          docid: item['docid'],
          title: item['title'],
          Image: item['Image'],
          action_type: item['actionParams']['action_type'],
          open_value: item['actionParams']['open_value']
        }
      });
      let audioTemp = result['audio'] && result['audio'].map((item: any) => {
        return {
          docid: item['docid'],
          title: item['title'],
          Image: item['Image'],
          albumid: item['albumid']
        }
      });
      setTvChannel([...tvChannelTemp]);
      setMovie([...movieTemp]);
      setAudio([...audioTemp]);
    }
  }
  function addItem(type: string) {
    if(type === TV_CHANNEL) {
      tvChannel.push({
        tv_channel_id: '',
        channel_name: '',
        icon: '',
        action_type: '',
        open_value: ''
      });
      setTvChannel([...tvChannel]);
    }

    if(type === MOVIE) {
      movie.push({
        docid: '',
        title: '',
        Image: '',
        action_type: '',
        open_value: ''
      });
      setMovie([...movie]);
    }

    if(type === AUDIO) {
      audio.push({
        docid: '',
        title: '',
        Image: '',
        albumid: ''
      });
      setAudio([...audio]);
    }
  };
  const handleSubmit = async () => {
    let channel = tvChannel.map((item: any) => {
      return {
        "tv_channel_id": item['tv_channel_id'],
        "channel_name": item['channel_name'],
        "icon": item['icon'],
        "action": "tv_station",
        "actionParams": {
          "tv_type": "live",
          "action_type": item['action_type'],
          "open_value": item['open_value']
        }
      }
    });
    let movieTemp = movie.map((item: any) => {
      return {
        "docid": item['docid'],
        "title": item['title'],
        "Image": item['Image'],
        "action": "tv_station",
        "actionParams": {
          "tv_type": "video",
          "action_type": item['action_type'],
          "open_value": item['open_value']
        }
      }
    });
    let audioTemp = audio.map((item: any) => {
      return {
        "docid": item['docid'],
        "title": item['title'],
        "Image": item['Image'],
        "albumid": item['albumid']
      }
    })
    if(channel.length <8 || movieTemp.length <6 || audioTemp.length <6){
      message.error('看电视最少为8条数据,其余最少为6条');
      return;
    }

    var data = {
      channel,
      movie: movieTemp,
      audio: audioTemp,
    }
    const {status} = await dispatch({
      type: 'spread/saveSpread',
      payload: {
        ...data
      }
    });
    if(status === 'success'){
      message.success('操作成功!');
    }else {
      message.error('操作失败, 请稍后重试!');
    }
  }

  const onMoveByIndex = (target: string, type: string, current: number) => { // current当前位置
    // console.log(target, type, current);
    let currentDataSource: any[] = [];
    if(target === TV_CHANNEL){
      currentDataSource = tvChannel;
    }
    if(target === MOVIE){
      currentDataSource = movie;
    }
    if(target === AUDIO){
      currentDataSource = audio;
    }

    if(type === 'up'){
      currentDataSource.splice(current - 1, 1, ...currentDataSource.splice(current, 1, currentDataSource[current - 1]));
    }
    if(type === 'down'){
      currentDataSource.splice(current, 1, ...currentDataSource.splice(current + 1, 1, currentDataSource[current]));
    }

    if(target === TV_CHANNEL){
      setTvChannel([...currentDataSource]);
    }
    if(target === MOVIE){
      setMovie([...currentDataSource]);
    }
    if(target === AUDIO){
      setAudio([...currentDataSource]);
    }
  }
  const onDeleteByIndex = (target: string, index: number) => {

    if(target === TV_CHANNEL){
      tvChannel.splice(index,1);
      setTvChannel([...tvChannel])
    }
    if(target === MOVIE){
      movie.splice(index,1)
      setMovie([...movie])
    }
    if(target === AUDIO){
      audio.splice(index,1)
      setAudio([...audio])
    }
  }
  const commonItemHead = (label:string, type: string) => {
    return <div className="common-head">
      {label} <Button onClick={()=>addItem(type)} size="small" type="primary"style={{float: 'right'}} >新增</Button>
    </div>
  }
  const onValueChange = (type: string, current: number, key: string, value: string) => {
    if(type === TV_CHANNEL){
      tvChannel[current][key] = value;
      setTvChannel([...tvChannel]);
    }
    if(type === MOVIE){
      movie[current][key] = value;
      setMovie([...movie]);
    }
    if(type === AUDIO){
      audio[current][key] = value;
      setAudio([...audio]);
    }
  };
  return (
    <div className="main-content">
      <div className="tv-channel">
        <List
          header={commonItemHead('看电视', TV_CHANNEL)}
          dataSource={tvChannel}
          renderItem={(item: any, index: number) => <List.Item>
            <Item
              index={index}
              total={tvChannel.length}
              onMove={(type: string, index: number) => onMoveByIndex(TV_CHANNEL, type, index)}
              onDelete={(index: number) => onDeleteByIndex(TV_CHANNEL, index)}
              onChange={(index: number, key: string, value: string) => onValueChange(TV_CHANNEL, index, key, value)}
              data = {item}
              type = {TV_CHANNEL}
            />
          </List.Item>}
        />
      </div>

      <div className="movie">
        <List
          header={commonItemHead('看大片', MOVIE)}
          dataSource={movie}
          renderItem={(item: any, index: number) => <List.Item>
            <Item
              index={index}
              total={movie.length}
              onMove={(type: string, index: number) => onMoveByIndex(MOVIE, type, index)}
              onDelete={(index: number) => onDeleteByIndex(MOVIE, index)}
              onChange={(index: number, key: string, value: string) => onValueChange(MOVIE, index, key, value)}
              data = {item}
              type = {MOVIE}
            />
          </List.Item>}
        />
      </div>

      <div className="audio">
        <List
          header={commonItemHead('音频', AUDIO)}
          dataSource={audio}
          renderItem={(item: any, index: number) => <List.Item>
            <Item
              index={index}
              total={audio.length}
              onMove={(type: string, index: number) => onMoveByIndex(AUDIO, type, index)}
              onDelete={(index: number) => onDeleteByIndex(AUDIO, index)}
              onChange={(index: number, key: string, value: string) => onValueChange(AUDIO, index, key, value)}
              data = {item}
              type = {AUDIO}
            />
          </List.Item>}
        />
      </div>
      <div className="save-btn">
        {(tvChannel.length || movie.length || audio.length)
          ? <Button type="primary" onClick={handleSubmit}>
            保存
          </Button>
          : null
        }
      </div>
    </div>
  );
}
export default connect(({spread}: any) => ({
  spreadState: spread
}))(Index);

