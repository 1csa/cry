import React, {useState, useEffect} from 'react';
import { Card, Button, Divider, message, Spin } from 'antd';
import { connect } from 'dva';
import { Dispatch } from '@/models/connect';
import { SlideModelState } from './models/index';
import Slide from './component/slide';
import './index.less';
interface IndexProps {
  children?: React.ReactNode
  dispatch: Dispatch
  slideState: SlideModelState
}

// 预处理
function isSlideEmpty(data: SLIDE[]): boolean{
  for(let i = 0; i < data.length; ++i){
    let slide = data[i];
    if(!slide.url || !slide.id){
      return true;
    }
  }
  return false;
}

const Index: React.FC<IndexProps> = ({children, dispatch, slideState}) => {
  /**hooks 区域*/
  useEffect(()=> {
    setTimeout(() => {
      dispatch({type: 'slide/fetchSlides'});
    },1000);
  }, []);

  useEffect(()=>{
    setSlides([...slideState.slides]);
  }, [slideState.slides]);
  const [slides, setSlides] = useState<SLIDE[]>(slideState.slides);
  const addSlide = () => {
    const slide = {
      id: '',
      url: ''
    }
    slides.push(slide);
    setSlides([...slides]);
  }
  const onSlideChange = (data: SLIDE, index: number) => {
    slides[index] = data;
  }
  const onDelete = (index: number) => {
    slides.splice(index, 1);
    setSlides([...slides]);
  }
  const saveSlides = () => {
    if(isSlideEmpty(slides)){
      message.error(`轮播图配置有空项!`);
      return;
    }
    dispatch({type: 'slide/addSlides', payload: {
      data: slides
    }})
  }
  return (
    <>
      <div className="main-content">
        <Card bordered={false}>
          <Spin tip="加载中..." spinning={slideState.loading}>
            <Button type="primary" onClick={addSlide}>添加</Button>&nbsp;
            {
              slides.length > 0 ? <Button type="primary" onClick={saveSlides}>保存</Button>:null
            }
            <Divider>
              <span style={{fontSize: '10px'}}>添加完成后保存</span>
            </Divider>
            {slides.map(
              (item: SLIDE, index: number) =>
              <Slide
                className="slide"
                key={index}
                defaultValue={item}
                index={index}
                onChange={(data: SLIDE) => onSlideChange(data, index)}
                onDelete={() => onDelete(index)}
              />)}
          </Spin>
        </Card>
      </div>
    </>
  );
}
export default connect(({slide: slideState}: any)=>({
  slideState
}))(Index);

