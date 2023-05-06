import React, {useState} from 'react';
import { Card, Input, Row, Col, Button } from 'antd';

interface SlideProps {
  children?: React.ReactNode
  style?: any
  index?: any
  defaultValue?: SLIDE | any
  className?: string
  onChange?: (data: SLIDE) => void
  onDelete?: () => void
}
const Slide: React.FC<SlideProps> = ({style, defaultValue = {}, index, className, onChange, onDelete})=> {
  const [slideValue, setSlideValue] = useState<SLIDE>(defaultValue);

  const onIdChange = (e: any) => {
    setSlideValue({...slideValue, id: e.target.value});
    onChange && onChange(slideValue);
  };
  const onCoverChange = (e: any) => {
    setSlideValue({...slideValue, url: e.target.value});
    onChange && onChange(slideValue);
  }
  const onDeleteSlide = () => {
    onDelete && onDelete();
  }
  return (
    <div style={style} className={className}>
      <Card>
        <Row gutter={10} style={{marginBottom: '15px'}}>
          <Col span={1}>{index != null ? (index + 1) + '、' : ''}</Col>
          <Col span={4}>话题id: </Col>
          <Col span={16}><Input placeholder="话题id" width="200" value={slideValue.id} onChange={onIdChange}/></Col>
          <Col span={3}>
            {onDelete? <Button onClick={onDeleteSlide} type="danger">删除</Button> : null}
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={1}></Col>
          <Col span={4}>封面图: </Col>
          <Col span={16}><Input placeholder="封面图"  width="200" value={slideValue.url} onChange={onCoverChange}/></Col>
        </Row>
      </Card>
    </div>
  );
}

export default Slide;
